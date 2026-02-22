import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import allQuestions from "../data/questions.json";

const COLORS = {
  primary: "#4F46E5",
  primaryLight: "#818CF8",
  bg: "#F0F0FA",
  white: "#FFFFFF",
  text: "#111827",
  textMuted: "#6B7280",
};

export default function HomeScreen() {
  const totalQuestions = (allQuestions as any[]).length;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Hero Header */}
      <View style={{
        backgroundColor: COLORS.primary,
        paddingTop: 60,
        paddingBottom: 48,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
        alignItems: "center",
      }}>
        <View style={{ width: 70, height: 70, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <Ionicons name="school" size={36} color={COLORS.white} />
        </View>
        <Text style={{ color: COLORS.white, fontSize: 30, fontWeight: "900", letterSpacing: -0.5 }}>QuizMaster</Text>
        <Text style={{ color: COLORS.primaryLight, fontSize: 15, marginTop: 6, textAlign: "center" }}>
          Test your knowledge with fun quizzes
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 28 }} showsVerticalScrollIndicator={false}>

        {/* Stats Row */}
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 28 }}>
          {[
            { icon: "help-circle-outline", label: "Questions", value: totalQuestions.toString() },
            { icon: "list-outline", label: "Per Quiz", value: "5" },
          ].map((stat) => (
            <View key={stat.label} style={{
              flex: 1,
              backgroundColor: COLORS.white,
              borderRadius: 18,
              padding: 18,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 3 },
              elevation: 3,
            }}>
              <Ionicons name={stat.icon as any} size={26} color={COLORS.primary} />
              <Text style={{ fontSize: 26, fontWeight: "900", color: COLORS.text, marginTop: 6 }}>{stat.value}</Text>
              <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Take a Quiz Block */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.push("/quiz")}
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: 24,
            padding: 24,
            shadowColor: COLORS.primary,
            shadowOpacity: 0.45,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 8 },
            elevation: 8,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>
                Ready to start?
              </Text>
              <Text style={{ color: COLORS.white, fontSize: 24, fontWeight: "900", lineHeight: 30 }}>
                Take a Quiz
              </Text>
              <Text style={{ color: COLORS.primaryLight, fontSize: 13, marginTop: 8, lineHeight: 20 }}>
                5 random questions • Multiple choice{"\n"}Tap to begin your challenge!
              </Text>
            </View>
            <View style={{ width: 60, height: 60, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center", marginLeft: 16 }}>
              <Ionicons name="play" size={28} color={COLORS.white} />
            </View>
          </View>

          {/* Decorative progress bar */}
          <View style={{ height: 4, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 2, marginTop: 20 }}>
            <View style={{ height: 4, backgroundColor: COLORS.white, borderRadius: 2, width: "0%" }} />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>0 / 5 questions</Text>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>0%</Text>
          </View>
        </TouchableOpacity>

        {/* How it works */}
        <View style={{ backgroundColor: COLORS.white, borderRadius: 20, padding: 20, marginTop: 24, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.text, marginBottom: 16 }}>How it works</Text>
          {[
            { icon: "shuffle", text: "5 questions are picked randomly each time" },
            { icon: "radio-button-on", text: "Select one of four answer choices" },
            { icon: "bulb-outline", text: "Reveal the explanation after answering" },
            { icon: "trophy-outline", text: "See your score and review at the end" },
          ].map((item, i) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 14, marginBottom: i < 3 ? 14 : 0 }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name={item.icon as any} size={18} color={COLORS.primary} />
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: COLORS.textMuted, lineHeight: 20 }}>{item.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
