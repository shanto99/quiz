import { Query } from "react-native-appwrite";
import { databases, DB_ID, getImageUrl, QUESTIONS_COL } from "./appwrite";

// ─── Type matching the Appwrite collection ────────────────────────────────────
export type Question = {
    $id: string;
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_index: number;
    explanation: string;
    image_id: string | null;
    category?: string;
    difficulty?: string;
};

// ─── Normalised shape used inside the app ─────────────────────────────────────
export type QuizQuestion = {
    id: string;
    question: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation: string;
    image: string | null;   // resolved URL or null
};

function toQuizQuestion(doc: Question): QuizQuestion {
    return {
        id: doc.$id,
        question: doc.question,
        options: [doc.option_a, doc.option_b, doc.option_c, doc.option_d],
        correctIndex: doc.correct_index,
        explanation: doc.explanation,
        image: doc.image_id ? getImageUrl(doc.image_id) : null,
    };
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Fetch up to `limit` random questions from the Appwrite collection.
 * If fewer questions exist than `limit`, all available are returned.
 */
export async function fetchRandomQuestions(limit = 5): Promise<QuizQuestion[]> {
    const res = await databases.listDocuments(DB_ID, QUESTIONS_COL, [
        Query.limit(100), // fetch up to 100 then shuffle client-side
    ]);

    const docs = res.documents as unknown as Question[];
    const shuffled = shuffle(docs);
    const picked = shuffled.slice(0, Math.min(limit, shuffled.length));
    return picked.map(toQuizQuestion);
}
