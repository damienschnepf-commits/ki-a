import { migrateConversationStore } from './conversation-store.mjs';

try {
  const result = migrateConversationStore();
  process.stdout.write(result.migrated ? 'Gesprächsspeicher bereit.\n' : 'Migration nicht bestätigt.\n');
} catch (error) {
  process.stderr.write(error.message + '\n');
  process.exitCode = 1;
}
