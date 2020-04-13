import * as React from 'react';
import {Fragment} from 'react';
import * as rx from 'rxjs';
import * as rxop from 'rxjs/operators';
import * as _ from 'lodash';
import {map} from 'rxjs/operators';
import './App.css';

const keyDowns$ = rx.fromEvent(document, 'keydown');
const keyUps$ = rx.fromEvent(document, 'keyup');
const keyActions$ = rx.merge(keyDowns$, keyUps$).pipe(
  rxop.map((e: Event) => e as KeyboardEvent),
  rxop.distinctUntilChanged(),
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

function App() {
  const [timer, updateTimer] = React.useState(0);
  const [laps, updateLaps] = React.useState([] as Lap[]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      updateTimer(timer + 300);
      timer$.next(timer + 300);
    }, 300);
    return () => clearInterval(interval);
  }, [timer]);

  React.useEffect(() => {
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
