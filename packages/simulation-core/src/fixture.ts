import type { SimulationInput } from "./types";

export const canonicalP0MicroScenario: SimulationInput = {
  model: { id: "social-event-dynamics", version: "0.1.0" },
  policy: { id: "popularity", version: "0.1.0", parameters: {} },
  seed: "20260912",
  configuration: {
    schemaVersion: "1.0.0",
    timestepCount: 1,
    recommendationListLength: 1,
    tieFormationProbability: 1,
    tieIncrement: 0.25,
    maximumTieWeight: 1,
    attendanceIntercept: -0.5,
    attendanceQualityCoefficient: 1.5,
    agents: [
      {
        id: "a0",
        group: 0,
        isAvailable: true,
        attendanceBias: 0,
        topicAffinities: [0.9, 0.2],
      },
      {
        id: "a1",
        group: 0,
        isAvailable: true,
        attendanceBias: 0,
        topicAffinities: [0.8, 0.3],
      },
      {
        id: "a2",
        group: 1,
        isAvailable: true,
        attendanceBias: 0,
        topicAffinities: [0.2, 0.9],
      },
      {
        id: "a3",
        group: 1,
        isAvailable: true,
        attendanceBias: 0,
        topicAffinities: [0.3, 0.8],
      },
    ],
    events: [
      {
        id: "e0",
        organizerId: "o0",
        isActive: true,
        capacity: 2,
        popularity: 3,
        quality: 0.8,
      },
      {
        id: "e1",
        organizerId: "o1",
        isActive: true,
        capacity: 2,
        popularity: 1,
        quality: 0.8,
      },
    ],
    initialTies: [],
  },
};
