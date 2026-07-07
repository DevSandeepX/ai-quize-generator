import { generateAiPrompt } from "@/services/lib";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
    NextRequest,
    NextResponse,
} from "next/server";

const genAI =
    new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY!
    );

export async function POST(
    req: NextRequest
) {
    try {
        const {
            title,
            category,
            difficulty,
            totalQuestions,
            prompt,
        } = await req.json();

        const model =
            genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
            });

        console.log(prompt)
        const aiPrompt = generateAiPrompt({ title, category, difficulty, totalQuestions, prompt })

        const result =
            await model.generateContent(
                aiPrompt
            );

        let text =
            result.response.text();

        text = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const questions =
            JSON.parse(text);

        return NextResponse.json({
            questions,
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                message:
                    "Failed to generate quiz",
            },
            {
                status: 500,
            }
        );
    }
}