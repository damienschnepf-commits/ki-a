# Projektkontext für GitHub Copilot

- Projekt: KI-Janny, Damiens erstes und zentrales KI-Projekt.
- Hauptverantwortliche Engineering-Komponente: KI-Engineering Jenny.
- GitHub Copilot unterstützt bei konkreten Engineering-Aufträgen; weitere Agenten sind derzeit nicht eingerichtet.
- Vorgesehenes Repository: https://github.com/damienschnepf-commits/ki-a
- Das Repository wurde leer vorgefunden. Nach HTTP 403 über die Integration gelang die Veröffentlichung über den lokalen Git-Zugang. Standardbranch: `codex/ki-janny-foundation`.
- Aktueller Stand: auf GitHub veröffentlichter Grundaufbau mit README, Architektur, Roadmap, Projektstatus, einem deterministischen JavaScript-Aufgabenplaner, CLI und Tests.
- Kein Sprachmodell ist angebunden. Der Planer führt keine Aufträge selbst aus.
- Laufzeit: Node.js 22 oder neuer; keine Paketabhängigkeiten. Jenny hat am 2026-09-07 alle vier Tests mit einer geprüften portablen Node.js-v22.23.2-Laufzeit erfolgreich ausgeführt. Sie liegt außerhalb dieses Repositorys unter `../../work/runtime/node.exe`.

## Maßgebliche Dateien

- `README.md`
- `PROJECT_STATUS.md`
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `src/jenny.mjs`
- `src/cli.mjs`
- `tests/jenny.test.mjs`

## Arbeitsgrundsätze

Die Struktur klein halten. Keine zusätzlichen Agenten, Frameworks, Hintergrunddienste oder Modellanbindungen ohne konkreten Auftrag ergänzen. Bestehende Nutzeränderungen erhalten. GitHub-Zugriff und tatsächlichen Remote-Stand vor einer Übernahme neu prüfen. Zugangsdaten niemals in Dateien oder Rückmeldungen ausgeben.
