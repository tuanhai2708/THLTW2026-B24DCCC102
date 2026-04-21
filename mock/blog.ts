import { Request, Response } from 'express';
import moment from 'moment';

const avatars = [
	'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
	'https://gw.alipayobjects.com/zos/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
	'https://gw.alipayobjects.com/zos/rmsportal/ThTvrQvRYyvQOQk.png',
];

const mockTags: any[] = [
	{ id: 't1', name: 'React', count: 0 },
	{ id: 't2', name: 'UmiJS', count: 0 },
	{ id: 't3', name: 'Frontend', count: 0 },
	{ id: 't4', name: 'JavaScript', count: 0 },
	{ id: 't5', name: 'Tutorial', count: 0 },
];

let mockPosts: any[] = [
	{
		id: 'post-1',
		title: 'Hiểu Sâu Về Server Components trong Môi Trường React Mới Nhất',
		slug: 'hieu-sau-ve-server-components-react',
		content: '# Hiểu về Server Components \n\n React Server Components (RSC) mang lại một sự đổi mới lớn lao trong cách chúng ta tư duy về xây dựng UI.\n\n## Ưu điểm khi dùng\n- Giảm Bundle Size.\n- Kết nối Backend trực tiếp nhanh chóng.\n\n```javascript\n// Đây là cách component trông giống như:\nasync function ServerProfile() {\n  const data = await db.query();\n  return <div>{data.name}</div>\n}\n```\n\n> "Giao diện không còn nằm riêng trên trình duyệt, nó nằm tại vị trí xử lý tối ưu nhất"\n',
		thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
		tags: ['t1', 't3'],
		author: { name: 'Tuan Hai (Alex)', avatar: avatars[0] },
		status: 'Published',
		views: 1250,
		createdAt: moment().subtract(1, 'days').toISOString()
	},
	{
		id: 'post-2',
		title: '10 Tips Tối Ưu Hiệu Năng Frontend Mà Mọi Developer Cần Biết',
		slug: 'toi-uu-hieu-nang-frontend',
		content: '# Tối ưu hóa là một chặng đường dài \n\nĐừng tối ưu một cách mù quáng, hãy sử dụng các công cụ đo lường như Lighthouse.\n\n### Những lưu ý quan trọng:\n1. Lazy load hình ảnh và các component không hiển thị ngay.\n2. Tách Code Splitting hợp lý.\n3. Dùng Caching strategy bằng Service Worker hoặc React Query.',
		thumbnail: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80',
		tags: ['t3', 't4'],
		author: { name: 'Nguyễn Văn A', avatar: avatars[1] },
		status: 'Published',
		views: 940,
		createdAt: moment().subtract(2, 'days').toISOString()
	},
	{
		id: 'post-3',
		title: 'Xây Dựng Hệ Thống Design System Hoàn Chỉnh Với LESS',
		slug: 'design-system-voi-less',
		content: '# Xây dựng Design System Không Thể Thiếu CSS \n\nSử dụng LESS để khai báo biến một cách bài bản nhất.\n\n```less\n@primary-color: #1890ff;\n@text-color: rgba(0, 0, 0, 0.85);\n@border-radius-base: 8px;\n\n.btn-primary {\n  background: @primary-color;\n  border-radius: @border-radius-base;\n}\n```',
		thumbnail: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800&q=80',
		tags: ['t3'],
		author: { name: 'Steve Jobs', avatar: avatars[2] },
		status: 'Published',
		views: 121,
		createdAt: moment().subtract(3, 'days').toISOString()
	},
	{
		id: 'post-4',
		title: 'Giới Thiệu UmiJS: Framework Xịn Nhất Trong Thế Giới Ant Design',
		slug: 'gioi-thieu-umijs',
		content: '# UmiJS thực sự là gì?\n\nLà một Enterprise React Framework, nó giúp bạn không cần setup webpack dài ngoằng.',
		thumbnail: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=800&q=80',
		tags: ['t2', 't5'],
		author: { name: 'Tuan Hai (Alex)', avatar: avatars[0] },
		status: 'Published',
		views: 2894,
		createdAt: moment().subtract(5, 'days').toISOString()
	},
	{
		id: 'post-5',
		title: 'Tại Sao TypeScript Lại Cứu Sự Nghiệp Của Rất Nhiều JavaScript Developer?',
		slug: 'tai-sao-chon-typescript',
		content: '# Giảm Lỗi Tối Đa Khi Coding \n\nTS sẽ bắt lỗi bạn ngay trong lúc Edit code chứ không phải tới lúc User gặp màn hình trắng xoá.\n\n```typescript\ninterface User {\n  name: string;\n  age: number;\n}\n\nfunction printAge(u: User) {\n  console.log(u.age.toString());\n}\n```',
		thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80',
		tags: ['t4'],
		author: { name: 'Nguyễn Văn A', avatar: avatars[1] },
		status: 'Published',
		views: 1024,
		createdAt: moment().subtract(10, 'days').toISOString()
	},
	{
		id: 'post-6',
		title: 'Cơ Bản Về Hook useEffect Mà Mọi React Dev Nên Ghi Nhớ',
		slug: 'co-ban-use-effect',
		content: '# Hiểu về Chu Kỳ Sống Của React (Lifecycles)\n\nThay thế ComponentDidMount bằng Dependency Array rỗng `[]`.',
		thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
		tags: ['t1', 't5'],
		author: { name: 'Steve Jobs', avatar: avatars[2] },
		status: 'Draft',
		views: 12,
		createdAt: moment().subtract(12, 'days').toISOString()
	},
	{
		id: 'post-7',
		title: 'Thiết Lập Môi Trường Viết Chặn Render Markdown Ở Client Side',
		slug: 'render-markdown-client',
		content: '# Cấu Hình Đẹp Hơn Với `marked`\n\n```javascript\nimport { marked } from "marked";\nconst html = marked.parse("# Hello World");\n```\nSử dụng thêm HighlightJS nếu muốn sáng cú pháp hơn.',
		thumbnail: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad8?w=800&q=80',
		tags: ['t4'],
		author: { name: 'Tuan Hai (Alex)', avatar: avatars[0] },
		status: 'Published',
		views: 890,
		createdAt: moment().subtract(15, 'days').toISOString()
	},
	{
		id: 'post-8',
		title: 'Kinh Nghiệm Phỏng Vấn Frontend Ở Các Công Ty Startup',
		slug: 'kinh-nghiem-phong-van-frontend',
		content: '# Bí Mật Vượt Qua Các Vòng Code Interview\n\nCác công ty rất hay kiểm tra kĩ năng Javascript căn bản (Closure, Prototype) hơn là React.',
		thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
		tags: ['t3'],
		author: { name: 'Nguyễn Văn A', avatar: avatars[1] },
		status: 'Published',
		views: 105,
		createdAt: moment().subtract(16, 'days').toISOString()
	},
	{
		id: 'post-9',
		title: 'Bí Kíp Triển Khai Ant Design Ở Mức Độ Nâng Cao',
		slug: 'trien-khai-ant-design-nang-cao',
		content: '# Vượt Qua Mặc Định\n\nTuỳ chỉnh Theme Global là điều tối quan trọng để có giao diện xịn xò. Đừng chỉ xài màu Blue mặc định.',
		thumbnail: 'https://images.unsplash.com/photo-1507238692062-7101eedb2be0?w=800&q=80',
		tags: ['t3', 't1'],
		author: { name: 'Steve Jobs', avatar: avatars[2] },
		status: 'Published',
		views: 2901,
		createdAt: moment().subtract(18, 'days').toISOString()
	},
	{
		id: 'post-10',
		title: 'Tổng Hợp Các Thư Viện Không Thể Thiếu Kèm Theo React',
		slug: 'thu-vien-kem-react',
		content: '# Đồ Chơi Cho Dân React\n\n1. React Router DOM\n2. Zustand / Redux\n3. React Hook Form & Zod \n4. Lodash',
		thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
		tags: ['t1'],
		author: { name: 'Tuan Hai (Alex)', avatar: avatars[0] },
		status: 'Published',
		views: 554,
		createdAt: moment().subtract(20, 'days').toISOString()
	}
];

// Hàm helper để tính lại count của tags
const recalculateTagsCount = () => {
	mockTags.forEach((t) => (t.count = 0));
	mockPosts.forEach((post) => {
		post.tags.forEach((tagId: string) => {
			const tag = mockTags.find((t) => t.id === tagId);
			if (tag) {
				tag.count += 1;
			}
		});
	});
};
recalculateTagsCount();

export default {
	'GET /api/blog/posts': (req: Request, res: Response) => {
		const { current = 1, pageSize = 9, keyword = '', tag = '', status = '' } = req.query as any;

		let dataSource = [...mockPosts];

		// Filter
		if (keyword) {
			dataSource = dataSource.filter((item) =>
				item.title.toLowerCase().includes(keyword.toLowerCase()),
			);
		}
		if (tag) {
			dataSource = dataSource.filter((item) => item.tags.includes(tag));
		}
		if (status) {
			dataSource = dataSource.filter((item) => item.status === status);
		}

		// Sort by newest
		dataSource = dataSource.sort(
			(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		);

		const total = dataSource.length;
		const finalPageSize = parseInt(pageSize, 10) || 9;
		const finalCurrent = parseInt(current, 10) || 1;

		const start = (finalCurrent - 1) * finalPageSize;
		const end = start + finalPageSize;
		const pagedData = dataSource.slice(start, end);

		res.json({
			data: pagedData,
			total,
			success: true,
			pageSize: finalPageSize,
			current: finalCurrent,
		});
	},

	'GET /api/blog/posts/:id': (req: Request, res: Response) => {
		const { id } = req.params;
		const post = mockPosts.find((p) => p.id === id);
		if (post) {
			res.json(post);
		} else {
			res.status(404).json({ message: 'Không tìm thấy bài viết' });
		}
	},

	'POST /api/blog/posts/:id/view': (req: Request, res: Response) => {
		const { id } = req.params;
		const postIndex = mockPosts.findIndex((p) => p.id === id);
		if (postIndex > -1) {
			mockPosts[postIndex].views += 1;
			res.json({ success: true, views: mockPosts[postIndex].views });
		} else {
			res.status(404).json({ success: false });
		}
	},

	'POST /api/blog/posts': (req: Request, res: Response) => {
		const newPost = {
			...req.body,
			id: `post-${Date.now()}`,
			views: 0,
			author: {
				name: 'Admin',
				avatar: avatars[0],
			},
			createdAt: moment().toISOString(),
		};
		mockPosts.unshift(newPost);
		recalculateTagsCount();
		res.json(newPost);
	},

	'PUT /api/blog/posts/:id': (req: Request, res: Response) => {
		const { id } = req.params;
		const postIndex = mockPosts.findIndex((p) => p.id === id);
		if (postIndex > -1) {
			mockPosts[postIndex] = {
				...mockPosts[postIndex],
				...req.body,
			};
			recalculateTagsCount();
			res.json(mockPosts[postIndex]);
		} else {
			res.status(404).json({ message: 'Không tìm thấy bài viết' });
		}
	},

	'DELETE /api/blog/posts/:id': (req: Request, res: Response) => {
		const { id } = req.params;
		mockPosts = mockPosts.filter((p) => p.id !== id);
		recalculateTagsCount();
		res.json({ success: true });
	},

	// TAGS API
	'GET /api/blog/tags': (req: Request, res: Response) => {
		res.json({ data: mockTags, success: true });
	},

	'POST /api/blog/tags': (req: Request, res: Response) => {
		const newTag = {
			...req.body,
			id: `tag-${Date.now()}`,
			count: 0,
		};
		mockTags.push(newTag);
		res.json(newTag);
	},

	'PUT /api/blog/tags/:id': (req: Request, res: Response) => {
		const { id } = req.params;
		const tagIndex = mockTags.findIndex((t) => t.id === id);
		if (tagIndex > -1) {
			mockTags[tagIndex] = {
				...mockTags[tagIndex],
				...req.body,
			};
			res.json(mockTags[tagIndex]);
		} else {
			res.status(404).json({ message: 'Không tìm thấy thẻ' });
		}
	},

	'DELETE /api/blog/tags/:id': (req: Request, res: Response) => {
		const { id } = req.params;
		const tagIndex = mockTags.findIndex((t) => t.id === id);
		if (tagIndex > -1) {
			mockTags.splice(tagIndex, 1);
			res.json({ success: true });
		} else {
			res.status(404).json({ message: 'Không tìm thấy thẻ' });
		}
	},
};
