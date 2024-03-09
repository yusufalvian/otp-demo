import sqlite3 from 'sqlite3';
import { Users } from './model';

export const getDb = async () => {
    const db = new sqlite3.Database('sqlite.db', (err) => {
        if (err) {
            console.error('Error opening database: ', err.message);
        } else {
            console.log('Connected to the SQLite database.');
        }
    });
    return db;
};

export class Repo {
    getUser = async (db: any, email: string) => {
        const query = `SELECT * FROM users WHERE email = '${email}'`;
        const result: Users[] = await db.all(query);

        await db.run(query, function (err: any, row) {
            if (err) {
                console.log("sqlite error");
            } else {
                return row[0];
            }
        });

    };

    addUser = async (db: any, user: Users) => {
        const query = `INSERT INTO users (email, password, is_active) VALUES ('${user.email}', '${user.password}', ${user.is_active});`;

        await db.run(query, function (err: any) {
            if (err) {
                console.log("sqlite error");
            }
        });

    };

    updateUser = async (db: any, user: Users) => {
        const query = `UPDATE users SET is_active = ${user.is_active} WHERE email = '${user.email}'`;

        await db.run(query, function (err: any) {
            if (err) {
                console.log("sqlite error");
            }
        });
    };
}

