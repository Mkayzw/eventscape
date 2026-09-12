<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<svelte:head>
  <title>EventScape — Recommendation-driven social dynamics</title>
  <meta
    name="description"
    content="A reproducible computational laboratory for studying recommendation policies and social integration."
  />
</svelte:head>

<header class="site-header">
  <a class="brand" href="/">EventScape <span>Research Laboratory</span></a>
  <nav aria-label="Primary navigation">
    <a href="/results">Results</a>
    <a href="/lab">Run experiment</a>
    <a href="/methodology">Methodology</a>
    <a href="/about/model-card">Model card</a>
  </nav>
</header>

{@render children()}

<footer>
  <div>
    <strong>EventScape</strong><br /><span
      >Synthetic computational research platform</span
    >
  </div>
  <div>Model v0.2 · Methods and limitations are public by default.</div>
</footer>

<style>
  .site-header {
    min-height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0 max(1rem, calc((100vw - 1180px) / 2));
    border-bottom: 1px solid var(--rule);
    background: rgba(245, 244, 240, 0.96);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .brand {
    font-weight: 750;
    text-decoration: none;
    letter-spacing: -0.02em;
  }
  .brand span {
    font-weight: 450;
    color: var(--muted);
    margin-left: 0.4rem;
  }
  nav {
    display: flex;
    gap: 1.2rem;
    font-size: 0.88rem;
  }
  nav a {
    text-decoration: none;
  }
  footer {
    margin-top: 5rem;
    border-top: 1px solid var(--rule);
    padding: 2rem max(1rem, calc((100vw - 1180px) / 2));
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    color: var(--muted);
    font-size: 0.84rem;
  }
  @media (max-width: 760px) {
    .site-header {
      align-items: flex-start;
      padding-block: 1rem;
      position: static;
    }
    .brand span {
      display: none;
    }
    nav {
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 0.7rem;
    }
    footer {
      flex-direction: column;
    }
  }
</style>
