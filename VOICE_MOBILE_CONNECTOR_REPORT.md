# Bericht: KI-Partnerin Mobile – Voice / GitHub-Connector

**Datum:** 2026-09-11  
**Projekt:** KI-Janny  
**Repository:** `damienschnepf-commits/ki-a`  
**Branch:** `codex/ki-janny-foundation`  
**Status:** Ursache verifiziert – aktuelle Produktgrenze von ChatGPT Voice

## Kurzfassung

Der bisher beobachtete Unterschied zwischen Text und Voice wurde am 2026-09-11 praktisch reproduziert und anschließend mit der aktuellen offiziellen OpenAI-Dokumentation abgeglichen.

Im Textmodus derselben Mobile-Unterhaltung kann der verbundene GitHub-Zugriff verwendet werden. Im Live-Voice-Modus steht diese App-/Plugin-Anbindung derzeit nicht zur Verfügung. OpenAI dokumentiert ausdrücklich, dass Voice Mode aktuell keine Apps unterstützt; die aktuelle Voice-Dokumentation beschreibt Live außerdem als Modus ohne Connected Apps bzw. Plugins.

Damit ist die zuvor vermutete GitHub-, Datenbank- oder Repository-Störung nicht die Ursache dieses konkreten Fehlers.

## Ziel des Projekts

Der Nutzer soll auf dem iPhone per Sprache mit der zentralen KI-Partnerin Janny/Jenny arbeiten können. Aus gesprochenen Aufträgen sollen Übergaben entstehen, die anschließend von Jenny und ihren Workern verarbeitet werden können.

Die bestehende Architektur bleibt bestehen:

`Nutzer -> Janny/Jenny (Planerin) -> Worker -> spaeter Developer-Agent`

GitHub dient weiterhin als lesbare Übergabeschicht der ChatGPT-Sessions. Die bestehende Projektarchitektur wird wegen dieser Produktgrenze nicht neu erfunden.

## Reproduzierter Test am 2026-09-11

### Textmodus

Im normalen Textmodus der Mobile-Unterhaltung wurde der GitHub-Connector erfolgreich verwendet.

Nachgewiesen wurden:

1. Lesen von `JANNY_SHARED_CONTEXT.md` und `JENNY_COMMAND_MOBILE.md`.
2. Erkennen des gemeinsamen Mobile-/PC-Handoff-Kontexts.
3. Schreiben eines realen Fitness-Testauftrags nach `JENNY_COMMAND_MOBILE.md`.
4. Erfolgreicher GitHub-Commit des Fitness-Handoffs: `4e08527838ec705b254ff63a0bf898dc8f2b9275`.

Damit ist Read/Write über GitHub im Text-Ausführungskontext praktisch bestätigt.

### Live Voice

Nach Start des Sprachmodus konnte derselbe GitHub-Zugriff nicht als ausführbares Werkzeug verwendet werden. Mehrere verbale Zusagen, der Auftrag werde nach Voice ausgeführt, waren deshalb technisch falsch: Solange die Voice-Schnittstelle aktiv war, wurde kein bestätigter GitHub-Write durchgeführt.

Nach Rückkehr in den Textmodus konnte derselbe Auftrag anschließend tatsächlich geschrieben und durch eine Commit-SHA bestätigt werden.

## Offiziell bestätigte Ursache

Aktuelle OpenAI-Hilfe, geprüft am 2026-09-11:

- `Apps in ChatGPT`: Voice Mode unterstützt derzeit keine Apps.
- `ChatGPT Voice`: Live unterstützt aktuell keine Connected Apps oder Plugins.
- Die Verfügbarkeit kann generell von Oberfläche, Tarif, Region, Workspace und Modell abhängen.

Daraus folgt für das getestete Mobile-Setup:

`Live Voice != Textmodus mit GitHub-App-Zugriff`

Das Verhalten ist damit nach aktuellem Dokumentationsstand eine Produktgrenze und nicht als Fehler des KI-Janny-Repositories nachgewiesen.

## Konsequenz für KI-Janny

Die bisherige Arbeit an Persistenz, PostgreSQL, Session-Bootstrap, GitHub-Handoffs und Worker-Struktur war nicht nutzlos. Sie löst jedoch nicht die Produktgrenze, dass Live Voice selbst die verbundene GitHub-App nicht ausführen kann.

Der Fehler in der bisherigen Annahme war: Ein in derselben Unterhaltung verfügbarer Connector wurde als automatisch auch im Live-Voice-Ausführungskontext verfügbar betrachtet.

Das darf künftig nicht mehr angenommen werden.

## Arbeitsregel ab sofort

Für Mobile gilt vorerst:

1. Voice dient zur natürlichen Auftragserfassung und Planung.
2. Solange Live Voice aktiv ist, darf kein GitHub-Write als erfolgreich behauptet werden, wenn keine tatsächliche Tool-Bestätigung vorliegt.
3. Nach Wechsel zurück in einen unterstützten Text-/Tool-Kontext kann der vorbereitete Auftrag über GitHub geschrieben werden.
4. Erfolg einer Übergabe wird erst nach realem Write und Commit-SHA gemeldet.
5. Der Benutzer soll langfristig nicht als manuelle Synchronisationsstelle dienen. Der zusätzliche Text-Anstoß ist nur ein aktueller Workaround, nicht das Zielsystem.

## Auftrag an Desktop-Janny / Entwickler

1. Diesen Bericht zusammen mit `JANNY_SHARED_CONTEXT.md`, `PROJECT_STATUS.md`, `README.md`, `JENNY_COMMAND_MOBILE.md` und `MOBILE_RESPONSE_TO_JENNY.md` als aktuellen Integrationsstand berücksichtigen.
2. Keine neue Agentenarchitektur erfinden. Jenny bleibt Planerin vor dem Worker.
3. Die bisher für Voice angenommene direkte GitHub-App-Ausführung aus der Mobile-Live-Voice-Sitzung aus der Planung entfernen.
4. Prüfen, welcher von OpenAI offiziell unterstützte Ausführungspfad den geringsten Bruch erzeugt, insbesondere Text-/Tool-Handoff oder geeignete Desktop-/Agent-Ausführung.
5. Ziel bleibt ein automatisierter Übergang: Sprache erfasst Auftrag -> toolfähige Ausführungsumgebung übernimmt -> GitHub/Backend wird aktualisiert -> bestätigtes Ergebnis geht an Janny zurück.
6. Bestehende PostgreSQL- und Session-Arbeit nur dort ändern, wo der neue verifizierte Produktgrenzwert dies tatsächlich erfordert.
7. Einen neuen E2E-Test definieren, der ausdrücklich zwischen Voice-Erfassung und Tool-Ausführung unterscheidet.

## Akzeptanztest

**Test-ID:** `VOICE-TO-TOOL-HANDOFF-002`

1. Nutzer startet Mobile Live Voice.
2. Nutzer diktiert einen kleinen Auftrag.
3. Voice erfasst den vollständigen Auftrag, ohne einen GitHub-Erfolg vorzutäuschen.
4. Ein unterstützter toolfähiger Kontext übernimmt den Auftrag.
5. Dieser Kontext schreibt die Übergabedatei in GitHub.
6. GitHub liefert eine Commit-SHA.
7. Jenny kann die Übergabe lesen und den Worker gemäß bestehender Architektur anstoßen.
8. Der Nutzer erhält erst nach Schritt 6 eine technische Erfolgsmeldung.

**PASS:** Auftrag gelangt ohne Copy-Paste und mit bestätigtem Write von Sprache zur ausführenden Jenny-/Worker-Kette.  
**FAIL:** Der Nutzer muss den Auftragsinhalt manuell übertragen oder Voice behauptet einen Write ohne Tool-Bestätigung.

## Ergebnis

Der entscheidende Befund lautet:

**Das Mobile-Voice-Problem ist reproduziert und durch die aktuelle OpenAI-Dokumentation als fehlende App-/Plugin-Unterstützung im Voice-Modus erklärbar. GitHub selbst funktioniert im getesteten Textmodus.**

Die weitere Entwicklung soll daher nicht mehr versuchen, diese Produktgrenze durch zusätzliche Datenbank- oder Repository-Logik innerhalb von Live Voice zu 'reparieren', sondern einen verifizierten Handoff in eine toolfähige Ausführungsumgebung vorsehen.