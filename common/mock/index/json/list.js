export default [{
	// 未完成报修的单据
		oid: 'BX202108010001',
		price: 20,
		status: 0,
		list: [{
				barCode: '202108010001',
				name: '直发器',
				model: 'JPA40W',
				status: 0
			},
			{
				barCode: '202108010002',
				name: '直发器',
				model: 'JPA40W',
				status: 0
			}
		]
	},
	{
		oid: 'BX202108010002',
		price: 99,
		status: 0,
		list: [{
				barCode: '202108010001',
				name: '直发器',
				model: 'JPA40W',
				status: 0
			}
		]
	},
	// 已完成报修的单据
	{
		oid: 'BX202108010003',
		price: 99,
		status: 1,
		list: [{
				barCode: '202108010001',
				name: '直发器',
				model: 'JPA40W',
				status: 1
			},
			{
				barCode: '202108010002',
				name: '直发器',
				model: 'JPA40W',
				status: 1
			}
		]
	}

]
