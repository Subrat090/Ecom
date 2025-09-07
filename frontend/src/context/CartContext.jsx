import { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.cart || [],
        totalItems: action.payload.totalItems || 0,
        totalPrice: action.payload.totalPrice || 0,
        loading: false
      };
    case 'ADD_TO_CART':
      return {
        ...state,
        items: action.payload.cart || [],
        totalItems: action.payload.totalItems || 0,
        totalPrice: action.payload.totalPrice || 0,
        loading: false
      };
    case 'UPDATE_CART':
      return {
        ...state,
        items: action.payload.cart || [],
        totalItems: action.payload.totalItems || 0,
        totalPrice: action.payload.totalPrice || 0,
        loading: false
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: action.payload.cart || [],
        totalItems: action.payload.totalItems || 0,
        totalPrice: action.payload.totalPrice || 0,
        loading: false
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      // Clear cart when user logs out
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await api.get('/api/cart');
      dispatch({ type: 'SET_CART', payload: res.data });
    } catch (error) {
      console.error('Error loading cart:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await api.post('/api/cart/add', { productId, quantity });
      dispatch({ type: 'ADD_TO_CART', payload: res.data });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add to cart'
      };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await api.put('/api/cart/update', { productId, quantity });
      dispatch({ type: 'UPDATE_CART', payload: res.data });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update cart'
      };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await api.delete('/api/cart/remove', { data: { productId } });
      dispatch({ type: 'REMOVE_FROM_CART', payload: res.data });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove from cart'
      };
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await api.delete('/api/cart/clear');
      dispatch({ type: 'CLEAR_CART' });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to clear cart'
      };
    }
  };

  const value = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
