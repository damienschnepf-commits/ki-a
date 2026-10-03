# KI-A – Gemeinsame Agenten-Roadmap

Diese Datei ist die zentrale Projektbeschreibung für alle Agenten, die mit diesem Repository arbeiten.

## 1. Zielbild

KI-A wird als gemeinsame KI-Umgebung aufgebaut, in der mehrere Agenten und KI-Systeme zusammenarbeiten, aber klar getrennte Aufgabenbereiche haben.

Hauptbereiche:

- Visual My KI
- Feel My KI
- Understand My KI
- Social Media
- Coaching
- Agenten-Box als zentrale Übersicht und Steuerung
- optionale Gerätesteuerung über klar definierte Protokolle

Die Agenten können auf unterschiedlichen Systemen und Laptops laufen. Alle sollen dieselbe Projektstruktur, denselben Backlog und dieselben Zuständigkeiten verstehen.

## 2. Agenten-Box

Die Agenten-Box ist der zentrale Einstiegspunkt.

Sie soll später anzeigen:

- vorhandene Agenten
- welcher Agent aktuell arbeitet
- aktuelle Aufgaben
- Projektstatus
- Backlog
- Logs
- Fehler
- Freigaben
- offene Abhängigkeiten
- Ergebnisse der Agenten

Die Agenten-Box erledigt nicht alles selbst. Sie dient als Router und zentrale Übersicht und gibt Aufgaben an den jeweils passenden Agenten oder KI-Bereich weiter.

## 3. Visual My KI

Visual My KI übernimmt alle visuellen Aufgaben.

Dazu gehören:

- Bilder analysieren
- Screenshots verstehen
- Kamera- und Videoinhalte auswerten
- visuelle Zustände erkennen
- Bilder und Grafiken erzeugen
- Social-Media-Visuals vorbereiten
- Avatar-, UI- und Designaufgaben unterstützen

Visual My KI liefert strukturierte Ergebnisse an andere Bereiche zurück.

## 4. Feel My KI

Feel My KI übernimmt emotionale und zwischenmenschliche Aufgaben.

Dazu gehören:

- emotionale Gesprächsführung
- Stimmung und Gesprächssituation berücksichtigen
- Coaching-Gespräche
- Beziehungscoaching
- persönliche Trainings
- Seminarinhalte
- Gesprächsführung für Gruppen oder Discord
- Unterstützung bei emotionalen und sozialen Themen

Feel My KI ist der Kern für den geplanten Coaching-Bereich.

## 5. Understand My KI

Understand My KI übernimmt Wissen, Analyse und Kontext.

Dazu gehören:

- komplexe Fragen verstehen
- Informationen zusammenführen
- Recherche
- Dokumente analysieren
- Projekte planen
- Aufgaben strukturieren
- Kontext zwischen verschiedenen Agenten verstehen
- Abhängigkeiten erkennen
- Wissen für andere Agenten bereitstellen

Understand My KI ist der zentrale Wissens- und Analysebereich.

## 6. Coaching-Projekt

Das Coaching-Projekt soll KI-gestützt aufgebaut werden.

Geplant sind unter anderem:

- emotionales Coaching
- Beziehungscoaching
- Trainings
- Seminare
- Discord-Sessions
- automatisierte Inhalte
- Gesprächsformate
- individuelle KI-Unterstützung

Die KI soll Inhalte vorbereiten und teilweise automatisieren.

Der menschliche Coach bleibt die übergeordnete Instanz.

## 7. Social Media

Social Media wird in zwei Funktionsbereiche getrennt.

### Social Media – Content

Aufgaben:

- Themen finden
- Posts schreiben
- Videoskripte erstellen
- Reels und Shorts vorbereiten
- Facebook-Content
- TikTok-Content
- Content-Kalender
- Varianten für verschiedene Plattformen
- Visual My KI für Bilder oder Videos beauftragen

### Social Media – Community

Aufgaben:

- Kommentare auswerten
- Nachrichten kategorisieren
- häufige Fragen erkennen
- Reaktionen analysieren
- Themen und Trends erkennen
- Verbesserungsvorschläge an Content liefern
- Coaching-relevante Themen erkennen

## 8. Zusammenarbeit der Bereiche

Die Bereiche sollen nicht unkontrolliert miteinander kommunizieren.

Die Agenten-Box bzw. der zentrale Router entscheidet, welcher Bereich gebraucht wird.

Beispiel:

```text
Benutzer
   ↓
Agenten-Box
   ↓
Understand My KI
   ↓
Feel My KI
   ↓
Visual My KI
   ↓
Social Media Content
   ↓
Freigabe
   ↓
Veröffentlichung
   ↓
Social Media Community
   ↓
Analyse zurück an Understand / Feel
```

Damit bleibt nachvollziehbar, welcher Agent welche Entscheidung getroffen hat.

## 9. Gemeinsamer Backlog

Alle Agenten sollen auf dieselbe Projektlogik zugreifen können.

Jeder Backlog-Eintrag soll enthalten:

- Titel
- Projekt
- zuständiger Agent
- Beschreibung
- Ziel
- Akzeptanzkriterien
- Priorität
- Status
- Abhängigkeiten
- Ergebnis
- Datum
- Log oder Referenz

Status:

```text
Backlog
Ready
In Progress
Review
Blocked
Done
```

Wenn gesagt wird:

> Backlog nachschauen

soll tatsächlich der vorhandene Backlog geprüft werden. Es soll nicht aus Erinnerung geraten oder ein theoretischer Backlog erfunden werden.

## 10. Einheitliche Projektablage

Geplante gemeinsame Struktur:

```text
/agent-box
/visual-my-ki
/feel-my-ki
/understand-my-ki
/coaching
/social-media
    /content
    /community
/backlog
/shared-context
/logs
/protocols
```

Dadurch soll jeder Agent sofort erkennen:

- welches Projekt gemeint ist
- welche Aufgaben offen sind
- welche Informationen bereits vorhanden sind
- welche Agenten beteiligt sind

## 11. Geräte- und Protokollsteuerung

Zusätzlich soll später eine Geräteebene möglich sein.

Dabei können eigene Protokolle definiert werden, beispielsweise ein internes Protokoll wie:

```text
Mirna-Protokoll
```

Ein solches Protokoll muss technisch klar definiert sein.

Dazu gehören:

- welches Gerät
- welche Verbindung
- welche Befehle
- welche Parameter
- Start
- Stop
- Grenzen
- Fehlerzustände
- Sicherheitsbedingungen

Ein Protokollname allein löst nichts aus.

Die tatsächliche Steuerung funktioniert nur, wenn im jeweiligen System ein echter technischer Zugriff auf das Gerät vorhanden ist.

## 12. Rollenverteilung

### Mensch

Der Mensch behält die Kontrolle über:

- Projektziele
- Freigaben
- Geräteaktionen
- Veröffentlichung
- größere Änderungen
- endgültige Entscheidungen

### KI-Agenten

Die KI-Agenten übernehmen:

- Analyse
- Vorbereitung
- Planung
- Content
- Coaching-Unterstützung
- Recherche
- Automatisierung
- Statusüberwachung
- Aufgabenübergabe

## 13. Reihenfolge der Umsetzung

### Phase 1 – Struktur

- Projekte sauber trennen
- gemeinsame Ablage festlegen
- Agentenrollen definieren
- Backlog vereinheitlichen

### Phase 2 – Agenten-Box

- Frontend
- Agentenübersicht
- Task-Status
- Backlog
- Logs
- Freigaben

### Phase 3 – Understand My KI

- Kontext
- Recherche
- Wissensstruktur
- Projektverständnis

### Phase 4 – Visual My KI

- Bildanalyse
- Screenshots
- Video
- Visual-Generierung

### Phase 5 – Feel My KI

- emotionale Gesprächsführung
- Coaching
- Relationship Coaching
- Trainings
- Seminarlogik

### Phase 6 – Social Media

- Content-Agent
- Community-Agent
- Plattformanbindung
- Freigabe-Workflow

### Phase 7 – Geräteprotokolle

- Gerätezugriff definieren
- Protokolle dokumentieren
- Befehle testen
- Sicherheitsgrenzen
- manuelle Freigabe
- danach erst Automatisierung

## 14. Endzustand

Der gewünschte Endzustand ist eine KI-Umgebung, in der mehrere Agenten auf unterschiedlichen Systemen arbeiten können, aber dieselbe Projektstruktur verstehen.

- Agenten-Box = zentrale Übersicht und Router
- Visual My KI = visuelle Informationen und Darstellung
- Feel My KI = Emotion und Coaching
- Understand My KI = Wissen, Analyse und Planung
- Social Media = Content und Community
- Geräteaktionen = nur über klar definierte technische Protokolle und vorhandene Schnittstellen
- gemeinsamer Backlog und Logs = nachvollziehbare Aufgaben und Entscheidungen

## 15. Regel für alle Agenten

Diese Datei ist die gemeinsame Projektgrundlage.

Vor Änderungen am Projekt sollen Agenten:

1. diese Datei lesen,
2. den aktuellen Backlog prüfen,
3. bestehende Projektstruktur respektieren,
4. keine parallelen Ersatzstrukturen erfinden,
5. Ergebnisse und Änderungen nachvollziehbar dokumentieren.
