/**
 * Validation layer — Pure functions, no side effects, fully testable.
 *
 * Architecture decision: Validators return structured error objects
 * instead of throwing. This lets the caller decide how to surface
 * errors (toast, inline, modal) without coupling to presentation.
 *
 * Guard clauses at the top of each function — fail fast pattern.
 */
import { COURSE_NAME_MAX_LENGTH, ENROLLMENT_FLOOR, INSTRUCTOR_REGISTRY } from './constants';

export interface ValidationViolation {
	readonly field: string;
	readonly message: string;
}

type ValidationResult =
	| { readonly isValid: true }
	| { readonly isValid: false; readonly violations: ValidationViolation[] };

/** Kiểm tra tên khóa học trùng trong tập dữ liệu hiện tại */
const isNameCollision = (
	candidateName: string,
	existingCourses: KhoaHoc.CourseRecord[],
	excludeCourseId?: string,
): boolean => {
	const normalizedCandidate = candidateName.trim().toLowerCase();
	return existingCourses.some(
		(course) =>
			course.courseName.trim().toLowerCase() === normalizedCandidate &&
			course.courseId !== excludeCourseId,
	);
};

/** Kiểm tra instructor tồn tại trong registry */
const isKnownInstructor = (instructorId: string): boolean =>
	INSTRUCTOR_REGISTRY.some((inst) => inst.instructorId === instructorId);

/**
 * Validate toàn bộ payload trước khi persist.
 * @param payload Dữ liệu từ form
 * @param existingCourses Danh sách khóa học hiện có (để check trùng tên)
 * @param excludeCourseId Bỏ qua chính nó khi edit
 */
export const validateCoursePayload = (
	payload: KhoaHoc.CourseFormPayload,
	existingCourses: KhoaHoc.CourseRecord[],
	excludeCourseId?: string,
): ValidationResult => {
	const violations: ValidationViolation[] = [];

	// --- Tên khóa học ---
	const trimmedName = payload.courseName?.trim();
	if (!trimmedName) {
		violations.push({ field: 'courseName', message: 'Tên khóa học không được để trống' });
	} else if (trimmedName.length > COURSE_NAME_MAX_LENGTH) {
		violations.push({
			field: 'courseName',
			message: `Tên khóa học tối đa ${COURSE_NAME_MAX_LENGTH} ký tự`,
		});
	} else if (isNameCollision(trimmedName, existingCourses, excludeCourseId)) {
		violations.push({ field: 'courseName', message: 'Tên khóa học đã tồn tại trong hệ thống' });
	}

	// --- Giảng viên ---
	if (!payload.instructorId) {
		violations.push({ field: 'instructorId', message: 'Vui lòng chọn giảng viên' });
	} else if (!isKnownInstructor(payload.instructorId)) {
		violations.push({ field: 'instructorId', message: 'Giảng viên không hợp lệ' });
	}

	// --- Số lượng học viên ---
	if (payload.enrollmentCount == null || payload.enrollmentCount < ENROLLMENT_FLOOR) {
		violations.push({
			field: 'enrollmentCount',
			message: `Số lượng học viên phải >= ${ENROLLMENT_FLOOR}`,
		});
	}
	if (!Number.isInteger(payload.enrollmentCount)) {
		violations.push({ field: 'enrollmentCount', message: 'Số lượng học viên phải là số nguyên' });
	}

	// --- Trạng thái ---
	const validStatuses: string[] = ['DANG_MO', 'DA_KET_THUC', 'TAM_DUNG'];
	if (!validStatuses.includes(payload.status)) {
		violations.push({ field: 'status', message: 'Trạng thái không hợp lệ' });
	}

	return violations.length === 0
		? { isValid: true }
		: { isValid: false, violations };
};

/**
 * Guard: Kiểm tra khóa học có thể xóa không.
 * Business rule: Chỉ xóa được khi enrollmentCount === 0
 */
export const canDeleteCourse = (
	course: KhoaHoc.CourseRecord,
): { deletable: true } | { deletable: false; reason: string } => {
	if (course.enrollmentCount > 0) {
		return {
			deletable: false,
			reason: `Không thể xóa khóa học đang có ${course.enrollmentCount} học viên. Chỉ được xóa khi chưa có học viên đăng ký.`,
		};
	}
	return { deletable: true };
};
