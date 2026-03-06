import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

// Track navigation
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const mockLogin = vi.fn();
vi.mock('../context/AuthContext', () => ({
    useAuth: vi.fn(() => ({
        login: mockLogin,
    })),
}));

vi.mock('../context/ThemeContext', () => ({
    useTheme: vi.fn(() => ({
        isDark: false,
        toggleDarkMode: vi.fn(),
    })),
}));

describe('Integration: Login Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('redirects to /dashboard after a successful login', async () => {
        mockLogin.mockResolvedValueOnce(undefined); // Simulate success

        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        await user.type(screen.getByLabelText('Email Address'), 'test@example.com');
        await user.type(screen.getByLabelText('Password'), 'password123');
        await user.click(screen.getByRole('button', { name: 'Sign In' }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('displays API error message on login failure', async () => {
        mockLogin.mockRejectedValueOnce({
            response: { data: { message: 'Invalid credentials' } },
        });

        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        await user.type(screen.getByLabelText('Email Address'), 'wrong@example.com');
        await user.type(screen.getByLabelText('Password'), 'wrongpassword');
        await user.click(screen.getByRole('button', { name: 'Sign In' }));

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });

        // Should NOT navigate to dashboard
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('displays generic error message when API returns no message', async () => {
        mockLogin.mockRejectedValueOnce(new Error('Network Error'));

        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        await user.type(screen.getByLabelText('Email Address'), 'test@example.com');
        await user.type(screen.getByLabelText('Password'), 'password123');
        await user.click(screen.getByRole('button', { name: 'Sign In' }));

        await waitFor(() => {
            expect(screen.getByText('Login failed. Please try again.')).toBeInTheDocument();
        });
    });
});
