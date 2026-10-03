import { chat } from './chat.mjs';

try {
  const args = process.argv.slice(2);
  if (args.length !== 4 && args.length !== 5) throw new Error('Aufruf: node src/chat-cli.mjs <Session-Code> <PC|IPHONE|VOICE> <Gerät> "Nachricht" [openai|local-test]');
  const result = await chat({ sessionCode: args[0], sessionType: args[1], deviceName: args[2], userText: args[3] }, { modelAdapter: args[4] || 'openai' });
  process.stdout.write(result.text + '\n');
} catch (error) {
  process.stderr.write(error.message + '\n');
  process.exitCode = 1;
}
