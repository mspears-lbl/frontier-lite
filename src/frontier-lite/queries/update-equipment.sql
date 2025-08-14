UPDATE equipment
SET
    equipment_type_id = @equipmentType,
    name = @name,
    geo = @geo
WHERE
    uuid = @id
