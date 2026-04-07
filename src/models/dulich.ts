import { useState, useCallback } from 'react';
import {
	getDestinations,
	getItineraries,
	getItineraryById,
	createItinerary,
	updateItinerary,
	deleteItinerary,
	getStatistics,
} from '@/services/DuLich/api';

export default () => {
	// ==================== STATE ====================
	const [destinations, setDestinations] = useState<DuLich.Destination[]>([]);
	const [itineraries, setItineraries] = useState<DuLich.Itinerary[]>([]);
	const [currentItinerary, setCurrentItinerary] = useState<DuLich.Itinerary | null>(null);
	const [statistics, setStatistics] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	// ==================== DESTINATIONS ====================

	const fetchDestinations = useCallback(async (filters?: DuLich.DestinationFilter) => {
		setLoading(true);
		try {
			const res = await getDestinations(filters);
			setDestinations(res?.data?.data ?? []);
			return res?.data?.data ?? [];
		} finally {
			setLoading(false);
		}
	}, []);

	// ==================== ITINERARIES ====================

	const fetchItineraries = useCallback(async () => {
		setLoading(true);
		try {
			const res = await getItineraries();
			setItineraries(res?.data?.data ?? []);
			return res?.data?.data ?? [];
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchItineraryDetail = useCallback(async (id: string) => {
		setLoading(true);
		try {
			const res = await getItineraryById(id);
			const data = res?.data?.data ?? null;
			setCurrentItinerary(data);
			return data;
		} finally {
			setLoading(false);
		}
	}, []);

	const addItinerary = useCallback(async (data: Partial<DuLich.Itinerary>) => {
		const res = await createItinerary(data);
		return res?.data;
	}, []);

	const editItinerary = useCallback(async (id: string, data: Partial<DuLich.Itinerary>) => {
		const res = await updateItinerary(id, data);
		return res?.data;
	}, []);

	const removeItinerary = useCallback(async (id: string) => {
		const res = await deleteItinerary(id);
		return res?.data;
	}, []);

	// ==================== STATISTICS ====================

	const fetchStatistics = useCallback(async () => {
		setLoading(true);
		try {
			const res = await getStatistics();
			setStatistics(res?.data?.data ?? null);
			return res?.data?.data;
		} finally {
			setLoading(false);
		}
	}, []);

	// ==================== BUDGET HELPERS ====================

	/** Tính tổng ngân sách theo hạng mục cho 1 lịch trình */
	const calculateBudgetBreakdown = useCallback(
		(itinerary: DuLich.Itinerary): DuLich.BudgetBreakdown => {
			let food = 0;
			let accommodation = 0;
			let transport = 0;

			itinerary.days.forEach((day) => {
				day.destinations.forEach((dd) => {
					const dest = destinations.find((d) => d.id === dd.destinationId) ?? dd.destination;
					if (dest) {
						food += dest.foodCost;
						accommodation += dest.accommodationCost;
						transport += dest.transportCost;
					}
				});
			});

			const total = food + accommodation + transport;
			return { food, accommodation, transport, other: 0, total };
		},
		[destinations],
	);

	return {
		// State
		destinations,
		itineraries,
		currentItinerary,
		statistics,
		loading,

		// Setters
		setDestinations,
		setCurrentItinerary,

		// Actions
		fetchDestinations,
		fetchItineraries,
		fetchItineraryDetail,
		addItinerary,
		editItinerary,
		removeItinerary,
		fetchStatistics,

		// Helpers
		calculateBudgetBreakdown,
	};
};
