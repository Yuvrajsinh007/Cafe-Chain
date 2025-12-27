import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import dummyData from '../assets/data.js';

// Create context
const AppContext = createContext();

// Initial state
const initialState = {
  isLoading: true,
  isAuthenticated: false,
  user: null,
  cafeStatus: undefined,
  setupCompleted: false,
  cafeInfo: null,
  isOpen: false,
  partnerCafes: [],
  announcements: [],
  leaderboard: [],
  events: [],
  transactions: [],
  metrics: {},
  performance: {},
  pendingOtp: null,
  gallery: []
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    // Initialize app by loading data from localStorage or using dummy data

    case 'INIT_APP': {
      const storedData = loadFromStorage();
      if (storedData) {
        if (storedData.user?.token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedData.user.token}`;
        }
        return {
          ...state,
          ...storedData,
          isLoading: false,
          cafeStatus: storedData.cafeStatus || storedData.user?.status
        };
      } else {
        return {
          ...state,
          partnerCafes: dummyData.partnerCafes,
          announcements: dummyData.announcements,
          leaderboard: dummyData.leaderboard,
          events: dummyData.events,
          transactions: dummyData.transactions,
          metrics: dummyData.metrics,
          performance: dummyData.performance,
          isLoading: false
        };
      }
    }
    
    // User authentication
    case 'LOGIN': {
      const newState = {
        ...state,
        isAuthenticated: true,
        user: { ...action.payload },
        cafeStatus: action.payload.status // critical for ProtectedRoute
      };
      saveToStorage(newState);
      axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
      return newState;
    }
    
    case 'REGISTER': {
      const newState = {
        ...state,
        isAuthenticated: true,
        user: action.payload
      };
      saveToStorage(newState);
      return newState;
    }
    
    case 'LOGOUT': {
      const newState = {
        ...initialState,
        isLoading: false,
        partnerCafes: state.partnerCafes,
        announcements: state.announcements,
        leaderboard: state.leaderboard,
        events: state.events,
        transactions: state.transactions,
        metrics: state.metrics,
        performance: state.performance
      };
      saveToStorage(newState);
      return newState;
    }

    case 'SET_CAFE_INFO': {
      const newState = {
        ...state,
        cafeInfo: action.payload,
        setupCompleted: true,
      };
      saveToStorage(newState);
      return newState;
    }

    case 'SET_PARTNER_CAFES': {
      return {
        ...state,
        partnerCafes: action.payload,
      };
    }
    
    // Setup completion
    case 'COMPLETE_SETUP': {
      const newState = {
        ...state,
        cafeInfo: action.payload,
        setupCompleted: true,
      };
      saveToStorage(newState);
      return newState;
    }
    
    // OTP Generation for redemption
    case 'GENERATE_OTP': {
      const newState = {
        ...state,
        pendingOtp: action.payload
      };
      saveToStorage(newState);
      return newState;
    }
    
    // Process redemption
    case 'PROCESS_REDEMPTION': {
      const newTransaction = {
        id: `txn-${Date.now()}`,
        customerId: `cust-${action.payload.customerPhone.slice(-4)}`,
        customerName: 'Customer',
        amount: 0,
        points: -100,
        date: new Date().toISOString(),
        type: 'redemption',
        items: [action.payload.rewardType === 'free_coffee' ? 'Free Coffee Voucher' : 'Lunch Set Voucher']
      };
      
      const newState = {
        ...state,
        pendingOtp: null,
        transactions: [newTransaction, ...state.transactions]
      };
      saveToStorage(newState);
      return newState;
    }
    
    // Toggle cafe open/closed status
    case 'TOGGLE_STATUS': {
      const newState = {
        ...state,
        isOpen: !state.isOpen
      };
      saveToStorage(newState);
      return newState;
    }
    
    // OTP generation and verification
    case 'UPDATE_PERFORMANCE': {
      const newState = {
        ...state,
        pendingOtp: null,
        transactions: [action.payload.transaction, ...state.transactions]
      };
      saveToStorage(newState);
      return newState;
    }
    
    // This case was removed as it was a duplicate of the earlier CLEAR_OTP case
    
    case 'UPDATE_METRICS': {
      const newState = {
        ...state,
        metrics: {
          ...state.metrics,
          ...action.payload
        }
      };
      saveToStorage(newState);
      return newState;
    }
    
    case 'VERIFY_OTP': {
      if (state.pendingOtp && state.pendingOtp.code === action.payload.code) {
        // Create new transaction for the redemption
        const newTransaction = {
          id: `txn-${Date.now()}`,
          customerId: state.pendingOtp.customerId,
          customerName: state.pendingOtp.customerName,
          amount: 0,
          points: -state.pendingOtp.points,
          date: new Date().toISOString(),
          type: 'redemption',
          items: [action.payload.item]
        };
        
        const newState = {
          ...state,
          pendingOtp: null,
          transactions: [newTransaction, ...state.transactions]
        };
        saveToStorage(newState);
        return newState;
      }
      return state;
    }
    
    case 'CLEAR_OTP': {
      const newState = {
        ...state,
        pendingOtp: null
      };
      saveToStorage(newState);
      return newState;
    }
    
    // Profile and gallery management
    case 'UPDATE_PROFILE': {
      const newState = {
        ...state,
        cafeInfo: {
          ...state.cafeInfo,
          ...action.payload
        }
      };
      saveToStorage(newState);
      return newState;
    }
    
    case 'ADD_GALLERY_IMAGE': {
      const newState = {
        ...state,
        gallery: [...state.gallery, action.payload]
      };
      saveToStorage(newState);
      return newState;
    }
    
    case 'REMOVE_GALLERY_IMAGE': {
      const newState = {
        ...state,
        gallery: state.gallery.filter((_, index) => index !== action.payload)
      };
      saveToStorage(newState);
      return newState;
    }
    
    default:
      return state;
  }
}

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'INIT_APP' });
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      saveToStorage(state);
    }
    if (state.user?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.user.token}`;
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}