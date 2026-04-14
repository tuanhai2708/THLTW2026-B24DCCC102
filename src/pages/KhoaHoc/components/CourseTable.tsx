import { Table, Tag, Space, Button, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { COURSE_STATUS_LABEL, COURSE_STATUS_COLOR, INSTRUCTOR_REGISTRY } from '../domain/constants';
import { canDeleteCourse } from '../domain/validators';

interface CourseTableProps {
	courses: KhoaHoc.CourseRecord[];
	onEdit: (course: KhoaHoc.CourseRecord) => void;
	onDelete: (courseId: string) => void;
	resolveInstructorName: (id: string) => string;
}

const buildColumns = (
	onEdit: CourseTableProps['onEdit'],
	onDelete: CourseTableProps['onDelete'],
	resolveInstructorName: CourseTableProps['resolveInstructorName'],
): ColumnsType<KhoaHoc.CourseRecord> => [
		{
			title: 'ID',
			dataIndex: 'courseId',
			key: 'courseId',
			width: 100,
			ellipsis: true,
			render: (courseId: string) => (
				<Tooltip title={courseId}>
					<span className='course-table__id'>{courseId.slice(0, 8)}...</span>
				</Tooltip>
			),
		},
		{
			title: 'Tên khóa học',
			dataIndex: 'courseName',
			key: 'courseName',
			width: 250,
			ellipsis: true,
			render: (name: string) => <strong className='course-table__name'>{name}</strong>,
		},
		{
			title: 'Giảng viên',
			dataIndex: 'instructorId',
			key: 'instructorId',
			width: 200,
			render: (instructorId: string) => resolveInstructorName(instructorId),
		},
		{
			title: 'Số học viên',
			dataIndex: 'enrollmentCount',
			key: 'enrollmentCount',
			width: 130,
			align: 'center',
			render: (count: number) => (
				<span className={`course-table__enrollment ${count === 0 ? 'course-table__enrollment--empty' : ''}`}>
					{count.toLocaleString('vi-VN')}
				</span>
			),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			width: 140,
			align: 'center',
			render: (status: KhoaHoc.CourseStatus) => (
				<Tag color={COURSE_STATUS_COLOR[status]} className='course-table__status-tag'>
					{COURSE_STATUS_LABEL[status]}
				</Tag>
			),
		},
		{
			title: 'Thao tác',
			key: 'operations',
			width: 140,
			align: 'center',
			render: (_: unknown, record: KhoaHoc.CourseRecord) => {
				const deleteGuard = canDeleteCourse(record);

				return (
					<Space size='middle'>
						<Tooltip title='Chỉnh sửa'>
							<Button
								type='text'
								icon={<EditOutlined />}
								onClick={() => onEdit(record)}
								className='course-table__action-btn course-table__action-btn--edit'
							/>
						</Tooltip>

						{deleteGuard.deletable ? (
							<Popconfirm
								title={<>Xác nhận xóa khóa học?<br /><span style={{ fontWeight: 'normal', fontSize: 13 }}>Hành động không thể hoàn tác.</span></>}
								onConfirm={() => onDelete(record.courseId)}
								okText='Xóa'
								cancelText='Hủy'
								okButtonProps={{ danger: true }}
								icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
							>
								<Tooltip title='Xóa'>
									<Button
										type='text'
										danger
										icon={<DeleteOutlined />}
										className='course-table__action-btn course-table__action-btn--delete'
									/>
								</Tooltip>
							</Popconfirm>
						) : (
							<Tooltip title={deleteGuard.reason}>
								<Button
									type='text'
									icon={<DeleteOutlined />}
									disabled
									className='course-table__action-btn course-table__action-btn--disabled'
								/>
							</Tooltip>
						)}
					</Space>
				);
			},
		},
	];

const CourseTable: React.FC<CourseTableProps> = ({
	courses,
	onEdit,
	onDelete,
	resolveInstructorName,
}) => {
	const columns = buildColumns(onEdit, onDelete, resolveInstructorName);

	return (
		<Table<KhoaHoc.CourseRecord>
			columns={columns}
			dataSource={courses}
			rowKey='courseId'
			pagination={{
				pageSize: 10,
				showSizeChanger: true,
				pageSizeOptions: ['5', '10', '20', '50'],
				showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} khóa học`,
			}}
			scroll={{ x: 960 }}
			locale={{ emptyText: 'Chưa có khóa học nào' }}
			className='course-table'
		/>
	);
};

export default CourseTable;
