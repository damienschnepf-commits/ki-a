# Janny-Kern: Arbeitsstand 11.09.2026

Quelle: Chat KI-Partnerin, Festlegungen am Abend des 10.09.2026, insbesondere Nachrichten 37854433-7750-43b3-a5eb-e89c3211351d und d2390915-8e30-4234-a026-91eff4e9d89c. Damien hat die Fortsetzung am 11.09. beauftragt.

## Vereinbarter Umfang

Janny ist eine persistente simulierte Identität mit wiedererkennbarem Kommunikationsstil, Projektwissen und belegtem Beziehungskontext. Geklärte Entscheidungen bleiben geklärt. Neue Vorschläge ändern den Plan nicht stillschweigend. Damien startet den manuellen Programmierworker. Worker-Automatik sowie GSM-/Cloudflare-Anbindung sind zurückgestellt, bis der Kern abgenommen ist.

## Dieser Umsetzungsschritt

Die CLI ergänzt den PostgreSQL-Bootstrap um conversationContext. Identität und Stil sind versionierte Anwendungskonfiguration; Projektzustand, Entscheidungen, Tasks und Freigaben kommen aus dem geladenen Datenbanksnapshot. Der Kontext wird nur erzeugt, wenn Session und Zustand dieselbe Version melden und alle erforderlichen Informationen vorhanden sind. PC, IPHONE und VOICE erhalten bei identischen Daten denselben gemeinsamen Kontext. Ein Freigabesnapshot autorisiert keine spätere Ausführung; diese muss erneut geprüft werden.

Der Profiltext beschreibt das vereinbarte Rollenverhalten. Der Gesprächspfad kann zwischen dem bestehenden OpenAI-Adapter und `local-test` wählen. `local-test` erzeugt eine deterministische Antwort ohne API-Key oder Netzwerkanfrage und ersetzt ausschließlich die Modellantwort; Bootstrap, Kontext, Versionsprüfung und PostgreSQL-Speicher bleiben derselbe Pfad. Die Auswahl erfolgt beim Chat-Aufruf über den optionalen fünften Wert `openai` oder `local-test`. Gemeinsame Gesprächsgeschichte wird ausschließlich aus dem Datenbanksnapshot geladen; es werden keine Erinnerungen erfunden. Der Kontext belegt keine physische Handyverbindung und keine automatische laufende Synchronisation.

Für die lokale Abnahme führt `npm run test:core-local` PC → VOICE → IPHONE mit `local-test` aus. Der Lauf speichert Gespräch A und B in PostgreSQL, prüft die Übernahme von Verlauf, Entscheidungen und Profil und versucht danach gezielt einen veralteten Gesprächsschreibvorgang. Dieser muss scheitern und darf keinen Gesprächseintrag erzeugen. Der Lauf verändert nur die vorgesehenen Session-, Gesprächs- und State-History-Daten der bestehenden Datenbank und fragt keine externe API an.

## Noch offene Abnahme

1. Gesprächsgeschichte ist mit Herkunft und Versionsstand in PostgreSQL angebunden und wird beim Kontextaufbau geladen. Die Datenbankmigration muss vor dem ersten Gespräch einmal ausgeführt werden.
2. Einen tatsächlichen Gesprächseingang mit diesem Kontext verbinden. Die Entscheidung über eine eigene Sprachoberfläche ist offen.
3. Während einer laufenden Sitzung geänderte Versionen erkennen und vor zustandsabhängiger Antwort bzw. Aktion nachladen; der aktuelle Vergleich prüft nur die Konsistenz des übergebenen Snapshots.
4. Mit echtem Modell prüfen: Identität bleibt wiedererkennbar, entschiedene Themen werden nicht ungefragt neu verhandelt, Geschichte wird korrekt erinnert, Vorschläge überschreiben keinen Plan.
5. Gerätewechsel mit echter PC- und iPhone-Sitzung prüfen. Lokale Tests mit unterschiedlichen Sessiontypen sind keine Geräteabnahme.

Die frühere Aussage „Session-Bootstrap fertig“ belegte lokale Datenbankoperationen. Die vollständige Produktanforderung ist weiterhin offen. Alte Datenbank- oder Repo-Statusangaben über Worker als nächsten Schritt sind gegen die obige neuere Planung abzugleichen, bevor weitere Aufträge ausgeführt werden.
