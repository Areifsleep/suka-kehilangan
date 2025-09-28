import React, { createContext, useContext, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (message, type = 'default', duration = 5000) => {
    const id = Date.now();
    const newAlert = { id, message, type };
    
    setAlerts(prev => [...prev, newAlert]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeAlert(id);
      }, duration);
    }
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const showSuccess = (message, duration) => showAlert(message, 'success', duration);
  const showError = (message, duration) => showAlert(message, 'destructive', duration);
  const showWarning = (message, duration) => showAlert(message, 'warning', duration);
  const showInfo = (message, duration) => showAlert(message, 'default', duration);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="h-4 w-4" />;
      case 'destructive':
        return <FiXCircle className="h-4 w-4" />;
      case 'warning':
        return <FiAlertTriangle className="h-4 w-4" />;
      default:
        return <FiInfo className="h-4 w-4" />;
    }
  };

  return (
    <AlertContext.Provider value={{ 
      showAlert, 
      showSuccess, 
      showError, 
      showWarning, 
      showInfo,
      removeAlert 
    }}>
      {children}
      
      {/* Alert Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
        {alerts.map((alert) => (
          <Alert key={alert.id} variant={alert.variant || alert.type} className="relative">
            {getIcon(alert.type)}
            <AlertDescription className="pl-6">
              {alert.message}
            </AlertDescription>
            <button
              onClick={() => removeAlert(alert.id)}
              className="absolute top-2 right-2 text-current opacity-50 hover:opacity-100"
            >
              <FiXCircle className="h-3 w-3" />
            </button>
          </Alert>
        ))}
      </div>
    </AlertContext.Provider>
  );
};