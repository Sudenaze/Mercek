import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure the API key is available in the environment
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY environment variable. Please check your .env file.");
}

// Initialize the Gemini API client
export const genAI = new GoogleGenerativeAI(apiKey);

// We will use the 'gemini-2.5-flash' model for fast text processing as a default
export const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
