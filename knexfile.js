const config = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: './db/reminders.db'
        },
        useNullAsDefault: true,
        migrations: {
            directory: './migrations'
        }
    }
};

export default config;
