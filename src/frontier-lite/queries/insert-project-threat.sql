with
    w_project as (
        select
            id
        from
            project as p
        where
            p.uuid = @projectId
    )
INSERT INTO
    project_threat (project_id, uuid, name, description, threat_type_id)
select
    wp.id,
    @uuid,
    @name,
    @description,
    @threatType
from
    w_project as wp
;
