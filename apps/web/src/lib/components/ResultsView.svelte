<script lang="ts">
  import type { ComparativeExperiment } from "@eventscape/simulation-core";
  import PolicyChart from "./PolicyChart.svelte";
  let { result }: { result: ComparativeExperiment } = $props();
  const bridge = $derived(
    result.summaries.find((summary) => summary.policy === "bridge-aware")!,
  );
  const popularity = $derived(
    result.summaries.find((summary) => summary.policy === "popularity")!,
  );
  const relevance = $derived(
    result.summaries.find((summary) => summary.policy === "relevance")!,
  );
  const display = (value: number | null) =>
    value === null ? "—" : value.toFixed(3);
</script>

<div class="warning" role="note">
  <strong>Exploratory demonstration.</strong>
  {result.caveat}
</div>

<section class="grid four summary" aria-label="Key results">
  <article class="panel">
    <div class="eyebrow">Replications</div>
    <div class="metric">{result.seeds.length}</div>
    <p>Matched seeds per policy</p>
  </article>
  <article class="panel">
    <div class="eyebrow">Bridge attendance</div>
    <div class="metric">
      {bridge.metrics.attendanceRate.mean === null
        ? "—"
        : `${(bridge.metrics.attendanceRate.mean * 100).toFixed(1)}%`}
    </div>
    <p>Terminal attendance rate</p>
  </article>
  <article class="panel">
    <div class="eyebrow">Exposure inequality</div>
    <div class="metric">{display(bridge.metrics.exposureGini.mean)}</div>
    <p>Bridge-aware terminal Gini</p>
  </article>
  <article class="panel">
    <div class="eyebrow">Catalog coverage</div>
    <div class="metric">
      {bridge.metrics.catalogCoverage.mean === null
        ? "—"
        : `${(bridge.metrics.catalogCoverage.mean * 100).toFixed(0)}%`}
    </div>
    <p>Events exposed at least once</p>
  </article>
</section>

<section class="grid two">
  <article class="panel">
    <h2>Participation</h2>
    <p class="muted">
      Attendance remains visible alongside integration; no combined ethical
      score is used.
    </p>
    <PolicyChart
      summaries={result.summaries}
      metric="attendanceRate"
      label="Terminal attendance rate"
    />
  </article>
  <article class="panel">
    <h2>Network concentration</h2>
    <p class="muted">
      Lower same-group edge share indicates greater mixing in this synthetic
      two-group model.
    </p>
    <PolicyChart
      summaries={result.summaries}
      metric="sameGroupEdgeShare"
      label="Same-group weighted edge share"
    />
  </article>
  <article class="panel">
    <h2>Provider exposure</h2>
    <p class="muted">
      Lower organizer exposure Gini represents more evenly distributed
      recommendation exposure.
    </p>
    <PolicyChart
      summaries={result.summaries}
      metric="exposureGini"
      label="Organizer exposure Gini"
    />
  </article>
  <article class="panel">
    <h2>Recommendation utility</h2>
    <p class="muted">
      Mean content relevance of selected events at the terminal timestep.
    </p>
    <PolicyChart
      summaries={result.summaries}
      metric="meanRelevance"
      label="Mean selected relevance"
    />
  </article>
</section>

<section class="section">
  <div class="eyebrow">Complete evidence table</div>
  <h2>Terminal outcomes</h2>
  <div class="table-wrap" role="region" aria-label="Policy outcome table">
    <table>
      <caption class="sr-only"
        >Terminal policy metrics with {result.seeds.length} matched seed replications</caption
      >
      <thead
        ><tr
          ><th>Policy</th><th>Attendance</th><th>Relevance</th><th
            >Exposure Gini</th
          ><th>Same-group edges</th><th>Cross-group ties</th><th>Coverage</th
          ></tr
        ></thead
      >
      <tbody
        >{#each result.summaries as summary}<tr
            ><th>{summary.policy}</th><td
              >{display(summary.metrics.attendanceRate.mean)}</td
            ><td>{display(summary.metrics.meanRelevance.mean)}</td><td
              >{display(summary.metrics.exposureGini.mean)}</td
            ><td>{display(summary.metrics.sameGroupEdgeShare.mean)}</td><td
              >{display(summary.metrics.crossGroupTieRate.mean)} (n={summary
                .metrics.crossGroupTieRate.validReplicationCount})</td
            ><td>{display(summary.metrics.catalogCoverage.mean)}</td></tr
          >{/each}</tbody
      >
    </table>
  </div>
  <p class="muted">
    Reference comparisons: popularity exposure Gini {display(
      popularity.metrics.exposureGini.mean,
    )}; relevance attendance {relevance.metrics.attendanceRate.mean === null
      ? "—"
      : `${(relevance.metrics.attendanceRate.mean * 100).toFixed(1)}%`}.
    Intervals and run-level values are included in the JSON publication
    artifact.
  </p>
</section>

<style>
  .summary {
    margin: 2rem 0 4rem;
  }
  .summary p {
    color: var(--muted);
    margin-bottom: 0;
    font-size: 0.86rem;
  }
  article h2 {
    font-size: 1.8rem;
    margin: 0;
  }
</style>
