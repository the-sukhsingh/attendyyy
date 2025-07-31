import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { STORAGE_KEYS, type AttendanceRecord, type Course } from '../hooks/Storage';

interface DataContextType {
  // Courses
  courses: Course[];
  setCourses: (courses: Course[] | ((prev: Course[]) => Course[])) => Promise<void>;
  addCourse: (course: Course) => Promise<void>;
  updateCourse: (course: Course) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  
  // Attendance Records
  attendanceRecords: AttendanceRecord[];
  setAttendanceRecords: (records: AttendanceRecord[] | ((prev: AttendanceRecord[]) => AttendanceRecord[])) => Promise<void>;
  addAttendanceRecord: (record: AttendanceRecord) => Promise<void>;
  updateAttendanceRecord: (record: AttendanceRecord) => Promise<void>;
  deleteAttendanceRecord: (recordId: string) => Promise<void>;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Utility functions
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [courses, setCoursesState] = useState<Course[]>([]);
  const [attendanceRecords, setAttendanceRecordsState] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [coursesData, recordsData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.COURSES),
        AsyncStorage.getItem(STORAGE_KEYS.ATTENDANCE_RECORDS)
      ]);
      
      setCoursesState(coursesData ? JSON.parse(coursesData) : []);
      setAttendanceRecordsState(recordsData ? JSON.parse(recordsData) : []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Course management functions
  const setCourses = useCallback(async (newCourses: Course[] | ((prev: Course[]) => Course[])) => {
    try {
      setError(null);
      const updatedCourses = typeof newCourses === 'function' ? newCourses(courses) : newCourses;
      
      await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updatedCourses));
      setCoursesState(updatedCourses);
    } catch (err) {
      console.error('Error updating courses:', err);
      setError(err instanceof Error ? err.message : 'Error updating courses');
    }
  }, [courses]);

  const addCourse = useCallback(async (course: Course) => {
    await setCourses(prev => [...prev, course]);
  }, [setCourses]);

  const updateCourse = useCallback(async (updatedCourse: Course) => {
    await setCourses(prev => 
      prev.map(course => course.id === updatedCourse.id ? updatedCourse : course)
    );
  }, [setCourses]);

  const deleteCourse = useCallback(async (courseId: string) => {
    try {
      // Delete course
      await setCourses(prev => prev.filter(course => course.id !== courseId));
      
      // Also delete all attendance records for this course
      await setAttendanceRecords(prev => prev.filter(record => record.courseId !== courseId));
    } catch (err) {
      console.error('Error deleting course:', err);
      setError(err instanceof Error ? err.message : 'Error deleting course');
    }
  }, [setCourses]);

  // Attendance record management functions
  const setAttendanceRecords = useCallback(async (newRecords: AttendanceRecord[] | ((prev: AttendanceRecord[]) => AttendanceRecord[])) => {
    try {
      setError(null);
      const updatedRecords = typeof newRecords === 'function' ? newRecords(attendanceRecords) : newRecords;
      
      await AsyncStorage.setItem(STORAGE_KEYS.ATTENDANCE_RECORDS, JSON.stringify(updatedRecords));
      setAttendanceRecordsState(updatedRecords);
    } catch (err) {
      console.error('Error updating attendance records:', err);
      setError(err instanceof Error ? err.message : 'Error updating attendance records');
    }
  }, [attendanceRecords]);

  const addAttendanceRecord = useCallback(async (record: AttendanceRecord) => {
    await setAttendanceRecords(prev => [...prev, record]);
  }, [setAttendanceRecords]);

  const updateAttendanceRecord = useCallback(async (updatedRecord: AttendanceRecord) => {
    await setAttendanceRecords(prev => 
      prev.map(record => record.id === updatedRecord.id ? updatedRecord : record)
    );
  }, [setAttendanceRecords]);

  const deleteAttendanceRecord = useCallback(async (recordId: string) => {
    await setAttendanceRecords(prev => prev.filter(record => record.id !== recordId));
  }, [setAttendanceRecords]);

  // Refresh data function
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const value: DataContextType = {
    courses,
    setCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    attendanceRecords,
    setAttendanceRecords,
    addAttendanceRecord,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    isLoading,
    error,
    refreshData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
