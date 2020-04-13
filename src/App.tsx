import * as React from 'react';
import {Fragment, useEffect, useState, useRef} from 'react';
import * as rx from 'rxjs';
import {map, distinctUntilChanged} from 'rxjs/operators';
import * as _ from 'lodash';
import './App.css';

const keyDowns$ = rx.fromEvent(document, 'keydown');
const keyUps$ = rx.fromEvent(document, 'keyup');
const keyActions$ = rx.merge(keyDowns$, keyUps$).pipe(
  map((e: Event) => e as KeyboardEvent),
  distinctUntilChanged(),
);

keyUps$
  .pipe(map(e => e as KeyboardEvent))
  .subscribe(function(e: KeyboardEvent) {
    console.log(e.type, e.key);
  });

const interval$ = rx.interval(300);
const timer$ = new rx.Subject();

const Timer = ({timer}: {timer: number}) => {
  const date = new Date(0);
  date.setUTCMilliseconds(timer);
  const datestr = `
    ${('00' + date.getUTCHours()).slice(-2)} :
    ${('00' + date.getUTCMinutes()).slice(-2)} :
    ${('00' + date.getUTCSeconds()).slice(-2)}  
    ${('0000' + date.getUTCMilliseconds()).slice(-3)}
    `;

  return <div className="timer">{datestr}</div>;
};

interface Lap {
  start: number;
  end: number;
}

const LapC = ({lap}: {lap: Lap}) => {
  return (
    <div>
      <Timer timer={lap.end - lap.start} />
    </div>
  );
};

function useInterval(callback: (x: number) => any, delay: number) {
  const tick = useRef((x: number) => {});
  const timerRef = useRef(0);
  useEffect(() => {
    tick.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay && tick.current) {
      const interval = setInterval(() => {
        timerRef.current += delay;
        tick.current(timerRef.current);
      }, delay);
      return () => clearInterval(interval);
    }
  }, [delay]);
}

function App() {
  const [timer, updateTimer] = useState(0);
  const [laps, updateLaps] = useState([] as Lap[]);

  useInterval((elapsed: number) => {
    updateTimer(elapsed);
  }, 300);

  useEffect(() => {
    const sub = keyUps$
      .pipe(map(e => e as KeyboardEvent))
      .subscribe((e: KeyboardEvent) => {
        switch (e.key) {
          case ' ':
          case 'n':
            const lapsLocal = [...laps];
            const last = _.last(lapsLocal) || {start: -1, end: -1};
            lapsLocal.push({start: last.end + 1, end: timer});
            updateLaps(lapsLocal);
            break;
        }
      });
    return () => sub.unsubscribe();
  }, [timer, laps]);

  const lapsComps = laps.map((lap: Lap, i: number) => (
    <Fragment key={i}>
      <LapC lap={lap} />
    </Fragment>
  ));

  let lapTimer = <div />;
  if (laps.length != 0) {
    const last = _.last(laps) || {start: -1, end: -1};
    lapTimer = (
      <div>
        <LapC lap={{start: last.end + 1, end: timer}} />
      </div>
    );
  }

  return (
    <div className="App">
      <Timer timer={timer} />
      {lapsComps}
      {lapTimer}
    </div>
  );
}

export default App;
