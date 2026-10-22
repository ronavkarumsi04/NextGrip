import { GripController, parseCommand, servoAngle } from "./controller.js";

const grip = new GripController();
const $ = (id) => document.getElementById(id);
const elements = {
  left: $("jaw-left"), right: $("jaw-right"), position: $("current-value"),
  target: $("target-value"), angle: $("angle-value"), positionBar: $("position-bar"),
  targetBar: $("target-bar"), angleBar: $("angle-bar"), slider: $("target-slider"),
  sliderValue: $("slider-value"), status: $("status-text"), statusLight: $("status-light"),
  overlay: $("estop-overlay"), listen: $("listen-button"), listenLabel: $("listen-label"),
  micDot: $("mic-dot"), support: $("voice-support"), history: $("command-log")
};

let lastTime = performance.now();
let recognition = null;
let listening = false;

function paint() {
  const percent = Math.round(grip.position);
  const offset = Math.round(grip.position * .82);
  elements.left.setAttribute("transform", "translate(" + offset + " 0)");
  elements.right.setAttribute("transform", "translate(" + (-offset) + " 0)");
  elements.position.textContent = String(percent);
  elements.target.textContent = String(Math.round(grip.target));
  elements.angle.textContent = String(servoAngle(grip.position));
  elements.positionBar.style.width = grip.position + "%";
  elements.targetBar.style.width = grip.target + "%";
  elements.angleBar.style.width = ((servoAngle(grip.position) - 20) / 90 * 100) + "%";
  elements.slider.value = String(Math.round(grip.target / 5) * 5);
  elements.sliderValue.textContent = String(Math.round(grip.target));
  elements.overlay.hidden = !grip.estopped;
  elements.statusLight.classList.toggle("is-danger", grip.estopped);
  document.querySelectorAll("[data-command]").forEach((button) => {
    button.disabled = grip.estopped;
  });
  elements.slider.disabled = grip.estopped;
  elements.listen.disabled = grip.estopped || !recognition;
}

function animate(now) {
  const delta = Math.min((now - lastTime) / 1000, .1);
  lastTime = now;
  grip.tick(delta);
  paint();
  requestAnimationFrame(animate);
}

function addLog(raw, result, channel) {
  const line = document.createElement("li");
  const time = document.createElement("span");
  const message = document.createElement("span");
  time.className = "log-time";
  time.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  message.className = "log-message";
  message.textContent = channel + ": " + raw + " — " + result.message;
  if (!result.ok) line.classList.add("log-error");
  line.append(time, message);
  elements.history.prepend(line);
  while (elements.history.children.length > 7) elements.history.lastElementChild.remove();
}

function setStatus(message, error = false) {
  elements.status.textContent = message;
  elements.statusLight.classList.toggle("is-warning", error);
}

function runCommand(input, channel = "Manual") {
  const cmd = String(input).trim();
  if (!cmd) return;
  const result = grip.execute(parseCommand(cmd));
  setStatus(result.message, !result.ok);
  addLog(cmd, result, channel);
  paint();
}

$("command-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = $("command-input");
  runCommand(input.value, "Typed");
  input.value = "";
});

document.querySelectorAll("[data-command]").forEach((button) => {
  button.addEventListener("click", () => runCommand(button.dataset.command, "Preset"));
});

elements.slider.addEventListener("input", () => {
  const chosen = Number(elements.slider.value);
  const result = grip.setTarget(chosen);
  setStatus(result.message, !result.ok);
  paint();
});
elements.slider.addEventListener("change", () => {
  addLog("Set grip to " + grip.target + "%", { ok: true, message: "Manual setpoint accepted." }, "Slider");
});

$("estop-button").addEventListener("click", () => {
  const result = grip.emergencyStop();
  if (listening && recognition) recognition.stop();
  setStatus(result.message, false);
  addLog("Emergency stop", result, "Safety");
  paint();
});

$("reset-button").addEventListener("click", () => {
  const result = grip.reset();
  setStatus(result.message);
  addLog("Manual reset", result, "Safety");
  paint();
});

$("clear-log").addEventListener("click", () => {
  elements.history.replaceChildren();
  addLog("Cleared history", { ok: true, message: "New command log started." }, "System");
});

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (Recognition) {
  recognition = new Recognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    listening = true;
    elements.listen.classList.add("is-listening");
    elements.listenLabel.textContent = "Listening…";
    setStatus("Listening for a command. Speak clearly.");
  };
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    runCommand(transcript, "Voice");
  };
  recognition.onerror = (event) => {
    setStatus("Voice recognition unavailable: " + event.error + ". Use the typed commands.", true);
  };
  recognition.onend = () => {
    listening = false;
    elements.listen.classList.remove("is-listening");
    elements.listenLabel.textContent = "Start listening";
  };
  elements.support.textContent = "Use Chrome or Edge on desktop for the best experience. Your browser may use a cloud speech service for recognition.";
  elements.listen.addEventListener("click", () => {
    if (listening) recognition.stop();
    else {
      try { recognition.start(); }
      catch { setStatus("Microphone could not start. Use the typed controls.", true); }
    }
  });
} else {
  elements.support.textContent = "Voice recognition isn't available in this browser. Typed and manual controls work everywhere.";
  elements.listenLabel.textContent = "Voice unavailable";
  elements.listen.disabled = true;
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden && listening && recognition) recognition.stop();
});

paint();
requestAnimationFrame(animate);
