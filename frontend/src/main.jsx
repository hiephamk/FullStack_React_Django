import React from 'react'
import ReactDOM from 'react-dom/client'
import { PersistGate } from "redux-persist/integration/react"
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store, { persistor } from './app/store'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client';

// const root = createRoot(document.getElementById('root'));
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter uture={{ v7_relativeSplatPath: true }}>
        <App/>
      </BrowserRouter>
    </PersistGate>
    </Provider>
  </React.StrictMode>,
)
