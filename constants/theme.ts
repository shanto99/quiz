// ─── App-wide colour palette ───────────────────────────────────────────────────
// Import this instead of defining a local COLORS object in every screen.
export const COLORS = {
    // Brand
    primary: "#4F46E5",
    primaryLight: "#818CF8",
    primaryFaint: "#EEF2FF",
    primaryBorder: "#C7D2FE",

    // Backgrounds
    bg: "#F0F0FA",
    white: "#FFFFFF",

    // Typography
    text: "#111827",
    textMuted: "#6B7280",

    // Feedback — correct / success
    correct: "#16A34A",
    correctLight: "#DCFCE7",
    correctBorder: "#BBF7D0",

    // Feedback — wrong / error
    wrong: "#DC2626",
    wrongLight: "#FEE2E2",
    wrongBorder: "#FECACA",

    // Neutral / disabled
    neutral: "#F3F4F6",
    neutralBorder: "#E5E7EB",

    // Input fields
    inputBorder: "#E5E7EB",
    focusBorder: "#4F46E5",
    inputBg: "#FAFAFA",
    inputFocusBg: "#F5F3FF",

    // Aliases used in auth screens
    error: "#DC2626",
    errorLight: "#FEE2E2",
} as const;

export type AppColors = typeof COLORS;
