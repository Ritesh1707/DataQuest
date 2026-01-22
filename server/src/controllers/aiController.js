const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.analyzeCode = async (req, res) => {
  try {
    const { code, exercisePrompt, language } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }

    const systemPrompt = `
You are CodeSensei, an expert coding tutor. 
Your goal is to help the user improve their code without giving away the direct solution unless strictly necessary.
Focus on:
1. Syntax Errors: Explain them clearly (no jargon).
2. Logic Flaws: Point out edge cases they missed.
3. Best Practices: Suggest cleaner ways to write the code (e.g., Pythonic style).
4. Performance: If the code is efficient.

The user is working on this problem: "${exercisePrompt}"
The language is: "${language || 'python'}"

Here is the user's code:
\`\`\`
${code}
\`\`\`

Provide your response in Markdown format. Be encouraging but strict on quality.
    `;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ feedback: text });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ message: "Failed to analyze code", error: error.message });
  }
};
