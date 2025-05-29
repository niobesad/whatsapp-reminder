export function up(knex) {
    return knex.schema.createTable('custom_lists', table => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable()
            .references('id').inTable('users')
            .onDelete('CASCADE');
        table.string('name', 50).unique().notNullable();
    });
}

export function down(knex) {
    return knex.schema.dropTable('custom_lists');
}
