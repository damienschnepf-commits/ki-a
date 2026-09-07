export function createPlan(request) {
  if (typeof request !== "string" || request.trim().length === 0) {
    throw new TypeError("Bitte einen nicht leeren Engineering-Auftrag angeben.");
  }
  return {
    project: "KI-Janny",
    owner: "KI-Engineering Jenny",
    request: request.trim(),
    status: "planned",
    steps: [
      "Ziel und Abnahmekriterien klären",
      "Änderung im Projekt umsetzen",
      "Ergebnis prüfen und Projektstatus aktualisieren"
    ],
    delegatedAgents: []
  };
}
