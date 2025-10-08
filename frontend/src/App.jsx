import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import BatteryForm from './components/BatteryForm';
import ProtectedRoute from './ProtectedRoute'; // Assuming you already created it
import Homelogged from './components/Homelogged';
import ChatBot from './components/chatbot';
import ForgotPassword from './components/forgotpassword';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword/>}/>
        <Route path="/Homelogged" element={<Homelogged />} />
        <Route path="/ChatBot" element={<ChatBot />} />
        <Route path="/register" element={<Register />} />
        <Route path="/simulate" element={<ProtectedRoute><BatteryForm /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
