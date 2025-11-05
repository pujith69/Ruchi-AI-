"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { generateRecipe } from "@/app/actions"
import RecipeDisplay from "./recipe-display"
import { Loader2 } from "lucide-react"

export default function RecipeForm() {
  const [recipeQuery, setRecipeQuery] = useState("")
  const [preferences, setPreferences] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recipeData, setRecipeData] = useState<any>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!recipeQuery.trim()) {
      toast({
        title: "Please enter a recipe query",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await generateRecipe(recipeQuery, preferences)
      setRecipeData(result)
      toast({
        title: "Recipe generated!",
        description: `Enjoy your ${result.title}`,
      })
    } catch (error) {
      console.error("Recipe generation error:", error)
      toast({
        title: "Error generating recipe",
        description: "Please try again with a different query",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipe-query">What would you like to cook?</Label>
              <Input
                id="recipe-query"
                placeholder="e.g., vegetarian pasta, quick breakfast, chocolate cake..."
                value={recipeQuery}
                onChange={(e) => setRecipeQuery(e.target.value)}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferences">Any dietary preferences or restrictions? (optional)</Label>
              <Textarea
                id="preferences"
                placeholder="e.g., gluten-free, low-carb, no nuts..."
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                className="bg-white"
              />
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Recipe...
                </>
              ) : (
                "Generate Recipe"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {recipeData && <RecipeDisplay recipeData={recipeData} />}
    </div>
  )
}
