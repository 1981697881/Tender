/**
 * 接口列表文件
 */
export default {
	/** 初始化 ↓ **/
	init: {
		url: 'index/init',
		auth: false,
		method: 'GET',
		// desc: '初始化数据',
	},
	/** 招标 ↓ **/
	bidding: {
		noticeList: {
			url: 'app/NoticeList',
			auth: true,
			method: 'POST',
			// desc: '公告',
		},
		signUp: {
			url: 'app/signUp',
			auth: true,
			method: 'POST',
			// desc: '报名',
		},
		registrations: {
			url: 'registration/registrations',
			auth: true,
			method: 'POST',
			// desc: '报名列表',
		},
		audit: {
			url: 'projectInitiation/audit',
			auth: true,
			method: 'POST',
			// desc: '审核',
		},projectInitiationList: {
			url: 'projectInitiation/projectInitiationList/1/10',
			auth: true,
			method: 'POST',
			// desc: '审核',
		},registrationList: {
			url: 'registration/registrationList/1/10',
			auth: true,
			method: 'POST',
			// desc: '审核',
		},
		
	},
	/** 聊天 ↓ **/
	chat: {
		init: {
			url: 'chat.index/init',
			auth: false,
			method: 'GET',
			// desc: '初始化聊天配置',
		}

	},

	/** 上传图片 ↓ **/
	upload: {
		url: 'file/imgUpload',
		auth: true,
		method: 'POST',
		// desc: '上传',
	},

	/** 上传Base64图片 ↓ **/
	uploadBase64: {
		url: 'index/uploadBase64',
		auth: false,
		method: 'POST',
		// desc: '上传Base64位图片',
	},

	/** 消息订阅模板 ↓ **/
	messageIds: {
		url: 'notification/template',
		auth: true,
		method: 'GET',
		// desc: '订阅消息模板ids',
	},

	/** 微信Jssdk ↓ **/
	wechat: {
		jssdk: {
			url: 'wechat/jssdk',
			auth: false,
			method: 'POST',
			// desc: '微信Jssdk',
		},
	},

	/** 富文本  ↓ **/
	richtext: {
		url: 'index/richtext',
		auth: false,
		method: 'GET',
		// desc: '富文本数据',
	},

	/** 用户 ↓ **/
	user: {
		changePass: {
			url: 'user/changePass',
			auth: true,
			method: 'POST',
			// desc: '修改密码',
		},login: {
			url: 'user/login',
			auth: false,
			method: 'POST',
			// desc: '账号登录',
		},
		member: {
			url: 'member/loginMember',
			auth: true,
			method: 'POST',
			// desc: '用户信息',
		},
		info: {
			url: 'user',
			auth: true,
			method: 'GET',
			// desc: '用户信息',
		},
		register: {
			url: 'user/register',
			auth: false,
			method: 'POST',
			// desc: '用户注册',
		},
		getWxMiniProgramSessionKey: {
			url: 'weChat/memberAuthorize',
			auth: false,
			method: 'POST',
			// desc: '获取用户session_key',
		},
		wxMiniProgramLogin: {
			url: 'weChat/memberLogin',
			auth: false,
			method: 'POST',
			// desc: '微信小程序登录',
		},
		getWxMiniPhoneNumber: {
			url: 'phone/phoneNumber',
			auth: false,
			method: 'POST',
			// desc: '获取用户手机号码',
		},
		forgot: {
			url: 'user/forgot',
			auth: false,
			method: 'POST',
			// desc: '忘记密码',
		},
	},

	/** 分享 ↓ **/
	share: {
		add: {
			url: 'share/add',
			auth: false,
			method: 'POST',
			// desc: '添加分享记录',
		}
	},

	/** 位置 ↓ **/
	address: {
		area: {
			url: 'address/area',
			auth: false,
			method: 'GET',
			// desc: '省市区',
		},
		list: {
			url: 'address',
			auth: true,
			method: 'GET',
			// desc: '地址列表',
		},
		edit: {
			url: 'address/edit',
			auth: true,
			method: 'POST',
			// desc: '修改地址',
		},
		defaults: {
			url: 'address/defaults',
			auth: true,
			method: 'GET',
			// desc: '默认地址',
		},
		info: {
			url: 'address/info',
			auth: true,
			method: 'GET',
			// desc: '地址详情',
		},
		del: {
			url: 'address/del',
			auth: true,
			method: 'POST',
			// desc: '删除',
		},
	},

	/** 短信 ↓ **/
	sms: {
		send: {
			url: 'sms/send',
			auth: false,
			method: 'POST',
			// desc: '发送短信',
		},
	},

	/** 常见问题 ↓ **/
	faq: {
		list: {
			url: 'faq',
			auth: false,
			method: 'GET',
			// desc: '常见问题列表',
		},
	},

	/** 意见反馈 ↓ **/
	feedback: {
		type: {
			url: 'feedback/type',
			auth: true,
			method: 'GET',
			// desc: '意见反馈类型',
		},
		add: {
			url: 'feedback/add',
			auth: true,
			method: 'POST',
			// desc: '提交意见',
		},
	},
	/** 支付 ↓ **/
	pay: {
		prepay: {
			url: 'WeChat/payMoney',
			auth: true,
			method: 'POST',
			// desc: '发起支付',
		},
	},
};
