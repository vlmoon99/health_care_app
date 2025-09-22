# 1. Introduction

The main idea of this tutorial is to provide all necessary information about technologies and the way to use these technologies to create apps as fast as possible.

This tutorial will focus on creating a fast prototype with only one problem to solve.

When this problem is solved – you can start to split the code, add new features, and build a solid application.

Our tutorial topic is **Food Analyzer App**.

---

# 2. Tech Stack

**Backend**: TypeScript, Supabase (PostgreSQL, Supabase Edge Functions)
**Frontend**: Vanilla JS, React, TailwindCSS, Vite, PWA
**AI**: LLM from Google, OpenAI, and other AI providers

---

# 4. First Step (Domain Models & Use Cases)

Creating Domain Models and Use Cases is the first step before making any application.
It is important because here you define the main entities and logic of the app.
On this step you need to think about your future users, how you will solve their problem, and how they will use the app.

Our Food Analyzer App domain models:

---

# Domain Models

## User

* **Attributes** (from Supabase `auth.users`)
* **Relationships**: has many **FoodIntakes**

## FoodIntake

* **Attributes**:

  * `id: UUID`
  * `user_id: UUID`
  * `food_image_id: string | null`
  * `description: string | null`
  * `nutrients: JSONB` (calories, protein, carbs, fat, etc.)
  * `created_at: DateTime`
  * `updated_at: DateTime`
* **Relationships**: belongs to **User**

---

# Use Cases

## 1. User Login

* **Who**: User (anonymous)
* **Steps**:

  1. Press "Login" button
  2. System logs in with Supabase
  3. Redirect to Home screen

---

## 2. Add Food Intake

* **Who**: Logged-in User
* **Steps**:

  1. Press FAB
  2. Add image, description, or both
  3. System processes input (optional: recognition/NLP)
  4. New FoodIntake object created

---

## 3. Store Food Intake

* **Who**: System
* **Steps**:

  1. Save FoodIntake in database (linked to user)
  2. Save image in Supabase Storage (if provided)
  3. Show new card on Home screen

---

## 4. View Food Intake Details

* **Who**: Logged-in User
* **Steps**:

  1. Tap FoodIntake card
  2. Modal opens with nutrient data (scrollable)

---

## 5. Delete All Data

* **Who**: Logged-in User
* **Steps**:

  1. Press "Delete All Data" in Settings
  2. System deletes all FoodIntakes and images
  3. Log out user
  4. Redirect to Login screen

---

# 5. Second Step (SQL Scripts)

It is very important to have **two scripts**:

1. **Init Script** – creates all tables, functions, triggers, indexes, policies, and storage bucket.
2. **Delete Script** – removes everything fast, so you can recreate it again if needed.

---

## Init Script

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create main table for food intakes
create table public.food_intakes (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users (id) on delete cascade,
    food_image_id text,
    description text,
    nutrients jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create storage bucket for user photos
insert into storage.buckets (id, name, public)
values ('user_photos', 'user_photos', false);

-- Function to update "updated_at" on every update
create or replace function public.set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Trigger to call set_updated_at before update
create trigger trg_set_updated_at
before update on public.food_intakes
for each row
execute procedure public.set_updated_at();

-- Indexes for performance
create index idx_food_intakes_user_id on public.food_intakes(user_id);
create index idx_food_intakes_created_at on public.food_intakes(created_at desc);

-- Enable Row Level Security
alter table public.food_intakes enable row level security;

-- Policy: allow users to manage their own food intakes
create policy "Enable CRUD for authenticated users on their own food intakes"
on public.food_intakes
as permissive
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Policy: allow users to manage their own images
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
```

---

## Delete Script

```sql
-- Drop policies
drop policy if exists "Enable CRUD for authenticated users on their own food intakes"
on public.food_intakes;

drop policy if exists "users can crud own images"
on storage.objects;

-- Disable RLS
alter table public.food_intakes disable row level security;

-- Drop indexes
drop index if exists idx_food_intakes_user_id;
drop index if exists idx_food_intakes_created_at;

-- Drop trigger
drop trigger if exists trg_set_updated_at on public.food_intakes;

-- Drop function
drop function if exists public.set_updated_at();

-- Drop table
drop table if exists public.food_intakes;

-- Delete storage bucket
delete from storage.buckets where id = 'user_photos';

-- Drop extension
drop extension if exists "uuid-ossp";
```


# 6. Third Step (Create UI mock prototype)


#Create mock UI

App Flow:

* Start Screen: Anonymous login with Supabase (simple login button). After pressing login, user is redirected to Home screen.
* Home Screen: Displays a list of FoodIntake cards. Each card shows short details like image (if uploaded), description, and created_at timestamp.
* Floating Action Button (FAB): Positioned at the bottom center right. When tapped, user can add a new FoodIntake by uploading an image, writing a description, or both. The system processes it and appends the new entry to the list.
* FoodIntake Card Interaction: When a user taps a card, a modal window opens showing full nutrient details. Modal can be scrolled vertically to view all nutrient data (calories, protein, carbs, fats, etc.).
* Bottom Navigation Bar: Contains two tabs:

  1. Home (default) – shows the FoodIntake list with FAB.
  2. Settings – shows a page with one button: "Delete All Data". When pressed, all FoodIntake data for this user is deleted, and the user is logged out and redirected back to the login screen.

Simplified App Flow for LLM :
Login Screen (anonymous Supabase login) → Home Screen (list of FoodIntake + FAB) → FAB pressed (add new FoodIntake) → New FoodIntake displayed as card → Tap on card → Modal opens with nutrient details (scrollable) → Bottom Nav Bar (switch between Home and Settings) → Settings (button to delete all data and return to login).
