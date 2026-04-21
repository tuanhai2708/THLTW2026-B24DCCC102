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

	// BLOG CÁ NHÂN
	{
		path: '/blog',
		name: 'Blog',
		icon: 'ReadOutlined',
		routes: [
			{
				path: '/blog',
				component: './Blog/Home',
				exact: true,
				hideInMenu: true,
			},
			{
				path: '/blog/about',
				name: 'Về tác giả',
				component: './Blog/About',
				exact: true,
				hideInMenu: true,
			},
			{
				path: '/blog/:id',
				component: './Blog/Detail',
				exact: true,
				hideInMenu: true,
			},
		]
	},

	// QUẢN LÝ BLOG
	{
		path: '/admin-blog',
		name: 'Quản lý Blog',
		icon: 'EditOutlined',
		routes: [
			{
				path: '/admin-blog/posts',
				name: 'Bài viết',
				component: './AdminBlog/PostManagement',
			},
			{
				path: '/admin-blog/tags',
				name: 'Thẻ (Tags)',
				component: './AdminBlog/TagManagement',
			},
		]
	},

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
