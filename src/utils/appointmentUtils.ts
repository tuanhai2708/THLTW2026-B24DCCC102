import moment from 'moment';

/**
 * Tính toán thời gian kết thúc dựa vào thời gian bắt đầu và thời lượng (phút)
 * @param startTime Giờ bắt đầu (HH:mm)
 * @param durationInMinutes Thời lượng (phút)
 * @returns Giờ kết thúc (HH:mm)
 */
export const calculateEndTime = (startTime: string, durationInMinutes: number): string => {
  if (!startTime || !durationInMinutes) return '';
  const [hours, minutes] = startTime.split(':').map(Number);
  const end = moment().hour(hours).minute(minutes).add(durationInMinutes, 'minute');
  return end.format('HH:mm');
};

/**
 * Format tiền tệ VNĐ
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

/**
 * Format ngày tháng VN
 */
export const formatDateVN = (dateStr: string, formatStr: string = 'DD/MM/YYYY'): string => {
  if (!dateStr) return '';
  return moment(dateStr).format(formatStr);
};
