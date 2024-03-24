import { useEffect, useRef, useState } from 'react';
import './App.css';

function App_Clock() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);  
  const [sessionTimer, setSessionTimer] = useState('25:00');
  const [secondsLeft, setSeccondsLeft] = useState(1500);
  const [running, setRunning] = useState(false);
  const [timerLabel, setTimerLabel] = useState('Session');

  const timer = useRef();

  useEffect(() => {
    if(running) {
      timer.current = setInterval(() => {
        setSeccondsLeft((prevState) => prevState - 1);
        //updateTimer();
      }, 1000);
    }

    return () => clearInterval(timer.current);
  }, [running]);

  useEffect(() => {
    if(secondsLeft < 0) {
      playAudio();
      if(timerLabel === 'Session') {
        setTimerLabel('Break');
        setSeccondsLeft(breakLength * 60);
      } else {
        setTimerLabel('Session');
        setSeccondsLeft(sessionLength * 60);
      }
    } else {
      updateTimer();
    }
  }, [secondsLeft]);

  useEffect(() => {
    if(!running) setSeccondsLeft(sessionLength * 60);
  }, [sessionLength]);

  const playAudio = () => {
    const audio = document.getElementById('beep');
    audio.play();
  }

  const resetAudio = () => {
    const audio = document.getElementById('beep');
    audio.pause();
    audio.currentTime = 0;
  }

  const updateTimer = () => {
    const minutes = parseInt(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    const minutesFormat = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
    const secondsFormat = seconds < 10 ? '0' + seconds.toString() : seconds.toString();

    setSessionTimer(minutesFormat + ':' + secondsFormat);
  }

  const handleStartStop = (event) => {
    if(running) {
      clearInterval(timer.current);
    }
    setRunning(!running);
  }

  const handleReset = (event) => {
    setBreakLength(5);
    setSessionLength(25);
    setSessionTimer('25:00');
    setSeccondsLeft(1500);
    setTimerLabel('Session');
    
    if(running) {
      clearInterval(timer.current);
      setRunning(!running);
    }
    resetAudio();
  }

  const handleIncrementBreak = (event) => {
    setBreakLength((prevState) => prevState + 1 > 60 ? prevState : prevState + 1);
  }

  const handleDecrementBreak = (event) => {
    setBreakLength((prevState) => prevState - 1 <= 0 ? prevState : prevState - 1);
  }

  const handleIncrementSession = (event) => {
    setSessionLength((prevState) => prevState + 1 > 60 ? prevState : prevState + 1);
  }

  const handleDecrementSession = (event) => {
    setSessionLength((prevState) => prevState - 1 <= 0 ? prevState : prevState - 1);
  }

  return(
    <div id='app-clock'>
      <div id='break-session'>
        <div id='break'>
          <div id='break-label'>Break Length</div>
          <div id='break-controls'>
            <button id='break-decrement' className='button-control' onClick={handleDecrementBreak}>-</button>
            <span id='break-length'>{breakLength}</span>
            <button id='break-increment' className='button-control' onClick={handleIncrementBreak}>+</button>
          </div>
        </div>
        <div id='session'>
          <div id='session-label'>Session Length</div>
          <div id='session-controls'>
            <button id='session-decrement' className='button-control' onClick={handleDecrementSession}>-</button>
            <span id='session-length'>{sessionLength}</span>
            <button id='session-increment' className='button-control' onClick={handleIncrementSession}>+</button>
          </div>
        </div>
      </div>
      <div id='timer'>
        <div id='timer-display'>
          <div id='timer-label'>{timerLabel}</div>
          <div id='time-left'>{sessionTimer}</div>
        </div>
        <div id='timer-controls'>
          <button id='start_stop' onClick={handleStartStop}>Start/Stop</button>
          <button id='reset' onClick={handleReset}>Reset</button>
        </div>
      </div>
      <audio src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav' id='beep'></audio>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <App_Clock />
    </div>
  );
}

export default App;
