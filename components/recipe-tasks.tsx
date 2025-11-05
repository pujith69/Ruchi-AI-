"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface RecipeTasksProps {
  steps: {
    id: string
    description: string
  }[]
}

export default function RecipeTasks({ steps }: RecipeTasksProps) {
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => (prev.includes(id) ? prev.filter((stepId) => stepId !== id) : [...prev, id]))
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg mb-2">Step-by-Step Instructions</h3>
      <div className="space-y-3">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-start space-x-3 p-3 rounded-md transition-colors ${
              completedSteps.includes(step.id) ? "bg-green-50" : "bg-gray-50"
            }`}
          >
            <Checkbox
              id={step.id}
              checked={completedSteps.includes(step.id)}
              onCheckedChange={() => toggleStep(step.id)}
              className="mt-1"
            />
            <Label
              htmlFor={step.id}
              className={`text-gray-700 cursor-pointer ${
                completedSteps.includes(step.id) ? "line-through text-gray-500" : ""
              }`}
            >
              {step.description}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}
