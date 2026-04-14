import { useEffect, useRef } from 'react';
import { Form, Input, Select, InputNumber, Button, Space } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import {
	COURSE_STATUS_OPTIONS,
	INSTRUCTOR_REGISTRY,
	COURSE_NAME_MAX_LENGTH,
	ENROLLMENT_FLOOR,
} from '../domain/constants';

interface CourseFormProps {
	editingCourse: KhoaHoc.CourseRecord | null;
	onSubmit: (payload: KhoaHoc.CourseFormPayload) => boolean;
	onCancel: () => void;
}

const instructorDropdownOptions = INSTRUCTOR_REGISTRY.map((inst) => ({
	value: inst.instructorId,
	label: inst.fullName,
}));

const CourseForm: React.FC<CourseFormProps> = ({ editingCourse, onSubmit, onCancel }) => {
	const [form] = Form.useForm<KhoaHoc.CourseFormPayload>();
	const editorRef = useRef<any>(null);
	const isEditMode = editingCourse !== null;

	useEffect(() => {
		if (editingCourse) {
			form.setFieldsValue({
				courseName: editingCourse.courseName,
				instructorId: editingCourse.instructorId,
				enrollmentCount: editingCourse.enrollmentCount,
				status: editingCourse.status,
				description: editingCourse.description,
			});
		} else {
			form.resetFields();
		}
	}, [editingCourse, form]);

	const handleFinish = (values: KhoaHoc.CourseFormPayload) => {
		/** Merge editor content — TinyMCE manages its own state */
		const descriptionHtml = editorRef.current?.getContent?.() ?? values.description ?? '';
		const payload: KhoaHoc.CourseFormPayload = {
			...values,
			description: descriptionHtml,
		};

		const succeeded = onSubmit(payload);
		if (succeeded) {
			form.resetFields();
		}
	};

	return (
		<Form<KhoaHoc.CourseFormPayload>
			form={form}
			layout='vertical'
			onFinish={handleFinish}
			initialValues={{
				enrollmentCount: 0,
				status: 'DANG_MO' as KhoaHoc.CourseStatus,
			}}
			className='course-form'
		>
			<Form.Item
				label='Tên khóa học'
				name='courseName'
				rules={[
					{ required: true, message: 'Vui lòng nhập tên khóa học' },
					{ max: COURSE_NAME_MAX_LENGTH, message: `Tối đa ${COURSE_NAME_MAX_LENGTH} ký tự` },
					{ whitespace: true, message: 'Tên khóa học không được chỉ chứa khoảng trắng' },
				]}
			>
				<Input
					placeholder='VD: Lập trình Web với React'
					maxLength={COURSE_NAME_MAX_LENGTH}
					showCount
				/>
			</Form.Item>

			<Form.Item
				label='Giảng viên'
				name='instructorId'
				rules={[{ required: true, message: 'Vui lòng chọn giảng viên' }]}
			>
				<Select
					placeholder='Chọn giảng viên phụ trách'
					options={instructorDropdownOptions}
					showSearch
					optionFilterProp='label'
				/>
			</Form.Item>

			<div className='course-form__row'>
				<Form.Item
					label='Số lượng học viên'
					name='enrollmentCount'
					rules={[
						{ required: true, message: 'Vui lòng nhập số lượng học viên' },
						{
							type: 'number',
							min: ENROLLMENT_FLOOR,
							message: `Số lượng phải >= ${ENROLLMENT_FLOOR}`,
						},
					]}
					className='course-form__half'
				>
					<InputNumber
						min={ENROLLMENT_FLOOR}
						precision={0}
						style={{ width: '100%' }}
						placeholder='0'
					/>
				</Form.Item>

				<Form.Item
					label='Trạng thái'
					name='status'
					rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
					className='course-form__half'
				>
					<Select placeholder='Chọn trạng thái' options={COURSE_STATUS_OPTIONS} />
				</Form.Item>
			</div>

			<Form.Item label='Mô tả khóa học (HTML)' name='description'>
				<Editor
					tinymceScriptSrc='/tinymce/tinymce.min.js'
					onInit={(_evt: any, editor: any) => {
						editorRef.current = editor;
					}}
					initialValue={editingCourse?.description ?? ''}
					init={{
						license_key: 'gpl',
						height: 250,
						menubar: false,
						plugins: [
							'advlist autolink lists link image charmap print preview anchor',
							'searchreplace visualblocks code fullscreen',
							'insertdatetime media table paste code help wordcount',
						],
						toolbar:
							'undo redo | formatselect | bold italic underline | \
							alignleft aligncenter alignright alignjustify | \
							bullist numlist outdent indent | removeformat | code | help',
						content_style: 'body { font-family: Inter, sans-serif; font-size: 14px }',
						branding: false,
					}}
				/>
			</Form.Item>

			<div className='course-form__footer'>
				<Space>
					<Button onClick={onCancel}>Hủy</Button>
					<Button type='primary' htmlType='submit'>
						{isEditMode ? 'Cập nhật' : 'Thêm mới'}
					</Button>
				</Space>
			</div>
		</Form>
	);
};

export default CourseForm;
