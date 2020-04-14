import * as React from "react";
import { Fragment, useEffect, useState, useRef } from "react";
import * as rx from "rxjs";
import { map, distinctUntilChanged } from "rxjs/operators";
import * as _ from "lodash";
import "./App.scss";
import { makeStyles, useTheme, createStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import PauseIcon from "@material-ui/icons/Pause";
import RefreshIcon from "@material-ui/icons/Refresh";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
const keyDowns$ = rx.fromEvent(document, "keydown");
const keyUps$ = rx.fromEvent(document, "keyup");
const keyActions$ = rx.merge(keyDowns$, keyUps$).pipe(
  map((e: Event) => e as KeyboardEvent),
  distinctUntilChanged()
);

keyUps$
  .pipe(map(e => e as KeyboardEvent))
  .subscribe(function(e: KeyboardEvent) {
    console.log(e.type, e.key);
  });

const interval$ = rx.interval(300);
const timer$ = new rx.Subject();

const TimerNumberDisplay = ({
  timer,
  style
}: {
  timer: number;
  style?: string;
}) => {
  const date = new Date(0);
  date.setUTCMilliseconds(timer);
  const sep = [":", ":"];
  return (
    <div className="timer">
      <div className="hours">{`${("00" + date.getUTCHours()).slice(-2)}`}</div>
      <div className="sep">{sep[0]}</div>
      <div className="minutes">{`${("00" + date.getUTCMinutes()).slice(-2)}`} </div>
      <div className="sep">{sep[1]}</div>
      <div className="seconds">{`${("00" + date.getUTCSeconds()).slice(-2)}`}</div>
      <div className="millis">{`${("0000" + date.getUTCMilliseconds()).slice(-3)}`}</div>
    </div>
  );
};

const TimerVerboseDisplay = ({
  timer,
  style
}: {
  timer: number;
  style?: string;
}) => {
  const date = new Date(0);
  date.setUTCMilliseconds(timer);
  let datestr = ``;
  if (date.getUTCHours() > 0) datestr += `${date.getUTCHours()} hours `;
  if (date.getUTCMinutes() > 0) datestr += `${date.getUTCMinutes()} mins `;
  datestr += `${date.getUTCSeconds()} secs`;
  return <div className="verboseTimer">{datestr}</div>;
};

const Timer = ({ timer, style }: { timer: number; style?: string }) => {
  if (style === "verbose") {
    return <TimerVerboseDisplay timer={timer} />;
  } else {
    return <TimerNumberDisplay timer={timer} />;
  }
};

interface Lap {
  start: number;
  end: number;
}

const LapC = ({ lap }: { lap: Lap }) => {
  return (
    <div>
      <Timer timer={lap.end - lap.start} />
    </div>
  );
};

const LapPanel = ({ lap, idx }: { lap: Lap; idx: number }) => {
  return (
    <div className="panel">
      <div className="number">{idx + 1}</div>
      <div className="time">
        <Timer timer={lap.end - lap.start} style="verbose" />
      </div>
    </div>
  );
};

enum Status {
  RUNNING = 1,
  STOPPED,
  PAUSED
}

function useInterval(callback: (x: number) => any, delay: number) {
  const [status, updateStatus] = useState(Status.PAUSED);
  const tick = useRef((x: number) => {});
  const timerRef = useRef(0);
  useEffect(() => {
    tick.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay && tick.current && status == Status.RUNNING) {
      const interval = setInterval(() => {
        timerRef.current += delay;
        tick.current(timerRef.current);
      }, delay);
      return () => clearInterval(interval);
    }
  }, [delay, status]);
  return {
    status: () => status,
    pause: () => {
      if (status === Status.PAUSED) updateStatus(Status.RUNNING);
      else updateStatus(Status.PAUSED);
    },
    stop: () => updateStatus(Status.STOPPED),
    start: () => updateStatus(Status.RUNNING),
    reset() {
      this.pause();
      timerRef.current = 0;
      this.stop();
      this.pause();
    }
  };
}

function TimerApp() {
  const theme = useTheme();

  const [timer, updateTimer] = useState(0);
  const [laps, updateLaps] = useState([] as Lap[]);

  const control = useInterval((elapsed: number) => {
    updateTimer(elapsed);
  }, 300);

  useEffect(() => {
    const sub = keyUps$
      .pipe(map(e => e as KeyboardEvent))
      .subscribe((e: KeyboardEvent) => {
        switch (e.key) {
          case "n":
            if (control.status() !== Status.RUNNING) break;
            const lapsLocal = [...laps];
            const last = _.last(lapsLocal) || { start: -1, end: -1 };
            lapsLocal.push({ start: last.end + 1, end: timer });
            updateLaps(lapsLocal);
            break;
          case " ":
          case "p":
            control.pause();
            break;
          case "s":
            control.stop();
            break;
          case "r":
            control.reset();
            break;
        }
      });
    return () => sub.unsubscribe();
  }, [timer, laps, control]);

  const lapsComps = laps.map((lap: Lap, i: number) => (
    <Fragment key={i}>
      <LapPanel lap={lap} idx={i} />
    </Fragment>
  ));

  let lapTimer = <div />;
  if (laps.length != 0) {
    const last = _.last(laps) || { start: -1, end: -1 };
    lapTimer = (
      <div>
        <LapC lap={{ start: last.end + 1, end: timer }} />
      </div>
    );
  }

  const controls = [];
  if (control.status() !== Status.RUNNING)
    if (control.status() === Status.STOPPED) {
      controls.push(
        <IconButton aria-label="play/reset">
          <RefreshIcon className="button" onClick={() => control.reset()} />
        </IconButton>
      );
    } else
      controls.push(
        <IconButton aria-label="play/play">
          <PlayArrowIcon className="button" onClick={() => control.start()} />
        </IconButton>
      );
  if (control.status() === Status.RUNNING)
    controls.push(
      <IconButton aria-label="play/pause">
        <PauseIcon className="button" onClick={() => control.pause()} />
      </IconButton>
    );

  if (control.status() !== Status.STOPPED)
    controls.push(
      <IconButton aria-label="play/stop">
        <StopIcon className="button" onClick={() => control.stop()} />
      </IconButton>
    );

  return (
    <div className="timerContainer">
      <div className="controls">
        {controls.map((c, i) => (
          <Fragment key={i}>{c}</Fragment>
        ))}
      </div>
      <div className="timerWithLaps">
        <div className="mainTimer">
          <Timer timer={timer} />
        </div>
        {laps.length != 0 && (
          <div id="lapTimer" className="lapTimer">
            <div className='title'>Lap {laps.length} </div>
            <div className='content'>{lapTimer}</div>
          </div>
        )}
        <div className="lapsContainer">{lapsComps}</div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <TimerApp />
    </div>
  );
}

export default App;
