# Projektstatus

Stand: 2026-10-01

- **Projekt:** KI-Janny, erstes und zentrales Projekt.
- **Hauptkomponente:** KI-Engineering Jenny.
- **Quelle der Wahrheit:** [GitHub-Repository](https://github.com/damienschnepf-commits/ki-a)
- **Phase:** Zentralschema und gemeinsamer Gesprächspfad lokal implementiert; externe Abnahmen offen.
- **Weitere Agenten:** Keine.

## Repository-Prüfung

Die allgemeine GitHub-Liste lieferte keine Einträge. Die direkte Abfrage nach eigenen, mitbearbeiteten und Organisations-Repositories lieferte genau `damienschnepf-commits/ki-a`. GitHub bestätigte, dass dieses Repository leer, öffentlich und beschreibbar ist. Daher wird es für KI-Janny verwendet. Es wurden keine früheren Rollen, Chats oder Projekte gelöscht oder migriert.

## Bereitgestellt

Projektübersicht, Architekturentscheidungen, Roadmap, deterministischer Aufgabenplaner, versioniertes PostgreSQL-Zentralschema, Gesprächsspeicher, gemeinsamer PC-/VOICE-/IPHONE-Kontext und Chat-CLI. Die Chat-Antwort wird vor Generierung mit einem frischen Snapshot abgeglichen; Versionskonflikte beim Speichern führen zu einem begrenzten Neuladen und erneuter Generierung. Der Initialzustand wird nur explizit gesetzt und überschreibt keine vorhandene Zustandszeile.

## Validierung

Am 2026-10-01: `npm test` besteht mit 35 Tests und 0 Fehlern. Syntaxprüfungen der geänderten Module sowie JSON-Prüfung von `package.json` bestehen ebenfalls. Die Tests verwenden lokale Adapter und Datenbank-Mocks; sie belegen keine Verbindung zur vorgesehenen PostgreSQL-Datenbank, keinen echten OpenAI-Aufruf und keine physische Geräteverbindung.

Die PostgreSQL-Migration und `npm run test:core-local` wurden in dieser Prüfung nicht ausgeführt, da sie die konfigurierte zentrale Datenbank verändern. Vorher Datenbank, Schema, Anmeldung und Backup prüfen.

## Lokaler Git- und Copilot-Stand

Der lokale Branch und bestehende Änderungen wurden während dieser Arbeit beibehalten. Es wurden keine Commits, Pushes oder Branchwechsel durchgeführt.

## Historische GitHub-Übernahme

Die erste Übernahme über die GitHub-Integration scheiterte mit HTTP 403 / `Resource not accessible by integration`. Am 2026-09-07 gelang die Veröffentlichung anschließend über den lokal verfügbaren Git-Zugang. Der Grundaufbau wurde mit Commit `8888f48f9b84a5a3c57f53ecfff887ce5c1bc5cf` auf `codex/ki-janny-foundation` veröffentlicht. GitHub bestätigt diesen Branch als Standardbranch. Die Integration selbst wurde nicht umkonfiguriert.

GitHub ist jetzt die verbindliche Projektbasis. Weitere Änderungen als eigene Themenbranches mit Pull Request gegen den Standardbranch vorbereiten. Zugangsdaten bleiben außerhalb von Dateien und Chat.

## Noch offen

1. T-001 bleibt `IN_PROGRESS`, bis Zentralschema und Gesprächsspeicher nach Prüfung gegen die vorgesehene PostgreSQL-Datenbank migriert und mit `npm run test:core-local` abgenommen wurden.
2. Den initialen Projektzustand fachlich festlegen und danach einmalig mit `npm run db:initialize` eintragen.
3. Echte Modellabnahme mit OpenAI durchführen; Identität, belegte Erinnerung und Entscheidungsstabilität bewerten.
4. Gemeinsamen Kontext mit echten PC- und iPhone-Sitzungen prüfen. Lokale Sessiontypen simulieren keine physische Geräteverbindung.
5. Übernahme der Änderungen auf GitHub bleibt ungeprüft; vor einem Pull Request Repository und Remote-Stand erneut verifizieren.
