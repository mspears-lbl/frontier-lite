select
    e.uuid as id,
    e.equipment_type_id as "equipmentType",
    e.name,
    e.geo,
    e.created_at as "created"
from
    equipment as e
where
    e.uuid = @equipmentId
;
