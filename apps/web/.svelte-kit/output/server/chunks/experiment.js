import { createHash } from "node:crypto";
//#region ../../packages/simulation-core/src/canonical.ts
function normalize(value, path) {
	if (value === null || typeof value === "string" || typeof value === "boolean") return value;
	if (typeof value === "number") {
		if (!Number.isFinite(value)) throw new TypeError(`Non-finite number at ${path}`);
		return Object.is(value, -0) ? 0 : value;
	}
	if (Array.isArray(value)) {
		const result = [];
		for (let index = 0; index < value.length; index += 1) {
			if (!(index in value)) throw new TypeError(`Sparse array at ${path}[${index}]`);
			result.push(normalize(value[index], `${path}[${index}]`));
		}
		return result;
	}
	if (typeof value === "object") {
		const prototype = Object.getPrototypeOf(value);
		if (prototype !== Object.prototype && prototype !== null) throw new TypeError(`Unsupported object at ${path}`);
		const entries = Object.entries(value).sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0);
		const result = {};
		for (const [key, item] of entries) result[key] = normalize(item, `${path}.${key}`);
		return result;
	}
	throw new TypeError(`Unsupported value at ${path}`);
}
function canonicalJson(value) {
	return JSON.stringify(normalize(value, "$"));
}
function scientificFingerprint(value) {
	return `sha256:${createHash("sha256").update(canonicalJson(value), "utf8").digest("hex")}`;
}
//#endregion
//#region ../../packages/simulation-core/src/rng.ts
var MASK_64 = (1n << 64n) - 1n;
var TWO_POW_53 = 9007199254740992;
function rotateLeft(value, shift) {
	return (value << shift | value >> 64n - shift) & MASK_64;
}
var Xoshiro256StarStar = class {
	#state;
	constructor(state) {
		this.#state = [...state];
		if (this.#state.every((word) => word === 0n)) this.#state[0] = 1n;
	}
	nextUint64() {
		const state = this.#state;
		const result = rotateLeft(state[1] * 5n & MASK_64, 7n) * 9n & MASK_64;
		const temporary = state[1] << 17n & MASK_64;
		state[2] ^= state[0];
		state[3] ^= state[1];
		state[1] ^= state[2];
		state[0] ^= state[3];
		state[2] ^= temporary;
		state[3] = rotateLeft(state[3], 45n);
		return result;
	}
	nextFloat() {
		return Number(this.nextUint64() >> 11n) / TWO_POW_53;
	}
	nextInt(maxExclusive) {
		if (!Number.isSafeInteger(maxExclusive) || maxExclusive <= 0) throw new RangeError("maxExclusive must be a positive safe integer");
		const bound = BigInt(maxExclusive);
		const range = 1n << 64n;
		const limit = range - range % bound;
		let sample = this.nextUint64();
		while (sample >= limit) sample = this.nextUint64();
		return Number(sample % bound);
	}
};
function deriveState(seed, name) {
	if (!/^(0|[1-9]\d*)$/.test(seed) || BigInt(seed) > MASK_64) throw new RangeError("seed must be a canonical unsigned 64-bit decimal string");
	if (name.length === 0) throw new TypeError("stream name must not be empty");
	const digest = createHash("sha256").update(`eventscape:rng:v1\0${seed}\0${name}`, "utf8").digest();
	return [
		0,
		8,
		16,
		24
	].map((offset) => digest.readBigUInt64BE(offset));
}
var NamedRandomStreams = class {
	#seed;
	#streams = /* @__PURE__ */ new Map();
	constructor(seed) {
		this.#seed = seed;
		deriveState(seed, "validation");
	}
	stream(name) {
		let stream = this.#streams.get(name);
		if (!stream) {
			stream = new Xoshiro256StarStar(deriveState(this.#seed, name));
			this.#streams.set(name, stream);
		}
		return stream;
	}
};
//#endregion
//#region ../../packages/simulation-core/src/experiment.ts
var POLICY_IDS = [
	"popularity",
	"relevance",
	"social",
	"bridge-aware"
];
var canonicalResearchScenario = {
	id: "balanced-city-v1",
	name: "Balanced city — moderate homophily",
	agentCount: 80,
	eventCount: 16,
	timesteps: 24,
	recommendationListLength: 3,
	homophily: .65,
	exploration: .18,
	socialInfluence: .35,
	bridgeWeight: .3,
	capacity: 18
};
function clamp(value, minimum = 0, maximum = 1) {
	return Math.min(maximum, Math.max(minimum, value));
}
function sigmoid(value) {
	return 1 / (1 + Math.exp(-value));
}
function pairKey(left, right) {
	return `${Math.min(left, right)}:${Math.max(left, right)}`;
}
function gini(values) {
	const total = values.reduce((sum, value) => sum + value, 0);
	if (total === 0) return 0;
	const sorted = [...values].sort((a, b) => a - b);
	return 2 * sorted.reduce((sum, value, index) => sum + (index + 1) * value, 0) / (sorted.length * total) - (sorted.length + 1) / sorted.length;
}
function initialize(seed, scenario) {
	const streams = new NamedRandomStreams(seed);
	const population = streams.stream("experiment-population");
	const network = streams.stream("experiment-network");
	const agents = Array.from({ length: scenario.agentCount }, (_, index) => {
		return {
			group: index % 2,
			interests: [clamp(.72 + (population.nextFloat() - .5) * .35), clamp(.72 + (population.nextFloat() - .5) * .35)],
			exploration: clamp(scenario.exploration + (population.nextFloat() - .5) * .12)
		};
	});
	const events = Array.from({ length: scenario.eventCount }, (_, index) => ({
		organizer: index,
		affinity: index % 2,
		quality: .55 + population.nextFloat() * .4,
		popularity: 1 + index % 5,
		capacity: scenario.capacity
	}));
	const edges = /* @__PURE__ */ new Map();
	for (let left = 0; left < agents.length; left += 1) for (let right = left + 1; right < agents.length; right += 1) {
		const probability = agents[left].group === agents[right].group ? .035 + scenario.homophily * .08 : .035 * (1 - scenario.homophily);
		if (network.nextFloat() < probability) edges.set(pairKey(left, right), {
			left,
			right,
			weight: .2
		});
	}
	return {
		agents,
		events,
		edges
	};
}
function socialSignal(agentIndex, eventAffinity, agents, edges) {
	let signal = 0;
	let weight = 0;
	for (const edge of edges.values()) {
		if (edge.left !== agentIndex && edge.right !== agentIndex) continue;
		const neighbor = edge.left === agentIndex ? edge.right : edge.left;
		signal += (agents[neighbor].group === eventAffinity ? 1 : .2) * edge.weight;
		weight += edge.weight;
	}
	return weight === 0 ? 0 : signal / weight;
}
function mixedAttendancePotential(event, agents) {
	const expectedByGroup = [0, 1].map((group) => {
		return agents.filter((agent) => agent.group === group).reduce((sum, agent) => sum + sigmoid(-1.15 + 2.25 * agent.interests[event.affinity] * event.quality), 0);
	});
	const total = expectedByGroup[0] + expectedByGroup[1];
	return total === 0 ? 0 : 2 * Math.min(expectedByGroup[0], expectedByGroup[1]) / total;
}
function score(policy, agentIndex, eventIndex, event, events, agents, edges, scenario, bridgePotentials) {
	const relevance = agents[agentIndex].interests[event.affinity] * event.quality;
	const maximumPopularity = Math.max(...events.map((candidate) => candidate.popularity), 1);
	const popularity = event.popularity / maximumPopularity;
	const social = socialSignal(agentIndex, event.affinity, agents, edges);
	const bridge = bridgePotentials[eventIndex];
	const organizerCoverage = 1 / (1 + event.popularity);
	switch (policy) {
		case "popularity": return popularity;
		case "relevance": return relevance;
		case "social": return relevance + scenario.socialInfluence * social;
		case "bridge-aware": return relevance + scenario.bridgeWeight * bridge + .12 * organizerCoverage - .08 * popularity;
	}
}
function runPolicy(policy, seed, scenario) {
	const { agents, events, edges } = initialize(seed, scenario);
	const streams = new NamedRandomStreams(seed);
	const choice = streams.stream(`choice:${policy}`);
	const capacity = streams.stream(`capacity:${policy}`);
	const tieFormation = streams.stream(`ties:${policy}`);
	const organizerExposure = Array.from({ length: events.length }, () => 0);
	const exposedEvents = /* @__PURE__ */ new Set();
	const timeline = [];
	const bridgePotentials = events.map((event) => mixedAttendancePotential(event, agents));
	for (let timestep = 1; timestep <= scenario.timesteps; timestep += 1) {
		const recommendations = [];
		const selections = [];
		const relevanceByAgent = [];
		for (let agentIndex = 0; agentIndex < agents.length; agentIndex += 1) {
			const ranked = events.map((event, eventIndex) => ({
				eventIndex,
				score: score(policy, agentIndex, eventIndex, event, events, agents, edges, scenario, bridgePotentials)
			})).sort((a, b) => b.score - a.score || a.eventIndex - b.eventIndex).slice(0, scenario.recommendationListLength).map(({ eventIndex }) => eventIndex);
			recommendations.push(ranked);
			for (const eventIndex of ranked) {
				organizerExposure[events[eventIndex].organizer] += 1;
				exposedEvents.add(eventIndex);
			}
			const selected = choice.nextFloat() < agents[agentIndex].exploration ? ranked[choice.nextInt(ranked.length)] : ranked[0];
			selections.push(selected);
			relevanceByAgent.push(agents[agentIndex].interests[events[selected].affinity] * events[selected].quality);
		}
		const intents = /* @__PURE__ */ new Map();
		for (let agentIndex = 0; agentIndex < agents.length; agentIndex += 1) {
			const selected = selections[agentIndex];
			const event = events[selected];
			const relevance = agents[agentIndex].interests[event.affinity] * event.quality;
			if (choice.nextFloat() < sigmoid(-1.15 + 2.25 * relevance)) {
				const attendees = intents.get(selected) ?? [];
				attendees.push(agentIndex);
				intents.set(selected, attendees);
			}
		}
		const attendance = /* @__PURE__ */ new Map();
		for (const [eventIndex, intending] of intents) {
			const accepted = intending.length <= events[eventIndex].capacity ? [...intending] : intending.map((agentIndex) => ({
				agentIndex,
				priority: capacity.nextFloat()
			})).sort((a, b) => a.priority - b.priority || a.agentIndex - b.agentIndex).slice(0, events[eventIndex].capacity).map(({ agentIndex }) => agentIndex);
			attendance.set(eventIndex, accepted);
			events[eventIndex].popularity += accepted.length;
		}
		let newEdges = 0;
		let newCrossGroupEdges = 0;
		for (const attendees of attendance.values()) for (let left = 0; left < attendees.length; left += 1) for (let right = left + 1; right < attendees.length; right += 1) {
			if (tieFormation.nextFloat() >= .07) continue;
			const leftAgent = attendees[left];
			const rightAgent = attendees[right];
			const key = pairKey(leftAgent, rightAgent);
			const existing = edges.get(key);
			if (!existing) {
				newEdges += 1;
				if (agents[leftAgent].group !== agents[rightAgent].group) newCrossGroupEdges += 1;
			}
			edges.set(key, {
				left: Math.min(leftAgent, rightAgent),
				right: Math.max(leftAgent, rightAgent),
				weight: clamp((existing?.weight ?? 0) + .12)
			});
		}
		const finalAttendance = [...attendance.values()].reduce((sum, attendees) => sum + attendees.length, 0);
		const totalEdgeWeight = [...edges.values()].reduce((sum, edge) => sum + edge.weight, 0);
		const sameGroupWeight = [...edges.values()].filter((edge) => agents[edge.left].group === agents[edge.right].group).reduce((sum, edge) => sum + edge.weight, 0);
		timeline.push({
			timestep,
			attendanceRate: finalAttendance / agents.length,
			meanRelevance: relevanceByAgent.reduce((sum, value) => sum + value, 0) / relevanceByAgent.length,
			exposureGini: gini(organizerExposure),
			sameGroupEdgeShare: totalEdgeWeight === 0 ? 0 : sameGroupWeight / totalEdgeWeight,
			crossGroupTieRate: newEdges === 0 ? null : newCrossGroupEdges / newEdges,
			catalogCoverage: exposedEvents.size / events.length
		});
	}
	const terminal = timeline.at(-1);
	return {
		policy,
		seed,
		fingerprint: scientificFingerprint({
			model: "comparative-demo-v1",
			policy,
			scenario,
			seed
		}),
		timeline,
		terminal
	};
}
function summarize(runs) {
	const metricNames = [
		"attendanceRate",
		"meanRelevance",
		"exposureGini",
		"sameGroupEdgeShare",
		"crossGroupTieRate",
		"catalogCoverage"
	];
	return POLICY_IDS.map((policy) => {
		const policyRuns = runs.filter((run) => run.policy === policy);
		const metrics = Object.fromEntries(metricNames.map((metric) => {
			const values = policyRuns.map((run) => run.terminal[metric]).filter((value) => value !== null);
			if (values.length === 0) return [metric, {
				mean: null,
				lower95: null,
				upper95: null,
				validReplicationCount: 0
			}];
			const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
			const variance = values.length < 2 ? 0 : values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (values.length - 1);
			const margin = 1.96 * Math.sqrt(variance / values.length);
			return [metric, {
				mean,
				lower95: clamp(mean - margin),
				upper95: clamp(mean + margin),
				validReplicationCount: values.length
			}];
		}));
		return {
			policy,
			replicationCount: policyRuns.length,
			metrics
		};
	});
}
function runComparativeExperiment(scenario = canonicalResearchScenario, seeds = [
	"101",
	"202",
	"303",
	"404",
	"505",
	"606",
	"707",
	"808"
]) {
	if (scenario.agentCount < 4 || scenario.agentCount > 500) throw new RangeError("agentCount must be between 4 and 500");
	if (scenario.eventCount < 4 || scenario.eventCount > 100) throw new RangeError("eventCount must be between 4 and 100");
	if (scenario.timesteps < 1 || scenario.timesteps > 200) throw new RangeError("timesteps must be between 1 and 200");
	if (seeds.length < 1 || seeds.length > 100) throw new RangeError("seed count must be between 1 and 100");
	const runs = seeds.flatMap((seed) => POLICY_IDS.map((policy) => runPolicy(policy, seed, scenario)));
	return {
		schemaVersion: "1.0.0",
		classification: "EXPLORATORY_DEMONSTRATION",
		generatedAt: "2026-09-12T00:00:00.000Z",
		scenario,
		seeds: [...seeds],
		runs,
		summaries: summarize(runs),
		caveat: "Synthetic, exploratory demonstration. These outputs validate platform behavior and illustrate hypotheses; they are not confirmatory empirical findings."
	};
}
//#endregion
export { runComparativeExperiment as n, canonicalResearchScenario as t };
