-- retrieve the list of v1 and v2 users
with
	w_v1 as (
		-- retrieve the list of v1 users who do not have a v2 account
		with w_lse as (
			-- aggregate the lse ids
			select
				l.user_id,
				array_agg(e.uuid) as lse
			from
				app.user_lse_link_v1 as l
			join
				app.lse as e
				on e.id = l.lse_id
			group by
				l.user_id
		)
		select
			u.uuid as "uuid",
			u.first_name as "firstName",
			u.last_name as "lastName",
			u.email as "email",
			u.level_id as "levelId",
			extract(epoch from u.created_date) as "created",
			u.comments as "comments",
			u.status_id as "statusId",
			case
				when l.user_id is not null then l.lse
				else null
			end as lse
		from
			auth.user_v1 as u
		left join
			auth.user_v1_v2_transfer as t
			on t.user_id_v1 = u.id
		left join
			w_lse as l
			on l.user_id = u.id
		where
			t.id is null
	),
	w_v1_agg as (
		-- aggregate the list of v1 users as jsonb objects
		select
			case
				when count(*) > 0 then jsonb_agg(d.*)
				else null
			end as items
		from
			w_v1 as d
	),
	w_v2 as (
		-- retrieve the list of all v2 users
		with w_lse as (
			-- aggregate the lse ids
			select
				l.user_id,
				array_agg(e.uuid) as lse
			from
				app.user_lse_link as l
			join
				app.lse as e
				on e.id = l.lse_id
			group by
				l.user_id
		)
		select
			uuid as "uuid",
			first_name as "firstName",
			last_name as "lastName",
			email as "email",
			organization as "organization",
			status as "status",
			role as "role",
			comments as "comments",
			case
				when l.user_id is not null then l.lse
				else null
			end as lse,
			extract(epoch from created_date) as "created",
			extract(epoch from modified_date) as "modified"
		from
			auth.user as u
		left join
			w_lse as l
			on l.user_id = u.id
	),
	w_v2_agg as (
		-- aggregate the list of v2 users as jsonb objects
		select
			case
				when count(*) > 0 then jsonb_agg(d.*)
				else null
			end as items
		from
			w_v2 as d
	)
-- return the aggregated lists of v1 and v2 users
select
	v1.items as v1,
	v2.items as v2
from
	w_v1_agg as v1,
	w_v2_agg as v2
