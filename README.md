# NextGrip — Control Lab

A small, dependency-free JavaScript web app that demonstrates a **simulated** command system for NextGrip, a student-designed wrist-mounted assistive gripper concept.

> **What works:** browser-based animated gripper, microphone commands where supported, typed commands, manual setpoint, rate-limited servo-position simulation, E-stop latch, manual reset, telemetry, and command history.
>
> **What is not implemented:** hardware connectivity, physical force regulation, collision sensing, clinical validation, or a real voice-operated prosthesis. This app does **not** control a physical device. No claim of a physical build or hardware testing is made.

## Run it

1. Clone or download this repository.
2. Start a local server: `python3 -m http.server 5173`
3. Open `http://localhost:5173` in Chrome or Edge.
4. Type `close`, `open`, `grip harder`, `grip lighter`, `stop`, `emergency stop`, or `grip 45 percent`. You can also use the buttons or slider.
5. Click **Start listening** and allow microphone access if supported. Voice recognition uses the browser's Web Speech API and may contact a browser-vendor speech service. No microphone recordings are saved by this app.

No installation or API key is needed; basic typed/manual functionality works on any modern browser. Microphone commands depend on `SpeechRecognition` browser support. Use HTTPS or localhost for reliable microphone permissions.

## Source map

| File | Purpose |
| --- | --- |
| `index.html` | Accessible layout and SVG gripper |
| `assets/styles.css` | Responsive UI design |
| `assets/controller.js` | Pure voice parser, safety state, and simulated motion math |
| `assets/app.js` | Browser events, mic input, telemetry rendering |
| `tests/controller.test.mjs` | Regression tests for parsing, limits and E-stop |

## Test

```bash
npm test
node --check assets/app.js
```

The modeled position is 0–100% and the *estimated* servo angle maps linearly from 20–110°. Motion advances at a maximum of 42 percentage points per second. These are demonstration values, **not** safe actuation limits for an actual physical mechanism. The in-app emergency stop stops only this simulation; it cannot stop real motors.

## Student development and CAC

This initial repository was generated with substantial AI assistance at the student's request and should be treated as a **starter implementation**, not a finished independently programmed CAC entry. Contest rules require disclosure of AI use in submission materials and meaningful student-written technical contributions. Before submission, the student should design, implement, test, and document their own substantive functionality and accurately explain which parts they authored.

See `docs/SUBMISSION-CHECKLIST.md` for steps that turn the starter into a demonstrably student-developed project.
