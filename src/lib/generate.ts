import { GoogleGenerativeAI } from "@google/generative-ai"
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generate = async ({ input, selectedTemplate }) => {
  try {
    const template =
      "{syntax} - {instructions} learn from syntax above and write {template} in mermaid syntax about {input}?";

    const prompt = template
      .replace("{template}", selectedTemplate)
      .replace("{input}", input)
      .replace("{syntax}", "Defined syntax from documentation")
      .replace(
        "{instructions}",
        `
        - use different shapes, colors, and also use icons when possible.
        - strict rules: do not add Note and do not explain the code and do not add any additional text except code.
        - do not use 'end' syntax.
        - do not use any parenthesis inside block.
      `
      );

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    console.error("gemini:debug", e);
    throw e;
  }
};
