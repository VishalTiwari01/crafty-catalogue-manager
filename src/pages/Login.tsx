import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '@/api/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(mobile, dispatch);
      navigate('/admin'); // redirect after login
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">Admin Login</h2>
        <input
          type="tel"
          placeholder="Enter mobile number"
          className="w-full p-2 border rounded mb-4"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
