//import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login'
import Layout from './components/Layout';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login onLogin={() => console.log('Logged in')} />} />
            <Route path="/layout" element={<Layout />} />
        </Routes>
    );
}

export default App;
