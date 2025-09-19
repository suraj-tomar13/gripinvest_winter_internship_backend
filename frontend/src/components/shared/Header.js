import React from 'react';

function Header({ isAuthenticated, onLogout, onNavigate }) {
  return (
    <header className="bg-white shadow-md p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">
          Grip Invest
        </div>
        {isAuthenticated ? (
          <ul className="flex space-x-4 md:space-x-8 text-gray-600">
            <li>
              <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-500 transition duration-300">Dashboard</button>
            </li>
            <li>
              <button onClick={() => onNavigate('products')} className="hover:text-blue-500 transition duration-300">Products</button>
            </li>
            <li>
              <button onClick={() => onNavigate('investments')} className="hover:text-blue-500 transition duration-300">My Investments</button>
            </li>
            <li>
              <button onClick={() => onNavigate('transactions')} className="hover:text-blue-500 transition duration-300">Logs</button>
            </li>
            <li>
              <button onClick={() => onNavigate('profile')} className="hover:text-blue-500 transition duration-300">Profile</button>
            </li>
            <li>
              <button onClick={onLogout} className="text-red-500 hover:text-red-700 transition duration-300 font-semibold">Logout</button>
            </li>
          </ul>
        ) : (
          <ul className="flex space-x-4 text-gray-600">
            <li>
              <button onClick={() => onNavigate('landing')} className="hover:text-blue-500 transition duration-300">Login/Signup</button>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}

export default Header;