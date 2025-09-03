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

insert into equipment_collection (
    uuid,
    name
)
with
    w_values as (
        select '6d8b6025-0ffb-4fc6-9a8c-fc675c115d8c' as uuid, 'Default' as name
    )
select
    n.uuid, n.name
from
    w_values as n
left join
    equipment_collection as e
    on e.uuid = n.uuid
where
    e.id is null
;



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

-------------
-- project --
-------------
create table if not exists project (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid text not null unique,
    name TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

--------------------------
-- Threat Scenario Type --
--------------------------
create table if not exists threat_type (
    id integer primary key,
    name text not null unique,
    description text
);

insert into threat_type (
    id,
    name
)
with
    w_values as (
        select 1 as id, 'Water Inundation' as name union
        select 2, 'Peak Ground Acceleration' union
        select 3, 'Peak Ground Velocity' union
        select 4, 'Soil Liquefaction Susceptibility' union
        select 5, 'Wind' union
        select 6, 'Wildfire' union
        select 7, 'Other'
    )
select
    n.id, n.name
from
    w_values as n
left join
    threat_type as e
    on e.id = n.id
where
    e.id is null
;

--------------------
-- project_threat --
--------------------
create table if not exists project_threat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    uuid text not null unique,
    name TEXT NOT NULL,
    description TEXT,
    threat_type_id integer not null,
    FOREIGN KEY (project_id) REFERENCES project (id),
    FOREIGN KEY (threat_type_id) REFERENCES threat_type (id)
);

------------------------------
-- project_threat_equipment --
------------------------------
create table if not exists project_threat_equipment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_threat_id INTEGER NOT NULL,
    equipment_id INTEGER NOT NULL,
    FOREIGN KEY (project_threat_id) REFERENCES project_threat (id) ON DELETE CASCADE,
    FOREIGN KEY (equipment_id) REFERENCES equipment (id),
    unique (project_threat_id, equipment_id)
);

-------------------
-- strategy_type --
-------------------
create table if not exists strategy_type (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL unique
);

insert into
    strategy_type (id, name)
with
    w_values as (
        select 1 as id, 'Relocate vulnerable lines' as name union
        select 2, 'Convert wood poles to concrete' union
        select 3, 'Bracing poles (Guy wires and Pole foam)' union
        select 4, 'Prestaging transmission equipment' union
        select 5, 'Reinforce substations' union
        select 6, 'Build new substations relocated' union
        select 7, 'Purchase mobile substations' union
        select 8, 'Prestaging substation equipment' union
        select 9, 'Relocate generation' union
        select 10, 'Reinforce generation' union
        select 11, 'Prestaging generation equipment'
    )
select
    n.id, n.name
from
    w_values as n
left join
    strategy_type as e
    on e.id = n.id
where
    e.id is null
;

-------------------------------
-- threat_equipment_strategy --
-------------------------------
create table if not exists threat_equipment_strategy (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    threat_equipment_id INTEGER NOT NULL,
    strategy_type_id INTEGER NOT NULL,
    name text not null,
    constants text not null,
    FOREIGN KEY (threat_equipment_id) REFERENCES project_threat_equipment (id),
    FOREIGN KEY (strategy_type_id) REFERENCES strategy_type (id),
    unique (threat_equipment_id, strategy_type_id)
);
