with
    w_strats as (
        select
            pt.id,
            pt.uuid,
            json_group_array(
                json_object(
                    'id', tes.id,
                    'equipmentId', e.uuid,
                    'strategyType', tes.strategy_type_id,
                    'data', tes.data
                )
            ) as strategies
        from
            project as p
        join
            project_threat as pt
            on pt.project_id = p.id
        join
            threat_equipment_strategy as tes
            on tes.project_threat_id = pt.id
        join
            equipment as e
            on e.id = tes.equipment_id
        where
            p.uuid = @id
        group by
            pt.id,
            pt.uuid
    ),
    w_threats as (
        select
            json_group_array(
                json_object(
                    'id', pt.uuid,
                    'threatType', pt.threat_type_id,
                    'name', pt.name,
                    'description', pt.description,
                    'strategies', s.strategies
                )
            ) as threats
        from
            project as p
        join
            project_threat as pt
            on pt.project_id = p.id
        left join
            w_strats as s
            on s.id = pt.id
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
