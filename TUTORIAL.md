# 1. Introduction

👉 [GitHub Repo](https://github.com/vlmoon99/health_care_app)

The main idea of this tutorial is to provide all the necessary information about technologies and how to use them to **create apps as fast as possible**.

This tutorial focuses on **creating a fast prototype** that solves only one specific problem.

When this problem is solved, you can **split the code, add new features, and build a solid application**.

Our tutorial topic is **Food Analyzer App**.

**Before you start building your app**, make sure you are **already registered on [Supabase](https://supabase.com/)** and have **created your first free project**.

---

# 2. Tech Stack

**Backend**: TypeScript, Supabase (PostgreSQL, Supabase Edge Functions)
**Frontend**: Vanilla JS, React, TailwindCSS, Vite, PWA
**AI**: LLM from Google, OpenAI, and other AI providers

---

# 3. First Step (Domain Models & Use Cases)

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

# 4. Second Step (SQL Scripts)

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

# 5. Third Step (Create UI Mock Prototype)

Before we write any backend or integration between UI and backend, we first create the **UI mock**.

Why?

* Having a full mocked UI helps you **mentally** – you already see a working app, even if there is no backend.
* You can show the concept to **early investors** and **potential customers**.
* It is easier to **split the work**:

  1. Create UI mock → fix UI bugs
  2. Create backend → fix backend bugs
  3. Connect backend with UI → fix integration bugs
* If you try to do everything at once (UI + backend + integration), you will face many problems in 3 layers at the same time.

It is also ok to write backend first. But my advice:

* **First create mock UI**
* **Then backend**
* **Then integration**

---

Before we build the UI mock or connect to the backend, we need to **scaffold our frontend app**.
We’ll use **Vite** for fast development and **Tailwind CSS** (via the new Vite plugin) for styling.

👉 [Vite Official docs](https://vite.dev/guide/#scaffolding-your-first-vite-project)
👉 [TailwindCSS Ofiicial docs](https://tailwindcss.com/docs/installation/using-vite)

---

## Step 1 – Create the Vite Project

Run:

```bash
npm create vite@latest food-analyzer-app
cd food-analyzer-app
```

Choose:

* **Framework**: Vanilla
* **Variant**: JavaScript

---

## Step 2 – Install Tailwind CSS

Install Tailwind with the official **Vite plugin**:

```bash
npm install tailwindcss @tailwindcss/vite
```

---

## Step 3 – Configure Tailwind in Vite

Edit your **`vite.config.js`** to add the plugin:

```js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```

---

## Step 4 – Import Tailwind in CSS

Open **`src/index.css`** and add:

```css
@import "tailwindcss";
```

---

## Step 5 – Run Dev Server

Start the project:

```bash
npm run dev
```


### Prompt for LLM

We will use this prompt to generate the UI mock:

============= Prompt for LLM Start =============

```
Create me the UI mock without any server calls, but with fully functional mocked business logic. Write all code using Vanila JS,React,TailwindCSS. Result must be one App.jsx file with all code inside it, following a modular approach for future decomposing and scaling functionality.

```

---

### App Flow

* **Start Screen**: Anonymous login with Supabase (simple login button). After pressing login, user is redirected to Home screen.
* **Home Screen**: Displays a list of FoodIntake cards. Each card shows short details like image (if uploaded), description, and created\_at timestamp.
* **Floating Action Button (FAB)**: Positioned at the bottom right. When tapped, user can add a new FoodIntake by uploading an image, writing a description, or both. The system processes it and appends the new entry to the list.
* **FoodIntake Card Interaction**: When a user taps a card, a modal window opens showing full nutrient details. Modal can be scrolled vertically to view all nutrient data (calories, protein, carbs, fats, etc.).
* **Bottom Navigation Bar**: Contains two tabs:

  1. Home (default) – shows FoodIntake list with FAB.
  2. Settings – shows a page with one button: "Delete All Data". When pressed, all FoodIntake data for this user is deleted, and the user is logged out and redirected back to login.

**Simplified App Flow for LLM**:
`Login Screen (anonymous Supabase login) → Home Screen (list of FoodIntake + FAB) → FAB pressed (add new FoodIntake) → New FoodIntake displayed as card → Tap on card → Modal opens with nutrient details (scrollable) → Bottom Nav Bar (switch between Home and Settings) → Settings (button to delete all data and return to login)`

---

### Domain Models

#### User

* **Attributes** (from Supabase `auth.users`)
* **Relationships**: has many **FoodIntakes**

#### FoodIntake

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

### Use Cases

#### 1. User Login

* **Who**: User (anonymous)
* **Steps**:

  1. Press "Login" button
  2. System logs in with Supabase
  3. Redirect to Home screen

---

#### 2. Add Food Intake

* **Who**: Logged-in User
* **Steps**:

  1. Press FAB
  2. Add image, description, or both
  3. System processes input (optional: recognition/NLP)
  4. New FoodIntake object created

---

#### 3. Store Food Intake

* **Who**: System
* **Steps**:

  1. Save FoodIntake in database (linked to user)
  2. Save image in Supabase Storage (if provided)
  3. Show new card on Home screen

---

#### 4. View Food Intake Details

* **Who**: Logged-in User
* **Steps**:

  1. Tap FoodIntake card
  2. Modal opens with nutrient data (scrollable)

---

#### 5. Delete All Data

* **Who**: Logged-in User
* **Steps**:

  1. Press "Delete All Data" in Settings
  2. System deletes all FoodIntakes and images
  3. Log out user
  4. Redirect to Login screen

============= Prompt for LLM End =============

---

# 6. Fourth Step (Create the Backend)

In this tutorial, we will write the backend **fully using PostgreSQL and Supabase Edge Functions**.
This approach is extremely powerful because it allows us to minimize or even completely eliminate traditional backend code and infrastructure.

Supabase provides two major pillars for building the backend:

1. **PostgreSQL** – all data storage, CRUD operations, and business rules (via SQL, triggers, RLS, and functions).
2. **Supabase Edge Functions** – serverless functions for custom logic that cannot be expressed directly in SQL.

---

## PostgreSQL as the Backend

PostgreSQL is not just a database – it’s a complete **application backend engine**.
With its support for:

* **CRUD Operations** (Create, Read, Update, Delete) – all managed via SQL queries.
* **Functions & Triggers** – logic can be embedded directly in the database (example: automatically updating timestamps).
* **Row-Level Security (RLS) Policies** – restrict access to data at the row level, ensuring users can only access their own records.
* **Indexes** – for performance optimization on frequently queried fields.

When combined with Supabase, PostgreSQL becomes a **full backend replacement** for apps that mainly perform CRUD operations or basic analytics.

📌 Supabase exposes a **PostgREST API** automatically on top of your tables.
This means you don’t even need to write a backend API – you can directly perform RESTful requests to your tables with RLS policies applied securely.

**Example:**

* `GET /rest/v1/food_intakes` → returns the authenticated user’s food intake records.
* `POST /rest/v1/food_intakes` → inserts a new record (with RLS ensuring ownership).

This approach allows you to **skip writing a separate backend service** and rely entirely on database logic + Supabase’s auto-generated API.

---

## Supabase Edge Functions

Even though PostgreSQL is powerful, sometimes your logic is too complex or requires integrations outside the database.
For these cases, we use **Supabase Edge Functions**.

### What are Edge Functions?

* Edge Functions are **serverless functions** that run in **Deno environments**.
* They are perfect for handling custom logic like:

  * Image processing
  * AI/ML integrations
  * Third-party API calls
  * Complex data analysis that goes beyond SQL

### Difference Between Environments

* **Deno Environment** (used by Supabase Edge Functions):

  * Secure by default (no file system or network unless explicitly allowed).
  * Uses modern JavaScript/TypeScript with native ES modules.
  * Built-in TypeScript support.
* **Node.js Environment**:

  * Widely used in backend development.
  * Has a large ecosystem of NPM libraries.
  * Not as secure by default, requires external security measures.
* **Web Environment** (Browser):

  * Runs in users’ browsers with many restrictions (no file system, limited network).
  * Designed for UI logic, not backend logic.

Understanding these differences is important: Supabase Edge Functions run on **Deno**, not Node.js.

---

## How to Create Supabase Edge Functions

1. **Initialize Supabase in your project**

   ```bash
   npx supabase init
   ```

2. **Login and link your project**

   ```bash
   npx supabase login
   npx supabase link --project-ref "your-project-id"
   ```

3. **Create your first function**

   ```bash
   npx supabase functions new my-function
   ```

4. **Run it locally (requires Docker)**

   ```bash
   supabase functions serve
   ```

5. **Deploy it online**

   ```bash
   supabase functions deploy my-function
   ```

📖 You can read more in the official docs:
[Supabase Functions CLI Reference](https://supabase.com/docs/reference/cli/supabase-functions)

---

## Example Function

You can see a practical example of using Supabase Edge Functions in this open-source project:
👉 [Food Analyzer Example](https://github.com/vlmoon99/health_care_app/blob/main/supabase/functions/analyze_food/index.ts)

This function analyzes food images and extracts nutritional data.
You should follow a similar approach when creating your own functions.

---

# 7. Fifth Step (Connect the Backend into UI)

This step connects our **mocked UI** into the **backend**.
We need to provide to the LLM all necessary files and context, so it understands how to integrate the UI with Supabase (PostgreSQL + Edge Functions).

What to provide:

1. **Mocked UI** – The fully working mock you already tested and debugged.
2. **Supabase Edge Functions** – The custom functions you wrote for data processing.
3. **Database SQL Script** – All your tables, row-level security (RLS) policies, and SQL functions (if any are used in the UI).
4. **Domain Models & Use Cases** – Optional, but helps the LLM better understand your business logic.

---

## Why this step is important

* The LLM must understand **how your data looks** and **how your backend works**.
* With this knowledge, it can **connect UI → Supabase → Database** correctly.
* The result will be a **single working frontend file** that you can later split into modules for scaling.

---

## Prompt for LLM

```
============= Prompt for LLM Start =============

You need to connect the Backend as Supabase Edge Functions and PostgreSQL structure into my UI based on my business logic and domain logic. Your context is:

1. Domain Models & Use Cases (paste your data here)
2. Mocked UI app code (paste your data here)
3. Supabase Edge Functions & PostgreSQL tables + RLS + functions if some exist and I want to use them in the UI (paste your data here)

Result must be one App.jsx file with all code inside it, following a modular approach for future decomposing and scaling functionality.

============= Prompt for LLM End =============
```

---

# 8. Sixth Step (Optimize App, Add Native Features, Add PWA)

This step is optional.
At this point, you already have a ready-to-use app that you can show to potential customers.
But some optimization and improvements can make your app look much better and more “native-like” for the users.

---

## 1. Optimize the App

* Open the **browser dev console**
* Analyze all network calls
* Check if you see any **duplication** or **extra requests**
* Fix and optimize your code so your app uses less network traffic

This will make your app **faster** and save bandwidth for your users.

---

## 2. Add Native-like Features

Adding small things like **vibration feedback** can make your app feel like a real native app.

```js
const NativeFeatures = {
  vibrate(pattern = 100) {
    if (this.canVibrate()) {
      return navigator.vibrate(pattern);
    }
    console.warn("Vibration API not supported on this device.");
    return false;
  },

  canVibrate() {
    return "vibrate" in navigator;
  },
};

// Example usage:
NativeFeatures.vibrate(15);  // light vibration
NativeFeatures.vibrate(40);  // medium vibration
NativeFeatures.vibrate(100); // heavy vibration
```

---

## 3. Add PWA Support

Next, you can transform your app into a **PWA (Progressive Web App)**.
This will give offline mode and extra features like installable app on mobile.

* Vite docs: [https://vitejs.dev/](https://vitejs.dev/)
* Vite PWA plugin docs: [https://vite-pwa.org/](https://vite-pwa.org/)

### Install PWA plugin for Vite

```bash
npm install -D vite-plugin-pwa
```

### Configure in `vite.config.js`

```js
// Import plugin
import { VitePWA } from 'vite-plugin-pwa'

// Add inside defineConfig
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: [
    'favicon.ico',
    'apple-touch-icon-180x180.png',
    'logo.svg'
  ],
  manifest: {
    name: 'Food Analyzer',
    short_name: 'Food Analyzer',
    description: 'Food analyzer',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    orientation: 'portrait',
    icons: [
      { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
      { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
    ]
  },
  devOptions: {
    enabled: true
  }
})
```

---

## 4. Generate Assets from Logo

You need your app logo (best format is **SVG**).
From this one SVG you can generate all needed icons for the PWA.

### Install assets generator

```bash
npm install -D @vite-pwa/assets-generator
```

### Generate assets

Put your logo at `public/logo.svg` and run:

```bash
pwa-assets-generator --preset minimal-2023 public/logo.svg
```

Check the generated files and update paths in your Vite PWA config.

---

## 5. Test Before Deploy

You can use **ngrok** to expose your local app to the internet and test it on other devices.
Docs: [https://ngrok.com/docs/getting-started/](https://ngrok.com/docs/getting-started/)

---

# 9. Seventh Step (Deploy App)

This step makes your **frontend app public on the internet**.
We’ll use **Vercel** because it’s free, simple, and works well with **Vite + React + Tailwind**.

---

## Steps

1. Go to 👉 [https://vercel.com/](https://vercel.com/)
2. Register a **free account** (you can log in with your GitHub).
3. Connect your **GitHub account**.
4. Select the **client folder** of your app.
5. Deploy it and get your **live link** to the app.

---

## Notes about Supabase

* Supabase is **already deployed automatically** when you create the project on [supabase.com](https://supabase.com/).
* You don’t need to deploy anything extra for the backend.
* Later, if your app gets popular, you can switch to a **paid Supabase plan** for better performance.

---

# 10. Eighth Step (Tell About This App to Friends and Potential Clients)

Now, when your app is **deployed**, it’s time to share it with the real world.

---

## Steps

1. Show your app to **friends, family, or potential clients**.
2. Get the **first feedback** and observe how users interact with your app.
3. Analyze the data and feedback.
4. Keep **improving and building** your app based on real user responses.

