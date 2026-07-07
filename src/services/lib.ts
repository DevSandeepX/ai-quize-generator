export function generateAiPrompt({
    category,
    difficulty,
    prompt,
    title,
    totalQuestions
}: {
    title: string,
    totalQuestions: number,
    difficulty: string,
    category: string,
    prompt: string
}) {
    const aiPrompt = `
You are an expert exam paper setter.

Generate exactly ${totalQuestions} ${difficulty} level MCQs.

IMPORTANT INSTRUCTIONS:
- The questions MUST be based on the quiz title and additional instructions.
- Quiz Title: "${title}"
- Category: "${category}"
- Additional Instructions:
${prompt}

STRICT RULES:
1. Every question must directly relate to "${title}".
2. Do not generate generic "${category}" questions unless they match the title and instructions.
3. If the title is "Personality Development", questions should cover only topics mentioned in the additional instructions.
4. Do not include questions from unrelated topics.
5. Generate exactly ${totalQuestions} questions.
6. Each question must have exactly 4 options.
7. Only one option can be correct.
8. Provide a short explanation.
9. Use simple language and exam-oriented questions.
10. Return ONLY valid JSON.

JSON Schema:
[
  {
    "text": "Question here",
    "explanation": "Explanation here",
    "options": [
      {
        "text": "Option A",
        "isCorrect": false
      },
      {
        "text": "Option B",
        "isCorrect": true
      },
      {
        "text": "Option C",
        "isCorrect": false
      },
      {
        "text": "Option D",
        "isCorrect": false
      }
    ]
  }
]
`;

    return aiPrompt
}