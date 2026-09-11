# Bericht: KI-Partnerin Mobile – Voice / GitHub-Connector

**Datum:** 2026-09-11  
**Projekt:** KI-Janny  
**Repository:** `damienschnepf-commits/ki-a`  
**Branch:** `codex/ki-janny-foundation`  
**Status:** Reproduzierter Integrations-/Session-Kontextfehler

## Ziel

Der Nutzer soll auf dem iPhone per Sprache mit **KI-Partnerin Mobile** sprechen können. Die Mobile-Instanz soll daraus Übergaben formulieren und diese über GitHub an **Jenny** weitergeben. Jenny bleibt die Planerin und verteilt daraus Aufgaben an ihre Worker. Die bestehende Architektur soll nicht ersetzt werden.

Gewünschter Weg:

`Nutzer (Voice) -> KI-Partnerin Mobile -> GitHub -> Jenny (Planerin) -> Worker`

## Erfolgreich getesteter Teil

Im normalen Chat-Kontext derselben Unterhaltung war der verbundene GitHub-Connector verfügbar.

Erfolgreich durchgeführt:

1. `JENNY_COMMAND_MOBILE.md` wurde direkt aus dem Repository auf Branch `codex/ki-janny-foundation` gelesen.
2. Test-ID `MOBILE-HANDOFF-001` wurde erkannt.
3. `MOBILE_RESPONSE_TO_JENNY.md` wurde anschließend direkt über den GitHub-Connector aktualisiert.
4. Der Schreibvorgang erzeugte Commit `7c165373b8faa23745347b3c4e2a4a3d8a4f3026`.
5. Status des Übergabetests: `MOBILE-HANDOFF OK`.

Damit ist nachgewiesen, dass Lesen und Schreiben über GitHub grundsätzlich funktionieren, wenn der Connector im aktiven Ausführungskontext verfügbar ist.

## Beobachtetes Problem

Beim Wechsel derselben Unterhaltung in den Sprachmodus konnte die Voice-Instanz den zuvor verwendeten GitHub-Connector nicht zuverlässig als ausführbares Werkzeug verwenden. Im Voice-Dialog wurde deshalb fälschlicherweise zunächst angenommen bzw. behauptet, der zuvor funktionierende Übergabeweg könne weiterhin direkt ausgeführt werden.

Das Problem ist besonders kritisch, weil die Spracheingabe kein Zusatzfeature ist, sondern ein Kernziel des Projekts: Der Nutzer möchte unterwegs sprechen, ohne einen neuen Chat öffnen, Plugins erneut auswählen oder Inhalte manuell kopieren zu müssen.

## Technische Schlussfolgerung

Nicht GitHub selbst und nicht die Repository-Struktur sind durch diesen Test als Fehlerquelle belegt. Der erfolgreiche Read/Write-Test zeigt vielmehr, dass die GitHub-Seite funktioniert.

Die zu untersuchende Grenze liegt zwischen **Chat-/Voice-Ausführungskontext und Connector-Verfügbarkeit bzw. Tool-Handoff**. Ein Connector, der im Textkontext derselben Unterhaltung verfügbar war, darf für die Architektur nicht stillschweigend als im Voice-Ausführungskontext verfügbar angenommen werden.

## Anforderungen an die Lösung

- Kein manueller Copy-Paste-Workflow.
- Kein Zwang, für jede Übergabe einen neuen Chat zu öffnen.
- Jenny bleibt Planerin vor den Workern.
- KI-Partnerin Mobile erzeugt bzw. übermittelt Mobile-Rückmeldungen und Übergaben, übernimmt aber nicht Jennys Worker-Rolle.
- Repository und Branch bleiben die zentrale Übergabeschicht.
- Voice muss entweder direkt auf einen persistent verfügbaren GitHub-/Backend-Kanal zugreifen können oder die Spracheingabe muss zuverlässig an einen nachgelagerten Prozess übergeben werden, der den GitHub-Schreibvorgang ausführt.
- Tool-Verfügbarkeit muss vor einer zugesagten GitHub-Aktion geprüft werden. Keine Erfolgsmeldung ohne tatsächlich bestätigten Schreibvorgang.

## Auftrag an Entwickler / Worker

1. Prüfen, welche Tool-/Connector-Fähigkeiten im Mobile-Voice-Modus tatsächlich verfügbar sind und ob sich diese beim Wechsel zwischen Text und Voice ändern.
2. Prüfen, ob der bestehende Chat nach Voice-Eingabe einen Text-/Backend-Schritt auslösen kann, der den verbundenen GitHub-Connector verwendet.
3. Falls Voice den Connector nicht direkt ausführen kann, einen persistenten Übergabemechanismus entwerfen, bei dem Voice nur den Auftrag erfasst und ein autorisierter Backend-/Worker-Schritt GitHub liest bzw. schreibt.
4. Bestehende Jenny-Architektur beibehalten: `Mobile -> GitHub -> Jenny -> Worker`.
5. Einen End-to-End-Test definieren, bei dem der Nutzer ausschließlich per Sprache einen kleinen Auftrag (z. B. Fitnessplan-Testauftrag) diktiert und dieser ohne manuelles Copy-Paste in einer von Jenny lesbaren GitHub-Datei landet.
6. Erfolgskriterium: Der Nutzer bleibt in seiner Mobile-Unterhaltung, spricht den Auftrag ein und erhält erst nach bestätigtem GitHub-Write eine Erfolgsmeldung.

## Vorgeschlagener Regressionstest

**Test-ID:** `VOICE-MOBILE-HANDOFF-001`

1. Mobile-Unterhaltung öffnen.
2. Voice starten.
3. Auftrag diktieren: kleiner Fitnesscenter-Plan als Testauftrag für Jenny.
4. Voice/Chat übergibt den Auftrag ohne Nutzer-Copy-Paste an GitHub.
5. Ziel-Datei wird auf `codex/ki-janny-foundation` geschrieben.
6. Jenny kann die Übergabe lesen.
7. Commit-SHA wird als technischer Erfolgsnachweis zurückgegeben.

**PASS:** Alle Schritte funktionieren ohne neuen Chat und ohne erneutes manuelles Aktivieren des GitHub-Connectors.  
**FAIL:** Voice verliert den ausführbaren Connector-Kontext, verlangt einen neuen Chat oder benötigt Copy-Paste.
