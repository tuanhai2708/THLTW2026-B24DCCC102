import axios from '@/utils/axios';

const BASE = '/api';

// ==================== ĐIỂM ĐẾN ====================

/** Lấy danh sách điểm đến (có filter) */
export async function getDestinations(params?: DuLich.DestinationFilter) {
	return axios.get(`${BASE}/destinations`, { params });
}

/** Lấy chi tiết 1 điểm đến */
export async function getDestinationById(id: string) {
	return axios.get(`${BASE}/destinations/${id}`);
}

/** Thêm điểm đến mới */
export async function createDestination(data: Partial<DuLich.Destination>) {
	return axios.post(`${BASE}/destinations`, data);
}

/** Cập nhật điểm đến */
export async function updateDestination(id: string, data: Partial<DuLich.Destination>) {
	return axios.put(`${BASE}/destinations/${id}`, data);
}

/** Xóa điểm đến */
export async function deleteDestination(id: string) {
	return axios.delete(`${BASE}/destinations/${id}`);
}

// ==================== LỊCH TRÌNH ====================

/** Lấy danh sách lịch trình */
export async function getItineraries() {
	return axios.get(`${BASE}/itineraries`);
}

/** Lấy chi tiết lịch trình (kèm populate destinations) */
export async function getItineraryById(id: string) {
	return axios.get(`${BASE}/itineraries/${id}`);
}

/** Tạo lịch trình mới */
export async function createItinerary(data: Partial<DuLich.Itinerary>) {
	return axios.post(`${BASE}/itineraries`, data);
}

/** Cập nhật lịch trình */
export async function updateItinerary(id: string, data: Partial<DuLich.Itinerary>) {
	return axios.put(`${BASE}/itineraries/${id}`, data);
}

/** Xóa lịch trình */
export async function deleteItinerary(id: string) {
	return axios.delete(`${BASE}/itineraries/${id}`);
}

// ==================== THỐNG KÊ ====================

/** Lấy dữ liệu thống kê tổng hợp */
export async function getStatistics() {
	return axios.get(`${BASE}/statistics`);
}
