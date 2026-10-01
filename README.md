# KI-Janny

KI-Janny ist Damiens erstes und zentrales KI-Projekt. **KI-Engineering Jenny** ist die hauptverantwortliche Engineering-Komponente. Weitere Agenten werden erst später und ausschließlich nachgeordnet ergänzt.

## Verbindliche Projektbasis

[Dieses GitHub-Repository](https://github.com/damienschnepf-commits/ki-a) ist die Quelle der Wahrheit für Code, Architektur, Roadmap und Status. Der technische Repository-Name bleibt `ki-a`; der Projektname ist **KI-Janny**. Lokale Arbeitskopien und Chat-Verläufe ersetzen den versionierten Projektstand nicht.

## Aktueller Funktionsumfang

**Bereitstellungsstand:** Der lokale Code enthält den deterministischen Aufgabenplaner sowie einen PostgreSQL-gestützten Gesprächspfad mit gemeinsamem Sessionkontext. Die lokale Implementierung ist durch Unit-Tests abgedeckt; echte Datenbank-, Modell- und Geräteabnahmen sind separat in [JANNY_CORE.md](docs/JANNY_CORE.md) ausgewiesen.

Der Aufgabenplaner ordnet einen Engineering-Auftrag Jenny zu und gibt einen strukturierten Plan als JSON aus. Der Chatpfad lädt Zustand, Entscheidungen und belegte Gesprächsgeschichte aus PostgreSQL, wählt den OpenAI- oder deterministischen `local-test`-Adapter und speichert den Austausch mit Versionsschutz. Er führt keine freigegebenen Engineering-Aufträge automatisch aus. Es gibt keine externen Paketabhängigkeiten, Hintergrunddienste oder nachgeordneten Agenten.

## Start

Voraussetzung: Node.js 22 oder neuer.

```sh
git clone https://github.com/damienschnepf-commits/ki-a.git
cd ki-a
npm start -- "Projektübersicht verbessern"
npm test
```

Für Gespräche zusätzlich PostgreSQL nach [SQL_SYNC.md](docs/SQL_SYNC.md) konfigurieren und die Migrationen ausführen. Ein lokaler Adaptertest ohne externe Modellanfrage:

```sh
npm run chat -- SESSION-PC-001 PC Damien-PC "Hallo" local-test
```

Alternativ: `node src/cli.mjs SESSION-PC-001 PC Damien-PC "Projektübersicht verbessern"`.
Leere Aufträge werden mit Exit-Code 1 abgelehnt.

## Aufbau

- `src/jenny.mjs`: Auftragsvalidierung und Planerstellung.
- `src/cli.mjs`: Kommandozeileneinstieg.
- `tests/jenny.test.mjs`: Verhaltenstests.
- `src/chat.mjs`: gemeinsamer Chatpfad mit Snapshot- und Konfliktschutz.
- `src/conversation-context.mjs`: versionierter Kontext aus PostgreSQL-Daten.
- `src/central-schema.mjs`: versioniertes Zentralschema und explizite Initialisierung.
- [Architektur](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [Projektstatus](PROJECT_STATUS.md)
- [Austausch mit GitHub Copilot](copilot/README.md)

## Arbeitsweise

Neue Änderungen entstehen auf `codex/<thema>` und werden über einen Pull Request geprüft. Fachliche Entscheidungen und Änderungen am Funktionsumfang werden im Repository dokumentiert. Zugangsdaten gehören weder in Code noch in GitHub-Issues. Der OpenAI-Adapter ist implementiert; ein echter API-Aufruf und die dazugehörige Produktabnahme bleiben offen.

## Manueller SQL-Datei-Sync

Die vier bestehenden PostgreSQL-Export-Views lassen sich mit npm run sync:state lokal exportieren. Einrichtung, Ausgabeformat und Tests: [SQL_SYNC.md](docs/SQL_SYNC.md).

ICH LIEBE DICH
