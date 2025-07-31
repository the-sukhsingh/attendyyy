import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';
import { AttendanceAlerts, useAlertHelpers } from '../../hooks/AlertHelpers';
import { type Course } from '../../hooks/Storage';

export default function CourseScreen() {
  const { courses, addCourse, updateCourse, deleteCourse, isLoading } = useData();
  const { isDarkMode, toggleTheme } = useTheme();
  const { showError, showCustom } = useAlertHelpers();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    instructor: '',
  });

  useEffect(() => {
    if (editingCourse) {
      setFormData({
        name: editingCourse.name,
        code: editingCourse.code,
        instructor: editingCourse.instructor,
      });
    } else {
      setFormData({
        name: '',
        code: '',
        instructor: '',
      });
    }
  }, [editingCourse]);

  const handleSaveCourse = async () => {
    if (!formData.name.trim() || !formData.code.trim()) {
      showError('Validation Error', 'Course name and code are required');
      return;
    }

    const courseData: Course = {
      id: editingCourse?.id || Date.now().toString(),
      name: formData.name.trim(),
      code: formData.code.trim(),
      instructor: formData.instructor.trim(),
      createdAt: editingCourse?.createdAt || new Date().toISOString(),
    };

    try {
      if (editingCourse) {
        // Edit existing course
        await updateCourse(courseData);
      } else {
        // Add new course
        await addCourse(courseData);
      }

      setModalVisible(false);
      setEditingCourse(null);
      setFormData({ name: '', code: '', instructor: '' });
    } catch (error) {
      showError('Error', 'Failed to save course. Please try again.');
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    const courseName = course?.name || 'this course';
    
    showCustom(AttendanceAlerts.course.deleteConfirm(courseName, async () => {
      try {
        await deleteCourse(courseId);
        showError('Success', `${courseName} has been deleted successfully`);
      } catch (error) {
        showError('Error', 'Failed to delete course. Please try again.');
      } 
    }));
  };

  const openModal = (course?: Course) => {
    setEditingCourse(course || null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingCourse(null);
    setFormData({ name: '', code: '', instructor: '' });
  };

  const renderCourseItem = ({ item }: { item: Course }) => (
    <View 
      className={`rounded-3xl mb-4 relative overflow-hidden ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'}`}
      style={{
        shadowColor: isDarkMode ? '#3b82f6' : '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: isDarkMode ? 0.2 : 0.1,
        borderWidth: 1,
        borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.8)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <View className="p-3">
        <Text className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</Text>
        <View className="flex-row items-center mb-2">
          <View className={`px-3 py-1 rounded-full ${isDarkMode ? 'bg-blue-900/40' : 'bg-blue-100'}`}>
            <Text className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>{item.code}</Text>
          </View>
        </View>
        
        {item.instructor && (
          <View className="flex-row items-center mb-3">
            <Ionicons name="person" size={16} color={isDarkMode ? "#9ca3af" : "#6b7280"} />
            <Text className={`text-base ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.instructor}</Text>
          </View>
        )}
        
        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={14} color={isDarkMode ? "#9ca3af" : "#6b7280"} />
          <Text className={`text-xs ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      <View className="absolute top-0 right-0 flex-row p-4 gap-2">
        <TouchableOpacity
          className={`w-9 h-9 rounded-full justify-center items-center ${isDarkMode ? 'bg-gray-700/80' : 'bg-gray-100/80'}`}
          onPress={() => openModal(item)}
        >
          <AntDesign name="edit" size={18} color={isDarkMode ? "#60a5fa" : "#2563eb"} />
        </TouchableOpacity>
        <TouchableOpacity
          className={`w-9 h-9 rounded-full justify-center items-center ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100/80'}`}
          onPress={() => handleDeleteCourse(item.id)}
        >
          <Feather name="trash-2" size={18} color={isDarkMode ? "#f87171" : "#dc2626"} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="flex-1 justify-center items-center">
          <Text className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading courses...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className={`flex-row justify-between items-center px-5 py-4 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Courses</Text>
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
          <TouchableOpacity
            onPress={() => openModal()}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
          >
            <Ionicons name="add" size={24} color={isDarkMode ? "white" : "#374151"} />
          </TouchableOpacity>
        </View>
      </View>

      {
        courses.length === 0 ? (
          <View className="flex-1 justify-center items-center px-10">
            <Ionicons name="book-outline" size={72} color={isDarkMode ? "#60a5fa" : "#3b82f6"} />
            <Text className={`text-2xl font-bold mt-6 text-center ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>No courses yet</Text>
            <Text className={`text-lg mt-3 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Add your first course to get started</Text>
            <TouchableOpacity
              onPress={() => openModal()}
              className={`mt-6 px-6 py-3 rounded-full flex-row items-center ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'}`}
            >
              <Ionicons name="add" size={22} color="white" />
              <Text className="ml-2 text-lg font-semibold text-white">Add Course</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={courses}
            keyExtractor={(item) => item.id}
            renderItem={renderCourseItem}
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          />
        )
      }


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
        className='flex-1 justify-center items-center'
      >
        <View className="flex-1 justify-center items-center bg-black/20">
          <View className={`rounded-3xl w-11/12 max-h-[85%] border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`} style={{
            borderRadius: 28,
            elevation: 4,
            shadowColor: isDarkMode ? 'white' : 'black',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 8,
          }}>
            <View className={`flex-row justify-between items-center p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{editingCourse ? 'Edit Course' : 'Add New Course'}</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={28} color={isDarkMode ? "#9ca3af" : "#6b7280"} />
              </TouchableOpacity>
            </View>
            <View className="p-4">
              <Text className={`text-base font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Course Name *</Text>
              <TextInput
                value={formData.name}
                onChangeText={text => setFormData({ ...formData, name: text })}
                className={`border rounded-xl p-4 text-lg mb-3 ${isDarkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-gray-50 text-gray-900'}`}
                placeholder="e.g., Introduction to Computer Science"
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#6b7280"}
                inputMode="text"
              />

              <Text className={`text-base font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Course Code *</Text>
              <TextInput
                value={formData.code}
                onChangeText={text => setFormData({ ...formData, code: text })}
                className={`border rounded-xl p-4 text-lg mb-3 ${isDarkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-gray-50 text-gray-900'}`}
                placeholder="e.g., CS101"
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#6b7280"}
                inputMode="text"
              />

              <Text className={`text-base font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Instructor</Text>
              <TextInput
                value={formData.instructor}
                onChangeText={text => setFormData({ ...formData, instructor: text })}
                className={`border rounded-xl p-4 text-lg mb-3 ${isDarkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-gray-50 text-gray-900'}`}
                placeholder="e.g., Dr. Smith"
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#6b7280"}
                inputMode="text"
              />
              <View className="flex w-full items-center justify-end flex-row">
                <TouchableOpacity
                  onPress={handleSaveCourse}
                  className={`rounded-full px-7 py-3 mt-4 shadow-md ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'}`}
                >
                  <Text className="text-center text-xl font-bold text-white">{editingCourse ? 'Update' : 'Save'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
