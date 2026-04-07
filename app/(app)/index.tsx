import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    StatusBar,
    Text,
    TouchableOpacity,
    View,
    ScrollView
} from "react-native";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

export default function SelectionScreen() {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try { await logout(); } catch { /* session already gone */ }
    };

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
                        <Ionicons name="medical" size={36} color={COLORS.white} />
                    </View>
                    <Text style={{ color: COLORS.white, fontSize: 30, fontWeight: "900", letterSpacing: -0.5 }}>Welcome</Text>
                    <Text style={{ color: COLORS.primaryLight, fontSize: 15, marginTop: 6, textAlign: "center" }}>
                        What would you like to do today?
                    </Text>
                </View>
            </View>

            {/* Body */}
            <ScrollView
                contentContainerStyle={{ padding: 24, paddingTop: 32, gap: 20 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Practice Card */}
                <TouchableOpacity
                    onPress={() => router.push("/(app)/categories")}
                    activeOpacity={0.8}
                    style={{
                        backgroundColor: COLORS.white,
                        borderRadius: 24,
                        padding: 24,
                        shadowColor: "#000",
                        shadowOpacity: 0.08,
                        shadowRadius: 12,
                        shadowOffset: { width: 0, height: 4 },
                        elevation: 4,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 20,
                    }}
                >
                    <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name="game-controller" size={32} color={COLORS.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 22, fontWeight: "800", color: COLORS.text, marginBottom: 4 }}>Practice</Text>
                        <Text style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 20 }}>
                            Test your knowledge with categorized quizzes.
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
                </TouchableOpacity>

                {/* Learn Card */}
                <TouchableOpacity
                    onPress={() => router.push("/(app)/learn")}
                    activeOpacity={0.8}
                    style={{
                        backgroundColor: COLORS.white,
                        borderRadius: 24,
                        padding: 24,
                        shadowColor: "#000",
                        shadowOpacity: 0.08,
                        shadowRadius: 12,
                        shadowOffset: { width: 0, height: 4 },
                        elevation: 4,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 20,
                    }}
                >
                    <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: "#ECFDF5", alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name="book" size={32} color="#059669" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 22, fontWeight: "800", color: COLORS.text, marginBottom: 4 }}>Learn</Text>
                        <Text style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 20 }}>
                            Explore study materials and strengthen your foundations.
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}
