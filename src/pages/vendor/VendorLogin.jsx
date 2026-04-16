import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LockKeyhole, User } from 'lucide-react';
import './VendorLogin.css';

export function VendorLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${process.env.API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('vendorInfo', JSON.stringify(data));
        navigate('/vendor/dashboard');
      } else {
        setError(data.message || 'Invalid username or password.');
      }
    } catch (err) {
      setError('Unable to connect to the server. Is Backend running?');
    }
  };

  return (
    <div className="login-page">
      <header className="page-header sticky-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={24} />
        </button>
        <div className="header-title">
          <h1>Vendor Access</h1>
        </div>
      </header>

      <main className="login-container">
        <div className="auth-card">
          <div className="auth-header">
            <LockKeyhole size={48} className="auth-icon" />
            <h2>Vendor Login</h2>
            <p>Manage menus and inventory</p>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <LockKeyhole size={18} className="input-icon" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary login-btn">
              Sign In
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
