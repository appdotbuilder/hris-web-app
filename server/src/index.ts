import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import {
  loginInputSchema,
  createUserInputSchema,
  updateUserInputSchema,
  getUserByIdInputSchema,
  deleteByIdInputSchema,
  createDepartmentInputSchema,
  updateDepartmentInputSchema,
  getDepartmentByIdInputSchema,
  createAttendanceInputSchema,
  updateAttendanceInputSchema,
  getAttendanceByUserIdInputSchema,
  createLeaveRequestInputSchema,
  updateLeaveRequestInputSchema,
  getLeaveRequestsByUserIdInputSchema,
  createDocumentInputSchema,
  updateDocumentInputSchema,
  getDocumentsByUserIdInputSchema,
  paginationInputSchema
} from './schema';

// Import handlers
import { login, getCurrentUser } from './handlers/auth';
import { 
  createUser, 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  updateUserProfile 
} from './handlers/users';
import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
} from './handlers/departments';
import {
  createAttendance,
  getAttendanceRecords,
  getAttendanceByUserId,
  getTodayAttendanceByUserId,
  updateAttendance,
  checkOut,
  deleteAttendance,
  getAttendanceSummary
} from './handlers/attendance';
import {
  createLeaveRequest,
  getLeaveRequests,
  getLeaveRequestsByUserId,
  getPendingLeaveRequests,
  updateLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  deleteLeaveRequest,
  getActiveLeaveRequestsCount
} from './handlers/leave_requests';
import {
  createDocument,
  getDocuments,
  getDocumentsByUserId,
  getDocumentById,
  updateDocument,
  deleteDocument,
  downloadDocument,
  uploadDocument
} from './handlers/documents';
import {
  getDashboardStats,
  getTotalEmployeesCount,
  getEmployeeAttendanceStats,
  getEmployeeLeaveBalance
} from './handlers/dashboard';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Authentication routes
  login: publicProcedure
    .input(loginInputSchema)
    .mutation(({ input }) => login(input)),
  
  getCurrentUser: publicProcedure
    .input(getUserByIdInputSchema)
    .query(({ input }) => getCurrentUser(input.id)),

  // User management routes
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),
  
  getUsers: publicProcedure
    .input(paginationInputSchema.optional())
    .query(({ input }) => getUsers(input)),
  
  getUserById: publicProcedure
    .input(getUserByIdInputSchema)
    .query(({ input }) => getUserById(input)),
  
  updateUser: publicProcedure
    .input(updateUserInputSchema)
    .mutation(({ input }) => updateUser(input)),
  
  deleteUser: publicProcedure
    .input(deleteByIdInputSchema)
    .mutation(({ input }) => deleteUser(input)),
  
  updateUserProfile: publicProcedure
    .input(updateUserInputSchema)
    .mutation(({ input }) => updateUserProfile(input.id, input)),

  // Department management routes
  createDepartment: publicProcedure
    .input(createDepartmentInputSchema)
    .mutation(({ input }) => createDepartment(input)),
  
  getDepartments: publicProcedure
    .input(paginationInputSchema.optional())
    .query(({ input }) => getDepartments(input)),
  
  getDepartmentById: publicProcedure
    .input(getDepartmentByIdInputSchema)
    .query(({ input }) => getDepartmentById(input)),
  
  updateDepartment: publicProcedure
    .input(updateDepartmentInputSchema)
    .mutation(({ input }) => updateDepartment(input)),
  
  deleteDepartment: publicProcedure
    .input(deleteByIdInputSchema)
    .mutation(({ input }) => deleteDepartment(input)),

  // Attendance management routes
  createAttendance: publicProcedure
    .input(createAttendanceInputSchema)
    .mutation(({ input }) => createAttendance(input)),
  
  getAttendanceRecords: publicProcedure
    .input(paginationInputSchema.optional())
    .query(({ input }) => getAttendanceRecords(input)),
  
  getAttendanceByUserId: publicProcedure
    .input(getAttendanceByUserIdInputSchema)
    .query(({ input }) => getAttendanceByUserId(input)),
  
  getTodayAttendanceByUserId: publicProcedure
    .input(getUserByIdInputSchema)
    .query(({ input }) => getTodayAttendanceByUserId(input.id)),
  
  updateAttendance: publicProcedure
    .input(updateAttendanceInputSchema)
    .mutation(({ input }) => updateAttendance(input)),
  
  checkOut: publicProcedure
    .input(getUserByIdInputSchema.extend({ checkOutTime: loginInputSchema.shape.password }))
    .mutation(({ input }) => checkOut(input.id, input.checkOutTime)),
  
  deleteAttendance: publicProcedure
    .input(deleteByIdInputSchema)
    .mutation(({ input }) => deleteAttendance(input)),
  
  getAttendanceSummary: publicProcedure
    .input(paginationInputSchema.pick({ limit: true }).optional())
    .query(({ input }) => getAttendanceSummary(input?.limit || 7)),

  // Leave request management routes
  createLeaveRequest: publicProcedure
    .input(createLeaveRequestInputSchema)
    .mutation(({ input }) => createLeaveRequest(input)),
  
  getLeaveRequests: publicProcedure
    .input(paginationInputSchema.optional())
    .query(({ input }) => getLeaveRequests(input)),
  
  getLeaveRequestsByUserId: publicProcedure
    .input(getLeaveRequestsByUserIdInputSchema)
    .query(({ input }) => getLeaveRequestsByUserId(input)),
  
  getPendingLeaveRequests: publicProcedure
    .query(() => getPendingLeaveRequests()),
  
  updateLeaveRequest: publicProcedure
    .input(updateLeaveRequestInputSchema)
    .mutation(({ input }) => updateLeaveRequest(input)),
  
  approveLeaveRequest: publicProcedure
    .input(deleteByIdInputSchema)
    .mutation(({ input }) => approveLeaveRequest(input.id)),
  
  rejectLeaveRequest: publicProcedure
    .input(deleteByIdInputSchema)
    .mutation(({ input }) => rejectLeaveRequest(input.id)),
  
  deleteLeaveRequest: publicProcedure
    .input(deleteByIdInputSchema)
    .mutation(({ input }) => deleteLeaveRequest(input)),
  
  getActiveLeaveRequestsCount: publicProcedure
    .query(() => getActiveLeaveRequestsCount()),

  // Document management routes
  createDocument: publicProcedure
    .input(createDocumentInputSchema)
    .mutation(({ input }) => createDocument(input)),
  
  getDocuments: publicProcedure
    .input(paginationInputSchema.optional())
    .query(({ input }) => getDocuments(input)),
  
  getDocumentsByUserId: publicProcedure
    .input(getDocumentsByUserIdInputSchema)
    .query(({ input }) => getDocumentsByUserId(input)),
  
  getDocumentById: publicProcedure
    .input(deleteByIdInputSchema)
    .query(({ input }) => getDocumentById(input.id)),
  
  updateDocument: publicProcedure
    .input(updateDocumentInputSchema)
    .mutation(({ input }) => updateDocument(input)),
  
  deleteDocument: publicProcedure
    .input(deleteByIdInputSchema)
    .mutation(({ input }) => deleteDocument(input)),
  
  downloadDocument: publicProcedure
    .input(deleteByIdInputSchema.extend({ 
      userId: getUserByIdInputSchema.shape.id,
      userRole: loginInputSchema.shape.password 
    }))
    .query(({ input }) => downloadDocument(input.id, input.userId, input.userRole)),

  // Dashboard routes
  getDashboardStats: publicProcedure
    .query(() => getDashboardStats()),
  
  getTotalEmployeesCount: publicProcedure
    .query(() => getTotalEmployeesCount()),
  
  getEmployeeAttendanceStats: publicProcedure
    .input(getUserByIdInputSchema.extend({ days: paginationInputSchema.shape.limit.optional() }))
    .query(({ input }) => getEmployeeAttendanceStats(input.id, input.days)),
  
  getEmployeeLeaveBalance: publicProcedure
    .input(getUserByIdInputSchema)
    .query(({ input }) => getEmployeeLeaveBalance(input.id)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();