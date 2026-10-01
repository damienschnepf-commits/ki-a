# Roadmap

## 1 — Grundlage

- [x] Verfügbare Repositories prüfen und bestehendes leeres Repo auswählen.
- [x] KI-Janny und die Hauptrolle KI-Engineering Jenny definieren.
- [x] README, Architektur und Projektstatus erstellen.
- [x] Lokalen Aufgabenplaner samt Verhaltenstests bereitstellen.
- [x] Erfolgreichen Testlauf bestätigen (2026-09-07: vier Tests bestanden).

Abnahme: Ein gültiger Auftrag ergibt einen Jenny zugeordneten Plan; ungültige Eingaben scheitern; Dokumentation beschreibt die tatsächlichen Grenzen.

## 2 — Persistenter Janny-Kern und Gesprächspfad

- [x] Identität, Projektkontext, Entscheidungen, Verlauf und Freigabegrenzen in `JANNY_CORE.md` festlegen.
- [x] PostgreSQL-Zentralschema, versionierte Migrationen und explizite Initialisierung implementieren.
- [x] PC-, VOICE- und IPHONE-Sessions mit gemeinsamem Snapshot-Kontext und Gesprächsspeicher verbinden.
- [x] Chat-CLI, OpenAI-Adapter und deterministischen `local-test`-Adapter bereitstellen.
- [x] Snapshot vor der Antwort erneut laden und veraltete Schreibvorgänge begrenzt wiederholen.
- [x] Lokale Unit-Tests bestehen (2026-10-01: 35 bestanden).
- [ ] PostgreSQL-Schema nach Prüfung und Backup auf die vorgesehene Datenbank migrieren und `npm run test:core-local` ausführen.
- [ ] Identitäts-, Erinnerungs- und Entscheidungsstabilität mit einem echten Modell abnehmen.
- [ ] Gemeinsamen Kontext mit echten PC- und iPhone-Sitzungen abnehmen.
- [ ] Entscheiden, ob eine eigene Sprachoberfläche benötigt wird.

Abnahme: Datenbankmigration und lokaler End-to-End-Test bestehen; Modell- und Geräteverhalten sind separat anhand der festgelegten Kriterien geprüft.

## 3 — Nachgeordnete Agenten, nur bei Bedarf

- [ ] Wiederkehrende, klar abgrenzbare Teilaufgabe identifizieren.
- [ ] Einen nachgeordneten Agenten mit begrenzter Verantwortung ergänzen.
- [ ] Rückgabe, Fehler und Freigaben durch Jenny überprüfen.

Abnahme: Jenny bleibt zentral verantwortlich; der zusätzliche Agent hat einen belegten Nutzen.
