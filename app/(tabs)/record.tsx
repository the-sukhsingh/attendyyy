import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { AttendanceAlerts, useAlertHelpers } from '../../hooks/AlertHelpers';

import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';
import { type AttendanceRecord } from '../../hooks/Storage';

type FilterOption = 'all' | string; // 'all' or courseId

export default function RecordScreen() {
  const { 
    courses, 
    attendanceRecords, 
    deleteAttendanceRecord, 
    isLoading 
  } = useData();
  
  const { isDarkMode, toggleTheme } = useTheme();
  const {showCustom, showError} = useAlertHelpers();
  
  const [filterCourse, setFilterCourse] = useState<FilterOption>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filter and sort records
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = attendanceRecords;
    
    // Filter by course
    if (filterCourse !== 'all') {
      filtered = filtered.filter(record => record.courseId === filterCourse);
    }
    
    // Sort by date
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });
  }, [attendanceRecords, filterCourse, sortOrder]);

  const handleDeleteRecord = (recordId: string) => {

    showCustom({
      title: 'Delete Record',
      message: 'Are you sure you want to delete this attendance record?',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAttendanceRecord(recordId);
              AttendanceAlerts.record.deleteSuccess();
            } catch (error) {
              showError('Failed to delete record. Please try again.');
            }
          }
        }
      ]
    })
  };
  const getCourseInfo = (courseId: string) => {
    return courses.find(course => course.id === courseId);
  };



  const renderRecord = ({ item }: { item: AttendanceRecord }) => {
    const course = getCourseInfo(item.courseId);
    const isPresent = item.status === 'present';
    
    return (
      <View className={`rounded-2xl shadow-lg p-5 mx-4 my-2 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{course?.name || 'Unknown Course'}</Text>
            <Text className={`text-base font-semibold mt-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{course?.code || 'N/A'}</Text>
          </View>
          <TouchableOpacity
            className="p-2 rounded-full bg-red-100"
            onPress={() => handleDeleteRecord(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={18} color={isDarkMode ? "#9ca3af" : "#6b7280"} />
            <Text className={`ml-2 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {new Date(item.date).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>
          <View className={`flex-row items-center px-4 py-1 rounded-full shadow-sm ${isPresent ? 'bg-green-500' : 'bg-red-500'}`}>
            <Ionicons 
              name={isPresent ? 'checkmark-circle' : 'close-circle'} 
              size={18} 
              color="white" 
            />
            <Text className="text-base font-bold text-white ml-1">
              {isPresent ? 'Present' : 'Absent'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    
    return (
      <View>
       

        {/* Filters */}
        <View className={`mx-4 mt-4 my-2 p-5 rounded-2xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <View className="mb-3">
            <Text className={`text-base font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Filter by Course:</Text>
            <View className={`border rounded-xl ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`}>
              <Picker
                selectedValue={filterCourse}
                onValueChange={(itemValue: string) => setFilterCourse(itemValue)}
                style={{ 
                  // height: 40, 
                  color: isDarkMode ? '#ffffff' : '#000000',
                  backgroundColor: isDarkMode ? '#1f2937' : '#ffffff'
                }}
                dropdownIconColor={isDarkMode ? '#ffffff' : '#000000'}
              >
                <Picker.Item label="All Courses" value="all" color={isDarkMode ? '#ffffff' : '#000000'} style={{ backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }} />
                {courses.map((course) => (
                  <Picker.Item
                    key={course.id}
                    label={`${course.name} (${course.code})`}
                    value={course.id}
                    style={{ color: isDarkMode ? '#ffffff' : '#000000', backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }}
                  />
                ))}
              </Picker>
            </View>
          </View>
          <TouchableOpacity
            className={`flex-row items-center self-end px-4 py-2 rounded-full shadow-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            onPress={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          >
            <Ionicons 
              name={sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'} 
              size={18} 
              color={isDarkMode ? "#60a5fa" : "#3b82f6"} 
            />
            <Text className={`ml-1 text-base font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Date {sortOrder === 'desc' ? '(Newest)' : '(Oldest)'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Results Count */}
        <View className="px-4 py-2">
          <Text className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {filteredAndSortedRecords.length} record{filteredAndSortedRecords.length !== 1 ? 's' : ''} found
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="flex-1 justify-center items-center">
          <Text className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading records...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (attendanceRecords.length === 0) {
    return (
      <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className={`px-5 py-4 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Attendance Records</Text>
        </View>
        <View className="flex-1 justify-center items-center px-10">
          <Ionicons name="document-text-outline" size={72} color={isDarkMode ? "#60a5fa" : "#3b82f6"} />
          <Text className={`text-2xl font-bold mt-6 text-center ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>No attendance records yet</Text>
          <Text className={`text-lg mt-3 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Start marking attendance to see records here</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className={`flex-row justify-between items-center px-5 py-4 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Attendance Records</Text>
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
      </View>

      <FlatList
        data={filteredAndSortedRecords}
        renderItem={renderRecord}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}