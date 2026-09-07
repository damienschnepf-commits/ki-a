# Austausch mit GitHub Copilot

Dieser Ordner dient als manuelle, dateibasierte Übergabe zwischen Damien, KI-Engineering Jenny und GitHub Copilot. Er startet keinen Dienst und sendet keine Nachrichten automatisch.

## Verwendung

1. Den Projektordner `ki-janny` in einer Entwicklungsumgebung mit GitHub Copilot öffnen.
2. Den folgenden Auftrag in Copilot Chat einfügen:

```text
Lies copilot/PROJECT_CONTEXT.md, copilot/TASK.md und PROJECT_STATUS.md. Bearbeite den Auftrag in diesem Projektordner. Halte Ergebnisse, Prüfungen und offene Punkte in copilot/RESPONSE.md fest. Behaupte keine erfolgreiche Ausführung oder GitHub-Synchronisation ohne Prüfung.
```

3. Copilots Rückmeldung steht anschließend in `copilot/RESPONSE.md` und kann von Jenny bei der nächsten Bearbeitung gelesen werden.
4. Für einen neuen Auftrag `TASK.md` aktualisieren; relevante Ergebnisse vor dem Ersetzen der Rückmeldung in der Projektdokumentation festhalten.

GitHub bleibt die Quelle der Wahrheit. Der Grundaufbau einschließlich dieses Ordners ist auf `codex/ki-janny-foundation` veröffentlicht. Neue lokale Änderungen werden erst durch eine erfolgreiche GitHub-Übernahme Teil des verbindlichen Stands. Keine Tokens, Passwörter oder persönlichen Geheimnisse in diesem Ordner speichern.
