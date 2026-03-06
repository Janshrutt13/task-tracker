import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

// Mock dependencies
vi.mock('../context/AuthContext', () => ({
    useAuth: vi.fn(() => ({
        login: vi.fn(),
    })),
}));

vi.mock('../context/ThemeContext', () => ({
    useTheme: vi.fn(() => ({
        isDark: false,
        toggleDarkMode: vi.fn(),
    })),
}));

const renderLoginPage = () => {
    return render(
        <MemoryRouter>
            <LoginPage />
        </MemoryRouter>
    );
};

describe('LoginForm', () => {
    it('renders the login form correctly', () => {
        renderLoginPage();
        expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    });

    it('shows validation error when email is empty and form is submitted', async () => {
        const user = userEvent.setup();
        renderLoginPage();

        await user.click(screen.getByRole('button', { name: 'Sign In' }));

        await waitFor(() => {
            expect(screen.getByText('Email is required')).toBeInTheDocument();
        });
    });

    it('shows validation error for invalid email format', async () => {
        const user = userEvent.setup();
        renderLoginPage();

        await user.type(screen.getByLabelText('Email Address'), 'invalid-email');
        await user.type(screen.getByLabelText('Password'), 'password123');
        await user.click(screen.getByRole('button', { name: 'Sign In' }));

        expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument();
    });

    it('shows validation error when password is too short', async () => {
        const user = userEvent.setup();
        renderLoginPage();

        await user.type(screen.getByLabelText('Email Address'), 'test@test.com');
        await user.type(screen.getByLabelText('Password'), '12345');
        await user.click(screen.getByRole('button', { name: 'Sign In' }));

        await waitFor(() => {
            expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
        });
    });

    it('does not show errors when valid data is provided', async () => {
        const user = userEvent.setup();
        renderLoginPage();

        await user.type(screen.getByLabelText('Email Address'), 'test@test.com');
        await user.type(screen.getByLabelText('Password'), 'password123');
        await user.click(screen.getByRole('button', { name: 'Sign In' }));

        await waitFor(() => {
            expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
            expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
            expect(screen.queryByText('Password must be at least 6 characters')).not.toBeInTheDocument();
        });
    });
});
