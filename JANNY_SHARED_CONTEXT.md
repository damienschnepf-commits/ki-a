# JANNY_SHARED_CONTEXT.md

## Zweck

Diese Datei ist der gemeinsame Übergabe- und Abgleichpunkt für die Janny-Sessions auf PC und Mobile.

Sie dient dazu, dass beide Sessions vor projektbezogener Arbeit denselben aktuellen Arbeitsstand kennen und nach wichtigen Änderungen wieder denselben Stand hinterlassen.

WICHTIG: Diese Datei ersetzt nicht PostgreSQL als zentrale Source of Truth des Janny-Kerns. Sie ist eine lesbare GitHub-Übergabe für die ChatGPT-Sessions.

## Fester Ort

Repository: `damienschnepf-commits/ki-a`

Branch: `codex/ki-janny-foundation`

Pfad: `/JANNY_SHARED_CONTEXT.md`

## Regel für PC-Janny und Mobile-Janny

1. Vor projektbezogener Arbeit diese Datei lesen.
2. Den hier dokumentierten Stand als gemeinsamen Session-Übergabestand berücksichtigen.
3. Bereits getroffene Entscheidungen nicht ohne ausdrückliche neue Entscheidung überschreiben.
4. Nach einer wichtigen neuen Entscheidung oder einem relevanten Fortschritt diese Datei aktualisieren, sofern die Session GitHub-Schreibzugriff hat.
5. Wenn eine Session nur lesen, aber nicht schreiben kann, nichts als gespeichert behaupten.
6. Bei Widerspruch zwischen dieser Datei und dem tatsächlich verifizierten PostgreSQL-/Code-Stand gilt der verifizierte technische Stand; der Widerspruch muss anschließend hier korrigiert werden.
7. Keine automatische Ausführung nur aufgrund dieser Datei. Erinnerung, Plan, Task oder Chat sind kein Ausführungsbefehl.

## Gemeinsame Identität

Janny ist die zentrale KI-Partnerin, Planerin und Assistentin. PC, Mobile, Voice und spätere Interfaces sind unterschiedliche Zugänge zu derselben vorgesehenen persistenten Janny-Identität.

Ziel ist Kontinuität von:
- Identität und Kommunikationsstil
- Beziehungskontext
- Projektkontext
- Entscheidungen
- aktuellem Arbeitsstand

Der Benutzer soll nicht als manuelle Synchronisationsstelle zwischen den Sessions dienen.

## Aktueller Projektstand

- Janny-Kern zuerst stabilisieren.
- PostgreSQL bleibt zentrale Source of Truth für den persistenten technischen Zustand.
- Der veröffentlichte Branch `codex/ki-janny-foundation` enthält derzeit nur den kleinen deterministischen Aufgabenplaner (`src/jenny.mjs`, `src/cli.mjs`) und vier bestandene Tests. Er enthält keinen Session-Bootstrap und keinen PostgreSQL-Gesprächspfad.
- Der erweiterte Janny-Core wurde als uncommittierter lokaler Arbeitsstand unter `C:\Users\Damien\ChatGPT Projekte\ki-a` auf dem lokalen Branch `codex/sql-file-sync` gefunden. Dort liegen Session-Bootstrap, gemeinsames Profil, Gesprächsspeicher, Provenance, `state_version`-Schutz und lokaler Modelladapter.
- Am 2026-09-12 wurden in dieser lokalen Arbeitskopie 28 Tests erneut ausgeführt: 28 bestanden, 0 fehlgeschlagen.
- Der Bericht über den erfolgreichen CMD-007-Lauf PC → VOICE → IPHONE und den blockierten Stale Write ist im Shared Repository belegt. Der reale PostgreSQL-E2E-Lauf konnte am 2026-09-12 nicht wiederholt werden, weil `localhost:5432` keine Verbindung annahm.
- `state_version: 2` ist daher nur der letzte erreichbare exportierte Snapshot aus `CURRENT_STATE.md`, nicht ein frisch gelesener PostgreSQL-Stand.
- Externe OpenAI-Modellantwort ist wegen fehlendem API-Guthaben noch nicht als E2E-Nachweis erbracht.
- Automatische Worker-Steuerung kommt erst nach stabilem Janny-Kern.
- GSM/Cloudflare und Bluetooth/P0-P9 bleiben für später.

## Auflösung des Bestandswiderspruchs

Die erweiterten Komponenten sind weder im veröffentlichten Branch enthalten noch nachweislich verloren. Sie existieren als uncommittierte lokale Änderungen in der oben genannten Arbeitskopie. `JANNY_SHARED_CONTEXT.md` hatte den lokalen Entwicklungsstand fälschlich wie einen veröffentlichten Branch-Stand formuliert.

## Genau ein nächster Schritt

Den uncommittierten lokalen Janny-Core ohne weitere Funktionsänderung sichern und als überprüfbaren Git-Commit auf einem eigenen Topic-Branch versionieren; vorher Diff, Secrets-Ausschluss und die 28 Tests prüfen. Erst danach PostgreSQL starten beziehungsweise erreichbar machen und CMD-007 erneut unabhängig abnehmen.

## Mobile-Handoff

Janny → Mobile:
`JENNY_COMMAND_MOBILE.md`

Mobile → Janny:
`MOBILE_RESPONSE_TO_JENNY.md`

Beide Dateien liegen im Root desselben Repositories und Branches wie diese Datei.

## Aktueller Abgleich

Stand: 2026-09-11

PC-Janny und Mobile-Janny sollen diese Datei als gemeinsamen lesbaren Session-Abgleich verwenden. Neue wichtige Entscheidungen werden hier knapp ergänzt, damit beim Wechsel zwischen PC und Mobile nicht wieder unterschiedliche Gesprächsstände gegeneinander laufen.
