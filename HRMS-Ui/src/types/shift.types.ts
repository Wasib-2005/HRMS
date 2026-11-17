export interface ShiftInterface {
  _id: string;
  shiftTitle: string;
  startAt: string;
  endAt: string;
  department: string | { _id: string; name: string; dept_id: string };
  offDay: number; // 1-7 (Mon-Sun)
  status: 'active' | 'inactive';
  createdBy?: string;
  updatedBy?: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}
