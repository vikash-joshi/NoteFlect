import './App.css'
import React from 'react';
import Navbar from './components/header/navbar';
import Home from './components/home/home';
import About from './components/home/about';
import Login from './components/auth/login';
import Register from './components/auth/register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {AuthProvider } from "./context/authContext";
import Profile from './components/Users/profile';
import Notes from './components/Notes/Notes';
import Dashboard from './components/dashboard/dashboard';
import ManageUsers from './components/admin/Manageuser';

const App = () => (

<>
<AuthProvider>   
<Router>    
    <Navbar /> 
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Notes" element={<Notes />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/ManageUsers" element={<ManageUsers />} />
          
          
        </Routes>
        
        </Router>
        </AuthProvider> 

</>
);

export default App;
