import { AlertOptions, useAlert } from '../contexts/AlertContext';

/**
 * Custom hook that provides easy-to-use alert methods
 */
export const useAlertHelpers = () => {
  const { showAlert } = useAlert();

  /**
   * Show a simple info alert
   */
  const showInfo = (title: string, message?: string, onPress?: () => void) => {
    showAlert({
      type: 'info',
      title,
      message,
      buttons: [{ text: 'OK', onPress }],
    });
  };

  /**
   * Show a success alert
   */
  const showSuccess = (title: string, message?: string, onPress?: () => void) => {
    showAlert({
      type: 'success',
      title,
      message,
      buttons: [{ text: 'OK', onPress }],
    });
  };

  /**
   * Show a warning alert
   */
  const showWarning = (title: string, message?: string, onPress?: () => void) => {
    showAlert({
      type: 'warning',
      title,
      message,
      buttons: [{ text: 'OK', onPress }],
    });
  };

  /**
   * Show an error alert
   */
  const showError = (title: string, message?: string, onPress?: () => void) => {
    showAlert({
      type: 'error',
      title,
      message,
      buttons: [{ text: 'OK', onPress }],
    });
  };

  /**
   * Show a confirmation dialog
   */
  const showConfirm = (
    title: string,
    message?: string,
    onConfirm?: () => void,
    onCancel?: () => void,
    confirmText: string = 'Confirm',
    cancelText: string = 'Cancel'
  ) => {
    showAlert({
      type: 'warning',
      title,
      message,
      buttons: [
        { text: cancelText, style: 'cancel', onPress: onCancel },
        { text: confirmText, style: 'default', onPress: onConfirm },
      ],
    });
  };

  /**
   * Show a destructive confirmation dialog (for delete actions)
   */
  const showDestructiveConfirm = (
    title: string,
    message?: string,
    onConfirm?: () => void,
    onCancel?: () => void,
    confirmText: string = 'Delete',
    cancelText: string = 'Cancel'
  ) => {
    showAlert({
      type: 'error',
      title,
      message,
      buttons: [
        { text: cancelText, style: 'cancel', onPress: onCancel },
        { text: confirmText, style: 'destructive', onPress: onConfirm },
      ],
    });
  };

  /**
   * Show a custom alert with multiple options
   */
  const showCustom = (options: AlertOptions) => {
    showAlert(options);
  };

  return {
    showInfo,
    showSuccess,
    showWarning,
    showError,
    showConfirm,
    showDestructiveConfirm,
    showCustom,
  };
};

/**
 * Predefined alert configurations for common attendance app scenarios
 */
export const AttendanceAlerts = {
  /**
   * Course management alerts
   */
  course: {
    deleteConfirm: (courseName: string, onConfirm: () => void) => ({
      type: 'delete' as const,
      title: 'Delete Course',
      message: `Are you sure you want to delete "${courseName}"? This will also delete all attendance records for this course. This action cannot be undone.`,
      buttons: [
        { text: 'Cancel', style: 'cancel' as const },
        { text: 'Delete', style: 'destructive' as const, onPress: onConfirm },
      ],
    }),
    
    createSuccess: (courseName: string) => ({
      type: 'success' as const,
      title: 'Course Created',
      message: `"${courseName}" has been successfully created.`,
    }),
    
    updateSuccess: (courseName: string) => ({
      type: 'success' as const,
      title: 'Course Updated',
      message: `"${courseName}" has been successfully updated.`,
    }),
    
    validationError: (field: string) => ({
      type: 'error' as const,
      title: 'Validation Error',
      message: `Please enter a valid ${field}.`,
    }),
  },

  /**
   * Attendance tracking alerts
   */
  attendance: {
    markSuccess: (status: 'present' | 'absent', courseName: string, date: string) => ({
      type: 'success' as const,
      title: 'Attendance Marked',
      message: `Marked as ${status} for ${courseName} on ${date}.`,
    }),
    
    updateConfirm: (currentStatus: string, newStatus: string, onConfirm: () => void) => ({
      type: 'warning' as const,
      title: 'Update Attendance',
      message: `Change attendance from ${currentStatus} to ${newStatus}?`,
      buttons: [
        { text: 'Cancel', style: 'cancel' as const },
        { text: 'Update', style: 'default' as const, onPress: onConfirm },
      ],
    }),
    
    dateError: () => ({
      type: 'error' as const,
      title: 'Invalid Date',
      message: 'Please select a valid date.',
    }),
    
    courseError: () => ({
      type: 'error' as const,
      title: 'No Course Selected',
      message: 'Please select a course to mark attendance.',
    }),
  },



    /**
     * Record management alerts
     */
    record: {
        deleteSuccess: () => ({
            type: 'success' as const,
            title: 'Record Deleted',
            message: 'The attendance record has been successfully deleted.',
        }),
        deleteError: () => ({
            type: 'error' as const,
            title: 'Delete Failed',
            message: 'Failed to delete the attendance record. Please try again.',
        }),
    },

  /**
   * Data management alerts
   */
  data: {
    exportSuccess: () => ({
      type: 'success' as const,
      title: 'Export Successful',
      message: 'Your attendance data has been exported successfully.',
    }),
    
    importSuccess: (recordCount: number) => ({
      type: 'success' as const,
      title: 'Import Successful',
      message: `Successfully imported ${recordCount} attendance records.`,
    }),
    
    clearAllConfirm: (onConfirm: () => void) => ({
      type: 'error' as const,
      title: 'Clear All Data',
      message: 'Are you sure you want to clear all courses and attendance records? This action cannot be undone.',
      buttons: [
        { text: 'Cancel', style: 'cancel' as const },
        { text: 'Clear All', style: 'destructive' as const, onPress: onConfirm },
      ],
    }),
  },

  /**
   * General app alerts
   */
  general: {
    networkError: () => ({
      type: 'error' as const,
      title: 'Network Error',
      message: 'Please check your internet connection and try again.',
    }),
    
    permissionDenied: (permission: string) => ({
      type: 'warning' as const,
      title: 'Permission Required',
      message: `This app needs ${permission} permission to function properly. Please grant permission in your device settings.`,
    }),
    
    comingSoon: () => ({
      type: 'info' as const,
      title: 'Coming Soon',
      message: 'This feature is coming soon in a future update.',
    }),
  },
};
