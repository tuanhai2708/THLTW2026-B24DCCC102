/**
 * Service Model
 * Định nghĩa cấu trúc dữ liệu cho dịch vụ
 */
import { useState, useEffect } from 'react';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // Thời gian thực hiện tính bằng phút
  createdAt: string;
  updatedAt: string;
}

export interface CreateServicePayload {
  name: string;
  description: string;
  price: number;
  duration: number;
}

export interface UpdateServicePayload {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
}

export default () => {
  const [services, setServices] = useState<Service[]>([]);

  const getServices = () => {
    const dataLocal: any = JSON.parse(localStorage.getItem('services') as any);
    if (dataLocal) {
      setServices(dataLocal);
    } else {
      // Mock data
      const mockServices: Service[] = [
        {
          id: '1',
          name: 'Cắt tóc nam',
          description: 'Cắt tóc nam thời trang',
          price: 100000,
          duration: 30,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Gội đầu dưỡng sinh',
          description: 'Gội đầu thư giãn, massage 60 phút',
          price: 250000,
          duration: 60,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      localStorage.setItem('services', JSON.stringify(mockServices));
      setServices(mockServices);
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  const addService = (payload: CreateServicePayload) => {
    const newService: Service = {
      ...payload,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const newServices = [newService, ...services];
    setServices(newServices);
    localStorage.setItem('services', JSON.stringify(newServices));
  };

  const updateService = (id: string, payload: UpdateServicePayload) => {
    const newServices = services.map((srv) => {
      if (srv.id === id) {
        return {
          ...srv,
          ...payload,
          updatedAt: new Date().toISOString(),
        };
      }
      return srv;
    });
    setServices(newServices);
    localStorage.setItem('services', JSON.stringify(newServices));
  };

  const deleteService = (id: string) => {
    const newServices = services.filter((srv) => srv.id !== id);
    setServices(newServices);
    localStorage.setItem('services', JSON.stringify(newServices));
  };

  return {
    services,
    getServices,
    addService,
    updateService,
    deleteService,
  };
};
