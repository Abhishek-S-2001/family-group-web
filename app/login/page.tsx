'use client'; // This tells Next.js this is an interactive client component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AuthPage() {
  const router = useRouter();
  
  // UI State
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Only used for signup

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      let response;
      
      if (isLogin) {
        // --- LOGIN FLOW ---
        response = await axios.post(`${apiUrl}/auth/login`, {
          email,
          password,
        });
      } else {
        // --- SIGNUP FLOW ---
        response = await axios.post(`${apiUrl}/auth/signup`, {
          email,
          password,
          username,
        });
      }

      // If successful, our FastAPI backend returns an access_token
      const { access_token } = response.data;

      // Save the token securely in the browser's local storage
      localStorage.setItem('family_app_token', access_token);

      // Redirect the user to the main feed/dashboard
      router.push('/');
      
    } catch (error: any) {
      // Extract the error message from our FastAPI backend
      const message = error.response?.data?.detail || 'Something went wrong. Please try again.';
      setErrorMessage(typeof message === 'string' ? message : JSON.stringify(message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Your private space for family and friends
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Show Username field ONLY if signing up */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <div className="mt-1">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                    placeholder="e.g. PapaBear99"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                />
              </div>
            </div>

            {/* Error Message Display */}
            {errorMessage && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                {errorMessage}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
              </button>
            </div>
          </form>

          {/* Toggle between Login and Signup */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMessage('');
              }}
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Log in"}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}