# Business and Research Requirements Document

## Computational Laboratory for Recommendation-Driven Social Dynamics

| Attribute | Value |
|---|---|
| Document status | Approved baseline for planning |
| Version | 1.0 |
| Date | 2026-09-12 |
| Product type | Publishable computational research platform and portfolio application |
| Project name | EventScape |
| Primary stack | SvelteKit, Elysia.js, Prisma, PostgreSQL |
| Primary discipline | Computational social science |
| Research method | Agent-based modelling and computational experiments |

> **Naming note:** “EventScape” names the computational research platform. The scientific contribution concerns recommendation-driven social dynamics, not event management.

---

## 1. Executive Summary

This project will build a reproducible computational laboratory for studying how recommendation policies alter social exposure, event participation, network formation, and segregation over time. Simulated people choose among simulated events under controlled recommendation policies. Co-attendance creates or strengthens social ties, those ties influence later recommendations, and the resulting feedback loop can produce integration, concentration, or segregation.

The project has two equally important outputs:

1. **Research output:** a transparent agent-based model, experiment protocol, datasets, statistical analysis, and a manuscript-ready set of results addressing the utility–integration trade-off in event recommendation.
2. **Portfolio output:** an extraordinary but restrained interactive research interface that allows users to configure, run, inspect, compare, reproduce, and export experiments.

The system will compare popularity-based, relevance-based, social, and bridge-aware recommendation policies. It will measure individual utility alongside system-level outcomes such as network assortativity, modularity, exposure diversity, provider exposure inequality, cross-group tie formation, and long-tail coverage.

The central research question is:

> **Under what conditions do recommendation algorithms amplify or reduce social segregation while preserving useful recommendations and participation?**

The product is not an event marketplace, social network, or commercial recommender. Events are the computational setting in which repeated exposure and social interaction are modelled.

---

## 2. Scientific Motivation

Recommendation systems are usually optimized for immediate outcomes such as clicks, saves, attendance, or ranking accuracy. Those measures do not capture longitudinal social consequences. A policy that produces excellent short-term relevance may repeatedly expose users to the same communities, amplify already-popular organizers, and reduce opportunities for cross-group contact.

The project connects four research traditions:

1. **Emergent segregation:** Schelling showed that modest local preferences can generate strong aggregate segregation, and aggregate patterns do not reliably reveal individual motives.
2. **Event recommendation:** Event items are short-lived and intrinsically cold-started; useful ranking therefore depends on context such as topic, location, time, groups, and social signals.
3. **Recommendation feedback loops:** Rankings influence behavior, behavior becomes future training or ranking data, and the resulting loop can amplify popularity and exposure concentration.
4. **Social integration and belonging:** Integration develops through multiple forms of contact, including close ties, acquaintances, serendipitous encounters, and connections across communities.

### 2.1 Foundational references

| Source | Contribution to this project |
|---|---|
| Schelling, T. C. (1971), *Dynamic Models of Segregation*. https://doi.org/10.1080/0022250X.1971.9989794 | Establishes how small individual preferences can produce large systemic segregation and motivates agent-based analysis. |
| Macedo, A. Q., Marinho, L. B., & Santos, R. L. T. (2015), *Context-Aware Event Recommendation in Event-based Social Networks*. https://doi.org/10.1145/2792838.2800187 | Establishes event cold-start and the relevance of content, social, location, and temporal context. |
| Yin, H. et al. (2018), *Joint Event-Partner Recommendation in Event-Based Social Networks*. https://doi.org/10.1109/ICDE.2018.00088 | Motivates modelling companion choice and the effect of attending with others. |
| Kunaver, M., & Požrl, T. (2017), *Diversity in recommender systems – A survey*. https://doi.org/10.1016/j.knosys.2017.02.009 | Supports evaluation beyond accuracy and the inclusion of recommendation diversity. |
| Klimashevskaia, A. et al. (2024), *A survey on popularity bias in recommender systems*. https://doi.org/10.1007/s11257-024-09406-0 | Motivates provider exposure, long-tail coverage, and longitudinal reinforcement measures. |
| Wang, Y. et al. (2022), *A Survey on the Fairness of Recommender Systems*. https://doi.org/10.1145/3547333 | Motivates explicit fairness definitions, stakeholders, datasets, and metrics. |
| Zhao, Y. et al. (2024), *Fairness and Diversity in Recommender Systems: A Survey*. https://doi.org/10.1145/3664928 | Connects user- and item-level fairness with diversity-aware recommendation. |
| Wessendorf, S., & Phillimore, J. (2018), *New Migrants’ Social Integration, Embedding and Emplacement in Superdiverse Contexts*. https://doi.org/10.1177/0038038518771843 | Motivates modelling acquaintances, bridging ties, and serendipitous encounters rather than only strong ties. |
| Allen, K.-A. et al. (2021), *Belonging: a review of conceptual issues, an integrative framework, and directions for future research*. https://doi.org/10.1080/00049530.2021.1883409 | Frames belonging around opportunities, competencies, motivations, and perceptions. |

The bibliography is a starting corpus, not a completed systematic review. Novelty claims must be finalized only after a documented literature search and screening process.

---

## 3. Vision, Mission, and Product Principles

### 3.1 Vision

Make the long-term social effects of recommendation policies visible, measurable, reproducible, and understandable.

### 3.2 Mission

Provide researchers, students, engineers, and policy-oriented audiences with an open computational environment for testing how ranking objectives interact with homophily, geography, event supply, social influence, and exploration.

### 3.3 Product principles

1. **Scientific validity before spectacle.** Visualizations must represent model state accurately and never imply stronger evidence than the model provides.
2. **Reproducibility by default.** Every result must trace to a model version, configuration, random seed, policy version, and code version.
3. **Multiple outcomes, not one score.** Utility, participation, integration, exposure, and provider fairness must remain separately visible.
4. **Transparent algorithms.** Every baseline and bridge-aware policy must have an inspectable definition.
5. **Determinism where promised.** Identical versioned inputs and seeds must reproduce identical simulation outputs within the supported runtime.
6. **No decorative complexity.** The interface should be exceptional through hierarchy, typography, motion, and information design—not novelty colors, gradients, glass effects, or excessive decoration.
7. **No claims about real populations without validation.** Simulations are theory-building tools unless calibrated and validated against suitable empirical data.

---

## 4. Goals and Non-Goals

### 4.1 Goals

- Build a configurable agent-based simulation of event exposure, attendance, and social tie formation.
- Implement four auditable recommendation conditions.
- Run deterministic single simulations and multi-seed experiment batches.
- Calculate longitudinal user-, network-, event-, and provider-level metrics.
- Support hypothesis-driven comparison and sensitivity analysis.
- Export complete reproduction bundles.
- Present the model and results through a publication-quality interactive interface.
- Produce outputs suitable for a research paper, technical report, or portfolio case study.
- Keep the model modular enough to support later empirical calibration without requiring it for the MVP.

### 4.2 Non-goals for the first research release

- Operating a real event marketplace.
- Recruiting or profiling real diaspora users.
- Processing payments, tickets, chat, or real-world identity.
- Inferring race, ethnicity, migration status, or other protected traits from real people.
- Claiming causal effects in real populations.
- Training a neural recommender.
- Building a general-purpose social-network simulator.
- Persisting every agent state for every timestep in normalized relational tables.
- Producing a single “ethical score” that hides trade-offs.
- Using generative AI to make recommendations or interpret results.

---

## 5. Stakeholders and Users

| Stakeholder | Need | Success condition |
|---|---|---|
| Principal investigator / project owner | A defensible research question and reproducible protocol | Can preregister, run, inspect, and report experiments |
| Computational social scientist | Transparent assumptions and longitudinal network measures | Can audit model equations and reproduce results |
| Recommender-systems researcher | Comparable policies and utility/fairness metrics | Can add or evaluate a policy through a stable contract |
| Student / portfolio reviewer | Understandable guided experience | Can grasp the experiment and findings without reading source code |
| Software engineer | Clear interfaces and bounded modules | Can implement slices without guessing scientific semantics |
| Peer reviewer | Evidence, sensitivity tests, and limitations | Can trace every figure to a reproduction bundle |
| Public visitor | Accurate, accessible explanation | Can explore prepared runs without initiating expensive workloads |

### 5.1 User roles

The MVP requires no public identity system. It recognizes operational roles rather than persisted user accounts:

- **Visitor:** views published scenarios, methodology, and prepared results.
- **Researcher:** configures and runs simulations in a trusted deployment or local environment.
- **Maintainer:** publishes canonical scenarios and controls computational limits.

Authentication is deferred unless the platform becomes publicly writable or supports private research workspaces.

---

## 6. Research Questions and Hypotheses

### 6.1 Primary research question

Under what combinations of homophily, network structure, geography, event supply, and exploration do recommendation policies increase or decrease social segregation without unacceptable loss of user utility?

### 6.2 Secondary research questions

1. How quickly do popularity feedback loops concentrate exposure among organizers?
2. When does social recommendation reinforce homophily rather than facilitate participation?
3. Can diversity-aware reranking increase cross-group exposure without reducing attendance?
4. Does companion recommendation increase bridging ties or strengthen existing clusters?
5. Which model parameters account for the greatest variance in integration outcomes?
6. Are policy rankings stable across different initial network conditions and random seeds?
7. Do short-run gains predict or contradict long-run social outcomes?

### 6.3 Preregisterable hypotheses

| ID | Hypothesis | Primary test |
|---|---|---|
| H1 | Popularity-first ranking increases organizer exposure concentration and network segregation relative to relevance-only ranking. | Difference in terminal Gini, assortativity, and modularity across matched seeds |
| H2 | Social ranking increases attendance but also increases same-group co-attendance when initial networks are homophilous. | Interaction between policy and initial homophily on attendance and same-group edge share |
| H3 | Bridge-aware reranking reduces segregation while keeping attendance within a prespecified non-inferiority margin of relevance ranking. | Non-inferiority test for attendance plus superiority test for integration metrics |
| H4 | Exploration probability produces nonlinear threshold effects in cross-group tie formation. | Parameter sweep with nonlinear response estimation/change-point analysis |
| H5 | Companion recommendation increases attendance; its effect on integration depends on whether companion choice is tie-based or bridge-aware. | Factorial comparison of companion policies |
| H6 | Immediate utility is an incomplete proxy for long-term collective outcomes. | Correlation and rank comparison between early utility and terminal segregation |

### 6.4 Confirmatory versus exploratory analysis

- H1–H3 form the minimum confirmatory study.
- H4–H6 are exploratory until power, parameter ranges, and analysis plans are preregistered.
- Exploratory results must be labeled as such in the UI, exports, and manuscript.

---

## 7. Conceptual Model

### 7.1 Core entities

These are **simulation concepts**, not approved database tables:

- **Agent:** a simulated decision-maker.
- **Event:** a time-bounded opportunity for attendance and co-presence.
- **Organizer:** the provider responsible for one or more events.
- **Social tie:** a weighted relationship between two agents.
- **Recommendation policy:** a versioned function that ranks candidate events.
- **Run:** one seeded execution of a scenario under a policy.
- **Experiment:** a collection of runs designed to answer a research question.

### 7.2 Agent attributes

- Stable group label used for controlled experiments.
- Interest vector.
- Spatial position or region.
- Availability distribution.
- Homophily preference.
- Exploration tendency.
- Attendance cost sensitivity.
- Social influence sensitivity.
- Existing network neighborhood.
- Attendance and exposure history.

Group labels are synthetic experimental variables. They are not asserted to represent any real protected class unless a later, separately reviewed empirical study defines them.

### 7.3 Event attributes

- Topic vector.
- Cultural/group affinity vector.
- Location.
- Start time and duration.
- Capacity.
- Organizer identity.
- Baseline quality.
- Attendance cost.
- Current popularity.
- Lifecycle state.

### 7.4 State transition

For agent $u$, event $e$, policy $p$, and timestep $t$:

$$
P(A_{u,e,t}=1)=\sigma\left(
\theta_0+
\theta_r R_{u,e,t}+
\theta_s S_{u,e,t}+
\theta_b B_{u,e,t}-
\theta_c C_{u,e,t}
\right)
$$

Where:

- $R$ is personal relevance.
- $S$ is social influence or companion utility.
- $B$ is bridging or exploration utility.
- $C$ is attendance cost, including distance and time conflict.
- $\sigma$ is a logistic transformation.

After attendance, an edge update may occur:

$$
w_{ij,t+1}=\min\left(w_{max},\;w_{ij,t}+\lambda q_{ij,e,t}\right)
$$

where $q$ represents interaction opportunity and $\lambda$ is tie-formation strength.

The exact equations, distributions, and defaults must be versioned in the methodology specification and must not be silently changed.

---

## 8. Experimental Conditions

### 8.1 Required recommendation policies

#### P0: Popularity baseline

Ranks feasible events using normalized current popularity. Ties are resolved deterministically from the run seed.

**Reason:** represents a common engagement proxy and provides a strong reinforcement baseline.
**Already exists:** no implementation exists in this new project.
**Consequence if omitted:** H1 and popularity-feedback analysis cannot be tested.

#### P1: Personal relevance

Ranks feasible events using topic match, distance, time compatibility, expected quality, and cost.

**Reason:** provides a utility-focused baseline without direct social or bridging objectives.
**Already exists:** no implementation exists.
**Consequence if omitted:** bridge-aware effects cannot be separated from basic relevance gains.

#### P2: Social recommendation

Adds weighted social evidence from existing ties and expected companions.

**Reason:** tests whether socially useful recommendations reinforce pre-existing network structure.
**Already exists:** no implementation exists.
**Consequence if omitted:** H2 and companion-mediated feedback cannot be tested.

#### P3: Bridge-aware reranking

Reranks a relevance-qualified candidate set to balance personal utility, cross-group exposure, organizer coverage, and excessive popularity concentration.

A starting formulation is:

$$
S(u,e)=\alpha R(u,e)+\beta X(u,e)+\gamma O(e)-\delta P(e)
$$

Where:

- $R$ = personal relevance.
- $X$ = expected cross-group exposure.
- $O$ = organizer/long-tail contribution.
- $P$ = popularity concentration penalty.

**Reason:** this is the proposed intervention and principal algorithmic contribution.
**Already exists:** recommendation only; it is not implemented.
**Consequence if omitted:** the project becomes descriptive and loses its primary intervention.

### 8.2 Experimental factors

- Number of agents.
- Number and turnover of events.
- Number and market share of organizers.
- Initial group balance.
- Initial network topology.
- Initial assortativity.
- Homophily strength.
- Geographic clustering.
- Exploration tendency.
- Social influence strength.
- Event capacity pressure.
- Recommendation-list length.
- Candidate-generation strategy.
- Policy weights.
- Companion policy.
- Simulation horizon.

### 8.3 Minimum experiment design

- Four recommendation policies.
- At least three homophily conditions.
- At least three initial network conditions.
- Matched random seeds across policies.
- Sufficient independent replications determined through pilot variance and simulation-based power analysis.
- A held-fixed confirmatory parameter set plus broader sensitivity sweeps.

---

## 9. Outcome Measures

### 9.1 Individual utility

- Feasible recommendation precision.
- Mean selected-event relevance.
- Attendance rate.
- Rejection rate.
- Travel or attendance cost.
- User-level exposure entropy.
- Recommendation novelty.

### 9.2 Network outcomes

- Assortativity by synthetic group label.
- Modularity under a specified community-detection algorithm.
- Same-group edge proportion.
- Cross-group tie formation rate.
- Component count and giant-component share.
- Average shortest path where defined.
- Tie-weight distribution.

### 9.3 Event and organizer outcomes

- Exposure Gini coefficient.
- Attendance Gini coefficient.
- Catalog and long-tail coverage.
- Organizer reach.
- Event fill rate.
- Exposure-to-attendance conversion.
- Share of zero-exposure and zero-attendance events.

### 9.4 System trade-off outcomes

- Utility–integration Pareto frontier.
- Attendance non-inferiority relative to relevance baseline.
- Integration gain per unit of utility loss.
- Stability of policy ranking across scenarios.
- Early-versus-terminal outcome correlation.

### 9.5 Measurement rules

- Metric definitions must be documented mathematically.
- Metrics requiring connected graphs must define disconnected-graph behavior.
- Community detection must use a fixed, versioned algorithm and seed.
- No metric may silently drop agents or events.
- Both population means and distributional outcomes must be reported.
- Confidence intervals must reflect independent runs, not timesteps treated as independent samples.

---

## 10. Functional Requirements

### 10.1 Methodology and scenario configuration

| ID | Requirement | Priority | Acceptance criterion |
|---|---|---:|---|
| FR-001 | The system shall display a plain-language and mathematical model specification. | Must | Every configurable parameter links to its definition, range, unit, and default. |
| FR-002 | The researcher shall configure a scenario through validated controls. | Must | Invalid combinations are rejected with actionable explanations. |
| FR-003 | The system shall provide versioned canonical scenarios. | Must | A canonical scenario can be loaded without manual parameter entry. |
| FR-004 | The system shall serialize a scenario into a stable configuration document. | Must | Exported configuration validates against the versioned schema. |
| FR-005 | The system shall calculate a configuration fingerprint. | Must | Semantically identical canonical configurations produce the same fingerprint. |

### 10.2 Simulation execution

| ID | Requirement | Priority | Acceptance criterion |
|---|---|---:|---|
| FR-010 | The researcher shall start a seeded simulation run. | Must | The run records seed, configuration, policy, and model version before execution. |
| FR-011 | The system shall report queued, running, completed, cancelled, and failed states. | Must | State transitions are valid, timestamped, and visible. |
| FR-012 | The researcher shall cancel a running batch. | Should | Cancellation stops future replications and safely finalizes completed outputs. |
| FR-013 | The system shall stream progress without changing run results. | Must | Disabling the stream produces identical outputs for the same run. |
| FR-014 | The system shall enforce computational limits. | Must | Runs exceeding configured bounds are rejected before allocation. |
| FR-015 | The system shall execute matched-seed policy comparisons. | Must | Each policy receives the same scenario realization where the design requires matching. |

### 10.3 Experiment management

| ID | Requirement | Priority | Acceptance criterion |
|---|---|---:|---|
| FR-020 | The researcher shall define a batch experiment over parameter levels and seeds. | Must | The interface reports the exact number of resulting runs before submission. |
| FR-021 | The system shall preserve confirmatory/exploratory labels. | Must | Labels appear in experiment metadata, exports, and result pages. |
| FR-022 | The researcher shall clone an experiment. | Should | Cloning creates a new draft without altering the source experiment. |
| FR-023 | The system shall compare policies using paired results where applicable. | Must | Matched runs are explicitly identified and included in comparisons. |
| FR-024 | The system shall publish immutable result snapshots. | Should | Published snapshots cannot change when draft metadata is edited. |

### 10.4 Visualization and analysis

| ID | Requirement | Priority | Acceptance criterion |
|---|---|---:|---|
| FR-030 | The interface shall animate network and attendance evolution. | Must | The animation is derived from recorded checkpoints and can be paused or scrubbed. |
| FR-031 | The interface shall compare at least two policies side by side. | Must | Axes, scales, and timesteps remain synchronized by default. |
| FR-032 | The system shall chart every primary metric over time and at terminal state. | Must | Charts expose definitions and downloadable underlying data. |
| FR-033 | The system shall display uncertainty across replications. | Must | Aggregate charts include intervals and replication count. |
| FR-034 | The system shall expose the utility–integration frontier. | Must | Policies/scenarios can be inspected without collapsing outcomes into one score. |
| FR-035 | The interface shall provide reduced-motion and non-animated alternatives. | Must | All findings remain accessible when motion is disabled. |
| FR-036 | The system shall distinguish simulated observations from statistical summaries. | Must | Visual labels and legends prevent confusing one run with aggregate evidence. |

### 10.5 Reproducibility and export

| ID | Requirement | Priority | Acceptance criterion |
|---|---|---:|---|
| FR-040 | The system shall reproduce a completed run from its manifest. | Must | Re-execution under the same supported version passes deterministic checks. |
| FR-041 | The system shall export a reproduction bundle. | Must | Bundle includes configuration, seed, versions, metrics, logs, and checksums. |
| FR-042 | The system shall export tidy CSV and structured JSON results. | Must | Exports include units, metric names, run IDs, and timestep keys. |
| FR-043 | The system shall generate publication-ready vector charts where feasible. | Should | Charts export as SVG with accessible labels and embedded metadata. |
| FR-044 | The system shall record source-control revision and dependency lock fingerprint. | Must | Every completed run manifest contains both values. |
| FR-045 | The system shall support citation metadata. | Should | Published scenarios provide a citation block and software version. |

### 10.6 Documentation

| ID | Requirement | Priority | Acceptance criterion |
|---|---|---:|---|
| FR-050 | The product shall include a model card. | Must | Assumptions, intended use, limitations, and invalid uses are documented. |
| FR-051 | The product shall include a metric dictionary. | Must | Every reported metric has formula, interpretation, and edge-case behavior. |
| FR-052 | The product shall include a guided experiment. | Must | A first-time visitor can understand the question, intervention, and result path. |
| FR-053 | The product shall include a reproducibility guide. | Must | A technically competent reviewer can reproduce a canonical figure. |

---

## 11. Non-Functional Requirements

### 11.1 Reproducibility

- Same model version, policy version, canonical configuration, and seed must produce identical metric outputs on supported architecture/runtime combinations.
- Any change that can alter output must increment the relevant model or policy version.
- Floating-point and library-version constraints must be documented.
- Result manifests must be immutable after completion.

### 11.2 Performance

- Interactive prepared-result pages should reach usable state within 2 seconds on a modern broadband desktop under normal load.
- UI interactions should generally respond within 100 ms where no server operation is required.
- The default demonstration run should complete within 10 seconds on the supported reference environment.
- Batch execution must use bounded concurrency and report estimated workload before submission.
- Large raw trajectories should use checkpointing and compressed artifact storage rather than unbounded relational inserts.

### 11.3 Accessibility

- Target WCAG 2.2 AA.
- Full keyboard operation.
- Visible focus states.
- Contrast of at least 4.5:1 for normal text and 3:1 for large text and meaningful graphics.
- Charts require text summaries, data tables, and non-color encodings.
- Motion must respect `prefers-reduced-motion` and provide pause/stop controls.
- No scientific distinction may rely on color alone.

### 11.4 Security and privacy

- The MVP contains synthetic data only.
- Configuration input must be validated and bounded.
- No arbitrary code execution or user-supplied policy code in hosted environments.
- Exports must not include secrets or internal infrastructure metadata.
- Public execution endpoints require rate limiting if exposed.
- Any later empirical-data ingestion requires a separate privacy and ethics review.

### 11.5 Reliability

- A failed run must not be marked completed.
- Partial outputs must be clearly identified and excluded from confirmatory summaries by default.
- Retries must not duplicate completed runs.
- Experiment aggregation must be idempotent.
- A run cancellation must preserve already-finalized artifacts and label them incomplete.

### 11.6 Maintainability

- Scientific model logic must be independent of HTTP and UI concerns.
- Recommendation policies must implement a stable, testable interface.
- Metrics must be pure or explicitly stateful with unit tests against hand-calculated fixtures.
- API and persistence boundaries must use explicit schemas.
- No framework-specific types may enter the core simulation package.

---

## 12. User Experience and Visual Requirements

### 12.1 Art direction

The UI must feel like a premium scientific instrument: quiet, precise, editorial, and deeply considered.

**Approved direction**

- Neutral graphite, warm white, slate, and restrained blue or teal accents.
- High-contrast typography with tabular numerals for metrics.
- Dense but legible analytical layouts.
- Fine rules, precise alignment, restrained radius, and minimal shadow.
- Motion used to explain state transitions, not decorate screens.
- Direct labeling on charts where possible.
- Split views and synchronized comparison.
- Purpose-built empty, loading, failure, and no-variance states.

**Explicitly prohibited**

- Rainbow or “funny” palettes.
- Purple/indigo AI-product styling.
- Neon colors.
- Decorative gradients.
- Glassmorphism.
- Excessive pill controls.
- Oversized rounded cards.
- Cartoon illustrations.
- Confetti, gamification, or playful scientific metaphors.
- Unnecessary 3D effects.

### 12.2 Provisional palette

These are design recommendations, not implementation changes:

| Token | Light | Dark | Use |
|---|---:|---:|---|
| Canvas | `#F5F4F0` | `#111416` | Application background |
| Surface | `#FFFFFF` | `#191D20` | Primary analytical surfaces |
| Surface raised | `#ECEBE6` | `#20262A` | Secondary panels |
| Ink | `#171A1C` | `#F1F2EF` | Primary text |
| Muted ink | `#5F676C` | `#AAB1B5` | Secondary text |
| Rule | `#D4D3CE` | `#343B3F` | Borders and chart guides |
| Accent | `#1F5C73` | `#74AFC4` | Selection, links, primary series |
| Secondary series | `#66725B` | `#A5B397` | Comparative series |
| Warning | `#8A5A20` | `#D4A45D` | Warnings, not decoration |
| Critical | `#8A3434` | `#DC8585` | Failure and invalid states |

Color choices must be validated for contrast and color-vision deficiencies before implementation.

### 12.3 Core screens

1. Research landing and guided narrative.
2. Methodology and model specification.
3. Scenario builder.
4. Policy workbench.
5. Run monitor.
6. Live simulation explorer.
7. Side-by-side comparison laboratory.
8. Experiment result report.
9. Reproduction and export center.
10. Model limitations and citation page.

---

## 13. Scientific Validity Requirements

### 13.1 Verification

- Unit-test transition equations against manually calculated cases.
- Test invariants: population conservation, event capacity, bounded probabilities, valid tie weights, and deterministic ordering.
- Replicate qualitative Schelling-style segregation under a documented baseline scenario.
- Confirm that neutral policies do not introduce group effects when group variables are excluded and all else is equal.
- Confirm that matched seeds produce matched exogenous event supply across policy conditions.

### 13.2 Validation

The MVP supports **conceptual and internal validation**, not empirical population validation.

Required validation activities:

- Face validation of assumptions against cited literature.
- Parameter sensitivity analysis.
- Extreme-condition testing.
- Pattern-oriented checks against known emergent segregation and popularity concentration behavior.
- Comparison of multiple network initializations.
- Robustness to event-supply and population-size changes.

Later empirical validation may calibrate distributions using ethically sourced aggregate datasets, but this requires a separate plan.

### 13.3 Statistical analysis

- Define the unit of analysis as the independent simulation run.
- Use matched-seed paired comparisons where designed.
- Report effect sizes and uncertainty, not only significance tests.
- Correct or control for multiplicity in confirmatory families.
- Publish exclusions and failed-run handling.
- Conduct simulation-based power analysis after pilot estimates.
- Keep confirmatory parameters locked after preregistration.

### 13.4 Reproducible research package

A publication release must include:

- Source code and license.
- Dependency lockfile.
- Model and policy version registry.
- Canonical configurations.
- Seed list.
- Raw aggregate outputs or justified storage alternative.
- Analysis script/notebook.
- Figure generation code.
- Data and metric dictionary.
- Model card.
- Reproduction instructions.
- Citation metadata.

---

## 14. Ethical Considerations

- Synthetic group identities are abstractions and must not be presented as faithful models of race, ethnicity, nationality, or migration status.
- “Integration” is operationalized through specific network and exposure measures; it is not a moral judgment about assimilation.
- Bridge-aware ranking may impose unwanted exposure or reduce autonomy if transferred directly to real systems. The simulation must retain individual relevance constraints.
- Fairness objectives can conflict across users, organizers, and groups. The system must expose rather than hide these conflicts.
- The interface must avoid deterministic language such as “the algorithm causes society to…” when evidence is simulation-specific.
- Any human-subject study, real interaction logs, or demographic calibration requires ethics review and informed governance beyond this BRD.

---

## 15. Success Criteria

### 15.1 Research success

- A preregisterable protocol exists for H1–H3.
- At least four policies run under matched experimental conditions.
- Canonical findings reproduce from a clean environment.
- Sensitivity analysis identifies robust and fragile conclusions.
- At least one non-trivial policy trade-off is demonstrated.
- A manuscript-quality methods section, figures, and results tables can be generated from exported artifacts.

### 15.2 Product success

- A visitor completes the guided experiment and correctly identifies the primary trade-off in a usability check.
- A researcher configures, runs, compares, and exports an experiment without editing source code.
- Every published figure resolves to an experiment and reproduction manifest.
- The interface meets WCAG 2.2 AA checks for primary flows.
- The visual system receives no critical findings for misleading encodings or inaccessible color use.

### 15.3 Engineering success

- Determinism tests pass across the supported reference environment.
- Core simulation achieves at least 80% branch coverage, with 100% coverage for critical invariants and metric formulas.
- API contracts are validated at runtime and represented in generated documentation.
- Batch workloads remain within configured memory and concurrency limits.
- No critical or high-severity security findings remain at release.

---

## 16. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Novelty overlaps existing simulation research | High | Complete a systematic search and novelty matrix before manuscript claims |
| Model appears realistic but is weakly validated | High | Explicit model card, extreme-condition tests, sensitivity analysis, restrained claims |
| Bridge score embeds normative assumptions | High | Keep components separable, expose weights, report stakeholder trade-offs |
| Results depend on arbitrary defaults | High | Preregister defaults; run global sensitivity and robustness analyses |
| Network visualizations mislead through layout changes | Medium | Fix layout seeds, synchronize comparisons, supplement with metrics and tables |
| Batch experiments overload the server | Medium | Preflight run counts, bounded queues, cancellation, per-run resource limits |
| Floating-point/runtime differences break reproduction | Medium | Pin versions, define reference runtime, checksum normalized outputs |
| UI spectacle overshadows methodology | Medium | Method-first information architecture and mandatory limitations panel |
| Persisting trajectories creates excessive storage | Medium | Store checkpoints/artifacts, not every entity state as relational rows |
| Scope drifts into a real social platform | High | Enforce non-goals and separate any empirical product proposal into a new BRD |

---

## 17. Dependencies and Assumptions

### 17.1 Assumptions

- The first release uses synthetic data only.
- Events provide a useful controlled setting for repeated social exposure.
- The reference simulation can execute within a TypeScript/Bun environment.
- PostgreSQL stores metadata and summaries; large artifacts use filesystem or object storage.
- The owner will select a final project name before public release.

### 17.2 External dependencies

- Bun runtime compatible with Elysia.js.
- PostgreSQL database.
- Prisma support for the selected runtime and deployment target.
- Graph and statistical libraries selected only after deterministic and licensing evaluation.
- A publication repository such as Zenodo or OSF for released artifacts is recommended but not required for local MVP development.

---

## 18. Delivery Scope and Phases

### Phase 0 — Research protocol

- Complete literature search and novelty matrix.
- Freeze conceptual model and H1–H3 analysis plan.
- Define parameter dictionary and metric formulas.
- Produce hand-calculated validation fixtures.

### Phase 1 — Deterministic simulation core

- Seeded random-number service.
- Agent, event, organizer, and network state.
- Candidate generation, attendance choice, and tie update.
- Popularity and relevance policies.
- Core invariant and metric tests.

### Phase 2 — Scientific comparison

- Social and bridge-aware policies.
- Batch experiment planning and matched seeds.
- Aggregation, uncertainty, and sensitivity outputs.
- Reproduction manifests.

### Phase 3 — Research interface

- Premium visual tokens and accessible shell.
- Scenario builder and run monitor.
- Live explorer and synchronized comparison.
- Result report, methodology, and limitations.

### Phase 4 — Publication package

- Locked canonical experiments.
- Manuscript figures and tables.
- Public reproduction bundle.
- Model card, citation metadata, and archived release.

---

## 19. Acceptance Gate for Implementation Start

Implementation may begin when:

- [x] Project direction is approved.
- [x] Primary technology choices are approved: SvelteKit, Elysia.js, Prisma, PostgreSQL.
- [x] Visual direction is approved: extraordinary, restrained, no novelty colors.
- [x] Project and repository name is accepted: EventScape.
- [x] H1–H3 operational definitions are reviewed in [`ADR-001`](./docs/decisions/ADR-001-first-executable-research-slice.md).
- [x] Initial confirmatory factor levels are reviewed in [`ADR-001`](./docs/decisions/ADR-001-first-executable-research-slice.md); full generator parameters remain Phase 0 work.
- [x] Initial implemented metric formulas are in [`research/metric-dictionary/v1.md`](./research/metric-dictionary/v1.md); later metrics remain versioned Phase 0 work.
- [x] The system design is accepted subject to the sequencing and reproduction clarifications in [`ADR-001`](./docs/decisions/ADR-001-first-executable-research-slice.md).

---

## 20. Open Decisions

1. Whether the first paper targets recommender systems, computational social science, or HCI.
2. Reference deployment target for public demonstrations.
3. Artifact storage choice for hosted deployments.
4. Whether published scenarios require a maintainer authentication mechanism in the MVP.

Resolved decisions:

- Project and repository name: EventScape.
- Companion recommendation is excluded from H1–H3 and reserved for exploratory H5 work.
- H3 attendance non-inferiority margin: 3 percentage points, as defined in [`ADR-001`](./docs/decisions/ADR-001-first-executable-research-slice.md).

---

## 21. Change Control

Changes to any of the following require a versioned decision record and review:

- Research question or confirmatory hypotheses.
- Agent decision equation.
- Tie-formation mechanism.
- Primary metric definitions.
- Recommendation policy semantics.
- Random-number generation behavior.
- Reproduction manifest format.
- Claims attached to published scenarios.

Cosmetic copy corrections and documentation clarifications do not require a research-model version change unless they alter interpretation.
