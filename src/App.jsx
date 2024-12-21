import React, { useState, useEffect, useRef }  from 'react'
import './App.css'

function App() {
  const [breakLength, setBreak] = useState(5);
  const [sessionLength, setSession] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerLabel, setTimeLabel] = useState("Session");
  const [isRunning, setRunning] = useState(false);
  const audioRef = useRef(null);

  const labelRef = useRef(timerLabel);

  useEffect(() => {
    labelRef.current = timerLabel;
  }, [timerLabel])
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer =  setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            audioRef.current.play().catch(error => {
              console.error("Error al reproducir el audio:", error);
            });
            if (labelRef.current === "Session") {
              setTimeLabel("Break"); 
              setTimeLeft(breakLength * 60);
            } else {
              setTimeLabel("Session");
              setTimeLeft(sessionLength * 60);
            }
          }
          return prev - 1;
        })
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning, sessionLength, breakLength]);
  
  const handleStartStop = () => {
    setRunning(!isRunning);
  }
  const resetBtn = () => {
    setBreak(5);
    setSession(25);
    setTimeLeft(25 * 60);
    setTimeLabel("Session");
    setRunning(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }
  const timeLabel = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }
  const handleClick = (type, action) => {
    if (type === "break") {
      if (action === "increment" && breakLength < 60) {
        setBreak(breakLength + 1);
        if (timerLabel === "Break") setTimeLeft((breakLength + 1) * 60);
      } else if (action === "decrement" && breakLength > 1) {
        setBreak(breakLength - 1);
        if (timerLabel === "Break") setTimeLeft((breakLength - 1) * 60);
      }
    }
    if (type === "session") {
      if (action === "increment" && sessionLength < 60) {
        setSession(sessionLength + 1);
        if (timerLabel === "Session") setTimeLeft((sessionLength + 1) * 60);
      } else if (action === "decrement" && sessionLength > 1) {
        setSession(sessionLength - 1);
        if (timerLabel === "Session") setTimeLeft((sessionLength - 1) * 60);
      }
    }
  }
  
  return (
    <>
      <div id="container">
        <h1>🍅Pomodoro Clock🍅</h1>
        <div id="timer">
          <label id="timer-label">{timerLabel}</label>
          <p id="time-left">{timeLabel(timeLeft)}</p>
        </div>
        <div id="options">
          <button id="start-stop" onClick={handleStartStop}>{isRunning ? "Stop" : "Start"}</button>
          <button id="reset" onClick={resetBtn}>Reset</button>
        </div>
        <div id="sessions">
          <div id="break">
          <label id="break-label">Break length</label> 
          <div>
            <button id="break-increment" onClick={() => handleClick("break", "increment")}>+</button>
            <span id="break-length">{breakLength}</span>
            <button id="break-decrement" onClick={() => handleClick("break", "decrement")}>-</button>
          </div>
          </div>
          <div id="session">
          <label id="session-label">Session Length</label>
          <div>
            <button id="session-increment" onClick={() => handleClick("session", "increment")}>+</button>
            <span id="session-length">{sessionLength}</span>
            <button id="session-decrement" onClick={() => handleClick("session", "decrement")}>
              -
            </button>
            </div>
          </div>
        </div>
        <audio id="beep" ref={audioRef} src="/mixkit-repeating-arcade-beep-1084.wav" />
      </div>
      
    </>
  )
}

export default App
