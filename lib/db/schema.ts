import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    name: text('name').notNull(),
    vendorType: text('vendor_type', { enum: ['photographer', 'caterer', 'florist'] }).notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const contracts = sqliteTable('contracts', {
    id: text('id').primaryKey(),
    vendorId: text('vendor_id').notNull().references(() => users.id),
    clientName: text('client_name').notNull(),
    eventDate: text('event_date').notNull(),
    venue: text('venue').notNull(),
    servicePackage: text('service_package').notNull(),
    amount: real('amount').notNull(),
    content: text('content').notNull().default(''),
    status: text('status', { enum: ['draft', 'final', 'signed'] }).notNull().default('draft'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const signatures = sqliteTable('signatures', {
    id: text('id').primaryKey(),
    contractId: text('contract_id').notNull().references(() => contracts.id),
    type: text('type', { enum: ['drawn', 'typed'] }).notNull(),
    data: text('data').notNull(), // base64 for drawn, text for typed
    timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    contracts: many(contracts),
}));

export const contractsRelations = relations(contracts, ({ one }) => ({
    vendor: one(users, {
        fields: [contracts.vendorId],
        references: [users.id],
    }),
    signature: one(signatures, {
        fields: [contracts.id],
        references: [signatures.contractId],
    }),
}));

export const signaturesRelations = relations(signatures, ({ one }) => ({
    contract: one(contracts, {
        fields: [signatures.contractId],
        references: [contracts.id],
    }),
}));

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Contract = typeof contracts.$inferSelect;
export type NewContract = typeof contracts.$inferInsert;
export type Signature = typeof signatures.$inferSelect;
export type NewSignature = typeof signatures.$inferInsert;