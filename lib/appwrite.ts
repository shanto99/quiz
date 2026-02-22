import { Account, Client, Databases, Storage } from "react-native-appwrite";

const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// ─── Convenience constants ────────────────────────────────────────────────────
export const DB_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
export const QUESTIONS_COL = process.env.EXPO_PUBLIC_APPWRITE_QUESTIONS_COLLECTION_ID!;
export const BUCKET_ID = "question-images";

/** Build a direct-view URL for a file stored in Appwrite Storage */
export function getImageUrl(fileId: string): string {
    return (
        `${process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}` +
        `/files/${fileId}/view?project=${process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID}`
    );
}
