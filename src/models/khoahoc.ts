/**
 * Business logic layer — UmiJS Model.
 *
 * Architecture decisions:
 * 1. Model owns ALL state mutations. Components only dispatch intents.
 * 2. Filtering/sorting is computed from raw data + criteria,
 *    never stored as separate state (single source of truth).
 * 3. UUID generation uses crypto.randomUUID() with fallback
 *    for older browsers — defensive by default.
 * 4. Every mutation validates before persisting — no optimistic writes.
 */
import { useState, useMemo, useCallback } from 'react';
import { message } from 'antd';
import { CourseStorage } from '@/pages/KhoaHoc/domain/storage';
import { validateCoursePayload, canDeleteCourse } from '@/pages/KhoaHoc/domain/validators';
import { INSTRUCTOR_REGISTRY } from '@/pages/KhoaHoc/domain/constants';

/** Fallback UUID generator cho môi trường không hỗ trợ crypto.randomUUID */
const generateCourseId = (): string => {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID();
	}
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
		const rand = (Math.random() * 16) | 0;
		const val = char === 'x' ? rand : (rand & 0x3) | 0x8;
		return val.toString(16);
	});
};

/** Resolve instructor name từ ID — O(n) nhưng n <= 10, không cần index */
const resolveInstructorName = (instructorId: string): string => {
	const found = INSTRUCTOR_REGISTRY.find((inst) => inst.instructorId === instructorId);
	return found?.fullName ?? 'Không xác định';
};

export default () => {
	// ── Core state ──
	const [courseRegistry, setCourseRegistry] = useState<KhoaHoc.CourseRecord[]>([]);

	// ── UI state ──
	const [filterCriteria, setFilterCriteria] = useState<KhoaHoc.CourseFilterCriteria>({});
	const [sortDirection, setSortDirection] = useState<KhoaHoc.SortDirection>('desc');
	const [modalVisible, setModalVisible] = useState(false);
	const [editingCourse, setEditingCourse] = useState<KhoaHoc.CourseRecord | null>(null);

	// ── Computed: filtered + sorted view ──
	const filteredCourses = useMemo(() => {
		let pipeline = [...courseRegistry];

		const { keyword, instructorId, status } = filterCriteria;

		if (keyword?.trim()) {
			const normalizedKeyword = keyword.trim().toLowerCase();
			pipeline = pipeline.filter((course) =>
				course.courseName.toLowerCase().includes(normalizedKeyword),
			);
		}

		if (instructorId) {
			pipeline = pipeline.filter((course) => course.instructorId === instructorId);
		}

		if (status) {
			pipeline = pipeline.filter((course) => course.status === status);
		}

		pipeline.sort((courseA, courseB) => {
			const delta = courseA.enrollmentCount - courseB.enrollmentCount;
			return sortDirection === 'asc' ? delta : -delta;
		});

		return pipeline;
	}, [courseRegistry, filterCriteria, sortDirection]);

	// ── Data loading ──
	const hydrateCourseRegistry = useCallback(() => {
		const persisted = CourseStorage.readRegistry();
		setCourseRegistry(persisted);
	}, []);

	// ── Create ──
	const createCourse = useCallback(
		(payload: KhoaHoc.CourseFormPayload): boolean => {
			const validation = validateCoursePayload(payload, courseRegistry);
			if (!validation.isValid) {
				validation.violations.forEach((v) => message.error(v.message));
				return false;
			}

			const now = new Date().toISOString();
			const newCourse: KhoaHoc.CourseRecord = {
				...payload,
				courseName: payload.courseName.trim(),
				courseId: generateCourseId(),
				createdAt: now,
				updatedAt: now,
			};

			const updatedRegistry = [newCourse, ...courseRegistry];
			CourseStorage.writeRegistry(updatedRegistry);
			setCourseRegistry(updatedRegistry);
			message.success('Thêm khóa học thành công');
			return true;
		},
		[courseRegistry],
	);

	// ── Update ──
	const updateCourse = useCallback(
		(courseId: string, payload: KhoaHoc.CourseFormPayload): boolean => {
			const targetIndex = courseRegistry.findIndex((c) => c.courseId === courseId);
			if (targetIndex === -1) {
				message.error('Khóa học không tồn tại hoặc đã bị xóa');
				return false;
			}

			const validation = validateCoursePayload(payload, courseRegistry, courseId);
			if (!validation.isValid) {
				validation.violations.forEach((v) => message.error(v.message));
				return false;
			}

			const updatedRegistry = [...courseRegistry];
			updatedRegistry[targetIndex] = {
				...updatedRegistry[targetIndex],
				...payload,
				courseName: payload.courseName.trim(),
				updatedAt: new Date().toISOString(),
			};

			CourseStorage.writeRegistry(updatedRegistry);
			setCourseRegistry(updatedRegistry);
			message.success('Cập nhật khóa học thành công');
			return true;
		},
		[courseRegistry],
	);

	// ── Delete ──
	const removeCourse = useCallback(
		(courseId: string): boolean => {
			const target = courseRegistry.find((c) => c.courseId === courseId);
			if (!target) {
				message.error('Khóa học không tồn tại');
				return false;
			}

			const guard = canDeleteCourse(target);
			if (!guard.deletable) {
				message.error(guard.reason);
				return false;
			}

			const updatedRegistry = courseRegistry.filter((c) => c.courseId !== courseId);
			CourseStorage.writeRegistry(updatedRegistry);
			setCourseRegistry(updatedRegistry);
			message.success('Xóa khóa học thành công');
			return true;
		},
		[courseRegistry],
	);

	// ── Modal orchestration ──
	const openCreateModal = useCallback(() => {
		setEditingCourse(null);
		setModalVisible(true);
	}, []);

	const openEditModal = useCallback((course: KhoaHoc.CourseRecord) => {
		setEditingCourse(course);
		setModalVisible(true);
	}, []);

	const closeModal = useCallback(() => {
		setEditingCourse(null);
		setModalVisible(false);
	}, []);

	return {
		// State
		courseRegistry,
		filteredCourses,
		filterCriteria,
		sortDirection,
		modalVisible,
		editingCourse,

		// Actions
		hydrateCourseRegistry,
		createCourse,
		updateCourse,
		removeCourse,

		// UI controls
		setFilterCriteria,
		setSortDirection,
		openCreateModal,
		openEditModal,
		closeModal,

		// Utilities
		resolveInstructorName,
	};
};
