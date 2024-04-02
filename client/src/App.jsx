// src/App.js
import React from 'react';
import HomePage from './components/Homepage.jsx';
import './App.css'; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TeamPage from './components/TeamPage';


function App() {
  return (
    <div className="App">
    <Router>
      <Routes>
        <Route path="/" exact element={<HomePage/>} />
        <Route path="/team/:teamId" element={<TeamPage/>} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
