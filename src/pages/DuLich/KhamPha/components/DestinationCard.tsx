import { Card, Rate, Tag } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined, StarFilled } from '@ant-design/icons';

/** Map loại hình sang label tiếng Việt */
const TYPE_MAP: Record<DuLich.DestinationType, string> = {
	bien: 'Biển',
	nui: 'Núi',
	thanh_pho: 'Thành phố',
};

/** Format số tiền VNĐ */
const formatPrice = (price: number) =>
	new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

interface DestinationCardProps {
	destination: DuLich.Destination;
	onClick: (dest: DuLich.Destination) => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination, onClick }) => {
	const totalCost = destination.foodCost + destination.accommodationCost + destination.transportCost;

	return (
		<Card
			className='destination-card'
			hoverable
			onClick={() => onClick(destination)}
			bodyStyle={{ padding: 0 }}
		>
			<div className='card-image'>
				<img
					src={destination.image}
					alt={destination.name}
					loading='lazy'
					onError={(e) => {
						(e.target as HTMLImageElement).src =
							'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';
					}}
				/>
				<span className={`type-badge ${destination.type}`}>{TYPE_MAP[destination.type]}</span>
				<span className='price-badge'>{formatPrice(totalCost)}</span>
			</div>

			<div className='card-content'>
				<div className='card-title'>{destination.name}</div>
				<div className='card-location'>
					<EnvironmentOutlined />
					{destination.location}
				</div>
				<div className='card-meta'>
					<div className='card-rating'>
						<StarFilled style={{ color: '#f59e0b', fontSize: 14 }} />
						<span className='rating-value'>{destination.rating}</span>
					</div>
					<div className='card-duration'>
						<ClockCircleOutlined />
						{destination.visitDuration}h tham quan
					</div>
				</div>
			</div>
		</Card>
	);
};

export default DestinationCard;
