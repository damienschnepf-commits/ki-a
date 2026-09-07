# Architektur

## Ziel und Verantwortung

Damien bestimmt Ziele und Prioritäten. KI-Janny bildet das zentrale Projekt. KI-Engineering Jenny übernimmt innerhalb dieses Projekts die Engineering-Verantwortung. Zusätzliche Agenten erhalten später klar begrenzte Aufgaben von Jenny; es gibt derzeit keine weiteren aktiven Agenten.

## Minimaler Ablauf

```text
Damien → CLI → KI-Engineering Jenny → strukturierter Aufgabenplan
                  innerhalb KI-Janny
```

Die CLI liest genau einen Auftrag und gibt JSON aus. Das Kernmodul validiert den Auftrag und erstellt einen unveränderlich definierten Ablauf aus Klären, Umsetzen und Prüfen. Der Auftragsinhalt wird als Daten behandelt, niemals als Shell-Befehl ausgeführt.

## Grenzen des ersten Standes

Der Planer ist eine lokale, deterministische Grundlage, keine laufende Codex-Instanz und kein autonomer KI-Dienst. Er verändert keine Dateien, kommuniziert nicht mit GitHub und delegiert nichts. Die organisatorische Hauptrolle Jenny wird hier im Projekt abgebildet; Einstellungen anderer Anwendungen werden dadurch nicht verändert.

## Entscheidungen

- Bestehendes Repository `damienschnepf-commits/ki-a` verwenden: einziges über die direkte Repository-Abfrage sichtbares Repo, leer, nicht archiviert und mit Schreibrecht.
- Ein Repository, ein kleines Modul und eine CLI: gemeinsame Versionierung ohne zusätzliche Infrastruktur.
- JavaScript-Module und Node.js-Bordmittel: keine Paketabhängigkeiten.
- GitHub ist die Quelle der Wahrheit; Chat-Aussagen gelten erst nach Übernahme in versionierte Dokumente als Projektentscheidung.
- Kein Modell, keine Datenbank, kein Webserver und kein Agenten-Framework für den Grundaufbau.

## Spätere Erweiterung

Eine Modellanbindung muss einen konkreten Nutzen, begrenzte Werkzeugrechte, nachvollziehbare Ergebnisse und explizite Fehlerbehandlung erhalten. Erst nach einem erfolgreich geprüften Jenny-Ablauf wird eine Schnittstelle für nachgeordnete Agenten entworfen. Keine vorsorgliche Plugin- oder Agenten-Infrastruktur.
