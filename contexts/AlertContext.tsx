import { BlurView } from 'expo-blur';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import {
    Dimensions,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { useTheme } from './ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface AlertButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

export interface AlertOptions {
  title?: string;
  message?: string;
  buttons?: AlertButton[];
  type?: 'info' | 'success' | 'warning' | 'error' | 'delete';
  cancelable?: boolean;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alertOptions, setAlertOptions] = useState<AlertOptions | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { isDarkMode } = useTheme();
  
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  const showAlert = (options: AlertOptions) => {
    setAlertOptions(options);
    setIsVisible(true);
    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withSpring(1, {
      damping: 20,
      stiffness: 300,
    });
  };

  const hideAlert = () => {
    opacity.value = withTiming(0, { duration: 200 });
    scale.value = withTiming(0.8, { duration: 200 }, () => {
      runOnJS(setIsVisible)(false);
      runOnJS(setAlertOptions)(null);
    });
  };

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    hideAlert();
  };

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const alertStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getAlertIcon = (type?: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'delete':
        return '🗑️';
      default:
        return 'ℹ️';
    }
  };

  const getAlertColor = (type?: string) => {
    switch (type) {
      case 'success':
        return '#4CAF50';
      case 'warning':
        return '#FF9800';
      case 'error':
        return '#F44336';
      default:
        return '#2196F3';
    }
  };

  const renderButtons = () => {
    if (!alertOptions?.buttons || alertOptions.buttons.length === 0) {
      return (
        <TouchableOpacity
          style={[styles.button, styles.defaultButton, { backgroundColor: getAlertColor(alertOptions?.type) }]}
          onPress={hideAlert}
          activeOpacity={1}
        >
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
      );
    }

    return alertOptions.buttons.map((button, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.button,
          button.style === 'cancel' && styles.cancelButton,
          button.style === 'destructive' && styles.destructiveButton,
          button.style === 'default' && [styles.defaultButton, { backgroundColor: getAlertColor(alertOptions?.type) }],
          alertOptions.buttons!.length > 1 && index > 0 && styles.buttonMargin,
        ]}
        onPress={() => handleButtonPress(button)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.buttonText,
            button.style === 'cancel' && styles.cancelButtonText,
            button.style === 'destructive' && styles.destructiveButtonText,
          ]}
        >
          {button.text}
        </Text>
      </TouchableOpacity>
    ));
  };

  if (!isVisible) {
    return (
      <AlertContext.Provider value={{ showAlert, hideAlert }}>
        {children}
      </AlertContext.Provider>
    );
  }

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <Modal
        transparent={true}
        visible={isVisible}
        animationType="slide"
        onRequestClose={alertOptions?.cancelable !== false ? hideAlert : undefined}
      >
        <Animated.View style={[styles.overlay, overlayStyle]}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={20} style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0)' }]} />
          )}
          
          <TouchableOpacity
            style={styles.overlayTouch}
            activeOpacity={1}
            onPress={alertOptions?.cancelable !== false ? hideAlert : undefined}
          >
            <Animated.View
              style={[
                styles.alertContainer,
                {
                  backgroundColor: isDarkMode ? '#1B1C3E' : '#ffffff' },
                alertStyle,
              ]}
            >
              {alertOptions?.type && (
                <View style={styles.iconContainer}>
                  <Text style={[styles.icon, { color: getAlertColor(alertOptions.type) }]}>
                    {getAlertIcon(alertOptions.type)}
                  </Text>
                </View>
              )}
              
              {alertOptions?.title && (
                <Text style={[
                  styles.title,
                  { color: isDarkMode ? '#ffffff' : '#000000' }
                ]}>
                  {alertOptions.title}
                </Text>
              )}
              
              {alertOptions?.message && (
                <Text style={[
                  styles.message,
                  { color: isDarkMode ? '#cccccc' : '#666666' }
                ]}>
                  {alertOptions.message}
                </Text>
              )}
              
              <View style={styles.buttonContainer}>
                {renderButtons()}
              </View>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </AlertContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  alertContainer: {
    width: SCREEN_WIDTH * 0.85,
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  buttonMargin: {
    marginLeft: 12,
  },
  defaultButton: {
    backgroundColor: '#2196F3',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  destructiveButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  cancelButtonText: {
    color: '#333333',
  },
  destructiveButtonText: {
    color: '#ffffff',
  },
});

export default AlertProvider;