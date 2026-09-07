# KI-Janny

KI-Janny ist Damiens erstes und zentrales KI-Projekt. **KI-Engineering Jenny** ist die hauptverantwortliche Engineering-Komponente. Weitere Agenten werden erst später und ausschließlich nachgeordnet ergänzt.

## Verbindliche Projektbasis

[Dieses GitHub-Repository](https://github.com/damienschnepf-commits/ki-a) ist die Quelle der Wahrheit für Code, Architektur, Roadmap und Status. Der technische Repository-Name bleibt `ki-a`; der Projektname ist **KI-Janny**. Lokale Arbeitskopien und Chat-Verläufe ersetzen den versionierten Projektstand nicht.

## Aktueller Funktionsumfang

**Bereitstellungsstand:** Auf GitHub veröffentlicht und lokal geprüft; alle vier Tests bestehen. Der aktuelle Standardbranch ist `codex/ki-janny-foundation`. Den Prüf- und Übernahmestand beschreibt `PROJECT_STATUS.md`.

Ein lokaler, deterministischer Aufgabenplaner ordnet einen Engineering-Auftrag Jenny zu und gibt einen strukturierten Plan als JSON aus. Er führt keine Aufträge aus und verwendet noch kein Sprachmodell. Keine externen Abhängigkeiten, Hintergrunddienste oder weiteren Agenten.

## Start

Voraussetzung: Node.js 22 oder neuer.

```sh
git clone https://github.com/damienschnepf-commits/ki-a.git
cd ki-a
npm start -- "Projektübersicht verbessern"
npm test
```

Alternativ: `node src/cli.mjs "Projektübersicht verbessern"`.
Leere Aufträge werden mit Exit-Code 1 abgelehnt.

## Aufbau

- `src/jenny.mjs`: Auftragsvalidierung und Planerstellung.
- `src/cli.mjs`: Kommandozeileneinstieg.
- `tests/jenny.test.mjs`: Verhaltenstests.
- [Architektur](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [Projektstatus](PROJECT_STATUS.md)
- [Austausch mit GitHub Copilot](copilot/README.md)

## Arbeitsweise

Neue Änderungen entstehen auf `codex/<thema>` und werden über einen Pull Request geprüft. Fachliche Entscheidungen und Änderungen am Funktionsumfang werden im Repository dokumentiert. Zugangsdaten gehören weder in Code noch in GitHub-Issues. Eine Modellanbindung und deren Zugangsdaten werden erst in einem eigenen Umsetzungsschritt eingerichtet.
