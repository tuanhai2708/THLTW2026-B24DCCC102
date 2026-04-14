/**
 * Domain constants — Centralized registry of all static domain data.
 *
 * Why here instead of inline:
 * 1. Instructors will eventually come from an API; this isolates the swap point
 * 2. Status labels are locale-sensitive; centralizing enables future i18n
 * 3. Validation thresholds live with the domain, not in UI components
 */

/** Status → Vietnamese label mapping */
export const COURSE_STATUS_LABEL: KhoaHoc.CourseStatusLabelMap = {
	DANG_MO: 'Đang mở',
	DA_KET_THUC: 'Đã kết thúc',
	TAM_DUNG: 'Tạm dừng',
} as const;

/** Status tag color mapping cho Ant Design Tag */
export const COURSE_STATUS_COLOR: Record<KhoaHoc.CourseStatus, string> = {
	DANG_MO: 'green',
	DA_KET_THUC: 'red',
	TAM_DUNG: 'orange',
} as const;

/** Dropdown options derived from enum — computed once, not on every render */
export const COURSE_STATUS_OPTIONS = Object.entries(COURSE_STATUS_LABEL).map(
	([value, label]) => ({ value, label }),
);

/** Seed instructors — swap with API call later without touching consumers */
export const INSTRUCTOR_REGISTRY: readonly KhoaHoc.Instructor[] = [
	{ instructorId: 'GV001', fullName: 'PGS.TS Nguyễn Văn An' },
	{ instructorId: 'GV002', fullName: 'TS. Trần Thị Bình' },
	{ instructorId: 'GV003', fullName: 'ThS. Lê Hoàng Cường' },
	{ instructorId: 'GV004', fullName: 'PGS.TS Phạm Minh Đức' },
	{ instructorId: 'GV005', fullName: 'TS. Vũ Thị Hương' },
] as const;

/** Validation ceilings — domain rules, not UI rules */
export const COURSE_NAME_MAX_LENGTH = 100;
export const ENROLLMENT_FLOOR = 0;

/** localStorage key — namespaced to avoid collision */
export const STORAGE_NAMESPACE = 'khoahoc_registry';
