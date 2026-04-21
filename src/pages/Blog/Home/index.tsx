import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Card, Typography, Input, Tag, Pagination, Spin, Empty, Avatar, Space } from 'antd';
import { SearchOutlined, EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import { fetchPosts } from '@/services/Blog/post';
import { fetchTags } from '@/services/Blog/tag';
import { debounce } from 'lodash';
import moment from 'moment';
import 'moment/locale/vi';
import styles from './index.less';

const { Title, Text } = Typography;

const BlogHome: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [posts, setPosts] = useState<API.BlogPost[]>([]);
	const [total, setTotal] = useState(0);
	const [tags, setTags] = useState<API.BlogTag[]>([]);
	const [params, setParams] = useState<API.PostSearchParams>({
		current: 1,
		pageSize: 9,
		status: 'Published',
		keyword: '',
		tag: '',
	});

	// Handle standard state
	const getPosts = async (currentParams: API.PostSearchParams) => {
		setLoading(true);
		try {
			const res = await fetchPosts(currentParams);
			if (res && res.success) {
				setPosts(res.data || []);
				setTotal(res.total || 0);
			}
		} catch (error) {
			console.error('Failed to fetch posts:', error);
		} finally {
			setLoading(false);
		}
	};

	const getTags = async () => {
		try {
			const res = await fetchTags();
			if (res && res.success) {
				setTags(res.data || []);
			}
		} catch (error) {
			console.error('Failed to fetch tags:', error);
		}
	};

	useEffect(() => {
		getTags();
	}, []);

	useEffect(() => {
		getPosts(params);
	}, [params.current, params.pageSize, params.tag, params.keyword]);

	// Debounce search
	const debouncedSearch = useMemo(
		() =>
			debounce((value: string) => {
				setParams((prev) => ({ ...prev, current: 1, keyword: value }));
			}, 300),
		[],
	);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		debouncedSearch(e.target.value);
	};

	const handleTagChange = (tagId: string) => {
		setParams((prev) => ({
			...prev,
			current: 1,
			tag: prev.tag === tagId ? '' : tagId, // Toggle tag
		}));
	};

	const handlePageChange = (page: number, pageSize?: number) => {
		setParams((prev) => ({ ...prev, current: page, pageSize: pageSize || 9 }));
	};

	return (
		<div className={styles.blogHome}>
			<div className={styles.searchBar}>
				<Row justify="space-between" align="middle">
					<Col xs={24} md={12}>
						<Title level={2} style={{ margin: 0 }}>DIỄN ĐÀN</Title>
						<Text type="secondary">Khám phá các bài viết hữu ích về công nghệ và lập trình</Text>
					</Col>
					<Col xs={24} md={8} style={{ textAlign: 'right' }}>
						<Input
							placeholder="Tìm kiếm bài viết..."
							prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
							size="large"
							className={styles.searchInput}
							onChange={handleSearch}
							allowClear
						/>
					</Col>
				</Row>
			</div>

			<div className={styles.tagContainer}>
				<Space wrap>
					<span className={styles.tagLabel}>Chủ đề:</span>
					<Tag.CheckableTag
						checked={!params.tag}
						onChange={() => handleTagChange('')}
						className={styles.tagItem}
					>
						Tất cả
					</Tag.CheckableTag>
					{tags.map((tag) => (
						<Tag.CheckableTag
							key={tag.id}
							checked={params.tag === tag.id}
							onChange={() => handleTagChange(tag.id)}
							className={styles.tagItem}
						>
							{tag.name} ({tag.count || 0})
						</Tag.CheckableTag>
					))}
				</Space>
			</div>

			<Spin spinning={loading}>
				{posts.length === 0 ? (
					<div style={{ background: '#fff', padding: '60px 0', borderRadius: '8px' }}>
						<Empty description="Không tìm thấy bài viết nào phù hợp." />
					</div>
				) : (
					<Row gutter={[24, 24]}>
						{posts.map((post) => {
							const postTags = tags.filter((t) => post.tags?.includes(t.id));
							return (
								<Col xs={24} sm={12} lg={8} key={post.id}>
									<Link to={`/blog/${post.id}`}>
										<Card
											hoverable
											className={styles.postCard}
											cover={<img alt={post.title} src={post.thumbnail} />}
										>
											<Card.Meta //
												title={post.title}
												description={
													// Extract summary from pure text
													post.content.replace(/[#*>_`]/g, '').slice(0, 150) + '...'
												}
											/>

											<div className={styles.tags}>
												{postTags.map(t => (
													<Tag color="cyan" key={t.id}>{t.name}</Tag>
												))}
											</div>

											<div className={styles.cardFooter}>
												<div className={styles.authorInfo}>
													<Avatar src={post.author?.avatar} size="small" />
													<span>{post.author?.name}</span>
												</div>
												<div className={styles.views}>
													<Space size="middle">
														<span>
															<ClockCircleOutlined /> {moment(post.createdAt).fromNow()}
														</span>
														<span>
															<EyeOutlined /> {post.views}
														</span>
													</Space>
												</div>
											</div>
										</Card>
									</Link>
								</Col>
							);
						})}
					</Row>
				)}

				{total > 0 && (
					<div className={styles.pagination}>
						<Pagination
							current={params.current}
							pageSize={params.pageSize}
							total={total}
							onChange={handlePageChange}
							showTotal={(total) => `Tổng số ${total} bài viết`}
						/>
					</div>
				)}
			</Spin>
		</div>
	);
};

export default BlogHome;
