select
    p.uuid as id,
    p.name,
    p.description,
    p.created_at as "created",
    json_object(
        'cost', c.cost,
        'benefit', c.benefit,
        'benefitCost', c.benefit_cost
    ) as "calc"
from
    project as p
left join
    project_calc as c
    on c.project_id = p.id
order by
    p.created_at desc
;
