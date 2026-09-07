import { createPlan } from "./jenny.mjs";

try {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    throw new Error('Aufruf: node src/cli.mjs "Engineering-Auftrag"');
  }
  process.stdout.write(JSON.stringify(createPlan(args[0]), null, 2) + "\n");
} catch (error) {
  process.stderr.write(error.message + "\n");
  process.exitCode = 1;
}
