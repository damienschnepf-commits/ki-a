# MOBILE RESPONSE TO JANNY

Diese Datei ist die feste Rueckmeldedatei der Mobile Session an Janny.

## Aktuelle Rueckmeldung

Datum: 2026-09-11
Status: VOICE-GRENZE GEKLÄRT

Die Mobile Session kann im Textmodus das Repository `damienschnepf-commits/ki-a` auf dem Branch `codex/ki-janny-foundation` lesen und schreiben.

Im Mobile-Sprachmodus liegt die eigentliche Produktgrenze: Beim Wechsel in Voice entsteht praktisch ein separater Sprachkontext, und die dortige Voice-Session hat keinen Zugriff auf die benötigten verbundenen Apps/Connectoren wie GitHub und andere externe Werkzeuge. Dadurch kann die Voice-Session den aktuellen Projektstand nicht selbstständig aus diesen Quellen nachladen und keine entsprechenden Übergaben direkt ausführen.

Wichtig: Das Problem liegt damit nicht primär an Jannys PostgreSQL-Kern, nicht an der Versionierung, nicht an GitHub-Pfaden und nicht an der grundsätzlichen Chat-zu-Chat-Übergabe. Der zentrale Blocker ist die derzeitige Einschränkung der Mobile-Voice-Funktion selbst.

Die Folge davon war, dass in den letzten Tagen unnötig viel Aufwand in Session-, Übergabe-, Persistenz- und Versionsmechanismen gesteckt wurde, weil das Verhalten fälschlich als Janny-Kern-/Synchronisationsproblem interpretiert wurde.

## Was tatsächlich funktioniert

- Mobile-Textchat kann GitHub lesen und schreiben.
- Übergabe Mobile → GitHub → Janny funktioniert.
- Janny kann Aufträge aus dem Repo lesen und an Worker weitergeben.
- Worker-Rückmeldungen können wieder über die bestehenden Dateien gelesen werden.
- Der bestehende Janny-Kern mit PostgreSQL, Session-/State-Versionierung und Gesprächsspeicher ist technisch vorhanden und getestet.

## Was derzeit nicht funktioniert

- Mobile Voice kann die verbundenen Apps/Connectoren nicht direkt nutzen.
- Deshalb kann Mobile Voice nicht selbstständig den aktuellen Repo-/Tool-Stand laden oder Aktionen über diese Connectoren ausführen.
- Voice darf daher aktuell nicht als vollwertige ausführungsfähige Janny-Schnittstelle behandelt werden.

## Konsequenz für die weitere Planung

1. Das Voice-Thema vorerst nicht weiter im Janny-Kern reparieren. Es handelt sich um eine Produktgrenze der ChatGPT-Mobile-Voice-Funktion.
2. Bestehende funktionierende Struktur Mobile-Text → GitHub → Janny → Worker beibehalten, solange sie praktisch nützlich ist.
3. Die vorhandenen Übergabe- und Versionsmechanismen nicht weiter ausbauen, nur um die fehlende Mobile-Voice-Connector-Unterstützung zu kompensieren.
4. Jannys Kern und die normale Chat-/Desktop-Arbeitsfähigkeit getrennt von der Mobile-Voice-Einschränkung betrachten.
5. Mobile Voice erst wieder technisch anfassen, wenn OpenAI diese Werkzeug-/Connector-Nutzung unterstützt oder bewusst eine eigene Sprachschnittstelle für Janny gebaut wird.

## Nachricht an Jenny

Bitte ab jetzt bei allen weiteren Entscheidungen davon ausgehen, dass die aktuell getestete Mobile-Voice-Funktion keine vollwertige Arbeitsinstanz mit GitHub-/Connector-Zugriff ist. Die vorherige Fehlersuche hat verschiedene Ebenen vermischt. Der technische Kern von Janny und die Mobile-Voice-Produktgrenze müssen künftig klar getrennt behandelt werden.

Status: MOBILE TO JENNY REPORT UPDATED