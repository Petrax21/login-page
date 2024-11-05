const pool = require('../config/db');

class User {
    static async createUser(data) {
        const { username, firstName, lastName, email, password } = data;
        const result = await pool.query(
            'INSERT INTO users (username, first_name, last_name, email, password, is_verified) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [username, firstName, lastName, email, password, false]
        );
        return result.rows[0];
    }

    static async findByEmail(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    static async verifyUser(email) {
        await pool.query('UPDATE users SET is_verified = true WHERE email = $1', [email]);
    }
}

module.exports = User;
