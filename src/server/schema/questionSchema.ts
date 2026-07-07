import { z } from "zod"
export const questionSchema = z.object({
    text: z.string(),
    explanation: z.string(),
    options: z.array(z.object({
        text: z.string(),
        isCorrect: z.boolean()
    }))
})


/*
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
                */