"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RecipeFlowchart from "./recipe-flowchart"
import RecipeTasks from "./recipe-tasks"

interface RecipeDisplayProps {
  recipeData: {
    title: string
    description: string
    ingredients: string[]
    steps: {
      id: string
      description: string
    }[]
    flowchart: string
  }
}

export default function RecipeDisplay({ recipeData }: RecipeDisplayProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Card className="bg-white">
      <CardHeader className="bg-green-50 rounded-t-lg">
        <CardTitle className="text-2xl text-green-800">{recipeData.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="flowchart">Flowchart</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-2">Description</h3>
              <p className="text-gray-700">{recipeData.description}</p>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">Ingredients</h3>
              <ul className="list-disc pl-5 space-y-1">
                {recipeData.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-700">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="flowchart">
            <RecipeFlowchart flowchart={recipeData.flowchart} />
          </TabsContent>

          <TabsContent value="tasks">
            <RecipeTasks steps={recipeData.steps} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
