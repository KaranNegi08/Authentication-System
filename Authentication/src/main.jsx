import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { AppContextProvider } from './context/AppContext.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    
    <BrowserRouter>
    <AppContextProvider>
       <App />
    </AppContextProvider>
    </BrowserRouter>
    
  </StrictMode>
);
