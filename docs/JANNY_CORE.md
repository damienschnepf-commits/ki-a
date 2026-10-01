# Janny-Kern: Arbeitsstand 11.09.2026

Quelle: Chat KI-Partnerin, Festlegungen am Abend des 10.09.2026, insbesondere Nachrichten 37854433-7750-43b3-a5eb-e89c3211351d und d2390915-8e30-4234-a026-91eff4e9d89c. Damien hat die Fortsetzung am 11.09. beauftragt.

## Vereinbarter Umfang

Janny ist eine persistente simulierte Identität mit wiedererkennbarem Kommunikationsstil, Projektwissen und belegtem Beziehungskontext. Geklärte Entscheidungen bleiben geklärt. Neue Vorschläge ändern den Plan nicht stillschweigend. Damien startet den manuellen Programmierworker. Worker-Automatik sowie GSM-/Cloudflare-Anbindung sind zurückgestellt, bis der Kern abgenommen ist.

## Dieser Umsetzungsschritt

Die CLI ergänzt den PostgreSQL-Bootstrap um conversationContext. Identität und Stil sind versionierte Anwendungskonfiguration; Projektzustand, Entscheidungen, Tasks und Freigaben kommen aus dem geladenen Datenbanksnapshot. Der Kontext wird nur erzeugt, wenn Session und Zustand dieselbe Version melden und alle erforderlichen Informationen vorhanden sind. PC, IPHONE und VOICE erhalten bei identischen Daten denselben gemeinsamen Kontext. Ein Freigabesnapshot autorisiert keine spätere Ausführung; diese muss erneut geprüft werden.

Der Profiltext beschreibt das vereinbarte Rollenverhalten. Der Gesprächspfad kann zwischen dem bestehenden OpenAI-Adapter und `local-test` wählen. `local-test` erzeugt eine deterministische Antwort ohne API-Key oder Netzwerkanfrage und ersetzt ausschließlich die Modellantwort; Bootstrap, Kontext, Versionsprüfung und PostgreSQL-Speicher bleiben derselbe Pfad. Die Auswahl erfolgt beim Chat-Aufruf über den optionalen fünften Wert `openai` oder `local-test`. Gemeinsame Gesprächsgeschichte wird ausschließlich aus dem Datenbanksnapshot geladen; es werden keine Erinnerungen erfunden. Der Kontext belegt keine physische Handyverbindung und keine automatische laufende Synchronisation.

Für die lokale Abnahme führt `npm run test:core-local` PC → VOICE → IPHONE mit `local-test` aus. Der Lauf speichert Gespräch A und B in PostgreSQL, prüft die Übernahme von Verlauf, Entscheidungen und Profil und versucht danach gezielt einen veralteten Gesprächsschreibvorgang. Dieser muss scheitern und darf keinen Gesprächseintrag erzeugen. Der Lauf verändert nur die vorgesehenen Session-, Gesprächs- und State-History-Daten der bestehenden Datenbank und fragt keine externe API an.

## Noch offene Abnahme

1. **Implementiert, Datenbankabnahme offen:** Kernschema, versionierte Migrationen und Gesprächsspeicher sind im Code vorhanden. `npm run db:migrate` muss vor dem ersten Gespräch nach Prüfung und Backup einmal gegen die vorgesehene Datenbank laufen. Ein fachlich freigegebener Startzustand ist separat über `npm run db:initialize` einzutragen; es gibt keinen automatisch erfundenen Seed.
2. **Implementiert, Laufzeitabnahme offen:** `npm run chat` verbindet den CLI-Gesprächseingang mit Bootstrap, Kontext, Modelladapter und PostgreSQL-Speicherung. Eine eigene Sprachoberfläche bleibt eine offene Produktentscheidung.
3. **Implementiert, PostgreSQL-Konflikttest offen:** Vor dem Modellaufruf wird der Snapshot erneut geladen. Ändert sich die Version während der Antwort, blockiert die Speicherung den veralteten Austausch; der Ablauf lädt neu und erzeugt die Antwort erneut. Wiederholte Konflikte brechen nach drei Versuchen ab.
4. **Echte Modellabnahme offen:** Mit echtem Modell prüfen: Identität bleibt wiedererkennbar, entschiedene Themen werden nicht ungefragt neu verhandelt, Geschichte wird korrekt erinnert, Vorschläge überschreiben keinen Plan. Die Unit-Tests verwenden Mock/`local-test` und bestätigen keine API-Verbindung.
5. **Geräteabnahme offen:** Gerätewechsel mit echten PC- und iPhone-Sitzungen prüfen. Lokale Tests mit unterschiedlichen Sessiontypen belegen keine physische Handyverbindung.

Die frühere Aussage „Session-Bootstrap fertig“ belegte lokale Datenbankoperationen. Die vollständige Produktanforderung ist weiterhin offen. Alte Datenbank- oder Repo-Statusangaben über Worker als nächsten Schritt sind gegen die obige neuere Planung abzugleichen, bevor weitere Aufträge ausgeführt werden.
