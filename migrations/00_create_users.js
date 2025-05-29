export function up(knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.string('username', 50).unique().notNullable();
        table.string('email', 100).unique().notNullable();
        table.string('phone', 20); // Optional phone number field
        table.string('password', 255).notNullable();
        table.timestamps(true, true); // created_at and updated_at
    });
}

export function down(knex) {
    return knex.schema.dropTable('users');
}
