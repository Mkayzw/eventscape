# Comparative Metric Dictionary v1

## Scope

Metrics produced by `comparative-demo-v1`. The independent run is the replication unit. Aggregate intervals are normal-approximation 95% confidence intervals over defined terminal run values. Every aggregate records its valid replication count.

## Attendance rate

Final attendees divided by all agents at a timestep. Range $[0,1]$. Higher indicates more participation; interpretation is contextual.

## Mean selected relevance

Arithmetic mean of the content-affinity × event-quality score for the single event selected by each agent. The same selection is used for attendance intent. Range $[0,1]$. Higher indicates greater modeled personal utility.

## Organizer exposure Gini

Population Gini coefficient over cumulative recommendation exposure counts for all organizers. The all-zero case is zero. Range $[0,1)$. Lower indicates more equal provider exposure.

## Same-group weighted edge share

Total weight of edges joining agents with the same synthetic group label divided by total edge weight. Undefined networks are encoded as zero only when no edge exists in the comparative demonstration; canonical scientific metrics retain an explicit `NO_EDGES` reason. Range $[0,1]$. Lower indicates more cross-group network mixing conditional on group composition.

## Cross-group tie formation rate

New cross-group edges divided by all newly created edges during the timestep. If no edge is created, the run value is `null`, not zero. Aggregate means and intervals exclude null values and report `validReplicationCount`. Range $[0,1]$ when defined.

## Catalog coverage

Distinct events appearing in at least one recommendation divided by all available events, cumulative through the timestep. Range $[0,1]$. Higher indicates broader item exposure.

## Bridge opportunity factor

For each event, expected attendance is computed separately for both synthetic groups using the shared logistic attendance function. Bridge opportunity is:

$$
\frac{2\min(E[A_0], E[A_1])}{E[A_0] + E[A_1]}
$$

It is maximal when expected attendance is balanced across groups and zero when only one group is expected to attend. This is a model-based opportunity estimate, not observed real-world integration.
