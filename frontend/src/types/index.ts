export interface User {
    id: number;
    email: string;
    name?: string;
    role: 'user' | 'admin';
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: 'pending' | 'completed';
    createdAt: string;
    authorId: number;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}
