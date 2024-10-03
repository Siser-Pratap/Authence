import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard.jsx';
import SignIn from './components/SignIn.jsx';
import Signup from './components/SignUp.jsx';



createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<App />}/>
    <Route path="/sign-in" element={<SignIn />}/>
    <Route path="/sign-up" element={<Signup />}/>
  </Routes>
  </BrowserRouter>
)
