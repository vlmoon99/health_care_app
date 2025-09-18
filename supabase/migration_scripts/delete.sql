drop policy if exists "Enable CRUD for authenticated users on their own food intakes" 
on public.food_intakes;

drop policy if exists "users can crud own images"
on storage.objects;

alter table public.food_intakes disable row level security;

drop index if exists idx_food_intakes_user_id;
drop index if exists idx_food_intakes_created_at;

drop trigger if exists trg_set_updated_at on public.food_intakes;

drop function if exists public.set_updated_at();

drop table if exists public.food_intakes;

drop extension if exists "uuid-ossp";
