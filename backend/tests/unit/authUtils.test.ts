// backend/tests/unit/authUtils.test.ts
import { hashedPassword } from '../../src/utils/auth.js';
import bcrypt from 'bcryptjs';

describe('Auth Utilities', () => {
    it('should hash a password correctly', async () => {
        const password = 'mySecretPassword';
        const hash = await hashedPassword(password);

        expect(hash).not.toBe(password);
        const isMatch = await bcrypt.compare(password, hash);
        expect(isMatch).toBe(true);
    });
});
