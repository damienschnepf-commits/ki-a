# Terra Root-Cause Analyse – verbindliche Projektregeln wurden nicht durchgesetzt

Stand: 2026-10-04

## Kurzfassung

Die extern abgelegten Regeln waren vorhanden und inhaltlich korrekt. Das Problem war nicht fehlender Kontext oder fehlende Dokumentation.

Die eigentliche Ursache: **GitHub/Linear/Skills/Checkpoints wurden als abrufbare Informationsquellen genutzt, aber nicht als technisch erzwungene Pre-Execution-Gates vor Planung und Tool-Nutzung.**

Dadurch konnte Terra trotz vorhandener Source of Truth aus dem laufenden Chat und einer bereits entstandenen Hypothese weitere plausible Schritte generieren, ohne dass die kanonischen Regeln den nächsten Schritt zwingend blockierten.

## Fehlerkette

1. **Retrieval-Failure**
   - Vor neuen technischen Hypothesen wurden die kanonischen Projektquellen nicht zwingend erneut geladen.
   - Vorhandene Repo-Regeln waren damit verfügbar, aber nicht garantiert im aktiven Entscheidungsweg.

2. **Anchoring / falscher Problem-Frame**
   - Das Problem wurde als komplexes Debugging-/Integrationsproblem behandelt.
   - Danach wurden weitere Schritte innerhalb dieses falschen Frames erzeugt.
   - Eine einfache Discovery-/Web-/GitHub-Suche wurde dadurch verdrängt.

3. **Kein harter Search-Trigger**
   - Es gab keine verbindliche Regel: bei ungeklärter externer API/Integration zuerst Primärquellen durchsuchen.
   - Dadurch konnte internes Hypothesenbilden länger laufen als eine Zwei-Minuten-Suche.

4. **Kein Budget-/Abort-Gate**
   - Erfolglosigkeit, Quota-Verbrauch oder wiederholte Tool-Loops führten nicht automatisch zu STOP/Reframe.
   - Der falsche Weg konnte dadurch über viele Turns weitergeführt werden.

5. **Kein Verification-Gate**
   - Zugriff, Planung, Tool-Verfügbarkeit und reale Ausführung wurden nicht strikt getrennt.
   - Erfolg wurde teilweise zu früh aus Zwischenständen abgeleitet.
   - Für dieses Projekt gilt: PASS nur mit realem Executor-/Tool-Resultat und externem Beweis.

## Projektbezug

Bereits vorhandene Regeln:

- `6KI/docs/TERRA_CONTEXT.md`
  - Source of Truth zuerst
  - GREEN/FROZEN nicht wieder öffnen
  - keine neue Nebenroute
  - nur erste nachweislich gescheiterte Grenze öffnen
  - Zugriff != Ausführung
  - PASS nur mit realer Evidenz

- `ki-a/AGENTS.md`
  - Projektgrundlage und Backlog vor Änderungen lesen
  - bestehende Struktur respektieren
  - keine parallelen Ersatzstrukturen erfinden

- Linear `SCH-8`
  - keine neue Architektur
  - vorhandene Tool/Controller-Schnittstelle verwenden
  - MultiFunPlayer / Buttplug / Intiface als bestehenden Pfad behalten

## Warum Repo-Regeln allein nicht automatisch bindend sind

Ein Repo-Eintrag ist für ein LLM zunächst nur eine externe Quelle. Er wird erst dann praktisch bindend, wenn der Orchestrator/Harness vor jeder relevanten Aktion:

1. die Quelle zwingend lädt,
2. die darin enthaltenen Regeln in eine Gate-Entscheidung überführt,
3. bei Regelverletzung die Aktion blockiert,
4. bei fehlender Evidenz STOP auslöst.

Ohne diesen Enforcement-Layer kann das Modell trotz korrekter Dokumentation wieder eine eigene plausible Fortsetzung generieren.

## Harte Betriebsregeln

- Vor jedem Projekt-Task: `TERRA_CONTEXT.md`, relevante `AGENTS.md` und aktuellen Projektstatus laden.
- Neuester verifizierter Zustand hat Vorrang vor neuer Modellhypothese.
- GREEN/FROZEN niemals ohne ausdrückliches Damien-GO öffnen.
- Externe Technik/API unbekannt: zuerst genau eine Primärquellen-Suche.
- Bereits dokumentierten Pfad nicht durch neue Architektur ersetzen.
- Nach 1 fehlgeschlagenen Hypothese: Reframe + Source-of-Truth/Search.
- Nach 2 erfolglosen Tool-Loops: STOP und Blocker melden.
- Kein Worker/Work/Codex ohne ausdrückliches GO.
- Zugriff != Ausführung.
- Planung != Ausführung.
- Tool-Verfügbarkeit != Tool-Aufruf.
- PASS nur mit externem Beweis: Tool-/Executor-Resultat, Log, Test oder reale Wirkung.
- Nach PASS sofort STOP und bewiesenen Slice GREEN/FROZEN setzen.

## Technischer Fix für KI-Engineering Jenny

Nicht noch mehr Memory oder Dokumentation hinzufügen, sondern einen **maschinenartig erzwungenen Preflight + Abort-Gate** vor Terras Planung/Ausführung entwerfen.

Ziel:

```text
User Task
  -> Load Source of Truth
  -> Evaluate hard gates
  -> BLOCK / SEARCH / EXECUTE
  -> Verify external evidence
  -> PASS or STOP
```

Der Preflight muss verhindern, dass Terra:
- ohne geladenen Projektzustand plant,
- GREEN/FROZEN neu öffnet,
- neue Architektur erfindet, obwohl ein Pfad dokumentiert ist,
- nach wiederholtem Fehlschlag weiterloopt,
- Erfolg ohne reale Evidenz meldet.

## Externe Referenzen

- OpenAI Model Spec / Instruction hierarchy
- OpenAI Guardrails and human review
- OpenAI Agent evals / trace grading
- OpenAI Cost & latency optimization
- Anthropic: Building Effective Agents

Diese Quellen stützen den Kernpunkt: Zuverlässige Agenten benötigen explizite Guardrails, Stop-Bedingungen, Ground Truth und überprüfbare Ausführungsevidenz.
