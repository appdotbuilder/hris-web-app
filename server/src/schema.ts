import { z } from 'zod';

// Enums
export const userRoleEnum = z.enum(['admin', 'employee']);
export const attendanceStatusEnum = z.enum(['present', 'late', 'absent']);
export const leaveRequestStatusEnum = z.enum(['pending', 'approved', 'rejected']);
export const documentTypeEnum = z.enum(['ID Card', 'Appointment Letter', 'Position Certificate', 'Others']);

// User (Employee) schema
export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: userRoleEnum,
  join_date: z.coerce.date(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  department_id: z.string().uuid(),
  profile_photo_path: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Department schema
export const departmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Department = z.infer<typeof departmentSchema>;

// Attendance schema
export const attendanceSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  date: z.coerce.date(),
  check_in_time: z.string(), // Stored as time string
  check_out_time: z.string().nullable(),
  status: attendanceStatusEnum,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Attendance = z.infer<typeof attendanceSchema>;

// Leave Request schema
export const leaveRequestSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  reason: z.string(),
  status: leaveRequestStatusEnum,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type LeaveRequest = z.infer<typeof leaveRequestSchema>;

// Document schema
export const documentSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string(),
  file_path: z.string(),
  uploaded_at: z.coerce.date(),
  type: documentTypeEnum
});

export type Document = z.infer<typeof documentSchema>;

// Input schemas for creating records
export const createUserInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: userRoleEnum,
  join_date: z.coerce.date(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  department_id: z.string().uuid(),
  profile_photo_path: z.string().nullable()
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const createDepartmentInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable()
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentInputSchema>;

export const createAttendanceInputSchema = z.object({
  user_id: z.string().uuid(),
  date: z.coerce.date(),
  check_in_time: z.string(),
  status: attendanceStatusEnum
});

export type CreateAttendanceInput = z.infer<typeof createAttendanceInputSchema>;

export const createLeaveRequestInputSchema = z.object({
  user_id: z.string().uuid(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  reason: z.string().min(1)
});

export type CreateLeaveRequestInput = z.infer<typeof createLeaveRequestInputSchema>;

export const createDocumentInputSchema = z.object({
  user_id: z.string().uuid(),
  title: z.string().min(1),
  file_path: z.string(),
  type: documentTypeEnum
});

export type CreateDocumentInput = z.infer<typeof createDocumentInputSchema>;

// Input schemas for updating records
export const updateUserInputSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: userRoleEnum.optional(),
  join_date: z.coerce.date().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  department_id: z.string().uuid().optional(),
  profile_photo_path: z.string().nullable().optional()
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

export const updateDepartmentInputSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional()
});

export type UpdateDepartmentInput = z.infer<typeof updateDepartmentInputSchema>;

export const updateAttendanceInputSchema = z.object({
  id: z.string().uuid(),
  check_out_time: z.string().optional(),
  status: attendanceStatusEnum.optional()
});

export type UpdateAttendanceInput = z.infer<typeof updateAttendanceInputSchema>;

export const updateLeaveRequestInputSchema = z.object({
  id: z.string().uuid(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  reason: z.string().min(1).optional(),
  status: leaveRequestStatusEnum.optional()
});

export type UpdateLeaveRequestInput = z.infer<typeof updateLeaveRequestInputSchema>;

export const updateDocumentInputSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).optional(),
  file_path: z.string().optional(),
  type: documentTypeEnum.optional()
});

export type UpdateDocumentInput = z.infer<typeof updateDocumentInputSchema>;

// Query input schemas
export const getUserByIdInputSchema = z.object({
  id: z.string().uuid()
});

export type GetUserByIdInput = z.infer<typeof getUserByIdInputSchema>;

export const getDepartmentByIdInputSchema = z.object({
  id: z.string().uuid()
});

export type GetDepartmentByIdInput = z.infer<typeof getDepartmentByIdInputSchema>;

export const getAttendanceByUserIdInputSchema = z.object({
  user_id: z.string().uuid(),
  date: z.coerce.date().optional()
});

export type GetAttendanceByUserIdInput = z.infer<typeof getAttendanceByUserIdInputSchema>;

export const getLeaveRequestsByUserIdInputSchema = z.object({
  user_id: z.string().uuid()
});

export type GetLeaveRequestsByUserIdInput = z.infer<typeof getLeaveRequestsByUserIdInputSchema>;

export const getDocumentsByUserIdInputSchema = z.object({
  user_id: z.string().uuid()
});

export type GetDocumentsByUserIdInput = z.infer<typeof getDocumentsByUserIdInputSchema>;

export const deleteByIdInputSchema = z.object({
  id: z.string().uuid()
});

export type DeleteByIdInput = z.infer<typeof deleteByIdInputSchema>;

// Authentication schemas
export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export type LoginInput = z.infer<typeof loginInputSchema>;

// Pagination schema
export const paginationInputSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10)
});

export type PaginationInput = z.infer<typeof paginationInputSchema>;

// Dashboard stats schema
export const dashboardStatsSchema = z.object({
  total_employees: z.number().int(),
  active_leave_requests: z.number().int(),
  attendance_summary: z.array(z.object({
    date: z.string(),
    present: z.number().int(),
    late: z.number().int(),
    absent: z.number().int()
  }))
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;