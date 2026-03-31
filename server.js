import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/generate", async (req, res) => {
  try {
    const { prompt, framework } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Act as a senior frontend engineer and UI/UX designer who builds modern, production-ready web components.

CRITICAL OUTPUT RULES (must follow strictly):
1. Always return a COMPLETE HTML document with <html>, <head>, and <body>.
2. Return ONLY the final code inside ONE Markdown fenced code block.
3. Do NOT include explanations, comments, apologies, or extra text outside the code block.

STYLING & FRAMEWORK RULES:
- If Tailwind CSS is used, you MUST include the official Tailwind CDN inside <head>.
- If Bootstrap is used, you MUST include Bootstrap CSS and Bootstrap JS CDN inside <head>.
- If plain HTML + CSS is used, include all CSS inside a <style> tag in <head>.
- Do NOT assume any external setup or build tools.
- The output MUST work directly when opened in a browser.

DESIGN & QUALITY REQUIREMENTS:
- Use modern UI/UX principles.
- Apply a clean color palette, gradients where suitable, and modern typography.
- Add smooth hover effects, subtle animations, and proper spacing.
- Ensure full responsiveness for mobile, tablet, and desktop.
- The component must look polished, stylish, and production-ready (not basic or raw HTML).

ACCESSIBILITY & STRUCTURE:
- Use semantic HTML elements where applicable.
- Maintain clean, readable, and well-structured code.
- Avoid unnecessary complexity.

USER REQUEST:
${prompt}

FRAMEWORK TO USE:
${framework}
    
Generate only the final UI component code.
`});
    res.json({ text: response.text });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));