import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function AppLayout() {
    const { user, isInitialising } = useAuth();
    // Wait for session restore before deciding where to route
    if (isInitialising) return null;
    if (!user) return <Redirect href="/(auth)/login" />;
    return <Stack screenOptions={{ headerShown: false }} />;
}
