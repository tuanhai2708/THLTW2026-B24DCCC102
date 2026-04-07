declare namespace DuLich {
	/** Loại hình điểm đến */
	type DestinationType = 'bien' | 'nui' | 'thanh_pho';

	/** Thông tin một điểm đến du lịch */
	interface Destination {
		id: string;
		name: string;
		location: string;
		type: DestinationType;
		description: string;
		visitDuration: number; // giờ
		image: string;
		rating: number; // 1-5
		foodCost: number; // VNĐ
		accommodationCost: number; // VNĐ/đêm
		transportCost: number; // VNĐ
		createdAt: string;
	}

	/** Một điểm đến trong lịch trình (có thêm thời gian, ghi chú) */
	interface ItineraryDestination {
		destinationId: string;
		destination?: Destination;
		startTime: string; // HH:mm
		endTime: string; // HH:mm
		notes: string;
		travelTimeFromPrev: number; // phút
	}

	/** Lịch trình 1 ngày */
	interface ItineraryDay {
		dayNumber: number;
		date: string; // YYYY-MM-DD
		destinations: ItineraryDestination[];
	}

	/** Lịch trình du lịch */
	interface Itinerary {
		id: string;
		name: string;
		startDate: string;
		endDate: string;
		totalBudget: number;
		days: ItineraryDay[];
		createdAt: string;
	}

	/** Phân bổ ngân sách theo hạng mục */
	interface BudgetBreakdown {
		food: number;
		accommodation: number;
		transport: number;
		other: number;
		total: number;
	}

	/** Filter tìm kiếm điểm đến */
	interface DestinationFilter {
		type?: DestinationType;
		minPrice?: number;
		maxPrice?: number;
		minRating?: number;
		keyword?: string;
		sortBy?: 'name' | 'rating' | 'price';
		sortOrder?: 'asc' | 'desc';
	}
}
