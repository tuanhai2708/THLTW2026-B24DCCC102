declare namespace API {
	type BlogPostStatus = 'Draft' | 'Published';

	export interface BlogTag {
		id: string; // Có thể dùng uuid hoặc chuỗi bất kỳ
		name: string;
		count?: number; // Số lượng bài viết đang dùng tag này
	}

	export interface BlogPost {
		id: string;
		title: string;
		slug: string;
		content: string; // Nội dung dạng Markdown
		thumbnail: string; // URL ảnh đại diện
		tags: string[]; // Danh sách các ID của Tag
		author: {
			name: string;
			avatar: string;
		};
		status: BlogPostStatus;
		views: number;
		createdAt: string; // ISO String
	}

	export interface PageParams {
		current?: number;
		pageSize?: number;
	}

	export interface PostSearchParams extends PageParams {
		keyword?: string;
		tag?: string;
		status?: BlogPostStatus;
	}

	export interface PaginatedResult<T> {
		data: T[];
		total: number;
		success: boolean;
		pageSize: number;
		current: number;
	}
}
