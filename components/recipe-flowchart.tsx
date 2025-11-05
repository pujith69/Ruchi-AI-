"use client"

import { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface RecipeFlowchartProps {
  flowchart: string
}

export default function RecipeFlowchart({ flowchart }: RecipeFlowchartProps) {
  const mermaidRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "forest",
      securityLevel: "loose",
    })

    if (mermaidRef.current) {
      try {
        mermaid
          .render("mermaid-svg", flowchart)
          .then(({ svg }) => {
            if (mermaidRef.current) {
              mermaidRef.current.innerHTML = svg
              setError(null)
            }
          })
          .catch((err) => {
            console.error("Mermaid rendering error:", err)
            setError("Could not render flowchart. Please try again with a different recipe.")
          })
      } catch (err) {
        console.error("Mermaid error:", err)
        setError("Could not render flowchart. Please try again with a different recipe.")
      }
    }
  }, [flowchart])

  return (
    <div className="overflow-x-auto">
      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div ref={mermaidRef} className="flex justify-center min-h-[300px]" />
      )}
    </div>
  )
}
