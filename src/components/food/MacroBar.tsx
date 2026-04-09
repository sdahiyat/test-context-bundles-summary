'use client'

interface MacroBarProps {
  protein: number
  carbs: number
  fat: number
  calories: number
  showLabels?: boolean
}

export default function MacroBar({
  protein,
  carbs,
  fat,
  calories,
  showLabels = false,
}: MacroBarProps) {
  const proteinCals = protein * 4
  const carbCals = carbs * 4
  const fatCals = fat * 9
  const totalCals = proteinCals + carbCals + fatCals

  const isEmpty = totalCals === 0

  const proteinPct = isEmpty ? 0 : Math.round((proteinCals / totalCals) * 100)
  const carbPct = isEmpty ? 0 : Math.round((carbCals / totalCals) * 100)
  // Use remainder to avoid rounding issues summing to != 100
  const fatPct = isEmpty ? 0 : 100 - proteinPct - carbPct

  return (
    <div className="w-full">
      <p className="text-xs text-gray-500 mb-1">
        Calories: <span className="font-medium text-gray-700">{calories} kcal</span>
      </p>

      {isEmpty ? (
        <div className="h-3 w-full rounded-full bg-gray-200" />
      ) : (
        <div className="flex h-3 w-full rounded-full overflow-hidden">
          <div
            className="bg-blue-500 transition-all duration-300"
            style={{ width: `${proteinPct}%` }}
            title={`Protein: ${protein}g (${proteinPct}%)`}
          />
          <div
            className="bg-amber-500 transition-all duration-300"
            style={{ width: `${carbPct}%` }}
            title={`Carbs: ${carbs}g (${carbPct}%)`}
          />
          <div
            className="bg-red-500 transition-all duration-300"
            style={{ width: `${fatPct}%` }}
            title={`Fat: ${fat}g (${fatPct}%)`}
          />
        </div>
      )}

      {showLabels && (
        <div className="flex justify-between mt-1.5 text-xs">
          <span className="flex items-center gap-1 text-blue-600">
            <span className="inline-block w-2 h-2 rounded-sm bg-blue-500" />
            Protein {protein}g
          </span>
          <span className="flex items-center gap-1 text-amber-600">
            <span className="inline-block w-2 h-2 rounded-sm bg-amber-500" />
            Carbs {carbs}g
          </span>
          <span className="flex items-center gap-1 text-red-600">
            <span className="inline-block w-2 h-2 rounded-sm bg-red-500" />
            Fat {fat}g
          </span>
        </div>
      )}
    </div>
  )
}
