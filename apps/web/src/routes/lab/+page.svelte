<script lang="ts">
  import type { ComparativeExperiment, ResearchScenario } from "@eventscape/simulation-core";
  import { untrack } from "svelte";
  import ResultsView from "$lib/components/ResultsView.svelte";

  let { data } = $props();
  const initialScenario = untrack(() => data.scenario);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";
  let agentCount = $state(initialScenario.agentCount);
  let timesteps = $state(initialScenario.timesteps);
  let homophily = $state(initialScenario.homophily);
  let exploration = $state(initialScenario.exploration);
  let status = $state("Ready");
  let result = $state<ComparativeExperiment | null>(null);

  async function runExperiment() {
    status = "Running…";
    const scenario: ResearchScenario = { ...initialScenario, agentCount, timesteps, homophily, exploration };
    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/experiments`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ scenario, seeds: ["101", "202", "303", "404"] }),
      });
      const record = await response.json();
      if (!response.ok || !record.result) throw new Error(record.error?.message ?? "Experiment failed");
      result = record.result;
      status = "Completed";
    } catch (error) {
      status = error instanceof Error ? `Unavailable: ${error.message}. Start the API with bun run dev:api.` : "Unavailable";
    }
  }
</script>

<main>
  <section class="section intro"><div class="eyebrow">Interactive laboratory</div><h1>Run a bounded experiment</h1><p class="lede">Adjust a small set of scientifically meaningful parameters. Inputs are validated by the API and all four policies receive matched seeds.</p></section>
  <section class="workspace">
    <form class="panel" onsubmit={(event) => { event.preventDefault(); runExperiment(); }}>
      <h2>Scenario</h2>
      <label>Agents <output>{agentCount}</output><input bind:value={agentCount} type="range" min="20" max="200" step="10" /></label>
      <label>Timesteps <output>{timesteps}</output><input bind:value={timesteps} type="range" min="4" max="80" step="4" /></label>
      <label>Homophily <output>{homophily.toFixed(2)}</output><input bind:value={homophily} type="range" min="0" max="1" step="0.05" /></label>
      <label>Exploration <output>{exploration.toFixed(2)}</output><input bind:value={exploration} type="range" min="0" max="0.8" step="0.05" /></label>
      <button type="submit">Run 16 simulations</button>
      <p role="status" aria-live="polite" class="muted">{status}</p>
    </form>
    <aside class="panel"><div class="eyebrow">Design</div><h2>Matched comparison</h2><dl><div><dt>Policies</dt><dd>4</dd></div><div><dt>Seeds</dt><dd>4</dd></div><div><dt>Total runs</dt><dd>16</dd></div><div><dt>Classification</dt><dd>Exploratory</dd></div></dl><p class="muted">This browser submits a synchronous bounded demonstration to the Elysia API. Production-scale batches use the worker artifact command.</p></aside>
  </section>
  {#if result}<section class="section"><ResultsView {result} /></section>{/if}
</main>
<style>
  .intro { border-top: 0; padding-top: 5rem; }
  .workspace { display: grid; grid-template-columns: 1.2fr .8fr; gap: 1.5rem; }
  form h2, aside h2 { font-size: 2rem; margin-top: .5rem; }
  label { display: grid; grid-template-columns: 1fr auto; gap: .5rem; margin: 1.5rem 0; font-weight: 650; }
  input { grid-column: 1 / -1; width: 100%; accent-color: var(--accent); }
  output, dd { font-variant-numeric: tabular-nums; }
  dl div { display: flex; justify-content: space-between; padding: .8rem 0; border-bottom: 1px solid var(--rule); }
  dd { margin: 0; font-weight: 700; }
  @media (max-width: 760px) { .workspace { grid-template-columns: 1fr; } }
</style>
