UPDATE project
SET
    name = @name,
    description = @description
WHERE
    uuid = @id