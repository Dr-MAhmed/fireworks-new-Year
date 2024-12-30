import { useEffect, useRef, useState } from "react";
import { Fireworks } from "fireworks-js";
import confetti from "canvas-confetti";
import "./App.css";

function App() {
  const fireworksRef = useRef(null);
  const [showFinalCountdown, setShowFinalCountdown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
    const targetDate = new Date("2025-01-01T00:00:00"); // Set your New Year's date
    return Math.max(0, targetDate - new Date());
  });

  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    if (!showFinalCountdown && timeLeft > 0) {
      const timer = setInterval(() => {
        const now = new Date();
        const targetDate = new Date("2025-01-01T00:00:00");
        const diff = Math.max(0, targetDate - now);

        setTimeLeft(diff);

        // Switch to final countdown when less than 10 seconds are left
        if (diff <= 10000) {
          clearInterval(timer);
          setShowFinalCountdown(true);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, showFinalCountdown]);

  useEffect(() => {
    if (showFinalCountdown) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1000);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showFinalCountdown]);

  useEffect(() => {
    if (timeLeft === 0) {
      setShowFireworks(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (showFireworks && fireworksRef.current) {
      const fireworks = new Fireworks(fireworksRef.current, {
        autoresize: true,
        opacity: 0.5,
        particles: 50,
        traceLength: 3,
        explosion: 5,
        intensity: 30,
        flickering: 50,
        lineStyle: "round",
      });

      fireworks.start();

      // Add confetti
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          })
        );
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          })
        );
      }, 250);

      return () => {
        fireworks.stop();
        clearInterval(interval);
      };
    }
  }, [showFireworks]);

  const formatTime = () => {
    if (!showFinalCountdown) {
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    return Math.ceil(timeLeft / 1000); // Show final countdown in seconds
  };

  return (
    <div className="App">
      <div className="fireworks-container" ref={fireworksRef}></div>
      <div className="message-container">
        {timeLeft > 0 ? (
          <h1 className="countdown-message">{formatTime()}</h1>
        ) : (
          <>
            <h1 className="new-year-message animate">Happy New Year</h1>
            <h2 className="year">2025</h2>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
