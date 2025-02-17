import { useState, useEffect } from 'react';
import { FiPlay, FiPause, FiRefreshCw } from 'react-icons/fi';

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  const hours = Math.floor(time / 360000);
  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);
  const milliseconds = time % 100;

  const startAndStop = () => {
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setTime(0);
    setIsRunning(false);
    setLaps([]);
  };

  const addLap = () => {
    setLaps([...laps, time]);
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 360000);
    const minutes = Math.floor((time % 360000) / 6000);
    const seconds = Math.floor((time % 6000) / 100);
    const milliseconds = time % 100;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="stopwatch-container">
      <div className="stopwatch-display">
        <span className="time-unit">{hours.toString().padStart(2, '0')}</span>:
        <span className="time-unit">{minutes.toString().padStart(2, '0')}</span>:
        <span className="time-unit">{seconds.toString().padStart(2, '0')}</span>
        <span className="milliseconds">.{milliseconds.toString().padStart(2, '0')}</span>
      </div>

      <div className="stopwatch-controls">
        <button 
          className={`control-button ${isRunning ? 'pause' : 'start'}`}
          onClick={startAndStop}
        >
          {isRunning ? <FiPause /> : <FiPlay />}
        </button>
        <button 
          className="control-button lap"
          onClick={addLap}
          disabled={!isRunning}
        >
          Lap
        </button>
        <button 
          className="control-button reset"
          onClick={reset}
        >
          <FiRefreshCw />
        </button>
      </div>

      {laps.length > 0 && (
        <div className="laps-container">
          <h3>Laps</h3>
          <div className="laps-list">
            {laps.map((lapTime, index) => (
              <div key={index} className="lap-item">
                <span>Lap {index + 1}</span>
                <span>{formatTime(lapTime)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Stopwatch; 