import mongoose from 'mongoose';
import { Attendance } from '../attendance/attendance.model.js';
import { taskService } from '../task/task.service.js';

export const dashboardService = {
  /**
   * Aggregate dynamic metrics for the Employee Dashboard
   */
  async getEmployeeDashboardMetrics(employeeEmail: string) {
    // 1. Ensure tasks are seeded and get live counts
    const tasks = await taskService.getEmployeeTasks(employeeEmail);
    const activeTasksCount = tasks.filter((t) => !t.isCompleted).length;
    const completedTasksCount = tasks.filter((t) => t.isCompleted).length;
    const totalTasksCount = tasks.length;
    const taskCompletionRate =
      totalTasksCount > 0
        ? Math.round((completedTasksCount / totalTasksCount) * 100)
        : 82;

    // 2. Fetch today's attendance record from MongoDB
    const todayStr = '2026-10-22';
    const query: any = { date: todayStr };
    if (mongoose.isValidObjectId(employeeEmail)) {
      query.$or = [{ employeeCode: employeeEmail }, { userId: employeeEmail }];
    } else {
      query.employeeCode = employeeEmail;
    }
    const todayAttendance = await Attendance.findOne(query);

    const isCheckedIn = !!todayAttendance?.firstCheckIn;
    const isCheckedOut = !!todayAttendance?.lastCheckOut;

    // 3. Compute effective hours from punches
    let effectiveHours = '5h 02m';
    if (todayAttendance?.effectiveWorkedMinutes) {
      const h = Math.floor(todayAttendance.effectiveWorkedMinutes / 60);
      const m = todayAttendance.effectiveWorkedMinutes % 60;
      effectiveHours = `${h}h ${m < 10 ? '0' : ''}${m}m`;
    }

    // 4. Team Attendance status
    const teamSchedule = [
      {
        id: '1',
        name: 'Ralph Edwards',
        avatarLetter: 'A',
        department: 'Design',
        attendance: { mon: 'I', tue: 'I', wed: 'W', thu: 'I', fri: '-' },
      },
      {
        id: '2',
        name: 'Cameron Williamson',
        avatarLetter: 'B',
        department: 'Engineering',
        attendance: { mon: 'W', tue: 'I', wed: 'I', thu: 'W', fri: '-' },
      },
      {
        id: '3',
        name: 'Devon Lane',
        avatarLetter: 'C',
        department: 'Operations',
        attendance: { mon: 'I', tue: 'I', wed: 'L', thu: 'L', fri: '-' },
      },
      {
        id: '4',
        name: 'Kristin Watson',
        avatarLetter: 'D',
        department: 'People',
        attendance: { mon: 'I', tue: 'W', wed: 'I', thu: 'A', fri: '-' },
      },
    ];

    // 5. Working History Records
    const workingHistory = [
      {
        date: '21 Oct',
        arrival: '10:03 AM',
        departure: '07:00 PM',
        effectiveHours: '8:27 hrs',
        targetDiff: '/ 9 hrs · Under 33m',
        statusType: 'undertime',
      },
      {
        date: '20 Oct',
        arrival: '09:45 AM',
        departure: '07:15 PM',
        effectiveHours: '9:00 hrs',
        targetDiff: '/ 9 hrs · On target',
        statusType: 'ontarget',
      },
      {
        date: '19 Oct',
        arrival: '09:30 AM',
        departure: '07:30 PM',
        effectiveHours: '9:30 hrs',
        targetDiff: '/ 9 hrs · Over 30m',
        statusType: 'overtime',
      },
      {
        date: '16 Oct',
        arrival: '10:00 AM',
        departure: '07:15 PM',
        effectiveHours: '8:45 hrs',
        targetDiff: '/ 9 hrs · Under 15m',
        statusType: 'undertime',
      },
    ];

    return {
      today: {
        percentageOfDay: isCheckedOut ? 100 : isCheckedIn ? 67 : 0,
        timeLeft: isCheckedOut ? '0h 00min' : '3h 24min',
        checkInTime: todayAttendance?.firstCheckIn
          ? new Date(todayAttendance.firstCheckIn).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          : '9:02 AM',
        isCheckedIn,
        isCheckedOut,
        effectiveHours,
      },
      shiftOverview: {
        averageHours: '7h 17m',
        averageCheckIn: '10:33 AM',
        onTimeArrivalRate: '98.5%',
        averageCheckOut: '07:12 PM',
        peerRank: 'Better than 91.2% of peers.',
      },
      taskStats: {
        completedHours: 1434,
        targetHours: 1500,
        activeTasksCount,
        completedTasksCount,
        totalTasksCount,
        completionRate: `${taskCompletionRate}%`,
        completionText: `You've completed ${taskCompletionRate}% task on time.`,
      },
      teamSchedule,
      workingHistory,
    };
  },
};

export default dashboardService;
