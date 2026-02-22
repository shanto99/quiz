import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function AuthLayout() {
    const { user, isInitialising } = useAuth();
    // Wait for session restore before deciding where to route
    if (isInitialising) return null;
    if (user) return <Redirect href="/(app)/" />;
    return <Stack screenOptions={{ headerShown: false }} />;
}
