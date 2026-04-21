import React from 'react';
import { Row, Col, Progress, Typography, Avatar, Badge } from 'antd';
import { GithubOutlined, LinkedinOutlined, TwitterOutlined, MailOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Paragraph } = Typography;

const BlogAbout: React.FC = () => {
    const skills = [
        { name: 'React / UmiJS', percent: 90 },
        { name: 'JavaScript / TypeScript', percent: 85 },
        { name: 'Node.js / Express', percent: 75 },
        { name: 'CSS / LESS / Tailwind', percent: 85 },
    ];

    return (
        <div className={styles.aboutPage}>
            <div className={styles.authorCard}>
                <div className={styles.avatarWrapper}>
                    <Badge dot color="green" offset={[-10, 100]} style={{ width: 14, height: 14 }}>
                        <Avatar 
                            size={120} 
                            src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" 
                            className={styles.avatar}
                        />
                    </Badge>
                </div>
                
                <div className={styles.name}>Tuan Hai (Alex)</div>
                <div className={styles.title}>Senior Fullstack Developer & Technical Blogger</div>
                
                <Paragraph className={styles.bio}>
                    Xin chào! Tham gia vào lĩnh vực phần mềm từ năm 2012, tôi có niềm đam mê mãnh liệt với việc xây dựng các ứng dụng Web chất lượng cao. Thông qua Blog này, tôi muốn chia sẻ những kinh nghiệm thực chiến, các bài học quý giá và kiến thức chuyên sâu về hệ sinh thái React, UmiJS và Web Development nói chung.
                </Paragraph>

                <div className={styles.skills}>
                    <div className={styles.sectionTitle}>Kỹ năng chuyên môn</div>
                    <Row gutter={[24, 0]}>
                        {skills.map(skill => (
                            <Col xs={24} md={12} key={skill.name} className={styles.skillItem}>
                                <span className={styles.skillName}>{skill.name}</span>
                                <Progress percent={skill.percent} strokeColor="#1890ff" strokeWidth={8} trailColor="#f0f0f0" />
                            </Col>
                        ))}
                    </Row>
                </div>

                <div className={styles.socialLinks}>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer"><GithubOutlined /></a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><LinkedinOutlined /></a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><TwitterOutlined /></a>
                    <a href="mailto:contact@example.com"><MailOutlined /></a>
                </div>
            </div>
        </div>
    );
};

export default BlogAbout;
