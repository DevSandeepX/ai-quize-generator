import { prisma } from "@/lib/db";


async function main() {
    // Seed Roles
    const roles = ["ADMIN", "TEACHER", "STUDENT"];

    for (const role of roles) {
        await prisma.role.upsert({
            where: { role },
            update: {},
            create: { role },
        });
    }

    // Seed Categories
    const categories = [
        "JavaScript",
        "React",
        "Node.js",
        "Next.js",
        "TypeScript",
        "HTML",
        "CSS",
        "Python",
        "Java",
        "C++",
        "MongoDB",
        "SQL",
        "Data Structures",
        "Algorithms",
        "Machine Learning",
        "Artificial Intelligence",
        "General Knowledge",
        "Mathematics",
        "Science",
        "History",
    ];

    for (const text of categories) {
        await prisma.category.upsert({
            where: { text },
            update: {},
            create: { text },
        });
    }

    console.log("✅ Database seeded successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

