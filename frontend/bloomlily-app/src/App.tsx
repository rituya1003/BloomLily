import React from 'react';
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import Login from './pages/login'
import Home from './pages/home';
import About from './pages/about';
import Recruitment from './pages/recruitment'
import Gallery from './pages/gallery';
import Design from './pages/design';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/recruitment" element={<Recruitment />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/design" element={<Design />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
