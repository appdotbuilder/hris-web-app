import { pgTable, uuid, text, varchar, timestamp, date, time, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Define PostgreSQL enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'employee']);
export const attendanceStatusEnum = pgEnum('attendance_status', ['present', 'late', 'absent']);
export const leaveRequestStatusEnum = pgEnum('leave_request_status', ['pending', 'approved', 'rejected']);
export const documentTypeEnum = pgEnum('document_type', ['ID Card', 'Appointment Letter', 'Position Certificate', 'Others']);

// Departments table
export const departmentsTable = pgTable('departments', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'), // Nullable
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Users (Employees) table
export const usersTable = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull(),
  join_date: date('join_date').notNull(),
  phone: varchar('phone', { length: 20 }), // Nullable
  address: text('address'), // Nullable
  department_id: uuid('department_id').notNull().references(() => departmentsTable.id),
  profile_photo_path: text('profile_photo_path'), // Nullable
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Attendance table
export const attendanceTable = pgTable('attendance', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  check_in_time: time('check_in_time').notNull(),
  check_out_time: time('check_out_time'), // Nullable
  status: attendanceStatusEnum('status').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Leave Requests table
export const leaveRequestsTable = pgTable('leave_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  reason: text('reason').notNull(),
  status: leaveRequestStatusEnum('status').notNull().default('pending'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Documents table
export const documentsTable = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  file_path: text('file_path').notNull(),
  uploaded_at: timestamp('uploaded_at').defaultNow().notNull(),
  type: documentTypeEnum('type').notNull()
});

// Define relations
export const departmentsRelations = relations(departmentsTable, ({ many }) => ({
  users: many(usersTable)
}));

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  department: one(departmentsTable, {
    fields: [usersTable.department_id],
    references: [departmentsTable.id]
  }),
  attendance: many(attendanceTable),
  leaveRequests: many(leaveRequestsTable),
  documents: many(documentsTable)
}));

export const attendanceRelations = relations(attendanceTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [attendanceTable.user_id],
    references: [usersTable.id]
  })
}));

export const leaveRequestsRelations = relations(leaveRequestsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [leaveRequestsTable.user_id],
    references: [usersTable.id]
  })
}));

export const documentsRelations = relations(documentsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [documentsTable.user_id],
    references: [usersTable.id]
  })
}));

// TypeScript types for the table schemas
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type Department = typeof departmentsTable.$inferSelect;
export type NewDepartment = typeof departmentsTable.$inferInsert;
export type Attendance = typeof attendanceTable.$inferSelect;
export type NewAttendance = typeof attendanceTable.$inferInsert;
export type LeaveRequest = typeof leaveRequestsTable.$inferSelect;
export type NewLeaveRequest = typeof leaveRequestsTable.$inferInsert;
export type Document = typeof documentsTable.$inferSelect;
export type NewDocument = typeof documentsTable.$inferInsert;

// Export all tables for proper query building
export const tables = {
  users: usersTable,
  departments: departmentsTable,
  attendance: attendanceTable,
  leaveRequests: leaveRequestsTable,
  documents: documentsTable
};