import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAlertHelpers } from '../../hooks/AlertHelpers';
import { type AttendanceRecord } from '../../hooks/Storage';

export default function AttendanceScreen() {
  const { 
    courses, 
    attendanceRecords, 
    addAttendanceRecord, 
    updateAttendanceRecord, 
    isLoading 
  } = useData();

  const { showError } = useAlertHelpers();
  
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleMarkAttendance = async (status: 'present' | 'absent', courseId: string) => {
    try {
      const existingRecord = attendanceRecords.find(
        record => record.courseId === courseId && record.date === selectedDate
      );

      const recordData: AttendanceRecord = {
        id: existingRecord?.id || Date.now().toString(),
        courseId: courseId,
        date: selectedDate,
        status,
      };

      if (existingRecord) {
        // Update existing record
        await updateAttendanceRecord(recordData);
      } else {
        // Add new record
        await addAttendanceRecord(recordData);
      }
      

    } catch (error) {
      showError('Failed to mark attendance. Please try again.');
    }
  };

  const handleDateChange = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    if (direction === 'prev') {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  const resetToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  if (isLoading) {
    return (
      <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <View className="flex-1 justify-center items-center">
          <Text className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (courses.length === 0) {
    return (
      <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <View className='flex-1 justify-center items-center px-10'>
          <Ionicons name="book-outline" size={64} color={isDarkMode ? "#6b7280" : "#9ca3af"} />
          <Text className={`text-lg mt-4 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No courses available</Text>
          <Text className={`text-base mt-2 text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Add courses in the Courses tab to start marking attendance</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <ScrollView className='flex-1' style={{ flexGrow: 1 }}>
        {/* Header */}
        <View className={`p-4 border-b flex-row justify-between items-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mark Attendance</Text>
          <TouchableOpacity 
            onPress={toggleTheme}
            className="p-2 rounded-full bg-blue-100"
          >
            <Ionicons 
              name={isDarkMode ? 'sunny' : 'moon'} 
              size={26} 
              color={isDarkMode ? '#fbbf24' : '#6366f1'} 
            />
          </TouchableOpacity>
        </View>
        {/* Date Selection */}
        <View className={`p-5 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} rounded-b-3xl`}>
          <View className="flex-row items-center justify-between mb-2">
            <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Select Date</Text>
            {!isToday && (
              <TouchableOpacity className='px-4 py-1 bg-blue-600 rounded-full' onPress={resetToToday}>
                <Text className='text-white text-xs font-semibold'>
                  Go to Today
                </Text>
              </TouchableOpacity>
            )}
          </View>
            <View className='flex-row items-center justify-center'>
            <TouchableOpacity className='px-3 py-2 rounded-full bg-[rgba(229, 231, 235, 0.8)]' onPress={() => handleDateChange('prev')}>
              <Ionicons name="chevron-back" size={28} color={isDarkMode ? "#ffffff" : "#000000"} />
            </TouchableOpacity>
            <TouchableOpacity 
              className={`flex-1 mx-4 px-4 py-3 rounded-2xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}
              onPress={() => setShowDatePicker(true)}
            >
              <View className="flex-row items-center justify-center">
              <Ionicons name="calendar" size={22} color={isDarkMode ? "#ffffff" : "#000000"} />
              <Text className={`ml-2 font-semibold text-lg text-center ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {new Date(selectedDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                })}
              </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="px-3 py-2 rounded-full bg-[rgba(229, 231, 235, 0.8)]" onPress={() => handleDateChange('next')}>
              <Ionicons name="chevron-forward" size={28} color={isDarkMode ? "#ffffff" : "#000000"} />
            </TouchableOpacity>
            </View>
            
            {/* Date Picker Modal */}
            {showDatePicker && (
            <DateTimePicker
              value={new Date(selectedDate)}
              mode="date"
              display="default"
              onChange={(event: import("@react-native-community/datetimepicker").DateTimePickerEvent, date?: Date) => {
                setShowDatePicker(false);
                if (date) {
                  setSelectedDate(date.toISOString().split('T')[0]);
                }
              }}
            />
            )}
        </View>
        {/* Course Cards */}
        <View className="px-4 pb-8">
          {courses.map((course) => {
            const existingRecord = attendanceRecords.find(
              record => record.courseId === course.id && record.date === selectedDate
            );
            const currentStatus = existingRecord?.status || null;

            return (
              <View 
                key={course.id}
                className={`mb-6 p-5 rounded-2xl shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
              >
                <View className='flex flex-row justify-between items-start'>
                  <View className="mb-4">
                    <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {course.name}
                    </Text>
                    <Text className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {course.code} • {course.instructor}
                    </Text>
                  </View>
                  {currentStatus && (
                    <View className="mb-3">
                      <View className={`self-start flex-row items-center px-3 py-1 rounded-full ${currentStatus === 'present' ? 'bg-green-100' : 'bg-red-100'}`}>
                        <Ionicons
                          name={currentStatus === 'present' ? 'checkmark-circle' : 'close-circle'}
                          size={18}
                          color={currentStatus === 'present' ? '#059669' : '#dc2626'}
                        />
                        <Text className={`text-sm font-semibold ml-1 ${currentStatus === 'present' ? 'text-green-700' : 'text-red-700'}`}>
                          {currentStatus === 'present' ? 'Present' : 'Absent'}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
                <View className="flex-row gap-4 mt-2">
                  <TouchableOpacity
                    className={`flex-1 flex-row items-center justify-center py-3 rounded-full border-2 shadow-sm ${
                      currentStatus === 'present' 
                        ? 'bg-green-500 border-green-500' 
                        : isDarkMode 
                          ? 'bg-gray-700 border-gray-600' 
                          : 'bg-gray-50 border-gray-300'
                    }`}
                    onPress={() => handleMarkAttendance('present', course.id)}
                  >
                    <Ionicons 
                      name="checkmark-circle" 
                      size={22} 
                      color={currentStatus === 'present' ? 'white' : (isDarkMode ? '#6b7280' : '#9ca3af')} 
                    />
                    <Text className={`ml-2 font-bold text-lg ${
                      currentStatus === 'present' 
                        ? 'text-white' 
                        : isDarkMode 
                          ? 'text-gray-300' 
                          : 'text-gray-700'
                    }`}>
                      Present
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`flex-1 flex-row items-center justify-center py-3 rounded-full border-2 shadow-sm ${
                      currentStatus === 'absent' 
                        ? 'bg-red-500 border-red-500' 
                        : isDarkMode 
                          ? 'bg-gray-700 border-gray-600' 
                          : 'bg-gray-50 border-gray-300'
                    }`}
                    onPress={() => handleMarkAttendance('absent', course.id)}
                  >
                    <Ionicons 
                      name="close-circle" 
                      size={22} 
                      color={currentStatus === 'absent' ? 'white' : (isDarkMode ? '#6b7280' : '#9ca3af')} 
                    />
                    <Text className={`ml-2 font-bold text-lg ${
                      currentStatus === 'absent' 
                        ? 'text-white' 
                        : isDarkMode 
                          ? 'text-gray-300' 
                          : 'text-gray-700'
                    }`}>
                      Absent
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}