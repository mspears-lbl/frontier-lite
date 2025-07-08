select
    uuid as id,
    name,
    description,
    created_at as "created"
from
    project
order by
    created_at desc
;
