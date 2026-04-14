import { useEffect } from 'react';
import { Modal } from 'antd';
import { useModel } from 'umi';
import CourseToolbar from './components/CourseToolbar';
import CourseTable from './components/CourseTable';
import CourseForm from './components/CourseForm';
import './index.less';

const CourseManagement: React.FC = () => {
	const {
		filteredCourses,
		filterCriteria,
		sortDirection,
		modalVisible,
		editingCourse,
		hydrateCourseRegistry,
		createCourse,
		updateCourse,
		removeCourse,
		setFilterCriteria,
		setSortDirection,
		openCreateModal,
		openEditModal,
		closeModal,
		resolveInstructorName,
	} = useModel('khoahoc');

	useEffect(() => {
		hydrateCourseRegistry();
	}, []);

	const handleFormSubmit = (payload: KhoaHoc.CourseFormPayload): boolean => {
		if (editingCourse) {
			const succeeded = updateCourse(editingCourse.courseId, payload);
			if (succeeded) closeModal();
			return succeeded;
		}
		const succeeded = createCourse(payload);
		if (succeeded) closeModal();
		return succeeded;
	};

	return (
		<div className='course-management'>
			<div className='course-management__header'>
				<h1 className='course-management__title'>Quản lý khóa học</h1>
				<p className='course-management__subtitle'>
					Quản lý danh sách khóa học trực tuyến
				</p>
			</div>

			<CourseToolbar
				filterCriteria={filterCriteria}
				sortDirection={sortDirection}
				onFilterChange={setFilterCriteria}
				onSortToggle={setSortDirection}
				onCreateClick={openCreateModal}
				totalResults={filteredCourses.length}
			/>

			<CourseTable
				courses={filteredCourses}
				onEdit={openEditModal}
				onDelete={removeCourse}
				resolveInstructorName={resolveInstructorName}
			/>

			<Modal
				title={editingCourse ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
				visible={modalVisible}
				onCancel={closeModal}
				footer={null}
				destroyOnClose
				width={720}
				className='course-modal'
			>
				<CourseForm
					editingCourse={editingCourse}
					onSubmit={handleFormSubmit}
					onCancel={closeModal}
				/>
			</Modal>
		</div>
	);
};

export default CourseManagement;
