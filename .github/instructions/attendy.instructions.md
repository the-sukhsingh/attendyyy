---
applyTo: '**'
---
### 📘 GitHub Copilot Instructions for Expo Attendance Tracker App

#### 🏗️ Project Overview

This is a personal **Attendance Tracker** built using **React Native with Expo**, based on a web version. The mobile version should replicate the core functionalities:

* Course Management (Add, Edit, Delete)
* Mark Attendance
* View Records
* View Summary Stats
* Export Data (optional or share to clipboard)
* Theme Support (Dark/Light)

#### 🧠 Guide Copilot to Follow These Instructions

---

### 🔧 App Architecture

* **Platform**: React Native using Expo (`expo init`)
* **Navigation**: Use `@react-navigation/native` with bottom tabs or top tabs
* **State Management**: Use React Context or hooks with `AsyncStorage` (replacing localStorage)
* **UI Library**: Use `react-native-paper` or `react-native-ui-lib` to match clean component design
* **Icons**: Use `@expo/vector-icons` (e.g. Feather, MaterialCommunityIcons)
* **Calendar**: Use `react-native-calendars` or `@react-native-community/datetimepicker`
* **Charts (for summary)**: Use `react-native-svg-charts` or `victory-native` if needed
* **CSV Export**: Optional — skip or allow sharing text/JSON instead

---

### 📌 Key Features to Implement

#### ✅ Course Management

```tsx
type Course = {
  id: string;
  name: string;
  code: string;
  instructor: string;
  createdAt: string;
};
```

* Show list of courses
* Add/Edit course via modal or screen
* Delete course with confirmation

#### ✅ Attendance Tracking

```tsx
type AttendanceRecord = {
  id: string;
  courseId: string;
  date: string;
  status: "present" | "absent";
};
```

* Select date
* Mark attendance (present/absent)
* Store attendance in AsyncStorage

#### ✅ Records Tab

* Table-like display of attendance history
* Filter by course
* Sort by date descending

#### ✅ Summary Tab

* For each course:

  * Total classes
  * Attended / Missed
  * Percentage bar
  * Optional battery-style icon or color bar

#### ✅ Theme Support

* Store darkMode boolean in AsyncStorage
* Apply theme with context and `react-native-appearance`

---

### 🧩 Technical Notes

#### AsyncStorage Hook

Replace `useLocalStorage` with:

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';

function useAsyncStorage<T>(key: string, initialValue: T) {
  // load on mount, save on change, wrap in hook
}
```

#### Navigation Structure Suggestion

* Tabs:

  * Courses
  * Attendance
  * Records
  * Summary

---

### 💡 Tips for Copilot Autocomplete

* When generating component screens, follow the structure and naming in `Attendance.tsx`
* Focus on mobile-first design and performance
* Use FlatList over map for course and record lists
* Avoid using `window` or `document` — use React Native APIs

---

### ✅ Next Steps

1. Initialize Expo app

   ```sh
   npx create-expo-app attendance-tracker
   ```

2. Set up navigation, theme context, and storage logic

3. Migrate components screen-by-screen

