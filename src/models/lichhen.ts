/**
 * Appointment Model
 * Định nghĩa cấu trúc dữ liệu cho lịch hẹn
 */
import { useState, useEffect } from 'react';
import { Employee, DayOfWeek } from './nhanvien';
import { Service } from './dichvu';
import moment from 'moment';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Appointment {
  id: string;
  employeeId: string;
  serviceId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  appointmentDate: string; // Format: "YYYY-MM-DD"
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
  status: AppointmentStatus;
  notes?: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentPayload {
  employeeId: string;
  serviceId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  appointmentDate: string;
  startTime: string;
  notes?: string;
}

export interface UpdateAppointmentPayload {
  status?: AppointmentStatus;
  notes?: string;
  startTime?: string;
  appointmentDate?: string;
  employeeId?: string;
  serviceId?: string;
}

export interface AppointmentConflict {
  hasConflict: boolean;
  reason?: string;
  conflictingAppointments?: string[]; // IDs of conflicting appointments
}

export default () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const getAppointments = () => {
    const dataLocal: any = JSON.parse(localStorage.getItem('appointments') as any);
    if (dataLocal) {
      setAppointments(dataLocal);
    } else {
      // Mock data
      const mockAppts: Appointment[] = [];
      localStorage.setItem('appointments', JSON.stringify(mockAppts));
      setAppointments(mockAppts);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const addAppointment = (payload: CreateAppointmentPayload, employees: Employee[], services: Service[]) => {
    const service = services.find(s => s.id === payload.serviceId);
    if (!service) throw new Error('Dịch vụ không tồn tại');

    const appointmentTime = moment(`${payload.appointmentDate} ${payload.startTime}`, 'YYYY-MM-DD HH:mm');
    const endTime = appointmentTime.add(service.duration, 'minutes').format('HH:mm');

    const newAppointment: Appointment = {
      ...payload,
      endTime,
      id: Math.random().toString(36).substr(2, 9),
      status: AppointmentStatus.PENDING,
      totalPrice: service.price,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const newAppointments = [newAppointment, ...appointments];
    setAppointments(newAppointments);
    localStorage.setItem('appointments', JSON.stringify(newAppointments));
    return newAppointment;
  };

  const updateAppointment = (id: string, payload: UpdateAppointmentPayload, services: Service[] = []) => {
    const newAppointments = appointments.map((appt) => {
      if (appt.id === id) {
        let updateData = { ...payload } as any;
        if (payload.serviceId && payload.startTime && payload.appointmentDate) {
           const service = services.find(s => s.id === payload.serviceId) || services.find(s => s.id === appt.serviceId);
           if (service) {
             const appointmentTime = moment(`${payload.appointmentDate} ${payload.startTime}`, 'YYYY-MM-DD HH:mm');
             updateData.endTime = appointmentTime.add(service.duration, 'minutes').format('HH:mm');
             updateData.totalPrice = service.price;
           }
        }
        return {
          ...appt,
          ...updateData,
          updatedAt: new Date().toISOString(),
        };
      }
      return appt;
    });
    setAppointments(newAppointments);
    localStorage.setItem('appointments', JSON.stringify(newAppointments));
  };

  const deleteAppointment = (id: string) => {
    const newAppointments = appointments.filter((appt) => appt.id !== id);
    setAppointments(newAppointments);
    localStorage.setItem('appointments', JSON.stringify(newAppointments));
  };

  const checkConflict = (
    employeeId: string,
    appointmentDate: string,
    startTime: string,
    duration: number,
    excludeAppointmentId?: string
  ): AppointmentConflict => {
    const newStart = moment(`${appointmentDate} ${startTime}`, 'YYYY-MM-DD HH:mm');
    const newEnd = moment(newStart).add(duration, 'minutes');

    const employeeAppointments = appointments.filter(
      (a) => a.employeeId === employeeId && 
             a.appointmentDate === appointmentDate && 
             a.status !== AppointmentStatus.CANCELLED &&
             a.id !== excludeAppointmentId
    );

    for (const appt of employeeAppointments) {
      const existingStart = moment(`${appt.appointmentDate} ${appt.startTime}`, 'YYYY-MM-DD HH:mm');
      const existingEnd = moment(`${appt.appointmentDate} ${appt.endTime}`, 'YYYY-MM-DD HH:mm');

      // Check for time overlap
      if (newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart)) {
        return {
          hasConflict: true,
          reason: `Trùng lịch với khách hàng ${appt.customerName} (${appt.startTime} - ${appt.endTime})`,
          conflictingAppointments: [appt.id],
        };
      }
    }

    return { hasConflict: false };
  };

  const checkEmployeeLimit = (employee: Employee, date: string): boolean => {
    const count = appointments.filter(
      a => a.employeeId === employee.id && 
           a.appointmentDate === date && 
           a.status !== AppointmentStatus.CANCELLED
    ).length;

    return count < employee.dailyCustomerLimit;
  };

  return {
    appointments,
    getAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    checkConflict,
    checkEmployeeLimit,
  };
};
