import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Playground from './pages/Playground';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './auth/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className='container'>
          <Header />
          <Routes>
            <Route path='/' element={<Playground />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
