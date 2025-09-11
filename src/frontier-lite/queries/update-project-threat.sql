UPDATE
    project_threat
SET
    threat_type_id = @threatType,
    name = @name,
    description = @description
WHERE
    uuid = @id
