import { useEffect, useRef, useState } from 'react';
import { Fireworks } from 'fireworks-js';
import confetti from 'canvas-confetti';
import './App.css';

function App() {
  const fireworksRef = useRef(null);
  const [timeRemaining, setTimeRemaining] = useState({ weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showFireworks, setShowFireworks] = useState(false);

  
  useEffect(() => {
    const targetDate = new Date('2025-01-01T00:00:00'); // New Year 2025
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        setShowFireworks(true);
        clearInterval(interval);
      } else {
        const weeks = Math.floor(difference / (1000 * 60 * 60 * 24 * 7));
        const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining({ weeks, days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showFireworks && fireworksRef.current) {
      const fireworks = new Fireworks(fireworksRef.current, {
        autoresize: true,
        opacity: 0.5,
        acceleration: 1.05,
        friction: 0.97,
        gravity: 1.5,
        particles: 50,
        traceLength: 3,
        traceSpeed: 10,
        explosion: 5,
        intensity: 30,
        flickering: 50,
        lineStyle: 'round',
        hue: {
          min: 0,
          max: 360
        },
        delay: {
          min: 30,
          max: 60
        },
        rocketsPoint: {
          min: 50,
          max: 50
        },
        lineWidth: {
          explosion: {
            min: 1,
            max: 3
          },
          trace: {
            min: 1,
            max: 2
          }
        },
        brightness: {
          min: 50,
          max: 80
        },
        decay: {
          min: 0.015,
          max: 0.03
        },
        mouse: {
          click: false,
          move: false,
          max: 1
        }
      });

      fireworks.start();

      // Add confetti
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);

      return () => {
        fireworks.stop();
        clearInterval(interval);
      };
    }
  }, [showFireworks]);

  return (
    <div className="App">
      <div className="fireworks-container" ref={fireworksRef}></div>
      <div className="message-container">
        {showFireworks ? (
          <>
            <h1 className="new-year-message animate">Happy New Year</h1>
            <h2 className="year">2025</h2>
          </>
        ) : (
          <div className="countdown-timer">
            <h1>{timeRemaining.weeks} Weeks</h1>
            <h1>{timeRemaining.days} Days</h1>
            <h1>{timeRemaining.hours} Hours</h1>
            <h1>{timeRemaining.minutes} Minutes</h1>
            <h1>{timeRemaining.seconds} Seconds</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;