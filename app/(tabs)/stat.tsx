import { useAlertHelpers } from '@/hooks/AlertHelpers';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import React, { useMemo } from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';
import { createFileWithData } from '../../hooks/FileHelpler';
import { type Course } from '../../hooks/Storage';

interface CourseStats {
  course: Course;
  totalClasses: number;
  presentCount: number;
  absentCount: number;
  attendanceRate: number;
  lastAttendanceDate?: string;
}

export default function StatScreen() {
  const { courses, attendanceRecords, isLoading } = useData();
  const { isDarkMode, toggleTheme } = useTheme();
  const { showError, showCustom } = useAlertHelpers();

  // Calculate statistics for each course
  const courseStats = useMemo((): CourseStats[] => {
    return courses.map(course => {
      const courseRecords = attendanceRecords.filter(record => record.courseId === course.id);
      const totalClasses = courseRecords.length;
      const presentCount = courseRecords.filter(record => record.status === 'present').length;
      const absentCount = totalClasses - presentCount;
      const attendanceRate = totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;
      
      // Get the most recent attendance date
      const sortedRecords = courseRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const lastAttendanceDate = sortedRecords.length > 0 ? sortedRecords[0].date : undefined;

      return {
        course,
        totalClasses,
        presentCount,
        absentCount,
        attendanceRate,
        lastAttendanceDate,
      };
    });
  }, [courses, attendanceRecords]);

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    const totalRecords = attendanceRecords.length;
    const totalPresent = attendanceRecords.filter(record => record.status === 'present').length;
    const totalAbsent = totalRecords - totalPresent;
    const overallRate = totalRecords > 0 ? (totalPresent / totalRecords) * 100 : 0;

    return {
      totalRecords,
      totalPresent,
      totalAbsent,
      overallRate,
      totalCourses: courses.length,
    };
  }, [attendanceRecords, courses]);

  const getAttendanceColor = (rate: number) => {
    if (rate >= 80) return '#10b981'; // Green
    if (rate >= 60) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getAttendanceStatus = (rate: number) => {
    if (rate >= 80) return 'Excellent';
    if (rate >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const handleExportData = async () => {
    // Prepare data for export
    const dataToExport = {
      courses,
      attendanceRecords,
      overallStats,
      courseStats,
    };

    const jsonData = JSON.stringify(dataToExport, null, 2);
    try {
      const fileUri = await createFileWithData('attendance_export.json', jsonData);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export Attendance Data',
        });
      } else {
        showCustom({
          type: 'info',
          title: 'Export Data',
          message: `Sharing is not available on this device.\nFile saved at:\n${fileUri}`,
          buttons: [
            { text: 'OK', style: 'default', onPress: () => {} },
          ],
        });
      }
    } catch (err) {
      showError('Failed to export data.');
    }
  };

  const renderProgressBar = (percentage: number) => {
    return (
      <View className="mb-4">
        <View className={`h-3 rounded-full overflow-hidden mb-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <View 
            className="h-full rounded-full shadow-md"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: getAttendanceColor(percentage)
            }} 
          />
        </View>
        <Text className="text-center text-lg font-bold" style={{ color: getAttendanceColor(percentage) }}>
          {percentage.toFixed(1)}%
        </Text>
      </View>
    );
  };

  const renderCourseCard = (stat: CourseStats) => {
    const { course, totalClasses, presentCount, absentCount, attendanceRate, lastAttendanceDate } = stat;
    
    return (
      <View key={course.id} className={`mb-4 rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        {/* Header with course info and status badge */}
        <View className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {course.name}
              </Text>
              <Text className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {course.code} • {course.instructor}
              </Text>
            </View>
            
            {/* Circular progress indicator */}
            <View className="items-center ml-4">
              <View 
                className="w-16 h-16 rounded-full border-4 items-center justify-center"
                style={{ 
                  borderColor: getAttendanceColor(attendanceRate),
                  backgroundColor: `${getAttendanceColor(attendanceRate)}20`
                }}
              >
                <Text className="text-sm font-bold" style={{ color: getAttendanceColor(attendanceRate) }}>
                  {attendanceRate.toFixed(0)}%
                </Text>
              </View>
              <Text className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {getAttendanceStatus(attendanceRate)}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats grid */}
        <View className="p-2">
          <View className="flex-row">
            {/* Total Classes */}
            <View className="flex-1 items-center">
              {/* <View className={`w-12 h-12 rounded-full items-center justify-center ${isDarkMode ? 'bg-blue-600' : 'bg-blue-100'}`}>
                <Ionicons 
                  name="school-outline" 
                  size={20} 
                  color={isDarkMode ? '#ffffff' : '#2563eb'} 
                />
              </View> */}
              <Text className={`text-xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {totalClasses}
              </Text>
              <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total
              </Text>
            </View>

            {/* Present */}
            <View className="flex-1 items-center">
              {/* <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center">
                <Ionicons 
                  name="checkmark-circle-outline" 
                  size={20} 
                  color="#10b981" 
                />
              </View> */}
              <Text className="text-xl font-bold mt-2 text-green-600">
                {presentCount}
              </Text>
              <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Present
              </Text>
            </View>

            {/* Absent */}
            <View className="flex-1 items-center">
              {/* <View className="w-12 h-12 rounded-full bg-red-100 items-center justify-center">
                <Ionicons 
                  name="close-circle-outline" 
                  size={20} 
                  color="#ef4444" 
                />
              </View> */}
              <Text className="text-xl font-bold mt-2 text-red-600">
                {absentCount}
              </Text>
              <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Absent
              </Text>
            </View>
          </View>

          {/* Progress bar
          <View className="mt-4">
            <View className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <View 
                className="h-full rounded-full"
                style={{ 
                  width: `${attendanceRate}%`,
                  backgroundColor: getAttendanceColor(attendanceRate)
                }} 
              />
            </View>
          </View> */}

          {/* Last attendance footer */}
          {lastAttendanceDate && (
            <View className={`flex-row items-center mt-3 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <Ionicons 
                name="time-outline" 
                size={14} 
                color={isDarkMode ? "#9ca3af" : "#6b7280"} 
              />
              <Text className={`ml-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Last marked: {new Date(lastAttendanceDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="flex-1 justify-center items-center">
          <Text className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading statistics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (courses.length === 0) {
    return (
      <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className={`px-5 py-4 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Summary</Text>
        </View>
        <View className="flex-1 justify-center items-center px-10">
          <Ionicons name="bar-chart-outline" size={64} color={isDarkMode ? "#6b7280" : "#9ca3af"} />
          <Text className={`text-xl font-semibold mt-4 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No data to display</Text>
          <Text className={`text-base mt-2 text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Add courses and mark attendance to see statistics</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className={`flex-row justify-between items-center px-5 py-4 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Summary</Text>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity 
            onPress={toggleTheme}
            className="p-2"
          >
            <Ionicons 
              name={isDarkMode ? 'sunny' : 'moon'} 
              size={24} 
              color={isDarkMode ? '#fbbf24' : '#6366f1'} 
            />
          </TouchableOpacity>
          <TouchableOpacity className="p-2" onPress={handleExportData}>
            <Ionicons name="share-outline" size={20} color={isDarkMode ? "#60a5fa" : "#3b82f6"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 pb-5">


        {/* Course-wise Statistics */}
        <View className="p-4">
          {courseStats.map(renderCourseCard)}
        </View>

        {/* Quick Insights */}
        <View className={`mx-4 mb-4 p-6 rounded-2xl shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <Text className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quick Insights</Text>
          
          {(() => {
            const bestCourse = courseStats.reduce((best, current) => 
              current.attendanceRate > best.attendanceRate ? current : best
            , courseStats[0]);
            
            const worstCourse = courseStats.reduce((worst, current) => 
              current.attendanceRate < worst.attendanceRate ? current : worst
            , courseStats[0]);

            const totalDaysAttended = overallStats.totalPresent;
            const recentActivity = attendanceRecords
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5);

            return (
              <View className="gap-3">
                {bestCourse && bestCourse.totalClasses > 0 && (
                  <View className="flex-row items-center">
                    <Ionicons name="trophy-outline" size={20} color="#10b981" />
                    <Text className={`ml-3 text-xl flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Best attendance: <Text className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{bestCourse.course.name}</Text> ({bestCourse.attendanceRate.toFixed(1)}%)
                    </Text>
                  </View>
                )}
                
                {worstCourse && worstCourse.totalClasses > 0 && worstCourse.attendanceRate < 80 && (
                  <View className="flex-row items-center">
                    <Ionicons name="warning-outline" size={20} color="#f59e0b" />
                    <Text className={`ml-3 text-xl flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Needs attention: <Text className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{worstCourse.course.name}</Text> ({worstCourse.attendanceRate.toFixed(1)}%)
                    </Text>
                  </View>
                )}
                
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={20} color={isDarkMode ? "#60a5fa" : "#3b82f6"} />
                  <Text className={`ml-3 text-xl flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Total days attended: <Text className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{totalDaysAttended}</Text>
                  </Text>
                </View>

                {recentActivity.length > 0 && (
                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={20} color={isDarkMode ? "#9ca3af" : "#6b7280"} />
                    <Text className={`ml-3 text-xl flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Last marked: <Text className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {new Date(recentActivity[0].date).toLocaleDateString()}
                      </Text>
                    </Text>
                  </View>
                )}
              </View>
            );
          })()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
