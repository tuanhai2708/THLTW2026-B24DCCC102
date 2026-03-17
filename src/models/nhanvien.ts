/**
 * Employee Model
 * Định nghĩa cấu trúc dữ liệu cho nhân viên
 */
import { useState, useEffect } from 'react';

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export interface WorkSchedule {
  dayOfWeek: DayOfWeek;
  startTime: string; // Format: "HH:mm" (e.g., "09:00")
  endTime: string; // Format: "HH:mm" (e.g., "17:00")
  isWorking: boolean;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  dailyCustomerLimit: number; // Số khách tối đa mỗi ngày
  workSchedules: WorkSchedule[]; // Lịch làm việc trong tuần
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeePayload {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  dailyCustomerLimit: number;
  workSchedules: WorkSchedule[];
}

export interface UpdateEmployeePayload {
  name?: string;
  email?: string;
  phone?: string;
  specialization?: string;
  dailyCustomerLimit?: number;
  workSchedules?: WorkSchedule[];
}

export default () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const getEmployees = () => {
    const dataLocal: any = JSON.parse(localStorage.getItem('employees') as any);
    if (dataLocal) {
      setEmployees(dataLocal);
    } else {
			// Mock data
			const mockData: Employee[] = [
				{
					id: '1',
					name: 'Nguyễn Văn A',
					email: 'nva@gmail.com',
					phone: '0123456789',
					specialization: 'Cắt tóc',
					dailyCustomerLimit: 10,
					workSchedules: [
						{ dayOfWeek: DayOfWeek.MONDAY, startTime: '09:00', endTime: '17:00', isWorking: true },
						{ dayOfWeek: DayOfWeek.TUESDAY, startTime: '09:00', endTime: '17:00', isWorking: true },
					],
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				}
			];
			localStorage.setItem('employees', JSON.stringify(mockData));
			setEmployees(mockData);
		}
  };

	useEffect(() => {
		getEmployees();
	}, []);

  const addEmployee = (payload: CreateEmployeePayload) => {
    const newEmployee: Employee = {
      ...payload,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const newEmployees = [newEmployee, ...employees];
    setEmployees(newEmployees);
    localStorage.setItem('employees', JSON.stringify(newEmployees));
  };

  const updateEmployee = (id: string, payload: UpdateEmployeePayload) => {
    const newEmployees = employees.map((emp) => {
      if (emp.id === id) {
        return {
          ...emp,
          ...payload,
          updatedAt: new Date().toISOString(),
        };
      }
      return emp;
    });
    setEmployees(newEmployees);
    localStorage.setItem('employees', JSON.stringify(newEmployees));
  };

  const deleteEmployee = (id: string) => {
    const newEmployees = employees.filter((emp) => emp.id !== id);
    setEmployees(newEmployees);
    localStorage.setItem('employees', JSON.stringify(newEmployees));
  };

  return {
    employees,
    getEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  };
};
