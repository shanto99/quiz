import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Platform, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";
import { COLORS } from "../../../constants/theme";

export default function PreviewScreen() {
    const { url, title, categoryId, categoryName } = useLocalSearchParams<{ url: string; title: string, categoryId?: string, categoryName?: string }>();
    const [loading, setLoading] = useState(true);

    if (!url) {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.bg, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: COLORS.textMuted }}>No document URL provided</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
                    <Text style={{ color: "#0EA5E9", fontWeight: "600" }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // On Android, directly rendering PDFs in WebView sometimes doesn't work.
    // Wrap it using Google Docs viewer for reliable rendering.
    const finalUrl = Platform.OS === "android" 
        ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`
        : url;

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
            <StatusBar barStyle="light-content" backgroundColor="#0EA5E9" />
            
            {/* Header */}
            <View style={{
                backgroundColor: "#0EA5E9",
                paddingTop: 60,
                paddingBottom: 16,
                paddingHorizontal: 24,
                flexDirection: "row",
                alignItems: "center",
            }}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        backgroundColor: "rgba(255,255,255,0.2)",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Ionicons name="arrow-back" size={20} color={COLORS.white} />
                </TouchableOpacity>
                <View style={{ marginLeft: 16, flex: 1 }}>
                    <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: "700" }} numberOfLines={1}>
                        {title || "Document Preview"}
                    </Text>
                </View>
                
                {categoryId && (
                    <TouchableOpacity
                        onPress={() => router.push({
                            pathname: "/(app)/quiz",
                            params: { categoryId, categoryName }
                        })}
                        style={{
                            backgroundColor: "rgba(255,255,255,0.2)",
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 12,
                            marginLeft: 8,
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    >
                        <Ionicons name="play-circle" size={16} color={COLORS.white} style={{ marginRight: 4 }} />
                        <Text style={{ color: COLORS.white, fontSize: 14, fontWeight: "700" }}>Quiz</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Viewer area */}
            <View style={{ flex: 1 }}>
                {loading && (
                    <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: COLORS.bg, alignItems: "center", justifyContent: "center", zIndex: 10 }}>
                        <ActivityIndicator size="large" color="#0EA5E9" />
                        <Text style={{ marginTop: 12, color: COLORS.textMuted }}>Loading document...</Text>
                    </View>
                )}
                
                <WebView
                    source={{ uri: finalUrl }}
                    style={{ flex: 1, backgroundColor: "transparent" }}
                    onLoadEnd={() => setLoading(false)}
                    onError={() => setLoading(false)}
                    scalesPageToFit={true}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                />
            </View>
        </View>
    );
}
