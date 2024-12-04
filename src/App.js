import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Music from './pages/Music';
import Shows from './pages/Shows';
import About from './pages/About';
import Contact from './pages/Contact';
import './styles/App.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/music" element={<Music />} />
          <Route path="/shows" element={<Shows />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
