<script lang="ts">
  import type { PolicySummary } from "@eventscape/simulation-core";
  let {
    summaries,
    metric,
    label,
  }: {
    summaries: readonly PolicySummary[];
    metric: keyof PolicySummary["metrics"];
    label: string;
  } = $props();
  const names: Record<string, string> = {
    popularity: "Popularity",
    relevance: "Relevance",
    social: "Social",
    "bridge-aware": "Bridge-aware",
  };
  const display = (value: number | null) =>
    value === null ? "—" : value.toFixed(3);
</script>

<div
  class="chart"
  role="img"
  aria-label={`${label} by policy. ${summaries.map((s) => `${names[s.policy]} ${display(s.metrics[metric].mean)}`).join(", ")}.`}
>
  <div class="axis-label">{label}</div>
  {#each summaries as summary}
    <div class="row">
      <span>{names[summary.policy]}</span>
      <div class="track" aria-hidden="true">
        <div
          class:bridge={summary.policy === "bridge-aware"}
          class="bar"
          style={`width: ${(summary.metrics[metric].mean ?? 0) * 100}%`}
        ></div>
      </div>
      <strong>{display(summary.metrics[metric].mean)}</strong>
    </div>
    <div class="interval">
      95% CI {display(summary.metrics[metric].lower95)}–{display(
        summary.metrics[metric].upper95,
      )} · n={summary.metrics[metric].validReplicationCount}
    </div>
  {/each}
</div>

<style>
  .chart {
    padding-top: 1rem;
  }
  .axis-label {
    font-size: 0.75rem;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 1rem;
  }
  .row {
    display: grid;
    grid-template-columns: 7rem 1fr 3.5rem;
    align-items: center;
    gap: 0.75rem;
    margin: 0.75rem 0;
    font-size: 0.86rem;
  }
  .track {
    height: 10px;
    border-bottom: 1px solid var(--rule);
    background: #f1f0ec;
  }
  .bar {
    height: 9px;
    background: var(--secondary);
    min-width: 2px;
  }
  .bar.bridge {
    background: var(--accent);
  }
  strong {
    font-variant-numeric: tabular-nums;
    text-align: right;
  }
  .interval {
    margin: -0.5rem 0 0.75rem 7.75rem;
    color: var(--muted);
    font-size: 0.72rem;
    font-variant-numeric: tabular-nums;
  }
</style>
