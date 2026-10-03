import { bootstrapSession, createPlan, createSessionPlan } from "./jenny.mjs";

try {
  const args = process.argv.slice(2);
  if (args.length !== 4) {
    throw new Error('Aufruf: node src/cli.mjs <Session-Code> <PC|IPHONE|VOICE> <Gerät> "Engineering-Auftrag"');
  }
  createPlan(args[3]); // Validate before registering a session.
  const centralState = bootstrapSession({ sessionCode: args[0], sessionType: args[1], deviceName: args[2] });
  process.stdout.write(JSON.stringify(createSessionPlan(args[3], centralState), null, 2) + "\n");
} catch (error) {
  process.stderr.write(error.message + "\n");
  process.exitCode = 1;
}
