import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/theme";
import { fetchQuestionsByCategory, fetchRandomQuestions, QuizQuestion } from "../../lib/questions";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const OPTION_LABELS = ["A", "B", "C", "D"];

// ─── Explanation ──────────────────────────────────────────────────────────────
function ExplanationSection({ text }: { text: string }) {
    const [expanded, setExpanded] = useState(false);
    const animHeight = useRef(new Animated.Value(0)).current;
    const animOpacity = useRef(new Animated.Value(0)).current;

    const toggle = () => {
        const toValue = expanded ? 0 : 1;
        Animated.parallel([
            Animated.spring(animHeight, { toValue, useNativeDriver: false, speed: 20 }),
            Animated.timing(animOpacity, { toValue, duration: 250, useNativeDriver: false }),
        ]).start();
        setExpanded(!expanded);
    };

    const maxHeight = animHeight.interpolate({ inputRange: [0, 1], outputRange: [0, 300] });

    return (
        <View style={{ marginTop: 16, borderRadius: 12, overflow: "hidden", backgroundColor: COLORS.primaryFaint, borderWidth: 1, borderColor: COLORS.primaryBorder }}>
            <TouchableOpacity onPress={toggle} activeOpacity={0.8} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Ionicons name="bulb-outline" size={18} color={COLORS.primary} />
                    <Text style={{ color: COLORS.primary, fontWeight: "700", fontSize: 14 }}>Show Explanation</Text>
                </View>
                <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={18} color={COLORS.primary} />
            </TouchableOpacity>
            <Animated.View style={{ maxHeight, overflow: "hidden", opacity: animOpacity }}>
                <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
                    <View style={{ height: 1, backgroundColor: COLORS.primaryBorder, marginBottom: 10 }} />
                    <Text style={{ color: "#3730A3", fontSize: 14, lineHeight: 22 }}>{text}</Text>
                </View>
            </Animated.View>
        </View>
    );
}

// ─── Option Button ────────────────────────────────────────────────────────────
type OptionState = "default" | "correct" | "wrong" | "disabled";

function OptionButton({ label, text, state, onPress }: { label: string; text: string; state: OptionState; onPress: () => void }) {
    const bg = state === "correct" ? COLORS.correctLight : state === "wrong" ? COLORS.wrongLight : COLORS.white;
    const border = state === "correct" ? COLORS.correct : state === "wrong" ? COLORS.wrong : COLORS.neutralBorder;
    const labelBg = state === "correct" ? COLORS.correct : state === "wrong" ? COLORS.wrong : COLORS.primary;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={state === "disabled" || state === "correct" || state === "wrong"}
            activeOpacity={0.75}
            style={{ flexDirection: "row", alignItems: "center", backgroundColor: bg, borderWidth: 1.5, borderColor: border, borderRadius: 14, padding: 14, marginBottom: 10, gap: 12, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
        >
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: labelBg, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: COLORS.white, fontWeight: "800", fontSize: 13 }}>{label}</Text>
            </View>
            <Text style={{ flex: 1, fontSize: 15, color: COLORS.text, fontWeight: "500", lineHeight: 22 }}>{text}</Text>
            {state === "correct" && <Ionicons name="checkmark-circle" size={22} color={COLORS.correct} />}
            {state === "wrong" && <Ionicons name="close-circle" size={22} color={COLORS.wrong} />}
        </TouchableOpacity>
    );
}

// ─── Results screen ───────────────────────────────────────────────────────────
function ResultsScreen({ questions, answers, onRetry }: { questions: QuizQuestion[]; answers: (number | null)[]; onRetry: () => void }) {
    const score = answers.filter((a, i) => a === questions[i].correctIndex).length;
    const pct = Math.round((score / questions.length) * 100);
    const emoji = pct === 100 ? "🎉" : pct >= 60 ? "👍" : "💪";
    const message = pct === 100 ? "Perfect score!" : pct >= 60 ? "Great job!" : "Keep practising!";

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <View style={{ backgroundColor: COLORS.primary, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, paddingTop: 48, paddingBottom: 40, alignItems: "center" }}>
                <Text style={{ fontSize: 60 }}>{emoji}</Text>
                <Text style={{ color: COLORS.white, fontSize: 20, fontWeight: "700", marginTop: 10 }}>{message}</Text>
                <View style={{ flexDirection: "row", alignItems: "baseline", marginTop: 8 }}>
                    <Text style={{ color: COLORS.white, fontSize: 56, fontWeight: "900" }}>{score}</Text>
                    <Text style={{ color: COLORS.primaryLight, fontSize: 24, fontWeight: "600", marginLeft: 4 }}>/ {questions.length}</Text>
                </View>
                <Text style={{ color: COLORS.primaryLight, fontSize: 16, marginTop: 4 }}>{pct}% correct</Text>
            </View>

            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 17, fontWeight: "700", color: COLORS.text, marginBottom: 14 }}>Review</Text>
                {questions.map((q, i) => {
                    const correct = answers[i] === q.correctIndex;
                    return (
                        <View key={q.id} style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: "row", alignItems: "flex-start", gap: 12, borderWidth: 1, borderColor: correct ? COLORS.correctBorder : COLORS.wrongBorder }}>
                            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: correct ? COLORS.correctLight : COLORS.wrongLight, alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                                <Ionicons name={correct ? "checkmark" : "close"} size={16} color={correct ? COLORS.correct : COLORS.wrong} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 13, color: COLORS.text, fontWeight: "600", lineHeight: 20 }} numberOfLines={2}>{q.question}</Text>
                                <Text style={{ fontSize: 12, color: correct ? COLORS.correct : COLORS.wrong, marginTop: 3, fontWeight: "600" }}>
                                    {correct ? "Correct" : `Your answer: ${q.options[answers[i]!] ?? "Skipped"}`}
                                </Text>
                                {!correct && <Text style={{ fontSize: 12, color: COLORS.correct, marginTop: 1 }}>Correct: {q.options[q.correctIndex]}</Text>}
                            </View>
                        </View>
                    );
                })}

                <TouchableOpacity onPress={onRetry} activeOpacity={0.85} style={{ backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: "center", marginTop: 6, shadowColor: COLORS.primary, shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6 }}>
                    <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: "700" }}>🔁  Try Again</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.back()} activeOpacity={0.75} style={{ backgroundColor: COLORS.neutral, borderRadius: 16, paddingVertical: 14, alignItems: "center", marginTop: 10 }}>
                    <Text style={{ color: COLORS.textMuted, fontSize: 15, fontWeight: "600" }}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

// ─── Quiz screen ──────────────────────────────────────────────────────────────
export default function QuizScreen() {
    const { categoryId, categoryName } = useLocalSearchParams<{ categoryId?: string; categoryName?: string }>();

    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [finished, setFinished] = useState(false);

    const loadQuestions = useCallback(async () => {
        setLoading(true);
        setFetchError(null);
        setCurrentIndex(0);
        setSelectedOption(null);
        setAnswers([]);
        setFinished(false);
        try {
            const data = categoryId
                ? await fetchQuestionsByCategory(categoryId, 5)
                : await fetchRandomQuestions(5);
            if (data.length === 0) {
                setFetchError("No questions found for this category.");
            } else {
                setQuestions(data);
            }
        } catch (e: any) {
            setFetchError(e?.message ?? "Failed to load questions. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [categoryId]);

    useEffect(() => {
        loadQuestions();
    }, [loadQuestions]);

    // ── Loading state ────────────────────────────────────────────────────────
    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center" }}>
                <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{ color: COLORS.textMuted, marginTop: 16, fontSize: 15 }}>Loading questions…</Text>
            </SafeAreaView>
        );
    }

    // ── Error state ──────────────────────────────────────────────────────────
    if (fetchError) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center", padding: 32 }}>
                <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
                <Ionicons name="cloud-offline-outline" size={56} color={COLORS.textMuted} />
                <Text style={{ color: COLORS.text, fontSize: 17, fontWeight: "700", marginTop: 16, textAlign: "center" }}>{fetchError}</Text>
                <TouchableOpacity onPress={loadQuestions} activeOpacity={0.85} style={{ backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32, marginTop: 24 }}>
                    <Text style={{ color: COLORS.white, fontWeight: "700", fontSize: 15 }}>Retry</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.back()} activeOpacity={0.75} style={{ marginTop: 14 }}>
                    <Text style={{ color: COLORS.textMuted, fontSize: 14 }}>Go back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const currentQuestion = questions[currentIndex];
    const isLast = currentIndex === questions.length - 1;

    const handleSelectOption = (index: number) => {
        if (selectedOption !== null) return;
        setSelectedOption(index);
    };

    const handleNext = () => {
        const newAnswers = [...answers, selectedOption];
        if (isLast) { setAnswers(newAnswers); setFinished(true); }
        else { setAnswers(newAnswers); setCurrentIndex((i) => i + 1); setSelectedOption(null); }
    };

    const getOptionState = (index: number): OptionState => {
        if (selectedOption === null) return "default";
        if (index === currentQuestion.correctIndex) return "correct";
        if (index === selectedOption) return "wrong";
        return "disabled";
    };

    // ── Results ──────────────────────────────────────────────────────────────
    if (finished) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
                <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
                <ResultsScreen questions={questions} answers={answers} onRetry={loadQuestions} />
            </SafeAreaView>
        );
    }

    const headerLabel = categoryName ? String(categoryName) : "Quiz";

    // ── Quiz ─────────────────────────────────────────────────────────────────
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

            <View style={{ backgroundColor: COLORS.primary, paddingVertical: 16, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <View style={{ alignItems: "center" }}>
                    <Text style={{ color: COLORS.primaryLight, fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8 }}>
                        {headerLabel}
                    </Text>
                    <Text style={{ color: COLORS.white, fontWeight: "700", fontSize: 15 }}>
                        Question {currentIndex + 1} / {questions.length}
                    </Text>
                </View>
                <View style={{ width: 32 }} />
            </View>

            {/* Progress bar */}
            <View style={{ height: 4, backgroundColor: COLORS.primaryBorder }}>
                <View style={{ height: 4, backgroundColor: COLORS.primaryLight, width: `${((currentIndex + (selectedOption !== null ? 1 : 0)) / questions.length) * 100}%` }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <View style={{ backgroundColor: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4 }}>
                    {currentQuestion.image && (
                        <Image source={{ uri: currentQuestion.image }} style={{ width: "100%", height: 180, borderRadius: 12, marginBottom: 16 }} contentFit="cover" />
                    )}
                    <Text style={{ fontSize: 18, fontWeight: "700", color: COLORS.text, lineHeight: 28 }}>{currentQuestion.question}</Text>
                </View>

                <View style={{ marginBottom: 8 }}>
                    {currentQuestion.options.map((opt, idx) => (
                        <OptionButton key={idx} label={OPTION_LABELS[idx]} text={opt} state={getOptionState(idx)} onPress={() => handleSelectOption(idx)} />
                    ))}
                </View>

                {selectedOption !== null && <ExplanationSection text={currentQuestion.explanation} />}

                {selectedOption !== null && (
                    <TouchableOpacity onPress={handleNext} activeOpacity={0.85} style={{ backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: "center", marginTop: 20, shadowColor: COLORS.primary, shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6 }}>
                        <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: "700" }}>
                            {isLast ? "Finish Quiz  🏁" : "Next Question  →"}
                        </Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
