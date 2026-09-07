# Projektstatus

Stand: 2026-09-07

- **Projekt:** KI-Janny, erstes und zentrales Projekt.
- **Hauptkomponente:** KI-Engineering Jenny.
- **Quelle der Wahrheit:** https://github.com/damienschnepf-commits/ki-a
- **Phase:** Technischer Grundaufbau geprüft und auf GitHub veröffentlicht.
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

## GitHub-Übernahme erfolgreich

Die erste Übernahme über die GitHub-Integration scheiterte mit HTTP 403 / `Resource not accessible by integration`. Am 2026-09-07 gelang die Veröffentlichung anschließend über den lokal verfügbaren Git-Zugang. Der Grundaufbau wurde mit Commit `8888f48f9b84a5a3c57f53ecfff887ce5c1bc5cf` auf `codex/ki-janny-foundation` veröffentlicht. GitHub bestätigt diesen Branch als Standardbranch. Die Integration selbst wurde nicht umkonfiguriert.

GitHub ist jetzt die verbindliche Projektbasis. Weitere Änderungen als eigene Themenbranches mit Pull Request gegen den Standardbranch vorbereiten. Zugangsdaten bleiben außerhalb von Dateien und Chat.

## Noch offen

Konkreten ersten Engineering-Anwendungsfall festlegen. Der aktuelle Planer erzeugt feste Arbeitsschritte; er nutzt kein Modell und führt keine Engineering-Arbeiten selbst aus. Es bestehen keine laufenden Agenten oder automatischen GitHub-Synchronisationen.
