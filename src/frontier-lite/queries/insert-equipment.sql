INSERT INTO equipment (uuid, collection_id, equipment_type_id, name, geo)
select
    @uuid,
    ec.id,
    @equipmentType,
    @name,
    @geo
from
    equipment_collection as ec
where
    ec.uuid = @collectionId
;
