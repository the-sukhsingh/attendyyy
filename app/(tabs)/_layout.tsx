import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Tabs } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";

export default function TabLayout() {
  const { isDarkMode } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: isDarkMode ? "#9ca3af" : "#6b7280",
        tabBarStyle: {
          backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
          borderTopColor: isDarkMode ? "#374151" : "#e5e7eb",
        },
        headerShown: false,

      }}
    >
      <Tabs.Screen
        name="course"
        options={{
          title: "Courses",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "book" : "book-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: "Attendance",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "checkmark-circle" : "checkmark-circle-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: "Records",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "list" : "list-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stat"
        options={{
          title: "Summary",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "bar-chart" : "bar-chart-outline"} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
