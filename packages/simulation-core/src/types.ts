export interface AgentState {
  readonly id: string;
  readonly group: number;
  readonly isAvailable: boolean;
  readonly attendanceBias: number;
  readonly topicAffinities?: readonly number[];
}

export interface EventState {
  readonly id: string;
  readonly organizerId: string;
  readonly isActive: boolean;
  readonly capacity: number;
  readonly popularity: number;
  readonly quality: number;
}

export interface TieState {
  readonly leftAgentIndex: number;
  readonly rightAgentIndex: number;
  readonly weight: number;
}

export interface AgentEventReference {
  readonly agentIndex: number;
  readonly eventIndex: number;
}

export interface SimulationState {
  readonly timestep: number;
  readonly agents: readonly AgentState[];
  readonly events: readonly EventState[];
  readonly exposures: readonly AgentEventReference[];
  readonly attendance: readonly AgentEventReference[];
  readonly ties: readonly TieState[];
  readonly newTieKeys: readonly string[];
  readonly eligibleAgentIndices: readonly number[];
}

export interface SimulationConfiguration {
  readonly schemaVersion: "1.0.0";
  readonly timestepCount: 1;
  readonly recommendationListLength: 1;
  readonly tieFormationProbability: number;
  readonly tieIncrement: number;
  readonly maximumTieWeight: number;
  readonly attendanceIntercept: number;
  readonly attendanceQualityCoefficient: number;
  readonly agents: readonly AgentState[];
  readonly events: readonly EventState[];
  readonly initialTies: readonly TieState[];
}

export interface SimulationInput {
  readonly model: {
    readonly id: "social-event-dynamics";
    readonly version: "0.1.0";
  };
  readonly policy: {
    readonly id: "popularity";
    readonly version: "0.1.0";
    readonly parameters: Record<string, never>;
  };
  readonly configuration: SimulationConfiguration;
  readonly seed: string;
}

export interface MetricValue {
  readonly value: number | null;
  readonly reason?:
    | "NO_ACTIVE_ORGANIZERS"
    | "NO_EDGES"
    | "NO_ELIGIBLE_AGENTS"
    | "NO_NEW_EDGES";
}

export interface TerminalMetrics {
  readonly attendanceRate: MetricValue;
  readonly organizerExposureGini: MetricValue;
  readonly sameGroupEdgeProportion: MetricValue;
  readonly crossGroupTieFormationRate: MetricValue;
}

export interface ScientificManifest {
  readonly manifestVersion: "1.0.0";
  readonly scientificFingerprint: string;
  readonly model: SimulationInput["model"];
  readonly policy: SimulationInput["policy"];
  readonly configuration: SimulationConfiguration;
  readonly seed: string;
}

export interface SimulationResult {
  readonly manifest: ScientificManifest;
  readonly state: SimulationState;
  readonly metrics: TerminalMetrics;
}
