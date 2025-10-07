INSERT INTO project_calc (project_id, cost, benefit, benefit_cost)
VALUES ((SELECT id FROM project WHERE uuid = @projectId), @cost, @benefit, @benefitCost)
ON CONFLICT(project_id) DO UPDATE SET
    cost = excluded.cost,
    benefit = excluded.benefit,
    benefit_cost = excluded.benefit_cost
