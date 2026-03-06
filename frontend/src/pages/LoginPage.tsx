import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CheckCircle, Mail, Lock, Eye, EyeOff, Moon, Sun } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { isDark, toggleDarkMode } = useTheme();
    const navigate = useNavigate();

    const validate = (): boolean => {
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!validate()) return;

        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* Logo */}
                <div className="auth-logo">
                    <h1>
                        <CheckCircle size={32} />
                        TaskTracker
                    </h1>
                </div>

                <div className="auth-card">
                    <h2>Welcome Back!</h2>
                    <p className="subtitle">Sign in to continue managing your tasks.</p>

                    {error && <div className="auth-error">{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className="input-group">
                            <label htmlFor="login-email">Email Address</label>
                            <div className="input-icon-wrapper">
                                <Mail size={18} className="input-icon-left" />
                                <input
                                    id="login-email"
                                    type="email"
                                    className="input input-with-icon"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="input-group">
                            <div className="input-label-row">
                                <label htmlFor="login-password">Password</label>
                                <span className="input-label-link">Forgot Password?</span>
                            </div>
                            <div className="input-icon-wrapper">
                                <Lock size={18} className="input-icon-left" />
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="input input-with-icon input-with-right-icon"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="input-icon-right-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner spinner-sm" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                </div>

                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            </div>

            {/* Dark mode toggle */}
            <button className="auth-dark-toggle" onClick={toggleDarkMode} title="Toggle dark mode">
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </div>
    );
};

export default LoginPage;
