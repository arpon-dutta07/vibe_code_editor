import { createGoogleGenerativeAI } from "@ai-sdk/google"
import type { LanguageModel } from "ai"

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

export function getModel(): LanguageModel {
  const modelId = process.env.GEMINI_MODEL ?? "gemini-2.5-flash"
  return google(modelId)
}
