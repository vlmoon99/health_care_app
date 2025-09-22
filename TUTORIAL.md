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