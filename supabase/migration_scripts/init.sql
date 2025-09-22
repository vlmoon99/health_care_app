create extension if not exists "uuid-ossp";

create table public.food_intakes (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users (id) on delete cascade,
    food_image_id text,
    description text,
    nutrients jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger trg_set_updated_at
before update on public.food_intakes
for each row
execute procedure public.set_updated_at();

create index idx_food_intakes_user_id on public.food_intakes(user_id);
create index idx_food_intakes_created_at on public.food_intakes(created_at desc);

alter table public.food_intakes enable row level security;

create policy "Enable CRUD for authenticated users on their own food intakes"
on public.food_intakes
as permissive
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users can crud own images"
on storage.objects
as permissive
for all
to authenticated
using (
  bucket_id = 'user_photos'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  (storage.foldername(name))[1] = auth.uid()::text
);


-- mock data