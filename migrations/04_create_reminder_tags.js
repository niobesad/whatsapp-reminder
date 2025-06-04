export function up(knex) {
    return knex.schema.createTable('reminder_tags', table => {
        table.integer('reminder_id').unsigned().notNullable();
        table.integer('custom_list_id').unsigned().notNullable();
        table.primary(['reminder_id', 'custom_list_id']);
        table.foreign('reminder_id').references('reminders.id').onDelete('CASCADE');
        table.foreign('custom_list_id').references('custom_lists.id').onDelete('CASCADE');
    });
}

export function down(knex) {
    return knex.schema.dropTable('reminder_tags');
}
