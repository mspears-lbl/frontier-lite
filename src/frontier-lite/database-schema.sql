------------------------
-- db_migrate_version --
------------------------
create table if not exists db_migrate_version (
	id INTEGER primary key AUTOINCREMENT,
	value INTEGER not null
);
-- set the initial db version
insert into db_migrate_version
	(value)
values
	(0)
;
insert into db_migrate_version (
    value
)
with
    w_values as (
        select 0 as value
    )
select
    n.value
from
    w_values as n
left join
    db_migrate_version as e
    on e.value = n.value
where
    e.value is null
;


------------------------
-- db_migrate_history --
------------------------
create table if not exists db_migrate_history (
	id INTEGER primary key AUTOINCREMENT,
	source_version INTEGER not null,
	target_version INTEGER not null,
	success boolean not null,
	run_time real not null
);


--------------------------
-- equipment_collection --
--------------------------
create table if not exists equipment_collection (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid text not null unique,
    name TEXT not null,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

--------------------
-- equipment_type --
--------------------
create table if not exists equipment_type (
    id INTEGER primary key,
    name TEXT not null unique,
    description TEXT
);
-- insert the equipment types if they don't exist already
insert into equipment_type (
    id,
    name
)
with
    w_values as (
        select 1 as id, 'Generation Assets' as name union
        select 2, 'Transmission Lines' union
        select 3, 'Substations' union
        select 4, 'Distribution Lines' union
        select 5, 'Other Critical Energy/Electricity Facilities'
    )
select
    n.id, n.name
from
    w_values as n
left join
    equipment_type as e
    on e.id = n.id
where
    e.id is null
;

---------------
-- equipment --
---------------
CREATE TABLE IF NOT EXISTS equipment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid text not null unique,
    collection_id INTEGER NOT NULL,
    equipment_type_id INTEGER NOT NULL,
    name TEXT not null,
    geo TEXT not null,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (collection_id) REFERENCES equipment_collection (id),
    FOREIGN KEY (equipment_type_id) REFERENCES equipment_type (id)
);
create index if not exists
    idx_equipment_collection_id on equipment (collection_id);

--------------
-- projects --
--------------
create table if not exists projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
