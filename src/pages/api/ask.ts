import { NextApiRequest, NextApiResponse } from "next";
import { generate } from "@/lib/generate";
import { TemplateEnum } from "@/lib/prompt-by-template";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { input, selectedTemplate = TemplateEnum.FLOWCHART } = req.body;

  if (!input) {
    return res.status(400).json({ message: "No input in the request" });
  }

  try {
    const ans = await generate({ input, selectedTemplate });

    const text = ans
      .replaceAll("```", "")
      .replaceAll(`"`, `'`)
      .replaceAll(`end[End]`, `ends[End]`)
      .replace("mermaid", "");

    return res.status(200).json({ text });
  } catch (e) {
    console.error("gemini:debug", e);
    return res.status(400).json(e);
  }
}
