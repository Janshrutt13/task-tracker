import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CheckCircle, Mail, Lock, Eye, EyeOff, User, Moon, Sun } from 'lucide-react';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, login } = useAuth();
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
            await register(email, password, name);
            // Auto-login after successful registration
            await login(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card" style={{ paddingTop: 32, paddingBottom: 28 }}>
                    {/* Logo inside card */}
                    <div className="auth-logo" style={{ marginBottom: 20 }}>
                        <h1>
                            <CheckCircle size={32} />
                            TaskTracker
                        </h1>
                    </div>

                    <h2 style={{ textAlign: 'center' }}>Create your account</h2>
                    <p className="subtitle" style={{ textAlign: 'center' }}>Start organizing your workflow today.</p>

                    {/* Social buttons at top */}
                    <div className="auth-social-row">
                        <button type="button" className="btn btn-social">
                            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                            Google
                        </button>
                        <button type="button" className="btn btn-social">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.52-3.23 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>
                            Apple
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="auth-divider">
                        <span>OR CONTINUE WITH EMAIL</span>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <div className="input-group">
                            <label htmlFor="reg-name">Full Name</label>
                            <div className="input-icon-wrapper">
                                <User size={18} className="input-icon-left" />
                                <input
                                    id="reg-name"
                                    type="text"
                                    className="input input-with-icon"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete="name"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="input-group">
                            <label htmlFor="reg-email">Email Address</label>
                            <div className="input-icon-wrapper">
                                <Mail size={18} className="input-icon-left" />
                                <input
                                    id="reg-email"
                                    type="email"
                                    className="input input-with-icon"
                                    placeholder="example@mail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="input-group">
                            <label htmlFor="reg-password">Create Password</label>
                            <div className="input-icon-wrapper">
                                <Lock size={18} className="input-icon-left" />
                                <input
                                    id="reg-password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="input input-with-icon input-with-right-icon"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
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
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <p className="auth-terms">
                        By signing up, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
                    </p>
                </div>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Log In</Link>
                </p>
            </div>

            {/* Dark mode toggle */}
            <button className="auth-dark-toggle" onClick={toggleDarkMode} title="Toggle dark mode">
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </div>
    );
};

export default RegisterPage;
