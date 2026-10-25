# NextGrip — Product context

**Purpose**: Let a competition judge or student explore the interaction model of a wrist-mounted assistive gripper concept, not control physical hardware.

**Audience**: Students, judges, makers, and accessibility-focused engineering learners. Some visitors will be viewing a short screen recording without interacting.

**Primary job**: Understand the model and test a natural-language grip command in under 30 seconds.

**Interaction**: Browser-based JavaScript parser; click, type, or optional browser SpeechRecognition. Motion state is simulated in 0–100% position with bounded speed and estimated 20–110° motor angle. The E-stop latches only the simulation and requires manual reset.

**Truth boundaries**: No wired or wireless connection to an ESP32, motors, force sensors, wearable device, or human subject. No medical efficacy, force control, or hardware safety claims.

**Constraints**: No authentication, no paid service, no backend requirement, clear fallback when speech recognition is unavailable, readable on a phone, accessible controls and contrast, reduced-motion support.

**Voice**: Concise, calm, reassuringly technical. Favor unambiguous simulation labels over promotional claims.
