import { Input, Select, Slider, Rate, Button } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Option } = Select;

interface FilterBarProps {
	onFilter: (filters: DuLich.DestinationFilter) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilter }) => {
	const [keyword, setKeyword] = useState('');
	const [type, setType] = useState<DuLich.DestinationType | undefined>();
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
	const [minRating, setMinRating] = useState<number>(0);
	const [sortBy, setSortBy] = useState<string | undefined>();

	const handleFilter = () => {
		onFilter({
			keyword: keyword || undefined,
			type,
			minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
			maxPrice: priceRange[1] < 5000000 ? priceRange[1] : undefined,
			minRating: minRating > 0 ? minRating : undefined,
			sortBy: sortBy as any,
			sortOrder: sortBy === 'price' ? 'asc' : 'desc',
		});
	};

	const handleReset = () => {
		setKeyword('');
		setType(undefined);
		setPriceRange([0, 5000000]);
		setMinRating(0);
		setSortBy(undefined);
		onFilter({});
	};

	const formatSliderPrice = (value?: number) => {
		if (!value) return '0';
		return `${(value / 1000000).toFixed(1)}tr`;
	};

	return (
		<div className='filter-bar'>
			<div className='filter-row'>
				<div className='filter-item' style={{ flex: 1, minWidth: 200 }}>
					<Input
						placeholder='Tìm kiếm điểm đến...'
						prefix={<SearchOutlined style={{ color: '#bbb' }} />}
						value={keyword}
						onChange={(e) => setKeyword(e.target.value)}
						onPressEnter={handleFilter}
						allowClear
						size='large'
						style={{ borderRadius: 8 }}
					/>
				</div>

				<div className='filter-item'>
					<span className='filter-label'>Loại:</span>
					<Select
						placeholder='Tất cả'
						value={type}
						onChange={setType}
						allowClear
						style={{ width: 140 }}
						size='large'
					>
						<Option value='bien'>🏖️ Biển</Option>
						<Option value='nui'>⛰️ Núi</Option>
						<Option value='thanh_pho'>🏙️ Thành phố</Option>
					</Select>
				</div>

				<div className='filter-item' style={{ minWidth: 200 }}>
					<span className='filter-label'>Giá:</span>
					<Slider
						range
						min={0}
						max={5000000}
						step={100000}
						value={priceRange}
						onChange={(val) => setPriceRange(val as [number, number])}
						tipFormatter={formatSliderPrice}
						style={{ width: 160 }}
					/>
				</div>

				<div className='filter-item'>
					<span className='filter-label'>Rating:</span>
					<Rate
						allowHalf
						value={minRating}
						onChange={setMinRating}
						style={{ fontSize: 16 }}
					/>
				</div>

				<div className='sort-section'>
					<Select
						placeholder='Sắp xếp'
						value={sortBy}
						onChange={setSortBy}
						allowClear
						style={{ width: 150 }}
						size='large'
					>
						<Option value='rating'>⭐ Đánh giá</Option>
						<Option value='price'>💰 Giá</Option>
						<Option value='name'>🔤 Tên A-Z</Option>
					</Select>

					<Button type='primary' icon={<FilterOutlined />} onClick={handleFilter} size='large'>
						Lọc
					</Button>
					<Button icon={<ClearOutlined />} onClick={handleReset} size='large'>
						Xóa
					</Button>
				</div>
			</div>
		</div>
	);
};

export default FilterBar;
