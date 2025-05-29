export function up(knex) {
    return knex.schema.createTable('reminders', table => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable()
            .references('id').inTable('users')
            .onDelete('CASCADE');
        table.string('title', 100).notNullable();
        table.string('description', 200);
        table.string('due_date', 50);
        table.boolean('completed').defaultTo(false);
    });
}

export function down(knex) {
    return knex.schema.dropTable('reminders');
}
