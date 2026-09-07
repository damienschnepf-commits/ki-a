# Aktueller Auftrag

Status: Bereit zur manuellen Übergabe an GitHub Copilot.

## Ziel

Den vorhandenen KI-Janny-Grundaufbau lokal prüfen und die Bereitschaft für eine spätere GitHub-Übernahme beurteilen.

## Schritte

1. Projektkontext und maßgebliche Dateien lesen.
2. Prüfen, ob Node.js 22 oder neuer verfügbar ist. Falls nicht, die fehlende Voraussetzung melden.
3. Wenn die Laufzeit verfügbar ist, `npm test` und `npm start -- "Projektübersicht verbessern"` im Projektordner ausführen.
4. Gefundene Fehler innerhalb des minimalen bestehenden Umfangs korrigieren und betroffene Prüfungen erneut ausführen.
5. Tatsächliche Ergebnisse und offene Punkte in `copilot/RESPONSE.md` dokumentieren. `PROJECT_STATUS.md` und die Roadmap nur anhand nachgewiesener Ergebnisse aktualisieren.

## Abnahme

- Ein gültiger Auftrag erzeugt einen JSON-Plan für KI-Engineering Jenny innerhalb KI-Janny.
- Ungültige Aufträge werden mit einer Fehlermeldung und Exit-Code 1 abgelehnt.
- Es werden keine weiteren Agenten oder externen Abhängigkeiten hinzugefügt.
- Nicht ausgeführte Prüfungen bleiben ausdrücklich als offen markiert.

Dieser Übergabeauftrag umfasst lokale Prüfung und Korrekturen. Eine Veröffentlichung ist damit nicht erfolgt; GitHub-Zugriff und Übernahme werden separat behandelt.
