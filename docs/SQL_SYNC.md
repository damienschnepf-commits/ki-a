# Manueller SQL-Datei-Sync

## Dateien nach GitHub (CMD-003)

`npm run sync:github` exportiert zuerst frisch aus PostgreSQL und überträgt ausschließlich die vier bestehenden Exportdateien nach `damienschnepf-commits/Shared-files-with-Jenny`, Branch `main`. PostgreSQL `janny_central` bleibt die alleinige Quelle der Wahrheit für diesen Zustand. Das öffentliche Code-Repository ist kein Ziel für Datenbankauszüge.

Der Aufruf nutzt dieselbe lokale PostgreSQL-Anmeldung wie `sync:state` sowie die bestehende Git-Anmeldung und Git-Commit-Identität. Keine Tokens im Skript. Die vier Dateien werden in einem temporären Verzeichnis erzeugt und in einer separaten Kopie des Shared-Repos gemeinsam committet. Unveränderte Auszüge erzeugen keinen Commit. Andere lokale Änderungen werden nicht übernommen. Bei parallelen Remote-Änderungen wird der Push ohne Überschreiben abgelehnt; erneut ausführen. Temporäre Dateien werden danach entfernt. Die lokalen Projekt-Auszüge werden weiterhin separat mit `sync:state` aktualisiert.

Es gibt keinen Zeitplan und keine Worker-Kaskade. Die Export-Views müssen für die Übergabe geeignete Daten ohne Secrets liefern; das Skript verändert oder filtert die View-Inhalte nicht. Ein erfolgreicher Unit-Test ersetzt keinen echten GitHub-Verbindungstest.

## Janny-Zustand laden (CMD-004)

Der CLI-Aufruf aktualisiert zuerst die vier vorhandenen Exportdateien durch den bestehenden SQL-Sync und lädt sie anschließend als Arbeitsgrundlage für Jenny: `CURRENT_STATE.md`, `OPEN_TASKS.md`, `DECISIONS.md` und `SESSION_INDEX.json`. Der Plan enthält diese Daten als `centralState`. Scheitert Export, Lesen oder JSON-Validierung, wird kein Plan ausgegeben. Damit bleibt PostgreSQL `janny_central` die alleinige Quelle; GitHub ist nur die synchronisierte Übergabeansicht. Es wird nichts automatisch an GitHub übertragen und kein weiterer Worker gestartet.

Voraussetzungen: Node.js 22+, PostgreSQL-Client `psql`, Leserechte auf die vier bestehenden Export-Views. Aufruf im Projektordner: `node src/sync-state.mjs` (oder `npm run sync:state`). Kein Hintergrunddienst und keine Developer-Ausführung.

## Session-Bootstrap und Freigaben

Der CLI-Start registriert eine `PC`-, `IPHONE`- oder `VOICE`-Session atomar mit der aktuell geladenen `state_version`. Er liefert Central State, offene Aufgaben, Entscheidungen, Sessions sowie noch nicht verbrauchte `APPROVED`-Freigaben. Ein Zustands-Update ist nur mit der exakt geladenen Version möglich; bei einem älteren Stand wird nichts geschrieben. Erfolgreiche Änderungen erhöhen die Version, erzeugen einen Eintrag in `state_history` und aktualisieren die schreibende Session.

Ein Command kann nur beansprucht werden, wenn die Session aktiv ist, der globale Schalter `system_state.execution_authorized` gesetzt ist und eine bestätigte, noch nicht verbrauchte Freigabe existiert. Beanspruchen setzt Approval und Command in derselben serialisierbaren Transaktion auf `CONSUMED` beziehungsweise `CLAIMED`. Ohne diese Bedingungen findet keine Ausführung statt.

CLI-Aufruf:

```powershell
node src/cli.mjs SESSION-PC-001 PC Damien-PC "Engineering-Auftrag"
node src/cli.mjs SESSION-IPHONE-001 IPHONE Damien-iPhone "Engineering-Auftrag"
```

## Lokale Verbindung

Der Sync verwendet die üblichen PostgreSQL-Umgebungsvariablen: `PGHOST`, `PGPORT`, `PGUSER`, `PGDATABASE` (Standard: `janny_central`), `PGPASSFILE` oder `PGSERVICE`/`PGSERVICEFILE`. `PGSCHEMA` ist optional (Standard: `public`). `PSQL_PATH` bezeichnet optional den vollständigen Pfad zu psql.exe.

Beispiel in PowerShell, ohne Passwort:

```powershell
$env:PSQL_PATH = 'C:\Program Files\PostgreSQL\18\bin\psql.exe'
$env:PGHOST = 'localhost'
$env:PGPORT = '5432'
$env:PGUSER = '<lokaler Datenbankbenutzer>'
npm run sync:state
```

Passwort lokal in `%APPDATA%\postgresql\pgpass.conf` hinterlegen, alternativ eine außerhalb des Repositorys liegende Datei über `PGPASSFILE` wählen. Format: `Host:Port:Datenbank:Benutzer:Passwort`. Windows-Dateirechte auf das eigene Konto beschränken. Keine Zugangsdaten im Code, im Repository oder im Chat speichern. Es werden keine .env-Dateien automatisch geladen. psql fragt nicht interaktiv nach einem Passwort und lädt keine psqlrc.

## Ausgabe und Fehlerverhalten

Im Projektstamm entstehen `CURRENT_STATE.md`, `OPEN_TASKS.md`, `DECISIONS.md` und `SESSION_INDEX.json`. Die Dateien sind lokale Datenbankauszüge und werden von Git ignoriert. Bestehende gleichnamige Dateien werden beim manuellen Aufruf ersetzt.

Alle Views werden mit einem gemeinsamen Snapshot in einer schreibgeschützten Transaktion gelesen. Jede Spalte wird unverändert als Daten übernommen, ohne Annahmen über die View-Struktur. Markdown zeigt Datensätze mit beschrifteten Feldern und maskiert Markup; der Session-Index ist ein JSON-Array mit den ursprünglichen Datentypen. Zeilen werden für stabile Ergebnisse nach ihrer JSON-Darstellung sortiert, nicht chronologisch.

Bei Verbindungs-, SQL- oder Formatfehlern bleiben bestehende Ausgaben unverändert. Nach vollständiger Vorbereitung wird jede Datei einzeln per Umbenennen ersetzt. Die vier Ersetzungen zusammen sind nicht atomar: Ein Dateisperrfehler oder Absturz währenddessen kann einen gemischten Stand hinterlassen; nach Behebung erneut ausführen. Nur einen Sync gleichzeitig starten. Fehlerdetails der Datenbank werden zum Schutz vertraulicher Inhalte nicht ausgegeben. Verbindungslimit: 10 Sekunden; SQL-Limit: 30 Sekunden; Prozesslimit: 45 Sekunden; Antwortlimit: 32 MiB.

## Tests

`npm test` prüft zusätzlich den Sync mit isolierten Testdaten: Unicode, Markdown-Maskierung, leere Views, JSON-Datentypen, Schema-Validierung, wiederholte Ausführung und Erhalt vorhandener Dateien bei Datenbank-/Formatfehlern. Diese Tests ersetzen keinen echten Verbindungstest mit der lokalen Datenbank.
