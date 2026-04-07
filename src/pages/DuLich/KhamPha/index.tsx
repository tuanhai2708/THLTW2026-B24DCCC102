import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Card, Spin, Empty } from 'antd';
import { CompassOutlined } from '@ant-design/icons';
import DestinationCard from './components/DestinationCard';
import FilterBar from './components/FilterBar';
import DestinationDetail from './components/DestinationDetail';
import './style.less';

const KhamPha: React.FC = () => {
	const { destinations, loading, fetchDestinations } = useModel('dulich');
	const [selectedDest, setSelectedDest] = useState<DuLich.Destination | null>(null);
	const [detailVisible, setDetailVisible] = useState(false);

	useEffect(() => {
		fetchDestinations();
	}, []);

	const handleFilter = (filters: DuLich.DestinationFilter) => {
		fetchDestinations(filters);
	};

	const handleCardClick = (dest: DuLich.Destination) => {
		setSelectedDest(dest);
		setDetailVisible(true);
	};

	return (
		<div className='kham-pha-page'>
			<div className='page-header'>
				<h1 className='page-title'>
					<CompassOutlined style={{ marginRight: 10, color: '#0ea5e9' }} />
					Khám phá điểm đến
				</h1>
				<p className='page-subtitle'>
					Tìm kiếm và khám phá những điểm đến tuyệt vời trên khắp Việt Nam
				</p>
			</div>

			<FilterBar onFilter={handleFilter} />

			<Spin spinning={loading}>
				{destinations.length > 0 ? (
					<div className='destination-grid'>
						{destinations.map((dest) => (
							<DestinationCard
								key={dest.id}
								destination={dest}
								onClick={handleCardClick}
							/>
						))}
					</div>
				) : (
					<Card>
						<Empty
							description='Không tìm thấy điểm đến phù hợp'
							className='empty-state'
						/>
					</Card>
				)}
			</Spin>

			<DestinationDetail
				visible={detailVisible}
				destination={selectedDest}
				onClose={() => setDetailVisible(false)}
			/>
		</div>
	);
};

export default KhamPha;
