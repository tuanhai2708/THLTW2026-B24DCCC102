import { Input, Select, Space, Button } from 'antd';
import { SearchOutlined, SortAscendingOutlined, SortDescendingOutlined, PlusOutlined } from '@ant-design/icons';
import { COURSE_STATUS_OPTIONS, INSTRUCTOR_REGISTRY } from '../domain/constants';

interface CourseToolbarProps {
	filterCriteria: KhoaHoc.CourseFilterCriteria;
	sortDirection: KhoaHoc.SortDirection;
	onFilterChange: (criteria: KhoaHoc.CourseFilterCriteria) => void;
	onSortToggle: (dir: KhoaHoc.SortDirection) => void;
	onCreateClick: () => void;
	totalResults: number;
}

const instructorOptions = INSTRUCTOR_REGISTRY.map((inst) => ({
	value: inst.instructorId,
	label: inst.fullName,
}));

const CourseToolbar: React.FC<CourseToolbarProps> = ({
	filterCriteria,
	sortDirection,
	onFilterChange,
	onSortToggle,
	onCreateClick,
	totalResults,
}) => {
	const patchFilter = (patch: Partial<KhoaHoc.CourseFilterCriteria>) => {
		onFilterChange({ ...filterCriteria, ...patch });
	};

	return (
		<div className='course-toolbar'>
			<div className='course-toolbar__left'>
				<Input
					prefix={<SearchOutlined />}
					placeholder='Tìm kiếm theo tên khóa học...'
					allowClear
					value={filterCriteria.keyword}
					onChange={(e) => patchFilter({ keyword: e.target.value })}
					className='course-toolbar__search'
				/>
				<Select
					placeholder='Giảng viên'
					allowClear
					value={filterCriteria.instructorId}
					onChange={(val) => patchFilter({ instructorId: val })}
					options={instructorOptions}
					className='course-toolbar__select'
				/>
				<Select
					placeholder='Trạng thái'
					allowClear
					value={filterCriteria.status}
					onChange={(val) => patchFilter({ status: val })}
					options={COURSE_STATUS_OPTIONS}
					className='course-toolbar__select'
				/>
				<Button
					icon={sortDirection === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
					onClick={() => onSortToggle(sortDirection === 'asc' ? 'desc' : 'asc')}
					className='course-toolbar__sort-btn'
				>
					{sortDirection === 'asc' ? 'Tăng dần' : 'Giảm dần'}
				</Button>
			</div>
			<div className='course-toolbar__right'>
				<span className='course-toolbar__count'>
					{totalResults} khóa học
				</span>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={onCreateClick}
					className='course-toolbar__create-btn'
				>
					Thêm khóa học
				</Button>
			</div>
		</div>
	);
};

export default CourseToolbar;
