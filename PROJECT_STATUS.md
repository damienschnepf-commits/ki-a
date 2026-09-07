# Projektstatus

Stand: 2026-09-07

- **Projekt:** KI-Janny, erstes und zentrales Projekt.
- **Hauptkomponente:** KI-Engineering Jenny.
- **Quelle der Wahrheit:** https://github.com/damienschnepf-commits/ki-a
- **Phase:** Technischer Grundaufbau lokal vorbereitet; noch nicht auf GitHub übernommen.
- **Weitere Agenten:** Keine.

## Repository-Prüfung

Die allgemeine GitHub-Liste lieferte keine Einträge. Die direkte Abfrage nach eigenen, mitbearbeiteten und Organisations-Repositories lieferte genau `damienschnepf-commits/ki-a`. GitHub bestätigte, dass dieses Repository leer, öffentlich und beschreibbar ist. Daher wird es für KI-Janny verwendet. Es wurden keine früheren Rollen, Chats oder Projekte gelöscht oder migriert.

## Bereitgestellt

Projektübersicht, Architekturentscheidungen, Roadmap und ein kleiner lokaler Aufgabenplaner mit CLI und Verhaltenstests. Jenny ist als zuständige Engineering-Komponente abgebildet.

## Validierung

Erneut geprüft am 2026-09-07 durch KI-Engineering Jenny: Alle vier Verhaltenstests bestehen (4 bestanden, 0 fehlgeschlagen). Der CLI-Probelauf liefert den erwarteten JSON-Plan. Verwendet wurde die portable offizielle Node.js-Laufzeit v22.23.2, deren SHA-256-Prüfsumme vor Ausführung mit dem offiziellen Downloadverzeichnis verglichen wurde. Die Laufzeit liegt außerhalb des Repositorys unter `work/runtime/node.exe`; eine systemweite Node.js-Installation bleibt optional.

Lokaler Testaufruf aus diesem Projektordner: `../../work/runtime/node.exe --test`. Bei installiertem Node.js weiterhin `npm test` verwenden.

## Lokaler Git- und Copilot-Stand

Der Projektordner hat jetzt ein eigenes Git-Repository auf `codex/ki-janny-foundation` mit dem vorgesehenen GitHub-Repository als `origin`. Copilots Rückmeldedatei enthält weiterhin nur die ursprüngliche Vorlage. Die oben genannten Prüfungen stammen von Jenny.

## GitHub-Übernahme blockiert

Der Versuch, README.md im leeren Repository anzulegen, wurde mit HTTP 403 / `Resource not accessible by integration` abgelehnt. Die Integration hat nicht die benötigte Schreibberechtigung. GitHub CLI ist lokal ebenfalls nicht verfügbar. Auf GitHub wurde durch diesen Versuch nichts angelegt. Diese Dateien sind ein lokaler Entwurf; der verbindliche GitHub-Projektstand bleibt bis zur erfolgreichen Übernahme unverändert.

Nächster Schritt: Der GitHub-Integration Zugriff auf dieses Repository einschließlich Schreibzugriff auf Inhalte gewähren. Danach den Entwurf testen, ins leere Repository übernehmen und den GitHub-Stand zurücklesen. Alternativ kann Damien die Dateien selbst in das Repository hochladen. Keine Zugangsdaten in Dateien oder Chat eintragen.

## Noch offen

Konkreten ersten Engineering-Anwendungsfall festlegen. Der aktuelle Planer erzeugt feste Arbeitsschritte; er nutzt kein Modell und führt keine Engineering-Arbeiten selbst aus. Es bestehen keine laufenden Agenten oder automatischen GitHub-Synchronisationen.
