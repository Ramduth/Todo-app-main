import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Loginpage from './Components/Loginpage';
import Reg from './Components/Reg';
import Todo from './Components/Home/Todo';

function App() {
  return (
    <BrowserRouter>
      <div>
      <Routes>
        <Route path="/" element={<Loginpage />} /> 
        <Route path="/Reg" element={<Reg />} /> 
        <Route path="/Todo" element={<Todo />} /> 
      </Routes>
      </div>
      </BrowserRouter>
  );
}

export default App;
