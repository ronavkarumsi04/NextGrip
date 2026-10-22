# NextGrip: Congressional App Challenge checklist (2026)

## Eligibility / truthful representation

- [ ] Confirm your Congressional district, registration status, and the official October 26 deadline.
- [ ] Confirm any original NextGrip work was created in the eligible date window. The interactive web prototype in this repo was newly generated in October 2026.
- [ ] Fully disclose AI assistance **in your submission materials** as required. This need not be part of the video narration unless the current submission instructions explicitly ask for it there.
- [ ] Make **significant personal coding contributions** before submitting. The initial code in this repo was AI-generated as a starter. Review it, write and test substantive additions yourself, and keep an accurate dated record. Do not describe generated code as personally written.
- [ ] Ensure originality and third-party media/code licensing.

## Student-owned next steps

1. Review and explain `assets/controller.js` line by line. Change the parser, limits, speed model, or control state machine based on your own reasoned specifications.
2. Add a substantive feature with your own code: e.g. **grip profiles and calibrated motion limits** or a **visual response-latency chart**; document why you chose it and add regression tests.
3. Run `npm test`; exercise every input and emergency-stop sequence yourself on desktop and mobile.
4. Record a screen demonstration where clicking and speaking produces **real changes in the simulated gripper UI**.
5. In the narration, explicitly say it is a *software simulation/concept*. Do not claim physical device testing, force measurement or medical readiness.
6. Discuss programming languages (JavaScript/HTML/CSS), your actual personal contribution, a challenge you solved, and proposed next steps.
7. Follow current official CAC rules for public YouTube/Vimeo video, duration, and submission.

## Suggested truthful demo

- Open simulator at 0%. Say "close" (or enter typed command), show smooth animation and servo-angle display.
- Say "grip lighter" (target moves to 85%). Say "grip 40 percent".
- Trigger emergency stop and attempt to close: the simulator refuses.
- Click Reset: the simulated gripper returns to open.
- Briefly show a **piece of code you personally wrote or meaningfully changed** and the tests that validate it.

### Hardware boundary

This starter never connects to an ESP32. A later physical controller requires separate engineering, overcurrent protection, a physical power-cutoff, proper mechanical stops, skin/electrical isolation where applicable, safe torque/force limits, fault monitoring, and supervised benchtop verification before anyone wears it.
