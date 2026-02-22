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

// ─── Field must live at MODULE SCOPE ──────────────────────────────────────────
// Defining it inside SignUpScreen creates a new component type on every
// keystroke re-render, unmounting the active TextInput and dismissing the keyboard.
type FieldProps = {
    label: string;
    icon: React.ComponentProps<typeof Ionicons>["name"];
    value: string;
    onChange: (v: string) => void;
    onClearError: () => void;
    focused: boolean;
    onFocus: () => void;
    onBlur: () => void;
    placeholder: string;
    keyboard?: "default" | "email-address";
    secure?: boolean;
    showToggle?: boolean;
    onToggle?: () => void;
    showValue?: boolean;
};

function Field({
    label, icon, value, onChange, onClearError, focused,
    onFocus, onBlur, placeholder,
    keyboard = "default", secure = false,
    showToggle = false, onToggle, showValue,
}: FieldProps) {
    return (
        <View style={{ marginBottom: 18 }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: COLORS.text, marginBottom: 8, letterSpacing: 0.3 }}>
                {label}
            </Text>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1.5,
                borderColor: focused ? COLORS.focusBorder : COLORS.inputBorder,
                borderRadius: 14,
                paddingHorizontal: 14,
                backgroundColor: focused ? "#F5F3FF" : "#FAFAFA",
            }}>
                <Ionicons name={icon} size={18} color={focused ? COLORS.primary : COLORS.textMuted} style={{ marginRight: 10 }} />
                <TextInput
                    value={value}
                    onChangeText={(t) => { onChange(t); onClearError(); }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    keyboardType={keyboard}
                    autoCapitalize={keyboard === "email-address" ? "none" : "words"}
                    autoCorrect={false}
                    secureTextEntry={secure && !showValue}
                    style={{ flex: 1, paddingVertical: 14, fontSize: 15, color: COLORS.text }}
                />
                {showToggle && onToggle && (
                    <TouchableOpacity onPress={onToggle} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Ionicons name={showValue ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function SignUpScreen() {
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [nameFocused, setNameFocused] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [confirmFocused, setConfirmFocused] = useState(false);

    const shakeAnim = useRef(new Animated.Value(0)).current;
    const clearError = () => setError(null);

    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
        ]).start();
    };

    const handleSignUp = async () => {
        if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setError("Please fill in all fields.");
            shake();
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            shake();
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            shake();
            return;
        }
        setError(null);
        setLoading(true);
        try {
            await register(name.trim(), email.trim(), password);
        } catch (e: any) {
            const msg: string = e?.message ?? "";
            setError(
                msg.includes("already exists") || msg.includes("conflict")
                    ? "An account with this email already exists."
                    : msg || "Sign up failed. Please try again."
            );
            shake();
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

            {/* Header */}
            <View style={{
                backgroundColor: COLORS.primary,
                paddingTop: 60,
                paddingBottom: 48,
                paddingHorizontal: 28,
                borderBottomLeftRadius: 48,
                borderBottomRightRadius: 48,
                alignItems: "center",
            }}>
                <View style={{ width: 76, height: 76, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <Ionicons name="person-add" size={38} color={COLORS.white} />
                </View>
                <Text style={{ color: COLORS.white, fontSize: 28, fontWeight: "900", letterSpacing: -0.5 }}>
                    Create Account
                </Text>
                <Text style={{ color: COLORS.primaryLight, fontSize: 14, marginTop: 6 }}>
                    Join MediQuiz today
                </Text>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{ padding: 24, paddingTop: 28 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
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
                            <View style={{ backgroundColor: COLORS.errorLight, borderRadius: 12, padding: 12, flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 18, borderWidth: 1, borderColor: "#FECACA" }}>
                                <Ionicons name="alert-circle" size={18} color={COLORS.error} />
                                <Text style={{ color: COLORS.error, fontSize: 13, flex: 1, fontWeight: "500" }}>{error}</Text>
                            </View>
                        )}

                        <Field
                            label="FULL NAME"
                            icon="person-outline"
                            value={name}
                            onChange={setName}
                            onClearError={clearError}
                            focused={nameFocused}
                            onFocus={() => setNameFocused(true)}
                            onBlur={() => setNameFocused(false)}
                            placeholder="John Doe"
                        />
                        <Field
                            label="EMAIL ADDRESS"
                            icon="mail-outline"
                            value={email}
                            onChange={setEmail}
                            onClearError={clearError}
                            focused={emailFocused}
                            onFocus={() => setEmailFocused(true)}
                            onBlur={() => setEmailFocused(false)}
                            placeholder="you@example.com"
                            keyboard="email-address"
                        />
                        <Field
                            label="PASSWORD"
                            icon="lock-closed-outline"
                            value={password}
                            onChange={setPassword}
                            onClearError={clearError}
                            focused={passwordFocused}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                            placeholder="Min. 8 characters"
                            secure
                            showToggle
                            onToggle={() => setShowPassword((v) => !v)}
                            showValue={showPassword}
                        />
                        <Field
                            label="CONFIRM PASSWORD"
                            icon="shield-checkmark-outline"
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            onClearError={clearError}
                            focused={confirmFocused}
                            onFocus={() => setConfirmFocused(true)}
                            onBlur={() => setConfirmFocused(false)}
                            placeholder="Re-enter password"
                            secure
                            showToggle
                            onToggle={() => setShowConfirm((v) => !v)}
                            showValue={showConfirm}
                        />

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            onPress={handleSignUp}
                            disabled={loading}
                            activeOpacity={0.85}
                            style={{
                                backgroundColor: loading ? COLORS.primaryLight : COLORS.primary,
                                borderRadius: 16,
                                paddingVertical: 16,
                                alignItems: "center",
                                marginTop: 8,
                                shadowColor: COLORS.primary,
                                shadowOpacity: 0.4,
                                shadowRadius: 10,
                                shadowOffset: { width: 0, height: 4 },
                                elevation: 6,
                            }}
                        >
                            {loading
                                ? <ActivityIndicator color={COLORS.white} />
                                : <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: "700" }}>Create Account</Text>
                            }
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Link to Login */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.75}
                        style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 24, gap: 4 }}
                    >
                        <Text style={{ fontSize: 14, color: COLORS.textMuted }}>Already have an account?</Text>
                        <Text style={{ fontSize: 14, color: COLORS.primary, fontWeight: "700" }}> Sign In</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
