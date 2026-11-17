export interface DepartmentInterface {
  _id: string;
  dept_id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'disabled';
  createdBy?: string;
  updatedBy?: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentAssignInterface {
  _id: string;
  user: string | { _id: string; name: string; email: string };
  department: string | DepartmentInterface;
  dept_id: string;
  status: 'active' | 'inactive' | 'disabled' | 'transferred';
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}
