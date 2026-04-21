import React, { useState, useEffect } from 'react';
import { useParams, history } from 'umi';
import { Spin, Typography, Avatar, Tag, Button, Row, Col, Card } from 'antd';
import { ArrowLeftOutlined, EyeOutlined, CalendarOutlined, TagsOutlined } from '@ant-design/icons';
import { getPost, increaseView, fetchPosts } from '@/services/Blog/post';
import { fetchTags } from '@/services/Blog/tag';
// @ts-ignore
import { marked } from 'marked';
import moment from 'moment';
import styles from './index.less';

const { Title } = Typography;

const BlogDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState<API.BlogPost | null>(null);
    const [tags, setTags] = useState<API.BlogTag[]>([]);
    const [relatedPosts, setRelatedPosts] = useState<API.BlogPost[]>([]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Fetch tags map first
                const tagRes = await fetchTags();
                if (tagRes.success) setTags(tagRes.data);

                if (id) {
                    const postRes = await getPost(id);
                    setPost(postRes);

                    // Increase view in background
                    increaseView(id);

                    // Fetch related posts (by first tag)
                    if (postRes.tags && postRes.tags.length > 0) {
                        const relatedRes = await fetchPosts({ tag: postRes.tags[0], current: 1, pageSize: 4 });
                        if (relatedRes.success) {
                            // exclude current post and limit to 3
                            setRelatedPosts(relatedRes.data.filter(p => p.id !== id).slice(0, 3));
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to load post detail", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            setLoading(true);
            loadInitialData();
            // Scroll to top on id change
            window.scrollTo(0,0);
        }
    }, [id]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!post) {
        return (
            <div style={{ textAlign: 'center', padding: '100px' }}>
                <Title level={3}>Bài viết không tồn tại hoặc đã bị xóa.</Title>
                <Button type="primary" onClick={() => history.push('/blog')} icon={<ArrowLeftOutlined />}>
                    Quay lại danh sách
                </Button>
            </div>
        );
    }

    const htmlContent = marked.parse(post.content || '');
    const postTags = tags.filter(t => post.tags.includes(t.id));

    return (
        <div className={styles.blogDetail}>
            <div className={styles.header}>
                <Title className={styles.title}>{post.title}</Title>
                <div className={styles.meta}>
                    <div className={styles.author}>
                        <Avatar src={post.author.avatar} />
                        <span>{post.author.name}</span>
                    </div>
                    <div className={styles.info}>
                        <CalendarOutlined />
                        <span>{moment(post.createdAt).format('DD MMM, YYYY')}</span>
                    </div>
                    <div className={styles.info}>
                        <EyeOutlined />
                        <span>{post.views + 1} lượt xem</span>
                    </div>
                </div>
            </div>

            {post.thumbnail && (
                <div className={styles.thumbnailWrapper}>
                    <img src={post.thumbnail} alt={post.title} />
                </div>
            )}

            <div className={styles.contentWrapper}>
                <div 
                    className={styles.markdownBody}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            </div>

            <div className={styles.tagList}>
                <TagsOutlined style={{ marginRight: 8, color: '#8c8c8c' }} />
                {postTags.map(tag => (
                    <Tag key={tag.id} color="blue" style={{ fontSize: 13, padding: '4px 12px', borderRadius: 16 }}>
                        {tag.name}
                    </Tag>
                ))}
            </div>

            <div className={styles.actions}>
                <Button size="large" onClick={() => history.push('/blog')} icon={<ArrowLeftOutlined />}>
                    Quay lại danh sách
                </Button>
            </div>

            {/* Bài viết liên quan */}
            {relatedPosts.length > 0 && (
                <div className={styles.relatedSection}>
                    <Title level={3} className={styles.relatedTitle}>Bài viết liên quan</Title>
                    <Row gutter={[24, 24]}>
                        {relatedPosts.map(rp => (
                            <Col xs={24} sm={8} key={rp.id}>
                                <Card
                                    hoverable
                                    className={styles.relatedCard}
                                    cover={<img alt={rp.title} src={rp.thumbnail} style={{ height: 160, objectFit: 'cover' }}/>}
                                    onClick={() => history.push(`/blog/${rp.id}`)}
                                >
                                    <Card.Meta 
                                        title={rp.title}
                                        description={rp.content.replace(/[#*>_`]/g, '').slice(0, 80) + '...'}
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}
        </div>
    );
};

export default BlogDetail;
