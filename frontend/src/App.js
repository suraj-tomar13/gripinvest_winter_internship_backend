import React, { useState, useEffect } from 'react';
import Header from './components/shared/Header';
import LandingPage from './pages/LandingPage';
import Dashboard from './components/Dashboard/Dashboard';
import Products from './pages/Products';
import Investments from './pages/Investments';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [currentPage, setCurrentPage] = useState('landing');

  // Handle token changes and fetch user data if authenticated
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // In a real app, you would fetch user details here using the token
      setUser({ name: 'John Doe', email: 'john.doe@example.com' }); 
      setCurrentPage('dashboard');
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setCurrentPage('landing');
    }
  }, [token]);

  const handleLogin = (jwtToken) => {
    setToken(jwtToken);
  };

  const handleLogout = () => {
    setToken(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'products':
        return <Products />;
      case 'investments':
        return <Investments />;
      case 'transactions':
        return <Transactions />;
      case 'profile':
        return <Profile />;
      default:
        return <LandingPage onLogin={handleLogin} onSignup={handleLogin} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <Header isAuthenticated={!!token} onLogout={handleLogout} onNavigate={setCurrentPage} />
      <main className="container mx-auto p-4 md:p-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;