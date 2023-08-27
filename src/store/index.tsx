import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { Provider } from 'react-redux';

import authReducer from './reducers/authSlice';
import newChatReducer from './reducers/newChatSlice';
import activeChatReducer from './reducers/activeChatSlice';

interface indexProps {
  children: React.ReactNode;
}

const store = configureStore({
  reducer: {
    auth: authReducer,
    newChat: newChatReducer,
    activeChat: activeChatReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

const StoreProvider: React.FC<indexProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
export default StoreProvider;
