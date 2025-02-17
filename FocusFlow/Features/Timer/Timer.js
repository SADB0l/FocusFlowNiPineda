let hours = 0, minutes = 25, seconds = 0, interval = null;
let currentMode = "pomodoro"; // Default mode

function formatTime(value) {
  return value < 10 ? `0${value}` : value;
}

function updateTimeDisplay() {
  let timeString = hours > 0
    ? `${hours}:${formatTime(minutes)}:${formatTime(seconds)}`
    : `${formatTime(minutes)}:${formatTime(seconds)}`;

  document.getElementById("timerDisplay").innerHTML = timeString;
}


function stopTimer() {
  clearInterval(interval);
  interval = null;
  document.getElementById("startStopButton").textContent = "Start";
  document.getElementById("startStopButton").classList.remove("stop-timer-button");
}

function startStopTimer() {
  let button = document.getElementById("startStopButton");
  button.classList.add("timerText-fade");

  setTimeout(() => {
    if (interval) {
      stopTimer();
    } else {
      interval = setInterval(() => {
        if (seconds === 0 && minutes === 0 && hours === 0) {
          stopTimer();
          switchMode(); // Automatically switch mode when timer ends
        } else {
          if (seconds === 0) {
            if (minutes === 0) {
              hours--;
              minutes = 59;
            } else {
              minutes--;
            }
            seconds = 59;
          } else {
            seconds--;
          }
        }
        updateTimeDisplay();
      }, 1000);
      button.textContent = "Stop";
      button.classList.add("stop-timer-button");
    }

    button.classList.remove("timerText-fade");
  }, 150); // Smooth transition effect
}

function switchMode() {
  if (currentMode === "pomodoro") {
    setBreakTime();
  } else {
    setPomodoroTime();
  }
}

// Function to set Break Time (5 minutes)
document.getElementById("break").addEventListener("click", setBreakTime);
function setBreakTime() {
  stopTimer();
  hours = 0;
  minutes = 5;
  seconds = 0;
  updateTimeDisplay();
  currentMode = "break";

  // Update button styling
  document.querySelector(".set-time2").classList.remove("active-time");
  document.getElementById("break").classList.add("active-time");

  // Change background color
  const timercon = document.querySelector(".timercon");

  // Set up transition
  timercon.style.transition = "opacity 0.3s ease-out";

  // Temporarily set opacity to 0, change background, then fade it back in
  timercon.style.opacity = "0";

  setTimeout(() => {
    timercon.style.backgroundImage = `
        linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1)), 
        url('BG2.png')
    `;
    timercon.style.opacity = "1";
  }, 100); // Small delay to allow opacity transition

  document.querySelector(".timercon").style.backgroundPosition = "center";
  document.querySelector(".timercon").style.backgroundRepeat = "no-repeat";
  document.querySelector(".timercon").style.backgroundSize = "cover";


  // Change reset button to "Skip"
  document.querySelector(".resetTimer-button").textContent = "Skip";
}

// Function to set Pomodoro Time (25 minutes)
document.querySelector(".set-time2").addEventListener("click", setPomodoroTime);
function setPomodoroTime() {
  stopTimer();
  hours = 0;
  minutes = 25;
  seconds = 0;
  updateTimeDisplay();
  currentMode = "pomodoro";

  // Update button styling
  document.getElementById("break").classList.remove("active-time");
  document.querySelector(".set-time2").classList.add("active-time");

  // Reset background color
  const timercon = document.querySelector(".timercon");

  // Set transition on opacity instead
  timercon.style.transition = "opacity 0.3s ease-out";

  // Temporarily fade out
  timercon.style.opacity = "0";

  setTimeout(() => {
    timercon.style.background = ""; // Remove background
    timercon.style.opacity = "1";  // Fade back in
  }, 100); // Wait for transition to finish


  // Change "Skip" back to "Reset"
  document.querySelector(".resetTimer-button").textContent = "Reset";
}

// Set default active style on page load
window.onload = function () {
  document.querySelector(".set-time2").classList.add("active-time");
  updateTimeDisplay(); // Ensure correct time is displayed
};

// Function for reset/skip button
document.querySelector(".resetTimer-button").addEventListener("click", function () {
  if (this.textContent === "Skip") {
    switchMode();
  } else {
    setPomodoroTime();
  }
});

function resetTimer() {
  clearInterval(interval);
  interval = null;
  hours = 0;
  minutes = 25;
  seconds = 0;
  updateTimeDisplay();
  document.getElementById("startStopButton").textContent = "Start";
  document.getElementById("startStopButton").classList.remove("stop-timer-button");
}

// Create Preset
let presetModal;

function openPresetModal() {
  presetModal = document.createElement("div");
  presetModal.style.position = "fixed";
  presetModal.style.top = "0";
  presetModal.style.left = "0";
  presetModal.style.width = "100vw";
  presetModal.style.height = "100vh";
  presetModal.style.display = "flex";
  presetModal.style.justifyContent = "center";
  presetModal.style.alignItems = "center";
  presetModal.style.zIndex = "1000";
  presetModal.style.background = "rgba(0, 0, 0, 0.1)";

  const iframeContainer = document.createElement("div");
  iframeContainer.style.display = "flex";
  iframeContainer.style.justifyContent = "center";
  iframeContainer.style.alignItems = "center";
  iframeContainer.style.background = "#fff";
  iframeContainer.style.padding = "10px";
  iframeContainer.style.borderRadius = "10px";
  iframeContainer.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";

  const iframe = document.createElement("iframe");
  iframe.src = "TimerAdd.html";
  iframe.style.width = "350px";
  iframe.style.height = "165px";
  iframe.style.border = "none";

  iframeContainer.appendChild(iframe);
  presetModal.appendChild(iframeContainer);
  document.body.appendChild(presetModal);
}


function closePresetModal() {
  if (presetModal) {
    document.body.removeChild(presetModal);
    presetModal = null;
  }
}

window.addEventListener("message", function (event) {
  if (event.data.type === "addPreset") {
    addPreset(event.data.value, event.data.unit);
    closePresetModal();
  } else if (event.data.type === "closeModal") {
    closePresetModal();
  }
});

function addPreset(value, unit) {
  const presetsContainer = document.getElementById("presets");

  const presetButton = document.createElement("button");
  presetButton.className = "preset-item";
  presetButton.textContent = `+${value} ${unit}`;
  presetButton.onclick = function () {
    addTime(parseInt(value), unit);
  };

  presetsContainer.appendChild(presetButton);
}


function addTime(value, unit) {
  if (unit === "seconds") {
    seconds += value;
  } else if (unit === "minutes") {
    minutes += value;
  } else if (unit === "hours") {
    hours += value;
  }

  if (seconds >= 60) {
    minutes += Math.floor(seconds / 60);
    seconds %= 60;
  }
  if (minutes >= 60) {
    hours += Math.floor(minutes / 60);
    minutes %= 60;
  }

  updateTimeDisplay();
}
function deletePreset() {
  const presetsContainer = document.getElementById("presets");
  const presetItems = presetsContainer.getElementsByClassName("preset-item");

  if (presetItems.length > 0) {
    presetsContainer.removeChild(presetItems[presetItems.length - 1]); // Remove the last preset-item
  }
}

const Set = document.getElementById("set");
const sidebar = document.getElementById("div-set");

sidebar.classList.add("hidden-divset");

function settime() {
    if (sidebar.classList.contains("hidden-divset")) {
        sidebar.classList.remove("hidden-divset");
        Set.classList.add("set-time1-hidden");
    } else {
        sidebar.classList.add("hidden-divset");
        Set.classList.remove("set-time1-hidden");
    }
}

document.querySelector(".done-set").addEventListener("click", function () {
  let hourInput = document.getElementById("hour");
  let minuteInput = document.getElementById("minute");
  let secondInput = document.getElementById("second");

  let newHours = hourInput.value.trim() === "" ? 0 : parseInt(hourInput.value) || 0;
  let newMinutes = minuteInput.value.trim() === "" ? 0 : parseInt(minuteInput.value) || 0;
  let newSeconds = secondInput.value.trim() === "" ? 0 : parseInt(secondInput.value) || 0;

  newMinutes = Math.max(0, Math.min(59, newMinutes));
  newSeconds = Math.max(0, Math.min(59, newSeconds));
  hours = newHours;
  minutes = newMinutes;
  seconds = newSeconds;

  updateTimeDisplay();
  sidebar.classList.add("hidden-divset");
  Set.classList.remove("set-time1-hidden");
  hourInput.value = "";
  minuteInput.value = "";
  secondInput.value = "";
});

document.querySelectorAll("#hour, #minute, #second").forEach(input => {
  input.addEventListener("input", function () {
    if (!/^\d+$/.test(this.value)) {
      this.value = this.value.slice(0, -1);
      return;
    }

    let num = parseInt(this.value);
    if (this.id === "hour") {
      this.value = Math.max(0, num); 
    } else {
      this.value = Math.max(1, Math.min(59, num)); 
    }
  });
});

