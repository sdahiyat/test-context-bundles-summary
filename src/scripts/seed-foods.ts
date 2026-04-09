import * as dotenv from 'dotenv'
import * as path from 'path'

// Load env vars from .env.local first, then .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

import { createClient } from '@supabase/supabase-js'
import { SEED_FOODS } from '../data/foods-seed'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing required environment variables:')
  if (!supabaseUrl) console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  if (!serviceRoleKey) console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  console.error('\nMake sure .env.local is configured. See .env.example for reference.')
  process.exit(1)
}

const adminClient = createClient(supabaseUrl, serviceRoleKey)

const BATCH_SIZE = 50

export async function seedFoods(): Promise<void> {
  console.log('🌱 Starting food database seeding...')
  console.log(`   Total foods to seed: ${SEED_FOODS.length}`)

  // Check if foods already exist
  const { count, error: countError } = await adminClient
    .from('foods')
    .select('*', { count: 'exact', head: true })

  if (countError) {
    console.error('❌ Error checking existing foods:', countError.message)
    console.error('   Make sure the foods table exists (run Task 1 migration first).')
    process.exit(1)
  }

  if (count && count > 0) {
    console.log(`⚠️  Foods table already contains ${count} records.`)
    const shouldContinue = process.argv.includes('--force')
    if (!shouldContinue) {
      console.log('   Skipping seed. Use --force flag to re-seed.')
      console.log('   Example: npm run seed:foods -- --force')
      process.exit(0)
    }
    console.log('   --force flag detected. Clearing existing foods and re-seeding...')
    const { error: deleteError } = await adminClient.from('foods').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (deleteError) {
      console.error('❌ Error clearing existing foods:', deleteError.message)
      process.exit(1)
    }
    console.log('   ✓ Existing foods cleared.')
  }

  // Insert in batches
  let totalInserted = 0
  const batches = Math.ceil(SEED_FOODS.length / BATCH_SIZE)

  for (let i = 0; i < batches; i++) {
    const batch = SEED_FOODS.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE)
    const batchNumber = i + 1

    console.log(`   Inserting batch ${batchNumber}/${batches} (${batch.length} foods)...`)

    const { data, error } = await adminClient
      .from('foods')
      .insert(
        batch.map(food => ({
          name: food.name,
          category: food.category,
          calories_per_100g: food.calories_per_100g,
          protein_per_100g: food.protein_per_100g,
          carbs_per_100g: food.carbs_per_100g,
          fat_per_100g: food.fat_per_100g,
          fiber_per_100g: food.fiber_per_100g,
          serving_size_g: food.serving_size_g,
          serving_unit: food.serving_unit,
        }))
      )
      .select()

    if (error) {
      console.error(`❌ Error inserting batch ${batchNumber}:`, error.message)
      console.error('   Details:', error)
      process.exit(1)
    }

    totalInserted += data?.length ?? 0
    console.log(`   ✓ Batch ${batchNumber} inserted (${data?.length ?? 0} rows)`)
  }

  console.log(`\n✅ Seeding complete! Inserted ${totalInserted} foods.`)

  // Verify by category
  const { data: categories, error: catError } = await adminClient
    .from('foods')
    .select('category')

  if (!catError && categories) {
    const categoryCounts = categories.reduce((acc: Record<string, number>, row) => {
      acc[row.category] = (acc[row.category] || 0) + 1
      return acc
    }, {})

    console.log('\n📊 Foods by category:')
    Object.entries(categoryCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([cat, count]) => {
        console.log(`   ${cat}: ${count}`)
      })
  }
}

seedFoods()
