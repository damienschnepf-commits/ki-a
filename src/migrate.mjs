import { migrateCentralSchema } from './central-schema.mjs';
import { migrateConversationStore } from './conversation-store.mjs';

try {
  const schema = migrateCentralSchema();
  if (!schema.initialized) {
    throw new Error('Zentralschema nicht bestätigt.');
  }

  const result = migrateConversationStore();
  if (!result.migrated) {
    throw new Error('Migration nicht bestätigt.');
  }

  process.stdout.write('Zentralschema und Gesprächsspeicher bereit.\n');
} catch (error) {
  process.stderr.write(error.message + '\n');
  process.exitCode = 1;
}
