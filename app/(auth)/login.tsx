import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const shakeAnim = useRef(new Animated.Value(0)).current;

    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
        ]).start();
    };

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            setError("Please enter your email and password.");
            shake();
            return;
        }
        setError(null);
        setLoading(true);
        try {
            await login(email, password);
            // Navigation handled automatically by (auth)/_layout redirect
        } catch (e: any) {
            setError(e.message ?? "An error occurred. Please try again.");
            shake();
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

            {/* Top wave header */}
            <View style={{
                backgroundColor: COLORS.primary,
                paddingTop: 70,
                paddingBottom: 60,
                paddingHorizontal: 28,
                borderBottomLeftRadius: 48,
                borderBottomRightRadius: 48,
                alignItems: "center",
            }}>
                <View style={{
                    width: 76,
                    height: 76,
                    borderRadius: 24,
                    backgroundColor: "rgba(255,255,255,0.18)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                }}>
                    <Ionicons name="school" size={38} color={COLORS.white} />
                </View>
                <Text style={{ color: COLORS.white, fontSize: 28, fontWeight: "900", letterSpacing: -0.5 }}>
                    MediQuiz
                </Text>
                <Text style={{ color: COLORS.primaryLight, fontSize: 14, marginTop: 6 }}>
                    Sign in to continue
                </Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ padding: 24, paddingTop: 32 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Card */}
                    <Animated.View style={{
                        backgroundColor: COLORS.white,
                        borderRadius: 24,
                        padding: 24,
                        shadowColor: "#000",
                        shadowOpacity: 0.08,
                        shadowRadius: 16,
                        shadowOffset: { width: 0, height: 6 },
                        elevation: 6,
                        transform: [{ translateX: shakeAnim }],
                    }}>

                        {/* Error Banner */}
                        {error && (
                            <View style={{
                                backgroundColor: COLORS.errorLight,
                                borderRadius: 12,
                                padding: 12,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 8,
                                marginBottom: 18,
                                borderWidth: 1,
                                borderColor: "#FECACA",
                            }}>
                                <Ionicons name="alert-circle" size={18} color={COLORS.error} />
                                <Text style={{ color: COLORS.error, fontSize: 13, flex: 1, fontWeight: "500" }}>{error}</Text>
                            </View>
                        )}

                        {/* Email */}
                        <Text style={{ fontSize: 13, fontWeight: "700", color: COLORS.text, marginBottom: 8, letterSpacing: 0.3 }}>
                            EMAIL ADDRESS
                        </Text>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            borderWidth: 1.5,
                            borderColor: emailFocused ? COLORS.focusBorder : COLORS.inputBorder,
                            borderRadius: 14,
                            paddingHorizontal: 14,
                            backgroundColor: emailFocused ? "#F5F3FF" : "#FAFAFA",
                            marginBottom: 20,
                        }}>
                            <Ionicons name="mail-outline" size={18} color={emailFocused ? COLORS.primary : COLORS.textMuted} style={{ marginRight: 10 }} />
                            <TextInput
                                value={email}
                                onChangeText={(t) => { setEmail(t); setError(null); }}
                                onFocus={() => setEmailFocused(true)}
                                onBlur={() => setEmailFocused(false)}
                                placeholder="you@example.com"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={{ flex: 1, paddingVertical: 14, fontSize: 15, color: COLORS.text }}
                            />
                        </View>

                        {/* Password */}
                        <Text style={{ fontSize: 13, fontWeight: "700", color: COLORS.text, marginBottom: 8, letterSpacing: 0.3 }}>
                            PASSWORD
                        </Text>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            borderWidth: 1.5,
                            borderColor: passwordFocused ? COLORS.focusBorder : COLORS.inputBorder,
                            borderRadius: 14,
                            paddingHorizontal: 14,
                            backgroundColor: passwordFocused ? "#F5F3FF" : "#FAFAFA",
                            marginBottom: 28,
                        }}>
                            <Ionicons name="lock-closed-outline" size={18} color={passwordFocused ? COLORS.primary : COLORS.textMuted} style={{ marginRight: 10 }} />
                            <TextInput
                                value={password}
                                onChangeText={(t) => { setPassword(t); setError(null); }}
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
                                placeholder="••••••••"
                                placeholderTextColor="#9CA3AF"
                                secureTextEntry={!showPassword}
                                style={{ flex: 1, paddingVertical: 14, fontSize: 15, color: COLORS.text }}
                            />
                            <TouchableOpacity onPress={() => setShowPassword((v) => !v)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.textMuted} />
                            </TouchableOpacity>
                        </View>

                        {/* Sign In Button */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={loading}
                            activeOpacity={0.85}
                            style={{
                                backgroundColor: loading ? COLORS.primaryLight : COLORS.primary,
                                borderRadius: 16,
                                paddingVertical: 16,
                                alignItems: "center",
                                shadowColor: COLORS.primary,
                                shadowOpacity: 0.4,
                                shadowRadius: 10,
                                shadowOffset: { width: 0, height: 4 },
                                elevation: 6,
                            }}
                        >
                            {loading ? (
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: "700" }}>Sign In</Text>
                            )}
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Sign Up Link */}
                    <TouchableOpacity
                        onPress={() => router.push("/(auth)/signup")}
                        activeOpacity={0.75}
                        style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 24, gap: 4 }}
                    >
                        <Text style={{ fontSize: 14, color: COLORS.textMuted }}>Don't have an account?</Text>
                        <Text style={{ fontSize: 14, color: COLORS.primary, fontWeight: "700" }}> Sign Up</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
