import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { Category, fetchCategories } from "../../lib/categories";

// A small palette to tint category cards when the DB doesn't supply a color
const CARD_COLORS = [
    { bg: "#EEF2FF", icon: "#4F46E5" },
    { bg: "#FFF7ED", icon: "#EA580C" },
    { bg: "#ECFDF5", icon: "#059669" },
    { bg: "#FDF2F8", icon: "#9333EA" },
    { bg: "#FFF1F2", icon: "#E11D48" },
    { bg: "#EFF6FF", icon: "#2563EB" },
];

// ─── Category Card ────────────────────────────────────────────────────────────
function CategoryCard({
    category,
    index,
    onPress,
}: {
    category: Category;
    index: number;
    onPress: () => void;
}) {
    const palette = CARD_COLORS[index % CARD_COLORS.length];
    const iconName = (category.icon as any) ?? "book-outline";

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.82}
            style={{
                flex: 1,
                backgroundColor: COLORS.white,
                borderRadius: 20,
                padding: 18,
                margin: 6,
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 3 },
                elevation: 3,
                minHeight: 110,
                justifyContent: "space-between",
            }}
        >
            <View
                style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: palette.bg,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                }}
            >
                <Ionicons name={iconName} size={22} color={palette.icon} />
            </View>
            <View>
                <Text
                    style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: COLORS.text,
                        lineHeight: 20,
                    }}
                    numberOfLines={2}
                >
                    {category.name}
                </Text>
                {category.description ? (
                    <Text
                        style={{
                            fontSize: 11,
                            color: COLORS.textMuted,
                            marginTop: 4,
                            lineHeight: 16,
                        }}
                        numberOfLines={2}
                    >
                        {category.description}
                    </Text>
                ) : null}
            </View>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 12,
                }}
            >
                <Text
                    style={{
                        fontSize: 12,
                        color: palette.icon,
                        fontWeight: "700",
                    }}
                >
                    Start Quiz
                </Text>
                <Ionicons
                    name="arrow-forward"
                    size={13}
                    color={palette.icon}
                    style={{ marginLeft: 4 }}
                />
            </View>
        </TouchableOpacity>
    );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
    const { user, logout } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleLogout = async () => {
        try { await logout(); } catch { /* session already gone */ }
    };

    const loadCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch (e: any) {
            setError(e?.message ?? "Failed to load categories.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    // Pair categories into rows of 2 for the grid layout
    const rows: Category[][] = [];
    for (let i = 0; i < categories.length; i += 2) {
        rows.push(categories.slice(i, i + 2));
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

            {/* Hero Header */}
            <View
                style={{
                    backgroundColor: COLORS.primary,
                    paddingTop: 60,
                    paddingBottom: 48,
                    paddingHorizontal: 24,
                    borderBottomLeftRadius: 36,
                    borderBottomRightRadius: 36,
                }}
            >
                {/* Top row: avatar + logout */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" }}>
                            <Ionicons name="person" size={20} color={COLORS.white} />
                        </View>
                        <View>
                            <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, fontWeight: "600" }}>SIGNED IN AS</Text>
                            <Text style={{ color: COLORS.white, fontSize: 13, fontWeight: "700" }}>
                                {user?.name ?? user?.email}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={handleLogout}
                        activeOpacity={0.75}
                        style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 }}
                    >
                        <Ionicons name="log-out-outline" size={16} color={COLORS.white} />
                        <Text style={{ color: COLORS.white, fontSize: 13, fontWeight: "600" }}>Logout</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ alignItems: "center" }}>
                    <View style={{ width: 70, height: 70, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                        <Ionicons name="school" size={36} color={COLORS.white} />
                    </View>
                    <Text style={{ color: COLORS.white, fontSize: 30, fontWeight: "900", letterSpacing: -0.5 }}>MediQuiz</Text>
                    <Text style={{ color: COLORS.primaryLight, fontSize: 15, marginTop: 6, textAlign: "center" }}>
                        Pick a category and start your quiz
                    </Text>
                </View>
            </View>

            {/* Body */}
            <ScrollView
                contentContainerStyle={{ padding: 18, paddingTop: 24 }}
                showsVerticalScrollIndicator={false}
            >
                <Text style={{ fontSize: 18, fontWeight: "800", color: COLORS.text, marginBottom: 4, marginLeft: 6 }}>
                    Categories
                </Text>
                <Text style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 16, marginLeft: 6 }}>
                    Choose a topic to test your knowledge
                </Text>

                {/* Loading */}
                {loading && (
                    <View style={{ alignItems: "center", paddingVertical: 60 }}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={{ color: COLORS.textMuted, marginTop: 14, fontSize: 14 }}>
                            Loading categories…
                        </Text>
                    </View>
                )}

                {/* Error */}
                {!loading && error && (
                    <View style={{ alignItems: "center", paddingVertical: 48 }}>
                        <Ionicons name="cloud-offline-outline" size={48} color={COLORS.textMuted} />
                        <Text style={{ color: COLORS.text, fontSize: 15, fontWeight: "700", marginTop: 12, textAlign: "center" }}>
                            {error}
                        </Text>
                        <TouchableOpacity
                            onPress={loadCategories}
                            activeOpacity={0.85}
                            style={{ backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 28, marginTop: 20 }}
                        >
                            <Text style={{ color: COLORS.white, fontWeight: "700" }}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Category Grid */}
                {!loading && !error && rows.map((row, ri) => (
                    <View key={ri} style={{ flexDirection: "row", marginHorizontal: -6 }}>
                        {row.map((cat, ci) => (
                            <CategoryCard
                                key={cat.$id}
                                category={cat}
                                index={ri * 2 + ci}
                                onPress={() =>
                                    router.push({
                                        pathname: "/(app)/quiz",
                                        params: { categoryId: cat.$id, categoryName: cat.name },
                                    })
                                }
                            />
                        ))}
                        {/* If odd number of items, pad the last row */}
                        {row.length === 1 && <View style={{ flex: 1, margin: 6 }} />}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
