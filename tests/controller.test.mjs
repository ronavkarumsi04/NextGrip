import test from "node:test";
import assert from "node:assert/strict";
import { GripController, parseCommand, servoAngle, clamp } from "../assets/controller.js";

test("natural commands map to predictable movements", () => {
  assert.deepEqual(parseCommand("Please clench harder"), { type: "nudge", delta: 15 });
  assert.deepEqual(parseCommand("Clench lighter"), { type: "nudge", delta: -15 });
  assert.deepEqual(parseCommand("Set grip to 45 percent"), { type: "set", percent: 45 });
  assert.deepEqual(parseCommand("release the grip"), { type: "set", percent: 0 });
  assert.deepEqual(parseCommand("Close the fingers"), { type: "set", percent: 100 });
  assert.equal(parseCommand("grip 150 percent").type, "invalid");
  assert.equal(parseCommand("reset emergency stop").type, "estop");
  assert.equal(parseCommand("hello world").type, "unknown");
});

test("limits and servo angle mapping", () => {
  assert.equal(clamp(120), 100);
  assert.equal(clamp(-5), 0);
  assert.equal(servoAngle(0), 20);
  assert.equal(servoAngle(100), 110);
  assert.equal(servoAngle(50), 65);
  assert.throws(() => clamp(NaN));
});

test("position ramps towards target instead of jumping", () => {
  const motor = new GripController();
  assert.equal(motor.setTarget(100).ok, true);
  motor.tick(0.1);
  assert.ok(motor.position > 0 && motor.position < 6);
  for (let n = 0; n < 300; n++) motor.tick(0.1);
  assert.equal(motor.position, 100);
  assert.equal(motor.tick(0.1), false);
});

test("delta time capped, preventing giant animation jumps", () => {
  const motor = new GripController();
  motor.setTarget(100);
  motor.tick(9999);
  assert.ok(motor.position < 5);
});

test("emergency stop prevents further movement and all commands until manual reset", () => {
  const motor = new GripController();
  motor.setTarget(100);
  motor.tick(0.1);
  const before = motor.position;
  assert.equal(motor.execute("emergency stop").ok, true);
  assert.equal(motor.estopped, true);
  assert.equal(motor.execute("open").ok, false);
  assert.equal(motor.execute("close").ok, false);
  motor.tick(0.1);
  assert.equal(motor.position, before);
  assert.equal(motor.reset().ok, true);
  assert.equal(motor.position, 0);
  assert.equal(motor.execute("close").ok, true);
});

test("hold and nudges obey target limits", () => {
  const motor = new GripController();
  motor.execute("clench harder");
  assert.equal(motor.target, 15);
  motor.execute("grip 99 percent");
  motor.execute("increase");
  assert.equal(motor.target, 100);
  motor.execute("decrease");
  assert.equal(motor.target, 85);
  motor.tick(0.1);
  motor.execute("stop");
  assert.equal(motor.target, motor.position);
});
