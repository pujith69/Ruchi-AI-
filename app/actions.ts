"use server"

import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export async function generateRecipe(query: string, preferences = "") {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      throw new Error("Groq API key is missing. Please check your environment variables.")
    }

    const prompt = `
You are a professional chef and recipe creator. Create a detailed recipe based on the following request: "${query}"
${preferences ? `Consider these dietary preferences/restrictions: ${preferences}` : ""}

You MUST respond with ONLY a valid JSON object in the following format without any additional text, markdown formatting, or code blocks:

{
  "title": "Recipe Title",
  "description": "A brief description of the dish",
  "ingredients": ["Ingredient 1 with quantity", "Ingredient 2 with quantity"],
  "steps": [
    {"id": "step1", "description": "First step description"},
    {"id": "step2", "description": "Second step description"}
  ],
  "flowchart": "graph TD;\\nA[\\\"Start\\\"] --> B[\\\"Step 1\\\"];\\nB --> C[\\\"Step 2\\\"];\\nC --> D[\\\"Serve and enjoy\\\"];"
}

The flowchart MUST be valid mermaid syntax with proper escaping of quotes. Use double backslashes before quotes in the flowchart string.
DO NOT include any explanations, just return the JSON object.
`

    console.log("Sending prompt to Groq API...")

    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant", { apiKey }),
      prompt,
      temperature: 0.5, // Lower temperature for more consistent formatting
      maxTokens: 2000,
    })

    console.log("Received response from Groq API")

    // Try to extract JSON from the response
    let jsonData

    try {
      // First attempt: Try to parse the entire response as JSON
      jsonData = JSON.parse(text.trim())
      console.log("Successfully parsed response as JSON directly")
    } catch (parseError) {
      console.log("Direct JSON parsing failed, trying to extract JSON from text")

      try {
        // Second attempt: Try to extract JSON using regex
        const jsonRegex = /\{[\s\S]*\}/
        const match = text.match(jsonRegex)

        if (!match) {
          console.log("Failed to find JSON pattern in response")
          throw new Error("Could not extract JSON from response")
        }

        jsonData = JSON.parse(match[0])
        console.log("Successfully extracted and parsed JSON using regex")
      } catch (extractError) {
        console.error("JSON extraction failed:", extractError)

        // Create a fallback response if parsing fails
        console.log("Creating fallback recipe response")
        return createFallbackRecipe(query, preferences)
      }
    }

    // Validate the parsed data has the required fields
    if (!jsonData.title || !jsonData.steps || !jsonData.ingredients || !jsonData.flowchart) {
      console.log("JSON missing required fields, using fallback")
      return createFallbackRecipe(query, preferences)
    }

    return jsonData
  } catch (error) {
    console.error("Error generating recipe:", error)
    throw error
  }
}

// Fallback function to create a basic recipe when parsing fails
function createFallbackRecipe(query: string, preferences: string) {
  const title = `Recipe for ${query}`
  const description = `A delicious ${query} recipe${preferences ? ` (${preferences})` : ""}`

  return {
    title,
    description,
    ingredients: ["Ingredients could not be generated automatically", "Please try again with a different query"],
    steps: [
      { id: "step1", description: "Recipe steps could not be generated automatically" },
      { id: "step2", description: "Please try again with a different query" },
    ],
    flowchart: `graph TD;
      A["Start"] --> B["Prepare ingredients"];
      B --> C["Cook ${query}"];
      C --> D["Serve and enjoy"];`,
  }
}
