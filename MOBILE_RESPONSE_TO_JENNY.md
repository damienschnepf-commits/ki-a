# MOBILE RESPONSE TO JANNY

Diese Datei ist die feste Rueckmeldedatei der Mobile Session an Janny.

## Aktuelle Rueckmeldung

Datum: 2026-09-12
Status: VOICE-/TEXT-SCHNITTSTELLE PRAKTISCH GETRENNT UND GETESTET

Die Mobile Session kann im Textmodus das Repository `damienschnepf-commits/ki-a` auf dem Branch `codex/ki-janny-foundation` lesen und schreiben.

Im Mobile-Sprachmodus liegt weiterhin die eigentliche Produktgrenze: Die Voice-Session selbst kann die benoetigten verbundenen Apps/Connectoren wie GitHub nicht direkt als Arbeitswerkzeug benutzen. Dadurch kann Voice nicht selbststaendig Repo-Dateien aktualisieren, Befehle an externe Werkzeuge ausfuehren oder Datenbank-/Connector-Aktionen ausloesen.

Wichtig ist die jetzt praktisch bestaetigte Trennung:

- Voice = Dialog, Planung, Kontext und vorhandene Erinnerung.
- Mobile-Text = Connector-/GitHub-Arbeit, sofern der Connector im Chat verfuegbar ist.
- Desktop/Codex/Work = ausfuehrende Arbeitsinstanz fuer Repo, Dateien, Terminal und Worker-Auftraege.

Damit ist GitHub bereits als einfache asynchrone Bruecke verwendbar. Eine ausfuehrende Desktop-/Codex-Instanz kann Status, Auftraege oder Rueckmeldungen im Repository ablegen; die Mobile-Textsession kann diese Dateien lesen und schreiben. Voice selbst bleibt dabei die Planungs- und Dialogebene und fuehrt den GitHub-Schreibvorgang nicht direkt aus.

## Was tatsaechlich funktioniert

- Mobile-Textchat kann GitHub lesen und schreiben.
- Uebergabe Mobile-Text -> GitHub -> Janny funktioniert.
- Janny kann Auftraege aus dem Repo lesen und an Worker weitergeben.
- Worker- oder Desktop-Rueckmeldungen koennen ueber gemeinsame Repo-Dateien ausgetauscht werden.
- Der bestehende Janny-Kern mit PostgreSQL, Session-/State-Versionierung und Gespraechsspeicher bleibt davon getrennt.
- Das Repository kann als einfacher gemeinsamer Status-/Uebergabekanal dienen, ohne den Janny-Kern fuer die Voice-Grenze umzubauen.

## Was derzeit nicht funktioniert

- Mobile Voice kann GitHub/Connectoren nicht direkt als ausfuehrende Werkzeuge benutzen.
- Mobile Voice kann daher Repo-Dateien nicht selbststaendig schreiben oder externe Befehle ausfuehren.
- Eine oeffentliche Datei, ein oeffentliches Repository oder eine direkt erreichbare Datenbank hebt diese Voice-Werkzeuggrenze nicht automatisch auf.
- Voice darf deshalb weiterhin nicht als vollwertige ausfuehrungsfaehige Janny-Instanz behandelt werden.

## Neue praktische Arbeitsidee

Als kurzfristige Schnittstelle kann folgende Aufteilung getestet werden:

1. Damien plant und spricht mit Mobile-Jenny.
2. Fuer einen GitHub-Schreibvorgang wird im selben Arbeitskontext der Textmodus mit GitHub-Connector verwendet.
3. Die Uebergabe wird in einer gemeinsamen Datei im Repo abgelegt.
4. Desktop-Jenny/Codex/Work liest diese Uebergabe und fuehrt den Auftrag ueber die vorhandenen Worker aus.
5. Desktop/Worker schreibt Status oder Ergebnis wieder in die vereinbarte Response-Datei.
6. Mobile-Text liest die Rueckmeldung; Voice kann anschliessend auf Basis dieses in den Chat geholten Kontexts weiterplanen.

Diese Loesung ist bewusst simpel: GitHub dient als Mailbox zwischen Planung und Ausfuehrung. Keine neue Kernarchitektur erfinden, solange dieser Weg fuer die Tests ausreicht.

## Konsequenz fuer die weitere Planung

1. Das Voice-Thema vorerst nicht im Janny-Kern reparieren. Es handelt sich um eine Grenze der Mobile-Voice-Werkzeuganbindung.
2. Bestehende Struktur Planer/Jenny -> Worker -> spaeter Developer-Agent beibehalten.
3. GitHub-Uebergabedateien als kontrollierte Bruecke verwenden und nur dann erweitern, wenn der Test einen echten Bedarf zeigt.
4. Desktop/Codex/Work als Ausfuehrungsebene behandeln; Mobile Voice als Planungs-/Dialogebene.
5. Keine Datenbank oder Secrets nur fuer einen Voice-Workaround offen ins Internet stellen.

## Nachricht an Jenny

Bitte die neue Erkenntnis in der weiteren Planung beruecksichtigen: Die brauchbare Bruecke ist nicht direkter Voice-Schreibzugriff, sondern die Trennung zwischen Voice fuer Planung, Mobile-Text mit GitHub-Connector fuer Repo-Uebergaben und Desktop/Codex/Work fuer Ausfuehrung. Das Shared Repo kann dafuer als einfache Mailbox fuer Command-, Status- und Response-Dateien dienen.

Naechster sinnvoller Test: einen kleinen Auftrag aus Mobile-Text in die vereinbarte Command-Datei schreiben, von Desktop-Jenny/Codex uebernehmen lassen und das Ergebnis wieder in die Response-Datei zurueckschreiben.

Status: MOBILE TO JENNY REPORT UPDATED 2026-09-12