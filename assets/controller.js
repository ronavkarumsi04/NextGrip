/**
 * NextGrip motion model and voice command parser.
 * All values describe an on-screen SIMULATION, never live hardware.
 */
export const GRIP = Object.freeze({
  MIN: 0,
  MAX: 100,
  INITIAL: 0,
  NUDGE: 15,
  MAX_SPEED_PER_SECOND: 42,
  SERVO_MIN_DEG: 20,
  SERVO_MAX_DEG: 110,
});

export function clamp(value, min = GRIP.MIN, max = GRIP.MAX) {
  if (!Number.isFinite(value)) throw new TypeError("Grip must be a finite number");
  return Math.min(max, Math.max(min, value));
}

export function servoAngle(percent) {
  return Math.round(GRIP.SERVO_MIN_DEG + (clamp(percent) / 100) *
    (GRIP.SERVO_MAX_DEG - GRIP.SERVO_MIN_DEG));
}

/**
 * SpeechRecognition can transcribe a sentence rather than a single command.
 * Only a recognized command phrase is accepted. The E-stop takes precedence.
 */
export function parseCommand(value) {
  const text = String(value ?? "").toLowerCase().trim().replace(/[^a-z0-9% ]+/g, " ").replace(/\s+/g, " ");
  if (!text) return { type: "unknown" };
  if (/\b(emergency stop|e stop|estop|kill switch)\b/.test(text)) return { type: "estop" };
  if (/\b(stop|halt|pause|freeze|hold)\b/.test(text)) return { type: "hold" };

  const exact = text.match(/\b(?:set|move|adjust)?\s*(?:the\s+)?(?:grip|clench|closure)\s*(?:to|at)?\s*(\d{1,3})\s*(?:percent|%)?\b/);
  if (exact) {
    const value = Number(exact[1]);
    if (value > GRIP.MAX) return { type: "invalid", reason: "Grip must be between 0 and 100%." };
    return { type: "set", percent: value };
  }
  if (/\b(harder|tighter|tighten|increase|more pressure)\b/.test(text)) return { type: "nudge", delta: GRIP.NUDGE };
  if (/\b(lighter|softer|loosen|less pressure|decrease)\b/.test(text)) return { type: "nudge", delta: -GRIP.NUDGE };
  if (/\b(open|release|unclench)\b/.test(text)) return { type: "set", percent: 0 };
  if (/\b(close|clench|grasp)\b/.test(text)) return { type: "set", percent: 100 };
  return { type: "unknown" };
}

export class GripController {
  constructor() {
    this.position = GRIP.INITIAL;
    this.target = GRIP.INITIAL;
    this.estopped = false;
  }

  setTarget(percent) {
    if (this.estopped) return { ok: false, message: "Emergency stop engaged. Reset manually to continue." };
    if (!Number.isFinite(percent) || percent < GRIP.MIN || percent > GRIP.MAX) {
      return { ok: false, message: "Choose a grip level from 0 to 100%." };
    }
    this.target = percent;
    return { ok: true, message: "Target set to " + percent + "%." };
  }

  emergencyStop() {
    this.estopped = true;
    this.target = this.position;
    return { ok: true, message: "Emergency stop engaged. Simulated motion halted." };
  }

  hold() {
    if (this.estopped) return { ok: false, message: "Emergency stop is already engaged." };
    this.target = this.position;
    return { ok: true, message: "Position held at " + Math.round(this.position) + "%." };
  }

  reset() {
    // Deliberately manual-only. Never expose reset through voice parsing.
    this.estopped = false;
    this.position = 0;
    this.target = 0;
    return { ok: true, message: "Simulation reset to the open position." };
  }

  execute(command) {
    const input = typeof command === "string" ? parseCommand(command) : command;
    if (input.type === "estop") return this.emergencyStop();
    if (this.estopped) return { ok: false, message: "Emergency stop engaged. Use the reset button." };
    if (input.type === "hold") return this.hold();
    if (input.type === "set") return this.setTarget(input.percent);
    if (input.type === "nudge") return this.setTarget(clamp(this.target + input.delta));
    if (input.type === "invalid") return { ok: false, message: input.reason };
    return { ok: false, message: "Command not recognized. Try 'open', 'close', or 'grip 50 percent'." };
  }

  tick(deltaSeconds) {
    if (this.estopped) return false;
    const dt = clamp(deltaSeconds, 0, 0.1);
    const step = GRIP.MAX_SPEED_PER_SECOND * dt;
    const diff = this.target - this.position;
    if (Math.abs(diff) < 0.01) {
      this.position = this.target;
      return false;
    }
    this.position += Math.sign(diff) * Math.min(step, Math.abs(diff));
    return true;
  }
}
