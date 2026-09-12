<script lang="ts">
  import ResultsView from "$lib/components/ResultsView.svelte";
  let { data } = $props();
</script>

<main>
  <section class="hero">
    <div class="eyebrow">
      Computational social science · Agent-based modelling
    </div>
    <h1>What does a recommendation system do to a social world?</h1>
    <p class="lede">
      EventScape makes the long-term effects of ranking policies visible.
      Synthetic people choose among events; co-attendance shapes social ties;
      those ties influence later exposure.
    </p>
    <div class="actions">
      <a class="button" href="/results">Inspect the evidence</a><a
        class="button secondary"
        href="/lab">Run the model</a
      >
    </div>
  </section>

  <section class="section question">
    <div>
      <div class="eyebrow">Primary research question</div>
      <h2>Utility and integration are not the same outcome.</h2>
    </div>
    <p>
      A ranking policy can feel relevant to individuals while concentrating
      attention among organizers and repeatedly exposing people to the same
      communities. EventScape keeps these outcomes separate, traceable, and
      reproducible.
    </p>
  </section>

  <section class="section">
    <div class="eyebrow">Canonical demonstration</div>
    <h2>Four policies. Matched synthetic worlds.</h2>
    <p class="lede">
      The prepared result below executes {data.result.runs.length} deterministic
      runs across popularity, relevance, social, and bridge-aware policies.
    </p>
    <ResultsView result={data.result} />
  </section>
</main>

<style>
  .hero {
    padding: clamp(5rem, 12vw, 10rem) 0 6rem;
  }
  .actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 2rem;
    flex-wrap: wrap;
  }
  .question {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 5rem;
    align-items: end;
  }
  .question p {
    font-size: 1.12rem;
    color: var(--muted);
  }
  @media (max-width: 800px) {
    .question {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
</style>
