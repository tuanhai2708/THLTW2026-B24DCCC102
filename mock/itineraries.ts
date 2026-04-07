import { Request, Response } from 'express';
import { defaultDestinations } from './destinations';

/** Dữ liệu mẫu 3 lịch trình du lịch */
const defaultItineraries: DuLich.Itinerary[] = [
	{
		id: 'itin-001',
		name: 'Khám phá miền Trung 5 ngày',
		startDate: '2025-06-10',
		endDate: '2025-06-14',
		totalBudget: 8000000,
		days: [
			{
				dayNumber: 1,
				date: '2025-06-10',
				destinations: [
					{
						destinationId: 'dest-001',
						startTime: '08:00',
						endTime: '12:00',
						notes: 'Tắm biển buổi sáng, chơi dù lượn',
						travelTimeFromPrev: 0,
					},
					{
						destinationId: 'dest-004',
						startTime: '14:00',
						endTime: '20:00',
						notes: 'Dạo phố cổ, thả hoa đăng sông Hoài',
						travelTimeFromPrev: 45,
					},
				],
			},
			{
				dayNumber: 2,
				date: '2025-06-11',
				destinations: [
					{
						destinationId: 'dest-008',
						startTime: '07:00',
						endTime: '17:00',
						notes: 'Tham quan Đại Nội, lăng Minh Mạng, chùa Thiên Mụ',
						travelTimeFromPrev: 120,
					},
				],
			},
			{
				dayNumber: 3,
				date: '2025-06-12',
				destinations: [
					{
						destinationId: 'dest-005',
						startTime: '09:00',
						endTime: '18:00',
						notes: 'Lặn ngắm san hô, tham quan Vinpearl Land',
						travelTimeFromPrev: 0,
					},
				],
			},
			{
				dayNumber: 4,
				date: '2025-06-13',
				destinations: [
					{
						destinationId: 'dest-012',
						startTime: '08:00',
						endTime: '17:00',
						notes: 'Check-in Kỳ Co, Eo Gió, thưởng thức hải sản',
						travelTimeFromPrev: 180,
					},
				],
			},
			{
				dayNumber: 5,
				date: '2025-06-14',
				destinations: [
					{
						destinationId: 'dest-001',
						startTime: '06:00',
						endTime: '10:00',
						notes: 'Tắm biển sáng sớm, bay về',
						travelTimeFromPrev: 180,
					},
				],
			},
		],
		createdAt: '2025-05-20',
	},
	{
		id: 'itin-002',
		name: 'Phượt Tây Bắc 4 ngày',
		startDate: '2025-07-01',
		endDate: '2025-07-04',
		totalBudget: 5000000,
		days: [
			{
				dayNumber: 1,
				date: '2025-07-01',
				destinations: [
					{
						destinationId: 'dest-003',
						startTime: '10:00',
						endTime: '18:00',
						notes: 'Trek bản Cát Cát, chinh phục Fansipan bằng cáp treo',
						travelTimeFromPrev: 0,
					},
				],
			},
			{
				dayNumber: 2,
				date: '2025-07-02',
				destinations: [
					{
						destinationId: 'dest-003',
						startTime: '06:00',
						endTime: '14:00',
						notes: 'Trekking ruộng bậc thang Mường Hoa',
						travelTimeFromPrev: 0,
					},
				],
			},
			{
				dayNumber: 3,
				date: '2025-07-03',
				destinations: [
					{
						destinationId: 'dest-009',
						startTime: '07:00',
						endTime: '18:00',
						notes: 'Chinh phục đèo Mã Pí Lèng, ngắm sông Nho Quế',
						travelTimeFromPrev: 240,
					},
				],
			},
			{
				dayNumber: 4,
				date: '2025-07-04',
				destinations: [
					{
						destinationId: 'dest-009',
						startTime: '06:00',
						endTime: '12:00',
						notes: 'Chợ phiên Đồng Văn, cột cờ Lũng Cú',
						travelTimeFromPrev: 0,
					},
				],
			},
		],
		createdAt: '2025-06-10',
	},
	{
		id: 'itin-003',
		name: 'Nghỉ dưỡng Phú Quốc 3 ngày',
		startDate: '2025-08-15',
		endDate: '2025-08-17',
		totalBudget: 12000000,
		days: [
			{
				dayNumber: 1,
				date: '2025-08-15',
				destinations: [
					{
						destinationId: 'dest-002',
						startTime: '10:00',
						endTime: '20:00',
						notes: 'Check-in resort, tắm biển Bãi Sao, chợ đêm Phú Quốc',
						travelTimeFromPrev: 0,
					},
				],
			},
			{
				dayNumber: 2,
				date: '2025-08-16',
				destinations: [
					{
						destinationId: 'dest-002',
						startTime: '08:00',
						endTime: '20:00',
						notes: 'VinWonders, Safari, câu cá, lặn ngắm san hô',
						travelTimeFromPrev: 0,
					},
				],
			},
			{
				dayNumber: 3,
				date: '2025-08-17',
				destinations: [
					{
						destinationId: 'dest-002',
						startTime: '07:00',
						endTime: '11:00',
						notes: 'Spa buổi sáng, bay về',
						travelTimeFromPrev: 0,
					},
				],
			},
		],
		createdAt: '2025-07-25',
	},
];

/** Lấy data từ localStorage hoặc dùng default */
function getItineraries(): DuLich.Itinerary[] {
	const stored = global?.localStorage?.getItem?.('itineraries');
	if (stored) {
		try {
			return JSON.parse(stored);
		} catch {
			return defaultItineraries;
		}
	}
	return defaultItineraries;
}

/** Lưu data vào localStorage */
function saveItineraries(data: DuLich.Itinerary[]) {
	global?.localStorage?.setItem?.('itineraries', JSON.stringify(data));
}

/** GET /api/itineraries — Danh sách */
function getItineraryList(req: Request, res: Response) {
	const result = getItineraries();
	res.json({ data: result, total: result.length });
}

/** GET /api/itineraries/:id — Chi tiết (kèm populate destinations) */
function getItineraryById(req: Request, res: Response) {
	const { id } = req.params;
	const all = getItineraries();
	const found = all.find((it) => it.id === id);
	if (!found) {
		res.status(404).json({ message: 'Không tìm thấy lịch trình' });
		return;
	}

	// Populate destination info — fallback to defaultDestinations khi localStorage không khả dụng (mock server)
	const destinations: DuLich.Destination[] = defaultDestinations;

	const populated = {
		...found,
		days: found.days.map((day) => ({
			...day,
			destinations: day.destinations.map((dd) => ({
				...dd,
				destination: destinations.find((d) => d.id === dd.destinationId),
			})),
		})),
	};

	res.json({ data: populated });
}

/** POST /api/itineraries — Tạo mới */
function createItinerary(req: Request, res: Response) {
	const all = getItineraries();
	const newItem: DuLich.Itinerary = {
		...req.body,
		id: `itin-${Date.now()}`,
		createdAt: new Date().toISOString().split('T')[0],
	};
	all.push(newItem);
	saveItineraries(all);
	res.json({ data: newItem, message: 'Tạo lịch trình thành công' });
}

/** PUT /api/itineraries/:id — Cập nhật */
function updateItinerary(req: Request, res: Response) {
	const { id } = req.params;
	const all = getItineraries();
	const index = all.findIndex((it) => it.id === id);
	if (index === -1) {
		res.status(404).json({ message: 'Không tìm thấy lịch trình' });
		return;
	}
	all[index] = { ...all[index], ...req.body, id };
	saveItineraries(all);
	res.json({ data: all[index], message: 'Cập nhật thành công' });
}

/** DELETE /api/itineraries/:id — Xóa */
function deleteItinerary(req: Request, res: Response) {
	const { id } = req.params;
	let all = getItineraries();
	const found = all.find((it) => it.id === id);
	if (!found) {
		res.status(404).json({ message: 'Không tìm thấy lịch trình' });
		return;
	}
	all = all.filter((it) => it.id !== id);
	saveItineraries(all);
	res.json({ message: 'Xóa thành công' });
}

/** GET /api/statistics — Thống kê cho admin */
function getStatistics(req: Request, res: Response) {
	const itineraries = getItineraries();
	// Sử dụng defaultDestinations trực tiếp vì localStorage không khả dụng trong mock server
	const destinations: DuLich.Destination[] = defaultDestinations;

	// Đếm số lịch trình theo tháng (12 tháng gần nhất)
	const monthlyStats: { month: string; count: number }[] = [];
	for (let i = 11; i >= 0; i--) {
		const date = new Date();
		date.setMonth(date.getMonth() - i);
		const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
		const count = itineraries.filter((it) => it.createdAt.startsWith(monthStr)).length;
		monthlyStats.push({ month: monthStr, count: count || Math.floor(Math.random() * 10) + 1 });
	}

	// Điểm đến phổ biến
	const destCount: Record<string, number> = {};
	itineraries.forEach((it) => {
		it.days.forEach((day) => {
			day.destinations.forEach((dd) => {
				destCount[dd.destinationId] = (destCount[dd.destinationId] || 0) + 1;
			});
		});
	});

	const popularDestinations = Object.entries(destCount)
		.map(([destId, count]) => ({
			destination: destinations.find((d) => d.id === destId),
			count,
		}))
		.filter((item) => item.destination)
		.sort((a, b) => b.count - a.count)
		.slice(0, 10);

	// Doanh thu theo hạng mục
	let totalFood = 0;
	let totalAccommodation = 0;
	let totalTransport = 0;

	itineraries.forEach((it) => {
		it.days.forEach((day) => {
			day.destinations.forEach((dd) => {
				const dest = destinations.find((d) => d.id === dd.destinationId);
				if (dest) {
					totalFood += dest.foodCost;
					totalAccommodation += dest.accommodationCost;
					totalTransport += dest.transportCost;
				}
			});
		});
	});

	// Doanh thu theo tháng
	const monthlyRevenue: { month: string; revenue: number }[] = [];
	for (let i = 11; i >= 0; i--) {
		const date = new Date();
		date.setMonth(date.getMonth() - i);
		const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
		const monthItins = itineraries.filter((it) => it.createdAt.startsWith(monthStr));
		let revenue = 0;
		monthItins.forEach((it) => {
			revenue += it.totalBudget;
		});
		monthlyRevenue.push({
			month: monthStr,
			revenue: revenue || Math.floor(Math.random() * 15000000) + 5000000,
		});
	}

	res.json({
		data: {
			totalItineraries: itineraries.length,
			totalRevenue: itineraries.reduce((sum, it) => sum + it.totalBudget, 0),
			totalDestinations: destinations.length,
			averageRating:
				destinations.length > 0
					? Number((destinations.reduce((sum, d) => sum + d.rating, 0) / destinations.length).toFixed(1))
					: 0,
			monthlyStats,
			popularDestinations,
			categoryRevenue: {
				food: totalFood || 3500000,
				accommodation: totalAccommodation || 8200000,
				transport: totalTransport || 2800000,
			},
			monthlyRevenue,
		},
	});
}

export default {
	'GET /api/itineraries': getItineraryList,
	'GET /api/itineraries/:id': getItineraryById,
	'POST /api/itineraries': createItinerary,
	'PUT /api/itineraries/:id': updateItinerary,
	'DELETE /api/itineraries/:id': deleteItinerary,
	'GET /api/statistics': getStatistics,
};
