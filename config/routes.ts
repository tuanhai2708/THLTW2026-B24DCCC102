export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},

	///////////////////////////////////
	// DU LỊCH
	{
		name: 'Du lịch',
		path: '/du-lich',
		icon: 'GlobalOutlined',
		routes: [
			{
				name: 'Khám phá',
				path: 'kham-pha',
				component: './DuLich/KhamPha',
				icon: 'CompassOutlined',
			},
			{
				name: 'Lịch trình',
				path: 'lich-trinh',
				component: './DuLich/LichTrinh',
				icon: 'ScheduleOutlined',
			},
			{
				name: 'Ngân sách',
				path: 'ngan-sach',
				component: './DuLich/NganSach',
				icon: 'WalletOutlined',
			},
		],
	},
	{
		name: 'Quản trị Du lịch',
		path: '/admin-du-lich',
		icon: 'SettingOutlined',
		routes: [
			{
				name: 'Quản lý điểm đến',
				path: 'quan-ly-diem-den',
				component: './DuLich/Admin/QuanLyDiemDen',
				icon: 'EnvironmentOutlined',
			},
			{
				name: 'Thống kê',
				path: 'thong-ke',
				component: './DuLich/Admin/ThongKe',
				icon: 'BarChartOutlined',
			},
		],
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
