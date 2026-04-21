import { request } from 'umi';

export async function fetchTags(): Promise<{ data: API.BlogTag[]; success: boolean }> {
	return request<{ data: API.BlogTag[]; success: boolean }>('/api/blog/tags', {
		method: 'GET',
	});
}

export async function createTag(data: Partial<API.BlogTag>): Promise<API.BlogTag> {
	return request<API.BlogTag>('/api/blog/tags', {
		method: 'POST',
		data,
	});
}

export async function updateTag(id: string, data: Partial<API.BlogTag>): Promise<API.BlogTag> {
	return request<API.BlogTag>(`/api/blog/tags/${id}`, {
		method: 'PUT',
		data,
	});
}

export async function deleteTag(id: string): Promise<any> {
	return request<any>(`/api/blog/tags/${id}`, {
		method: 'DELETE',
	});
}
