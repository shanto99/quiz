import { Query } from "react-native-appwrite";
import { databases, DB_ID, getImageUrl, QUESTIONS_COL, QUIZ_FUNCTION_URL } from "./appwrite";

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

/**
 * Fetch questions for a specific category via the Appwrite Function URL.
 */
export async function fetchQuestionsByCategory(categoryId: string, limit = 5): Promise<QuizQuestion[]> {
    const url = `${QUIZ_FUNCTION_URL}?categoryId=${encodeURIComponent(categoryId)}&limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch questions (HTTP ${response.status})`);
    }
    const json = await response.json();
    // The function returns { questions: [...] }
    const raw: Question[] = Array.isArray(json.questions) ? json.questions : [];
    return raw.map(toQuizQuestion);
}
