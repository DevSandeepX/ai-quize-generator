import { prisma } from "@/lib/db";


type QuestionInput = {
    text: string;
    explanation?: string;
    options: {
        text: string;
        isCorrect: boolean;
    }[];
};

export async function createQuestionsDB(
    questions: QuestionInput[],
    { quizId }: { quizId: string }
) {
    await prisma.$transaction(
        questions.map((question) =>
            prisma.question.create({
                data: {
                    quizId,
                    text: question.text,
                    explanation:
                        question.explanation,

                    options: {
                        create:
                            question.options.map(
                                (option) => ({
                                    text: option.text,
                                    isCorrect:
                                        option.isCorrect,
                                })
                            ),
                    },
                },
            })
        )
    );
}