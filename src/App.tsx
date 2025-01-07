import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import store from './redux/store';
import AuthWrapper from './components/AuthWrapper';
import InfoAlert from './components/InfoAlert';
import useFirebaseAuth from './hooks/useFirebaseAuth';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './App.css';

const AppContent: React.FC = () => {
  useFirebaseAuth();

  return (
    <BrowserRouter>
      <AuthWrapper />
      <InfoAlert />
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <AppContent />
      </HelmetProvider>
    </Provider>
  );
};

export default App;
