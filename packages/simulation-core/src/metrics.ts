import type { MetricValue, SimulationState, TerminalMetrics } from "./types";

function defined(value: number): MetricValue {
  return { value };
}

export function computeTerminalMetrics(
  state: SimulationState,
): TerminalMetrics {
  const attendanceRate =
    state.eligibleAgentIndices.length === 0
      ? ({ value: null, reason: "NO_ELIGIBLE_AGENTS" } as const)
      : defined(state.attendance.length / state.eligibleAgentIndices.length);

  const activeOrganizerIds = [
    ...new Set(
      state.events
        .filter((event) => event.isActive)
        .map((event) => event.organizerId),
    ),
  ];
  let organizerExposureGini: MetricValue;
  if (activeOrganizerIds.length === 0) {
    organizerExposureGini = { value: null, reason: "NO_ACTIVE_ORGANIZERS" };
  } else {
    const counts = activeOrganizerIds.map(
      (organizerId) =>
        state.exposures.filter(
          ({ eventIndex }) =>
            state.events[eventIndex]?.organizerId === organizerId,
        ).length,
    );
    const total = counts.reduce((sum, count) => sum + count, 0);
    if (total === 0) {
      organizerExposureGini = defined(0);
    } else {
      const absoluteDifferences = counts.reduce(
        (outer, left) =>
          outer +
          counts.reduce((inner, right) => inner + Math.abs(left - right), 0),
        0,
      );
      organizerExposureGini = defined(
        absoluteDifferences / (2 * counts.length * total),
      );
    }
  }

  const totalEdgeWeight = state.ties.reduce((sum, tie) => sum + tie.weight, 0);
  const sameGroupEdgeProportion =
    totalEdgeWeight === 0
      ? ({ value: null, reason: "NO_EDGES" } as const)
      : defined(
          state.ties
            .filter(
              (tie) =>
                state.agents[tie.leftAgentIndex]?.group ===
                state.agents[tie.rightAgentIndex]?.group,
            )
            .reduce((sum, tie) => sum + tie.weight, 0) / totalEdgeWeight,
        );

  const newTieKeySet = new Set(state.newTieKeys);
  const newTies = state.ties.filter((tie) =>
    newTieKeySet.has(`${tie.leftAgentIndex}:${tie.rightAgentIndex}`),
  );
  const crossGroupTieFormationRate =
    newTies.length === 0
      ? ({ value: null, reason: "NO_NEW_EDGES" } as const)
      : defined(
          newTies.filter(
            (tie) =>
              state.agents[tie.leftAgentIndex]?.group !==
              state.agents[tie.rightAgentIndex]?.group,
          ).length / newTies.length,
        );

  return {
    attendanceRate,
    organizerExposureGini,
    sameGroupEdgeProportion,
    crossGroupTieFormationRate,
  };
}
