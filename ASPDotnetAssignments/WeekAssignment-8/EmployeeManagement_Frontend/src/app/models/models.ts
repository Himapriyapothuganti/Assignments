export interface AuthUser {
  token: string;
  userId: string;
  username: string;
  fullName: string;
  role: 'Admin' | 'Manager' | 'Employee';
  email: string;
}

export interface Employee {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: number;
  hireDate: string;
  isActive: boolean;
  userId: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
