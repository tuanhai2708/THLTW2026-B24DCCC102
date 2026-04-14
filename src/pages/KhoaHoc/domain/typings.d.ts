declare namespace KhoaHoc {

	const enum CourseStatus {
		DANG_MO = 'DANG_MO',
		DA_KET_THUC = 'DA_KET_THUC',
		TAM_DUNG = 'TAM_DUNG',
	}

	type CourseStatusLabelMap = Record<CourseStatus, string>;

	interface Instructor {
		readonly instructorId: string;
		readonly fullName: string;
	}

	interface CourseFormPayload {
		courseName: string;
		instructorId: string;
		enrollmentCount: number;
		description: string;
		status: CourseStatus;
	}

	interface CourseRecord extends CourseFormPayload {
		readonly courseId: string;
		readonly createdAt: string;
		updatedAt: string;
	}

	interface CourseFilterCriteria {
		keyword?: string;
		instructorId?: string;
		status?: CourseStatus;
	}

	type SortDirection = 'asc' | 'desc';
}
