-- ============================================================
-- NutriTrack Initial Schema Migration
-- ============================================================

-- 1. EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE
-- ============================================================
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  full_name       TEXT,
  avatar_url      TEXT,
  date_of_birth   DATE,
  gender          TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  height_cm       NUMERIC(5, 2),
  activity_level  TEXT CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active')),
  goal            TEXT CHECK (goal IN ('lose_weight', 'maintain_weight', 'gain_weight', 'gain_muscle')),
  target_calories INTEGER,
  target_protein_g INTEGER,
  target_carbs_g  INTEGER,
  target_fat_g    INTEGER,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FOODS TABLE
-- ============================================================
CREATE TABLE foods (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              TEXT NOT NULL,
  brand             TEXT,
  serving_size_g    NUMERIC(8, 2) NOT NULL DEFAULT 100,
  calories_per_100g NUMERIC(8, 2) NOT NULL,
  protein_per_100g  NUMERIC(8, 2) NOT NULL DEFAULT 0,
  carbs_per_100g    NUMERIC(8, 2) NOT NULL DEFAULT 0,
  fat_per_100g      NUMERIC(8, 2) NOT NULL DEFAULT 0,
  fiber_per_100g    NUMERIC(8, 2),
  sugar_per_100g    NUMERIC(8, 2),
  sodium_per_100mg  NUMERIC(8, 2),
  is_verified       BOOLEAN DEFAULT FALSE,
  created_by        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MEALS TABLE
-- ============================================================
CREATE TABLE meals (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  meal_type       TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  logged_at       DATE NOT NULL DEFAULT CURRENT_DATE,
  notes           TEXT,
  photo_url       TEXT,
  ai_generated    BOOLEAN DEFAULT FALSE,
  total_calories  NUMERIC(10, 2),
  total_protein_g NUMERIC(8, 2),
  total_carbs_g   NUMERIC(8, 2),
  total_fat_g     NUMERIC(8, 2),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MEAL_ITEMS TABLE
-- ============================================================
CREATE TABLE meal_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_id     UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  food_id     UUID NOT NULL REFERENCES foods(id) ON DELETE RESTRICT,
  quantity_g  NUMERIC(8, 2) NOT NULL,
  calories    NUMERIC(8, 2) NOT NULL,
  protein_g   NUMERIC(8, 2) NOT NULL DEFAULT 0,
  carbs_g     NUMERIC(8, 2) NOT NULL DEFAULT 0,
  fat_g       NUMERIC(8, 2) NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 6. WEIGHT_LOGS TABLE
-- ============================================================
CREATE TABLE weight_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg   NUMERIC(6, 2) NOT NULL,
  logged_at   DATE NOT NULL DEFAULT CURRENT_DATE,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 7. INDEXES
-- ============================================================
CREATE INDEX idx_meals_user_id         ON meals(user_id);
CREATE INDEX idx_meals_logged_at       ON meals(logged_at);
CREATE INDEX idx_meals_user_logged_at  ON meals(user_id, logged_at);
CREATE INDEX idx_meal_items_meal_id    ON meal_items(meal_id);
CREATE INDEX idx_meal_items_food_id    ON meal_items(food_id);
CREATE INDEX idx_weight_logs_user_id   ON weight_logs(user_id);
CREATE INDEX idx_weight_logs_logged_at ON weight_logs(logged_at);
CREATE INDEX idx_foods_name            ON foods USING gin(to_tsvector('english', name));
CREATE INDEX idx_foods_is_verified     ON foods(is_verified);

-- 8. UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_foods_updated_at
  BEFORE UPDATE ON foods
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_meals_updated_at
  BEFORE UPDATE ON meals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 9. AUTO-CREATE PROFILE TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 10. ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals       ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods       ENABLE ROW LEVEL SECURITY;

-- ---- profiles policies ----
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- ---- meals policies ----
CREATE POLICY "Users can view their own meals"
  ON meals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meals"
  ON meals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meals"
  ON meals FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals"
  ON meals FOR DELETE
  USING (auth.uid() = user_id);

-- ---- meal_items policies ----
CREATE POLICY "Users can view their own meal items"
  ON meal_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM meals
      WHERE meals.id = meal_items.meal_id
        AND meals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own meal items"
  ON meal_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM meals
      WHERE meals.id = meal_items.meal_id
        AND meals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own meal items"
  ON meal_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM meals
      WHERE meals.id = meal_items.meal_id
        AND meals.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM meals
      WHERE meals.id = meal_items.meal_id
        AND meals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own meal items"
  ON meal_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM meals
      WHERE meals.id = meal_items.meal_id
        AND meals.user_id = auth.uid()
    )
  );

-- ---- weight_logs policies ----
CREATE POLICY "Users can view their own weight logs"
  ON weight_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weight logs"
  ON weight_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weight logs"
  ON weight_logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weight logs"
  ON weight_logs FOR DELETE
  USING (auth.uid() = user_id);

-- ---- foods policies ----
-- Public read: anyone can browse/search foods (including anonymous visitors)
CREATE POLICY "Anyone can view foods"
  ON foods FOR SELECT
  USING (true);

-- Authenticated users can add new foods
CREATE POLICY "Authenticated users can insert foods"
  ON foods FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can only update foods they created
CREATE POLICY "Users can update their own foods"
  ON foods FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Users can only delete foods they created
CREATE POLICY "Users can delete their own foods"
  ON foods FOR DELETE
  USING (auth.uid() = created_by);

-- 11. NUTRIENT CALCULATION FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION calculate_meal_totals(p_meal_id UUID)
RETURNS TABLE (
  total_calories  NUMERIC,
  total_protein_g NUMERIC,
  total_carbs_g   NUMERIC,
  total_fat_g     NUMERIC
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    COALESCE(SUM(calories),   0) AS total_calories,
    COALESCE(SUM(protein_g),  0) AS total_protein_g,
    COALESCE(SUM(carbs_g),    0) AS total_carbs_g,
    COALESCE(SUM(fat_g),      0) AS total_fat_g
  FROM meal_items
  WHERE meal_id = p_meal_id;
$$;
