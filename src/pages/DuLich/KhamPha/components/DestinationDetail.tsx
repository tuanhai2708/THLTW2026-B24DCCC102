import { Modal, Tag, Rate } from 'antd';
import {
	EnvironmentOutlined,
	ClockCircleOutlined,
	StarFilled,
	CoffeeOutlined,
	HomeOutlined,
	CarOutlined,
	DollarOutlined,
} from '@ant-design/icons';
import './DestinationDetail.less';

const TYPE_MAP: Record<DuLich.DestinationType, string> = {
	bien: '🏖️ Biển',
	nui: '⛰️ Núi',
	thanh_pho: '🏙️ Thành phố',
};

const TYPE_COLOR: Record<DuLich.DestinationType, string> = {
	bien: '#0ea5e9',
	nui: '#22c55e',
	thanh_pho: '#f59e0b',
};

const formatPrice = (price: number) =>
	new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

interface DestinationDetailProps {
	visible: boolean;
	destination: DuLich.Destination | null;
	onClose: () => void;
}

const DestinationDetail: React.FC<DestinationDetailProps> = ({ visible, destination, onClose }) => {
	if (!destination) return null;

	const totalCost = destination.foodCost + destination.accommodationCost + destination.transportCost;

	return (
		<Modal
			visible={visible}
			onCancel={onClose}
			footer={null}
			width={720}
			bodyStyle={{ padding: 0 }}
			className='destination-detail-modal'
			centered
			destroyOnClose
		>
			{/* Hero Image */}
			<div className='detail-hero'>
				<img
					className='detail-hero-img'
					src={destination.image}
					alt={destination.name}
					onError={(e) => {
						(e.target as HTMLImageElement).src =
							'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';
					}}
				/>
				<div className='detail-hero-overlay' />
				<div className='detail-hero-badges'>
					<Tag color={TYPE_COLOR[destination.type]} className='detail-type-tag'>
						{TYPE_MAP[destination.type]}
					</Tag>
				</div>
				<div className='detail-hero-info'>
					<h2 className='detail-hero-title'>{destination.name}</h2>
					<div className='detail-hero-location'>
						<EnvironmentOutlined />
						<span>{destination.location}</span>
					</div>
				</div>
			</div>

			{/* Content Body */}
			<div className='detail-body'>
				{/* Rating & Duration Row */}
				<div className='detail-meta-row'>
					<div className='meta-item rating-item'>
						<StarFilled className='meta-icon star' />
						<span className='meta-value'>{destination.rating}</span>
						<Rate disabled allowHalf defaultValue={destination.rating} className='meta-stars' />
					</div>
					<div className='meta-item duration-item'>
						<ClockCircleOutlined className='meta-icon clock' />
						<span className='meta-value'>{destination.visitDuration} giờ tham quan</span>
					</div>
				</div>

				{/* Description */}
				<div className='detail-description-section'>
					<h3 className='section-title'>Giới thiệu</h3>
					<p className='detail-description'>{destination.description}</p>
				</div>

				{/* Cost Breakdown */}
				<div className='detail-cost-section'>
					<h3 className='section-title'>Chi phí ước tính</h3>
					<div className='cost-cards'>
						<div className='cost-card food'>
							<div className='cost-card-icon'>
								<CoffeeOutlined />
							</div>
							<div className='cost-card-info'>
								<div className='cost-card-label'>Ăn uống</div>
								<div className='cost-card-value'>{formatPrice(destination.foodCost)}</div>
							</div>
						</div>
						<div className='cost-card accommodation'>
							<div className='cost-card-icon'>
								<HomeOutlined />
							</div>
							<div className='cost-card-info'>
								<div className='cost-card-label'>Lưu trú</div>
								<div className='cost-card-value'>{formatPrice(destination.accommodationCost)}</div>
							</div>
						</div>
						<div className='cost-card transport'>
							<div className='cost-card-icon'>
								<CarOutlined />
							</div>
							<div className='cost-card-info'>
								<div className='cost-card-label'>Di chuyển</div>
								<div className='cost-card-value'>{formatPrice(destination.transportCost)}</div>
							</div>
						</div>
					</div>
				</div>

				{/* Total */}
				<div className='detail-total-bar'>
					<div className='total-label'>
						<DollarOutlined />
						Tổng chi phí ước tính
					</div>
					<div className='total-value'>{formatPrice(totalCost)}</div>
				</div>
			</div>
		</Modal>
	);
};

export default DestinationDetail;
