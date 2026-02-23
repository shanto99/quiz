import { CATEGORIES_COL, databases, DB_ID } from "./appwrite";

// ─── Type matching the Appwrite categories collection ─────────────────────────
export type Category = {
    $id: string;
    name: string;
    icon?: string;
    color?: string;
    description?: string;
};

/**
 * Fetch all categories from the Appwrite categories collection.
 */
export async function fetchCategories(): Promise<Category[]> {
    const res = await databases.listDocuments(DB_ID, CATEGORIES_COL);
    return res.documents as unknown as Category[];
}
