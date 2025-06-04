export function up(knex) {
    return knex.schema.createTable('receivers_lists', table => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable()
            .references('id').inTable('users')
            .onDelete('CASCADE');
        table.string('phone_number', 15).notNullable();
    });
}

export function down(knex) {
    return knex.schema.dropTable('receivers_lists');
}
