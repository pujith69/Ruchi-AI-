import RecipeForm from "@/components/recipe-form"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Recipe AI Assistant</h1>
          <p className="text-green-600">Generate recipes with step-by-step instructions and visual flowcharts</p>
        </header>

        <RecipeForm />
        <Toaster />
      </div>
    </main>
  )
}
