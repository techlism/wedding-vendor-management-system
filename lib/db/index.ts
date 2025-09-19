import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite, { schema });

// Initialize database with test users
export async function initializeDatabase() {
    const bcrypt = require('bcryptjs');

    const testUsers = [
        {
            id: 'photographer-1',
            email: 'photographer@test.com',
            password: await bcrypt.hash('password123', 10),
            name: 'John Smith',
            vendorType: 'photographer' as const,
        },
        {
            id: 'caterer-1',
            email: 'caterer@test.com',
            password: await bcrypt.hash('password123', 10),
            name: 'Sarah Johnson',
            vendorType: 'caterer' as const,
        },
        {
            id: 'florist-1',
            email: 'florist@test.com',
            password: await bcrypt.hash('password123', 10),
            name: 'Mike Davis',
            vendorType: 'florist' as const,
        },
    ];

    for (const user of testUsers) {
        try {
            await db.insert(schema.users).values(user).onConflictDoNothing();
        } catch (error) {
            console.log('User already exists:', user.email);
        }
    }
}