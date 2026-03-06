import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CheckCircle, Mail, Lock, Eye, EyeOff, User, Moon, Sun, Shield } from 'lucide-react';
import { registerSchema, type RegisterFormData } from '../lib/validation';

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showAdminField, setShowAdminField] = useState(false);
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register: authRegister, login } = useAuth();
    const { isDark, toggleDarkMode } = useTheme();
    const navigate = useNavigate();

    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setApiError('');
        setLoading(true);
        try {
            await authRegister(data.email, data.password, data.name, data.adminCode || undefined);
            // Auto-login after successful registration
            await login(data.email, data.password);
            navigate('/dashboard');
        } catch (err: any) {
            setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
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

                    {apiError && <div className="auth-error">{apiError}</div>}

                    <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
                                    {...registerField('name')}
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
                                    className={`input input-with-icon ${errors.email ? 'input-error' : ''}`}
                                    placeholder="example@mail.com"
                                    {...registerField('email')}
                                    autoComplete="email"
                                />
                            </div>
                            {errors.email && (
                                <p className="field-error">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="input-group">
                            <label htmlFor="reg-password">Create Password</label>
                            <div className="input-icon-wrapper">
                                <Lock size={18} className="input-icon-left" />
                                <input
                                    id="reg-password"
                                    type={showPassword ? 'text' : 'password'}
                                    className={`input input-with-icon input-with-right-icon ${errors.password ? 'input-error' : ''}`}
                                    placeholder="••••••••"
                                    {...registerField('password')}
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
                            {errors.password && (
                                <p className="field-error">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Admin Code (collapsible) */}
                        <div>
                            <button
                                type="button"
                                onClick={() => setShowAdminField(!showAdminField)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: 0,
                                    fontFamily: 'inherit',
                                    fontWeight: 600,
                                }}
                            >
                                <Shield size={14} />
                                {showAdminField ? 'Hide Admin Code' : 'Have an admin code?'}
                            </button>
                            {showAdminField && (
                                <div className="input-group" style={{ marginTop: '8px' }}>
                                    <label htmlFor="reg-admin-code">Admin Secret Code</label>
                                    <div className="input-icon-wrapper">
                                        <Shield size={18} className="input-icon-left" />
                                        <input
                                            id="reg-admin-code"
                                            type="text"
                                            className="input input-with-icon"
                                            placeholder="Enter admin code"
                                            {...registerField('adminCode')}
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                            )}
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
