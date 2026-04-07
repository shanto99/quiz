import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Linking,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../../constants/theme";
import { LEARNING_FUNCTION_URL } from "../../../lib/appwrite";

interface Resource {
    id: string;
    title: string;
    resource_id: string;
    fileViewUrl: string;
    fileDownloadUrl: string;
    createdAt: string;
    updatedAt: string;
}

export default function LearningResourcesScreen() {
    const { id, name } = useLocalSearchParams();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadResources = useCallback(async () => {
        if (!LEARNING_FUNCTION_URL) {
            setError("Learning function endpoint is not configured in .env");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // Trim trailing slash if exists to safely append query string
            const baseUrl = LEARNING_FUNCTION_URL.replace(/\/$/, "");
            const res = await fetch(`${baseUrl}?categoryId=${id}`);
            
            if (!res.ok) {
                // Read potential text error
                const text = await res.text();
                throw new Error(text || "Failed to fetch resources");
            }

            const data = await res.json();
            
            if (data.success) {
                setResources(data.resources || []);
            } else {
                throw new Error(data.error || "Unknown server error");
            }
        } catch (e: any) {
            setError(e.message || "Network request failed");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadResources();
    }, [loadResources]);

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
            <StatusBar barStyle="light-content" backgroundColor="#0EA5E9" />

            {/* Header */}
            <View style={{
                backgroundColor: "#0EA5E9",
                paddingTop: 60,
                paddingBottom: 24,
                paddingHorizontal: 24,
                borderBottomLeftRadius: 32,
                borderBottomRightRadius: 32,
            }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
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
                    <Text style={{ color: COLORS.white, fontSize: 22, fontWeight: "800", marginLeft: 16 }}>
                        {name || "Resources"}
                    </Text>
                </View>
                <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, marginLeft: 56 }}>
                    Study materials & PDFs
                </Text>
            </View>

            {/* Content */}
            <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
                {loading && (
                    <View style={{ alignItems: "center", paddingVertical: 60 }}>
                        <ActivityIndicator size="large" color="#0EA5E9" />
                        <Text style={{ color: COLORS.textMuted, marginTop: 14, fontSize: 14 }}>
                            Retrieving learning materials...
                        </Text>
                    </View>
                )}

                {!loading && error && (
                    <View style={{ alignItems: "center", paddingVertical: 48 }}>
                        <Ionicons name="alert-circle-outline" size={54} color="#EF4444" />
                        <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: "700", marginTop: 16, textAlign: "center" }}>
                            Oops! Something went wrong.
                        </Text>
                        <Text style={{ color: COLORS.textMuted, fontSize: 14, marginTop: 8, textAlign: "center", paddingHorizontal: 20 }}>
                            {error}
                        </Text>
                        <TouchableOpacity
                            onPress={loadResources}
                            activeOpacity={0.8}
                            style={{ backgroundColor: "#0EA5E9", borderRadius: 10, paddingVertical: 12, paddingHorizontal: 32, marginTop: 24 }}
                        >
                            <Text style={{ color: COLORS.white, fontWeight: "700", fontSize: 15 }}>Retry Request</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {!loading && !error && resources.length === 0 && (
                    <View style={{ alignItems: "center", paddingVertical: 60 }}>
                        <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: "#E0F2FE", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                            <Ionicons name="document-text-outline" size={40} color="#0EA5E9" />
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: "700", color: COLORS.text }}>No Resources Found</Text>
                        <Text style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 8, textAlign: "center", paddingHorizontal: 30 }}>
                            This category currently has no attached learning materials. Handouts will be visible here once available.
                        </Text>
                    </View>
                )}

                {!loading && !error && resources.length > 0 && (
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: "800", color: COLORS.text, marginBottom: 16 }}>
                            Available Files ({resources.length})
                        </Text>
                        {resources.map((resource) => (
                            <TouchableOpacity
                                key={resource.id}
                                activeOpacity={0.7}
                                onPress={() => Linking.openURL(resource.fileViewUrl)}
                                style={{
                                    backgroundColor: COLORS.white,
                                    borderRadius: 16,
                                    padding: 16,
                                    marginBottom: 16,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    shadowColor: "#000",
                                    shadowOpacity: 0.04,
                                    shadowRadius: 6,
                                    shadowOffset: { width: 0, height: 2 },
                                    elevation: 2,
                                }}
                            >
                                <View style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 12,
                                    backgroundColor: "#FFF1F2",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: 16
                                }}>
                                    <Ionicons name="document" size={24} color="#E11D48" />
                                </View>

                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 15, fontWeight: "700", color: COLORS.text, marginBottom: 4 }}>
                                        {resource.title}
                                    </Text>
                                    <Text style={{ fontSize: 12, color: COLORS.textMuted }}>
                                        Added: {new Date(resource.createdAt).toLocaleDateString()}
                                    </Text>
                                </View>

                                <View style={{ alignItems: "center", justifyContent: "center", paddingLeft: 12 }}>
                                    <TouchableOpacity 
                                        onPress={() => Linking.openURL(resource.fileDownloadUrl)}
                                        style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 18,
                                            backgroundColor: "#F1F5F9",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <Ionicons name="cloud-download-outline" size={18} color="#64748B" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
