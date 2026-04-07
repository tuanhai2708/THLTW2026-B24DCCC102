import { Request, Response } from 'express';

/** data mẫu */
export const defaultDestinations: DuLich.Destination[] = [
	{
		id: 'dest-001',
		name: 'Bãi biển Mỹ Khê',
		location: 'Đà Nẵng',
		type: 'bien',
		description:
			'Bãi biển Mỹ Khê được Forbes bình chọn là một trong 6 bãi biển quyến rũ nhất hành tinh. Bờ cát trắng trải dài, nước biển trong xanh, sóng vừa phải rất thích hợp cho tắm biển và các hoạt động thể thao dưới nước.',
		visitDuration: 4,
		image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80',
		rating: 4.7,
		foodCost: 300000,
		accommodationCost: 800000,
		transportCost: 200000,
		createdAt: '2025-01-15',
	},
	{
		id: 'dest-002',
		name: 'Đảo Phú Quốc',
		location: 'Kiên Giang',
		type: 'bien',
		description:
			'Phú Quốc là đảo lớn nhất Việt Nam, nổi tiếng với bãi biển hoang sơ, nước biển trong vắt và hệ sinh thái san hô phong phú. Nơi đây còn có VinWonders, Safari, chợ đêm sầm uất.',
		visitDuration: 8,
		image: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=800&q=80',
		rating: 4.8,
		foodCost: 400000,
		accommodationCost: 1200000,
		transportCost: 500000,
		createdAt: '2025-02-10',
	},
	{
		id: 'dest-003',
		name: 'Thị trấn Sa Pa',
		location: 'Lào Cai',
		type: 'nui',
		description:
			'Sa Pa nằm ở độ cao 1.500m, nổi tiếng với ruộng bậc thang tuyệt đẹp, đỉnh Fansipan - nóc nhà Đông Dương, và văn hóa đặc sắc của các dân tộc thiểu số H\'Mông, Dao đỏ.',
		visitDuration: 6,
		image: 'https://images.unsplash.com/photo-1570366583862-f91883984fde?w=800&q=80',
		rating: 4.6,
		foodCost: 250000,
		accommodationCost: 600000,
		transportCost: 350000,
		createdAt: '2025-01-20',
	},
	{
		id: 'dest-004',
		name: 'Phố cổ Hội An',
		location: 'Quảng Nam',
		type: 'thanh_pho',
		description:
			'Hội An là di sản văn hóa thế giới UNESCO với kiến trúc cổ kính hàng trăm năm tuổi. Phố cổ lung linh đèn lồng về đêm, ẩm thực đường phố phong phú: cao lầu, mì Quảng, bánh mì Phượng.',
		visitDuration: 5,
		image: 'https://images.unsplash.com/photo-1555921015-5532091f6026?w=800&q=80',
		rating: 4.9,
		foodCost: 200000,
		accommodationCost: 500000,
		transportCost: 150000,
		createdAt: '2025-03-05',
	},
	{
		id: 'dest-005',
		name: 'Vịnh Nha Trang',
		location: 'Khánh Hòa',
		type: 'bien',
		description:
			'Vịnh Nha Trang là một trong 29 vịnh đẹp nhất thế giới. Thành phố biển sôi động với Vinpearl Land, Tháp bà Ponagar, viện Hải dương học và hàng loạt hòn đảo xinh đẹp.',
		visitDuration: 6,
		image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80',
		rating: 4.5,
		foodCost: 350000,
		accommodationCost: 900000,
		transportCost: 250000,
		createdAt: '2025-02-28',
	},
	{
		id: 'dest-006',
		name: 'Thành phố Đà Lạt',
		location: 'Lâm Đồng',
		type: 'nui',
		description:
			'Đà Lạt - thành phố ngàn hoa với khí hậu mát mẻ quanh năm. Nổi tiếng với hồ Xuân Hương, thung lũng Tình Yêu, đồi chè Cầu Đất, vườn hoa thành phố và các quán cà phê view đẹp.',
		visitDuration: 5,
		image: 'https://images.unsplash.com/photo-1586858459248-8a345a40b2f2?w=800&q=80',
		rating: 4.7,
		foodCost: 250000,
		accommodationCost: 700000,
		transportCost: 200000,
		createdAt: '2025-03-15',
	},
	{
		id: 'dest-007',
		name: 'Vịnh Hạ Long',
		location: 'Quảng Ninh',
		type: 'bien',
		description:
			'Di sản thiên nhiên thế giới UNESCO với gần 2.000 hòn đảo đá vôi. Du thuyền ngắm cảnh, kayak khám phá hang động, tắm biển tại Ti Tốp, trải nghiệm làng chài cổ.',
		visitDuration: 8,
		image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80',
		rating: 4.8,
		foodCost: 500000,
		accommodationCost: 1500000,
		transportCost: 400000,
		createdAt: '2025-01-10',
	},
	{
		id: 'dest-008',
		name: 'Cố đô Huế',
		location: 'Thừa Thiên Huế',
		type: 'thanh_pho',
		description:
			'Huế - cố đô triều Nguyễn với Đại Nội, lăng tẩm, chùa Thiên Mụ bên dòng sông Hương thơ mộng. Ẩm thực cung đình tinh tế: bún bò Huế, cơm hến, bánh bèo, chè Huế.',
		visitDuration: 6,
		image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80',
		rating: 4.6,
		foodCost: 200000,
		accommodationCost: 500000,
		transportCost: 180000,
		createdAt: '2025-04-01',
	},
	{
		id: 'dest-009',
		name: 'Cao nguyên đá Đồng Văn',
		location: 'Hà Giang',
		type: 'nui',
		description:
			'Công viên địa chất toàn cầu UNESCO với cảnh quan hùng vĩ. Đèo Mã Pí Lèng, sông Nho Quế xanh ngắt, cột cờ Lũng Cú, chợ phiên Đồng Văn đậm bản sắc dân tộc.',
		visitDuration: 8,
		image: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=800&q=80',
		rating: 4.9,
		foodCost: 200000,
		accommodationCost: 400000,
		transportCost: 300000,
		createdAt: '2025-03-20',
	},
	{
		id: 'dest-010',
		name: 'TP. Hồ Chí Minh',
		location: 'TP. Hồ Chí Minh',
		type: 'thanh_pho',
		description:
			'Thành phố năng động nhất Việt Nam với Nhà thờ Đức Bà, Bưu điện trung tâm, Bến Nhà Rồng, phố đi bộ Nguyễn Huệ. Thiên đường ẩm thực đường phố và cuộc sống về đêm sôi động.',
		visitDuration: 6,
		image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80',
		rating: 4.4,
		foodCost: 350000,
		accommodationCost: 800000,
		transportCost: 150000,
		createdAt: '2025-02-15',
	},
	{
		id: 'dest-011',
		name: 'Tràng An - Tam Cốc',
		location: 'Ninh Bình',
		type: 'nui',
		description:
			'Di sản văn hóa và thiên nhiên thế giới UNESCO. Đi thuyền qua các hang động tự nhiên, ngắm núi non hùng vĩ. Cố đô Hoa Lư, chùa Bái Đính, hang Múa với view panorama tuyệt đẹp.',
		visitDuration: 6,
		image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80',
		rating: 4.7,
		foodCost: 200000,
		accommodationCost: 450000,
		transportCost: 250000,
		createdAt: '2025-04-10',
	},
	{
		id: 'dest-012',
		name: 'Biển Quy Nhơn',
		location: 'Bình Định',
		type: 'bien',
		description:
			'Quy Nhơn sở hữu những bãi biển hoang sơ tuyệt đẹp: Kỳ Co, Eo Gió, bãi Xép. Thiên đường check-in với ghềnh Ráng Tiên Sa. Ẩm thực hải sản tươi sống giá rẻ.',
		visitDuration: 5,
		image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80',
		rating: 4.5,
		foodCost: 250000,
		accommodationCost: 600000,
		transportCost: 200000,
		createdAt: '2025-05-01',
	},
];

/** Lấy data từ localStorage hoặc dùng default */
function getDestinations(): DuLich.Destination[] {
	const stored = global?.localStorage?.getItem?.('destinations');
	if (stored) {
		try {
			return JSON.parse(stored);
		} catch {
			return defaultDestinations;
		}
	}
	return defaultDestinations;
}

/** Lưu data vào localStorage */
function saveDestinations(data: DuLich.Destination[]) {
	global?.localStorage?.setItem?.('destinations', JSON.stringify(data));
}

/** GET /api/destinations — Danh sách + filter */
function getDestinationList(req: Request, res: Response) {
	const { type, minPrice, maxPrice, minRating, keyword, sortBy, sortOrder } = req.query as any;
	let result = getDestinations();

	// Filter theo loại hình
	if (type) {
		result = result.filter((d) => d.type === type);
	}

	// Filter theo khoảng giá (tổng chi phí)
	if (minPrice) {
		result = result.filter((d) => d.foodCost + d.accommodationCost + d.transportCost >= Number(minPrice));
	}
	if (maxPrice) {
		result = result.filter((d) => d.foodCost + d.accommodationCost + d.transportCost <= Number(maxPrice));
	}

	// Filter theo rating tối thiểu
	if (minRating) {
		result = result.filter((d) => d.rating >= Number(minRating));
	}

	// Tìm kiếm theo từ khóa
	if (keyword) {
		const kw = (keyword as string).toLowerCase();
		result = result.filter(
			(d) =>
				d.name.toLowerCase().includes(kw) ||
				d.location.toLowerCase().includes(kw) ||
				d.description.toLowerCase().includes(kw),
		);
	}

	// Sắp xếp
	if (sortBy) {
		const order = sortOrder === 'desc' ? -1 : 1;
		result.sort((a, b) => {
			switch (sortBy) {
				case 'name':
					return a.name.localeCompare(b.name) * order;
				case 'rating':
					return (a.rating - b.rating) * order;
				case 'price': {
					const priceA = a.foodCost + a.accommodationCost + a.transportCost;
					const priceB = b.foodCost + b.accommodationCost + b.transportCost;
					return (priceA - priceB) * order;
				}
				default:
					return 0;
			}
		});
	}

	res.json({ data: result, total: result.length });
}

/** GET /api/destinations/:id — Chi tiết */
function getDestinationById(req: Request, res: Response) {
	const { id } = req.params;
	const all = getDestinations();
	const found = all.find((d) => d.id === id);
	if (!found) {
		res.status(404).json({ message: 'Không tìm thấy điểm đến' });
		return;
	}
	res.json({ data: found });
}

/** POST /api/destinations — Thêm mới */
function createDestination(req: Request, res: Response) {
	const all = getDestinations();
	const newDest: DuLich.Destination = {
		...req.body,
		id: `dest-${Date.now()}`,
		createdAt: new Date().toISOString().split('T')[0],
	};
	all.push(newDest);
	saveDestinations(all);
	res.json({ data: newDest, message: 'Thêm điểm đến thành công' });
}

/** PUT /api/destinations/:id — Cập nhật */
function updateDestination(req: Request, res: Response) {
	const { id } = req.params;
	const all = getDestinations();
	const index = all.findIndex((d) => d.id === id);
	if (index === -1) {
		res.status(404).json({ message: 'Không tìm thấy điểm đến' });
		return;
	}
	all[index] = { ...all[index], ...req.body, id };
	saveDestinations(all);
	res.json({ data: all[index], message: 'Cập nhật thành công' });
}

/** DELETE /api/destinations/:id — Xóa */
function deleteDestination(req: Request, res: Response) {
	const { id } = req.params;
	let all = getDestinations();
	const found = all.find((d) => d.id === id);
	if (!found) {
		res.status(404).json({ message: 'Không tìm thấy điểm đến' });
		return;
	}
	all = all.filter((d) => d.id !== id);
	saveDestinations(all);
	res.json({ message: 'Xóa thành công' });
}

export default {
	'GET /api/destinations': getDestinationList,
	'GET /api/destinations/:id': getDestinationById,
	'POST /api/destinations': createDestination,
	'PUT /api/destinations/:id': updateDestination,
	'DELETE /api/destinations/:id': deleteDestination,
};
