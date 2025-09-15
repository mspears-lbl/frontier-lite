with
    w_project_threat as (
        select
            id
        from
            project_threat as p
        where
            p.uuid = @threatId
    ),
    w_equipment as (
        select
            id
        from
            equipment as e
        where
            e.uuid = @equipmentId
    )
INSERT INTO
    threat_equipment_strategy (
        project_threat_id,
        equipment_id,
        strategy_type_id,
        name,
        data
    )
select
    wp.id,
    we.id,
    @strategyType,
    @name,
    @data
from
    w_project_threat as wp,
    w_equipment as we
;
