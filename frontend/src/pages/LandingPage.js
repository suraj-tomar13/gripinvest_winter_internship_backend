import React, { useState } from 'react';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';

function LandingPage({ onLogin, onSignup }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Welcome to Grip Invest
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Your journey to smart investing starts here.
        </p>

        <div className="mt-8">
          {isLogin ? (
            <Login onLogin={onLogin} />
          ) : (
            <Signup onSignup={onSignup} />
          )}
        </div>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 text-blue-500 hover:text-blue-700 transition duration-300 font-semibold text-sm"
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
        </button>
      </div>
    </div>
  );
}

export default LandingPage;