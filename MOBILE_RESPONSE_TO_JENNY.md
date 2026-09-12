# MOBILE RESPONSE TO JANNY

Diese Datei ist die feste Rueckmeldedatei der Mobile Session an Janny.

## Aktuelle Rueckmeldung

Datum: 2026-09-12
Status: INFO FUER JENNY

Die Mobile Session kann im Textmodus das Repository `damienschnepf-commits/ki-a` auf dem Branch `codex/ki-janny-foundation` lesen und schreiben.

Im Mobile-Sprachmodus liegt weiterhin die eigentliche Produktgrenze: Die Voice-Session selbst kann die benoetigten verbundenen Apps/Connectoren wie GitHub nicht direkt als Arbeitswerkzeug benutzen. Dadurch kann Voice nicht selbststaendig Repo-Dateien aktualisieren, Befehle an externe Werkzeuge ausfuehren oder Datenbank-/Connector-Aktionen ausloesen.

Wichtig ist die praktisch bestaetigte Trennung:

- Voice = Dialog, Planung, Kontext und vorhandene Erinnerung.
- Mobile-Text = Connector-/GitHub-Arbeit, sofern der Connector im Chat verfuegbar ist.
- Desktop/Codex/Work = ausfuehrende Arbeitsinstanz fuer Repo, Dateien, Terminal und Worker-Auftraege.

GitHub kann damit als einfache asynchrone Bruecke zwischen Planung und Ausfuehrung verwendet werden. Das Repository kann als gemeinsamer Status-/Uebergabekanal dienen, ohne den Janny-Kern fuer die Voice-Grenze umzubauen.

## Info an Jenny

Diese Rueckmeldung ist **nur als Information fuer Jenny** gedacht und ist **kein direkter Ausfuehrungsauftrag**.

Bitte pruefen, ob die Erkenntnis fuer die allgemeine Projektarchitektur bzw. fuer andere Projekte relevant ist. Wenn ja, kann Jenny sie in die uebergeordnete Planung oder in passende Projektstandards aufnehmen.

Projektuebergreifend moeglicherweise relevant:

- Vor zugesagten Aktionen immer pruefen, ob der benoetigte Connector im aktuellen Ausfuehrungskontext tatsaechlich verfuegbar ist.
- Voice-, Text- und Desktop-/Worker-Kontexte nicht automatisch als technisch gleichwertig behandeln.
- Gemeinsame Repo-Dateien koennen als einfache Mailbox fuer Command-, Status- und Response-Uebergaben dienen.
- Keine neue Kernarchitektur nur wegen einer einzelnen Client-/Voice-Grenze bauen, solange eine saubere Uebergabeschicht ausreicht.
- Erfolg einer externen Aktion erst melden, wenn der Schreib-/Ausfuehrungsvorgang technisch bestaetigt wurde.

Jenny entscheidet selbst, ob und wo diese Punkte fuer **alle Projekte** eingeplant werden sollen.

Status: INFO AN JENNY ABGELEGT