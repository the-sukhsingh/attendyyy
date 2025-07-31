import { Stack } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertProvider } from "../contexts/AlertContext";
import { DataProvider } from "../contexts/DataContext";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { Modal } from "react-native";


function Root() {
  const { isDarkMode } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }}>
      <Stack screenOptions={{
        headerShown: false, statusBarStyle: isDarkMode ? "light" : "dark",
        statusBarAnimation: "fade", statusBarTranslucent: true
      }} />

    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <DataProvider>
        <AlertProvider>
          <Root />
        </AlertProvider>
      </DataProvider>
    </ThemeProvider>
  );
}
