import { request } from 'umi';

export async function fetchPosts(
	params: API.PostSearchParams,
): Promise<API.PaginatedResult<API.BlogPost>> {
	return request<API.PaginatedResult<API.BlogPost>>('/api/blog/posts', {
		method: 'GET',
		params,
	});
}

export async function getPost(id: string): Promise<API.BlogPost> {
	return request<API.BlogPost>(`/api/blog/posts/${id}`, {
		method: 'GET',
	});
}

export async function createPost(data: Partial<API.BlogPost>): Promise<API.BlogPost> {
	return request<API.BlogPost>('/api/blog/posts', {
		method: 'POST',
		data,
	});
}

export async function updatePost(id: string, data: Partial<API.BlogPost>): Promise<API.BlogPost> {
	return request<API.BlogPost>(`/api/blog/posts/${id}`, {
		method: 'PUT',
		data,
	});
}

export async function deletePost(id: string): Promise<any> {
	return request<any>(`/api/blog/posts/${id}`, {
		method: 'DELETE',
	});
}

export async function increaseView(id: string): Promise<any> {
	return request<any>(`/api/blog/posts/${id}/view`, {
		method: 'POST',
	});
}
