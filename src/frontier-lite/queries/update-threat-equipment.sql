update
    threat_equipment_strategy
set
    name = @name,
    data = @data
where
    id = @id
;
