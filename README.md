# 📱 AttendYourself - Personal Attendance Tracker

A React Native Expo app for tracking your personal class attendance across multiple courses.

## � Features

### ✅ Course Management
- **Add/Edit/Delete Courses**: Manage your course list with details like course name, code, and instructor
- **Course Information**: Store course details including instructor names and creation dates
- **Intuitive Interface**: Clean, modern UI for easy course management

### ✅ Attendance Tracking
- **Daily Attendance**: Mark attendance as Present or Absent for any course
- **Date Navigation**: Navigate through dates with intuitive controls
- **Quick Statistics**: See immediate stats for the selected course
- **Status Updates**: Update attendance for past dates

### ✅ Records Management
- **Comprehensive History**: View all attendance records in a clean, organized list
- **Advanced Filtering**: Filter records by specific courses
- **Smart Sorting**: Sort records by date (newest/oldest first)
- **Record Management**: Delete incorrect records with confirmation
- **Overall Statistics**: Quick overview of total classes and attendance rates

### ✅ Summary & Analytics
- **Course-wise Statistics**: Detailed breakdown for each course
  - Total classes attended
  - Present/Absent counts
  - Attendance percentage with color-coded status
  - Progress bars with visual indicators
- **Overall Analytics**: Global statistics across all courses
- **Smart Insights**: 
  - Best performing course
  - Courses needing attention
  - Recent activity tracking
- **Visual Progress Bars**: Color-coded attendance rates (Green: ≥80%, Yellow: ≥60%, Red: <60%)

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router with Bottom Tabs
- **Storage**: AsyncStorage for local data persistence
- **UI Components**: Native React Native components with custom styling
- **Icons**: Expo Vector Icons (Ionicons)
- **TypeScript**: Full TypeScript support for type safety

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd attendyourself
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/emulator**
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go
   - **iOS**: Press `i` in the terminal or scan QR code with Camera app
   - **Web**: Press `w` in the terminal

## 📱 App Structure

```
app/
├── _layout.tsx           # Root layout
├── index.tsx            # Landing page with redirect
└── (tabs)/
    ├── _layout.tsx      # Tab navigation layout
    ├── course.tsx       # Course management screen
    ├── attendance.tsx   # Attendance marking screen
    ├── record.tsx       # Records viewing screen
    └── stat.tsx         # Statistics/summary screen

hooks/
└── Storage.tsx          # AsyncStorage hooks and utilities

components/
└── navigation/
    └── TabBarIcon.tsx   # Custom tab bar icons
```

## 🎯 Usage

### Getting Started
1. **Add Courses**: Start by adding your courses in the "Courses" tab
2. **Mark Attendance**: Go to "Attendance" tab to mark daily attendance
3. **View Records**: Check "Records" tab to see your attendance history
4. **Track Progress**: Monitor your performance in the "Summary" tab

### Course Management
- Tap the "+" button to add a new course
- Fill in course name (required), course code (required), and instructor (optional)
- Tap on a course card to edit details
- Use the trash icon to delete courses (with confirmation)

### Marking Attendance
- Select the course from the dropdown
- Navigate to the desired date using arrow buttons
- Tap "Present" or "Absent" to mark attendance
- View quick stats for the selected course

### Viewing Records
- See all attendance records with course details and dates
- Filter by specific courses using the dropdown
- Sort by date (newest or oldest first)
- Delete individual records if needed

### Statistics & Analytics
- View overall statistics across all courses
- See detailed course-wise breakdowns with progress bars
- Get insights about best/worst performing courses
- Track attendance trends and patterns

## 📊 Data Structure

### Course Model
```typescript
type Course = {
  id: string;
  name: string;
  code: string;
  instructor: string;
  createdAt: string;
};
```

### Attendance Record Model
```typescript
type AttendanceRecord = {
  id: string;
  courseId: string;
  date: string; // YYYY-MM-DD format
  status: "present" | "absent";
};
```

## 💾 Data Storage

All data is stored locally using AsyncStorage:
- **Courses**: Stored in `courses` key
- **Attendance Records**: Stored in `attendanceRecords` key
- **Settings**: Theme and app preferences

Data persists between app sessions and device restarts.

## 🎨 Design Features

- **Clean Interface**: Modern, minimalist design with intuitive navigation
- **Color-coded Status**: Visual indicators for attendance rates and status
- **Responsive Layout**: Optimized for different screen sizes
- **Accessibility**: Proper contrast ratios and touch targets
- **Smooth Animations**: Native animations for better user experience

## 🔮 Future Enhancements

- **Export Data**: CSV export functionality
- **Notifications**: Reminders to mark attendance
- **Dark Theme**: Theme switching support
- **Backup/Sync**: Cloud storage integration
- **Advanced Analytics**: Charts and graphs
- **Attendance Goals**: Set and track attendance targets
- **Calendar Integration**: Import class schedules

## 🐛 Troubleshooting

### Common Issues

1. **App won't start**: Make sure all dependencies are installed with `npm install`
2. **QR code not working**: Ensure your device and computer are on the same network
3. **Data not persisting**: Check AsyncStorage permissions

### Development

```bash
# Clear Metro cache
npx expo start --clear

# Reset project
npm run reset-project

# Check for updates
npx expo install --fix
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues, questions, or feature requests, please create an issue in the repository.

---

**Happy Tracking! 📚✅**