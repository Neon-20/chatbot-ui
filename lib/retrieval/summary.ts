"use server"
import OpenAI from "openai"
import { checkApiKey, getServerProfile } from "../server/server-chat-helpers"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"

export async function genSummary(text: string | undefined) {
  if (!text) {
    return "No data provided"
  }
  const profile = await getServerProfile()
  const prompt = `Please provide a concise summary of the following data.
  Focus on the key points, trends, and any significant insights or findings that are evident from the data. The summary should be clear and easily understandable to someone who is not familiar with the data: `

  checkApiKey(profile.azure_openai_api_key, "Azure OpenAI")

  const ENDPOINT = profile.azure_openai_endpoint
  const KEY = profile.azure_openai_api_key

  let DEPLOYMENT_ID = profile.azure_openai_35_turbo_id

  if (!ENDPOINT || !KEY || !DEPLOYMENT_ID) {
    return (
      JSON.stringify({ message: "Azure resources not found" }),
      {
        status: 400
      }
    )
  }

  const azureOpenai = new OpenAI({
    apiKey: KEY,
    baseURL: `${ENDPOINT}/openai/deployments/${DEPLOYMENT_ID}`,
    defaultQuery: { "api-version": "2023-12-01-preview" },
    defaultHeaders: { "api-key": KEY }
  })

  const response = await azureOpenai.chat.completions.create({
    model: DEPLOYMENT_ID as ChatCompletionCreateParamsBase["model"],
    messages: [
      { role: "user", content: prompt },
      { role: "user", content: text }
    ]
  })
  if (typeof response.choices[0].message.content == "string") {
    return response.choices[0].message.content
  }
  return "Error generating summary"
}

export async function genSuggestions(userQuery: string | undefined) {
  if (!userQuery) {
    return ["No data provided"]
  }

  const profile = await getServerProfile()
  const prompt = `Based on the user's current query, suggest some potential follow-up questions or related topics they might be interested in. The suggestions should be relevant, and encourage deeper exploration of the subject matter. the suggestions should be an array of strings with variable name 'suggestions'`

  checkApiKey(profile.azure_openai_api_key, "Azure OpenAI")

  const ENDPOINT = profile.azure_openai_endpoint
  const KEY = profile.azure_openai_api_key

  let DEPLOYMENT_ID = profile.azure_openai_35_turbo_id

  if (!ENDPOINT || !KEY || !DEPLOYMENT_ID) {
    return ["Azure resources not found"]
  }

  const azureOpenai = new OpenAI({
    apiKey: KEY,
    baseURL: `${ENDPOINT}/openai/deployments/${DEPLOYMENT_ID}`,
    defaultQuery: { "api-version": "2023-12-01-preview" },
    defaultHeaders: { "api-key": KEY }
  })

  const response = await azureOpenai.chat.completions.create({
    model: DEPLOYMENT_ID as ChatCompletionCreateParamsBase["model"],
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that extracts data and returns it in JSON format."
      },
      { role: "user", content: prompt },
      { role: "user", content: userQuery }
    ],
    response_format: {
      type: "json_object"
    }
  })

  if (typeof response.choices[0].message.content == "string") {
    const res = response.choices[0].message.content
    const suggestions: string[] = JSON.parse(res).suggestions
    return suggestions
  }

  return ["Error generating suggestions"]
}
