select
    e.uuid as id,
    e.equipment_type_id as "equipmentType",
    e.name,
    e.geo,
    e.created_at as "created"
from
    equipment as e,
    equipment_collection as c
where
    c.uuid = @collectionId
and
    e.collection_id = c.id
order by
    e.created_at desc
;
