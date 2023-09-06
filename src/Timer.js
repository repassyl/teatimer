import React, { useState, useEffect } from "react";
import useSound from "use-sound";

function Timer() {
  let audioContext;
  // Initial state of the timer
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  // Initial state of the selected value
  const [selected, setSelected] = useState(
    localStorage.getItem("selectedValue") || "45"
  );

  const bootAudioContext = () => {
    if (audioContext && audioContext.state === "suspended") {
      audioContext.resume();
    } else {
      audioContext = new AudioContext();
    }
  }

  // Function to start the timer
  const startTimer = (minutes) => {
    bootAudioContext();
    // Set the time to the given minutes in seconds
    setTime(minutes * 60);
    // Set the running state to true
    setIsRunning(true);
    // Store the selected value in localStorage
    localStorage.setItem("selectedValue", selected);
  };

  // Function to stop the timer
  const stopTimer = () => {
    // Set the running state to false
    setIsRunning(false);
  };

  // Function to format the time
  const formatTime = (seconds) => {
    // Calculate the minutes and seconds from the given seconds
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    // Add leading zeros if needed
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    // Return the formatted time
    return `${minutes}:${seconds}`;
  };

  // Use the useSound hook to create a play function and pass the sound file as an argument
  const [play] = useSound("public/Ring-bell-sound.mp3");

  // Use the useEffect hook to update the timer every second
  useEffect(() => {
    // Check if the timer is running and not zero
    if (isRunning && time > 0) {
      // Set a timeout to decrement the time by one second
      const timeout = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
      // Return a cleanup function to clear the timeout
      return () => clearTimeout(timeout);
    } else if (isRunning && time === 0) {
      stopTimer();
      alert("Tea is ready!");
      // Play a sound when the timer is done
      play();
    }
  }, [isRunning, time, play]);

  const timeOptions = [
    15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255,
    270, 285, 300, 315, 330, 345, 360, 375, 390, 405, 420, 435, 450, 465, 480, 495,
    510, 525, 540, 555, 570, 585, 600, 615, 630, 645, 660, 675, 690, 705, 720, 735,
    750, 765, 780, 795, 810, 825, 840, 855, 870, 885, 900
  ];

  // Set the default value of the select element based on selected state
  const defaultSelectValue = timeOptions.includes(parseInt(selected))
    ? selected
    : "45"; // Default to 45 if the selected value is not in the options

  return (
    <div className="SimpleTeaTimer">
      <h1>Simple Tea Timer {selected}</h1>
      <p>{formatTime(time)}</p>
      {/* Add a select element with options */}
      <select
        value={defaultSelectValue}
        onChange={(e) => {
          setSelected(e.target.value);
        }}
      >
        {timeOptions.map((option) => (
          <option key={option} value={option}>
            {formatTime(option * 60)}
          </option>
        ))}
      </select>
      {/* Add "Start" button to start the timer */}
      <button onClick={() => startTimer(selected / 60)}>Start</button>
      {/* Add some spaces between buttons */}
      <button onClick={stopTimer}>Stop</button>
      <button onClick={() => startTimer(1)}>Green (1:00)</button>
      <button onClick={() => startTimer(2)}>Black (2:00)</button>
      <button onClick={() => startTimer(10)}>Herbal (10:00)</button>
    </div>
  );
}

export default Timer;
