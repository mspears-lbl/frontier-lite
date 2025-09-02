with
    w_threats as (
        select
            json_group_array(
                json_object(
                    'id', pt.uuid,
                    'threatType', pt.threat_type_id,
                    'name', pt.name,
                    'description', pt.description
                )
            ) as threats
        from
            project as p
        join
            project_threat as pt
            on pt.project_id = p.id
        where
            p.uuid = @id
    )
select
    p.uuid as id,
    p.name,
    p.description,
    p.created_at as "created",
    wt.threats
from
    project as p
cross join
    w_threats as wt
where
    p.uuid = @id
;
