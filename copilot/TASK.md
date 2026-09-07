# Aktueller Auftrag

Status: Bereit zur manuellen Übergabe an GitHub Copilot.

## Ziel

Den veröffentlichten KI-Janny-Grundaufbau bei Bedarf unabhängig prüfen. Jennys erfolgreich abgeschlossene Erstprüfung ist in `JENNY_UPDATE.md` dokumentiert.

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

Dieser Übergabeauftrag umfasst lokale Prüfung und Korrekturen. Jenny hat den Grundaufbau bereits veröffentlicht. Neue Korrekturen auf einem eigenen Themenbranch vorbereiten und die Ergebnisse in `RESPONSE.md` festhalten.
