import { Ionicons } from "@expo/vector-icons";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StatusBar, View } from "react-native";
import { COLORS } from "../constants/theme";
import { AuthProvider } from "../context/AuthContext";
import "./global.css";

SplashScreen.preventAutoHideAsync();


function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // Logo springs in
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, speed: 5, bounciness: 14 }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      // App name fades in
      Animated.timing(textOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      // Subtitle fades in
      Animated.timing(subtitleOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      // Hold for a moment
      Animated.delay(700),
      // Fade out the entire splash
      Animated.timing(containerOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => onFinish());
  }, []);

  return (
    <Animated.View style={{
      ...{ flex: 1, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" },
      opacity: containerOpacity,
    }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Decorative circles */}
      <View style={{ position: "absolute", top: -80, right: -80, width: 260, height: 260, borderRadius: 130, backgroundColor: "rgba(255,255,255,0.06)" }} />
      <View style={{ position: "absolute", bottom: -60, left: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.06)" }} />

      {/* Logo */}
      <Animated.View style={{
        width: 100,
        height: 100,
        borderRadius: 30,
        backgroundColor: "rgba(255,255,255,0.18)",
        alignItems: "center",
        justifyContent: "center",
        transform: [{ scale: logoScale }],
        opacity: logoOpacity,
        marginBottom: 24,
      }}>
        <Ionicons name="school" size={52} color={COLORS.white} />
      </Animated.View>

      {/* App name */}
      <Animated.Text style={{
        color: COLORS.white,
        fontSize: 38,
        fontWeight: "900",
        letterSpacing: -1,
        opacity: textOpacity,
      }}>
        MediQuiz
      </Animated.Text>

      {/* Subtitle */}
      <Animated.Text style={{
        color: COLORS.primaryLight,
        fontSize: 16,
        marginTop: 8,
        opacity: subtitleOpacity,
      }}>
        Test your knowledge
      </Animated.Text>
    </Animated.View>
  );
}

export default function RootLayout() {
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    // Hide the native splash immediately so our custom one shows
    SplashScreen.hideAsync();
  }, []);

  if (!splashDone) {
    return (
      <AuthProvider>
        <AnimatedSplash onFinish={() => setSplashDone(true)} />
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
