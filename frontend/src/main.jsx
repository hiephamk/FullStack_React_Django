
// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import './index.css'
// import { Provider } from 'react-redux'
// import { store } from './app/store'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'react-toastify/dist/ReactToastify.css';
// import { AuthProvider } from './context/AuthContext.jsx'

// ReactDOM.createRoot(document.getElementById('root')).render(
//     <React.StrictMode>
//       <Provider store={store}>
//           <App />
//       </Provider>
//     </React.StrictMode>,
// )

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import App from "./App.jsx";
import store, { persistor } from "./app/store";
import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
          <App />
      </PersistGate>
  </Provider>
);
