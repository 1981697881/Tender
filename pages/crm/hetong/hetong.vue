<template>
	<view>
		<dataNull v-if="list.length == 0" src="/static/img/chahua/gjNull.png" title="暂无相关合同" title1="请添加或者更换搜索添加"></dataNull>
		<scroll-view v-else scroll-y="true" :style="{height: scrollHeight}" @scrolltolower="selectDataFun"
			refresher-enabled :refresher-threshold="200" :refresher-triggered="triggered" refresher-background="gray" @refresherrefresh="onRefresh" @refresherrestore="onRestore">
			<view v-for="(item, index) in list" :key="index" @click="clickFun(item, index)">
				<hetong :item="item" :isSelect="isSelect" :index="index" :isQywx="isQywx"></hetong>
			</view>
			<getMore :isMore="isMore"></getMore>
		</scroll-view>
	</view>
</template>

<script>
	let that = '';
	import { crmHeTongApi } from '../../../static/utils/api.js'
	import {
		getDayFun, getDayByNumFun
	} from '@/static/utils/date.js'
	import dataNull from '@/components/dataNull/dataNull.vue'
	import addBtn from '@/components/addBtn/addBtn.vue'
	import getMore from '@/components/getMore/getMore.vue'
	import hetong from '../card/hetong.vue'
	export default {
		components: {
			dataNull,
			addBtn,
			getMore,
			hetong,
		},
		data() {
			return {
				sxList: [],
				list: [/* {
					"department_id": ["2d44d6c260ffb03d002fabd760144289"],
					"gender": 1,
					"depArr": ["2d44d6c260ffb03d002fabd760144289"],
					"cjRenName": "超级管理员",
					"cjRenZh": "admin",
					"fuZeDepId": "2d44d6c260ffb03d002fabd760144289",
					"fuZeRenName": "超级管理员",
					"lxr_name": "测试",
					"clientLxr": "测试",
					"clientName": "66452585",
					"_id": "63565741702e9d00019cc969",
					"htName": "测试项目合同",
					"sjId": "",
					"sjName": "",
					"bjName": "",
					"bjdId": "",
					"cpNum": 2,
					"htPrice": "8812.00",
					"qianYueDate": "2022-10-24",
					"qianYueDateTime": 1666540800000,
					"startDate": "",
					"startDateTime": "",
					"shiXiaoDate": "",
					"shiXiaoDateTime": "",
					"htType": "新合同",
					"shRen": "",
					"shAddr": "",
					"shPhone": "",
					"describe": "",
					"create_date": 1666602816283,
					"update_date": 1666687672362,
					"clientId": "634e2561664ca50001e99b9f",
					"clientLxrId": "634f5ddc6758c000013e6985",
					"fuZeRenId": "79550af26065ecf40d0ebf2138e30e99",
					"fuZeRen": "超级管理员",
					"cjRen": "超级管理员",
					"cjRenId": "79550af26065ecf40d0ebf2138e30e99",
					"htCode": "HT20221024-0005"
				} */],
				pageIndex: 1,
				isMore: true,
				scrollHeight: '667px',
				triggered: false,
				isSelect: false,
				pageType: '',
				matchObj: {},
				searchValue: '',
				clientIdArr: [],
				tabNoEqualArr: [], //标签页不等于数据
				depId: undefined,
				isQywx: false,
				external_userid: '',
				userid: '',
				uids: []
			}
		},
		onLoad(e) {
			that = this;
			that.pageType = e.type ? e.type : '';
			if(e.type) {
				that.isSelect = true;
				uni.setNavigationBarTitle({
					title: '企微合同列表'
				})
			}
			that.selectDataFun();
			uni.$on('deleteCardFun', that.deleteCardFun);
			uni.$on('updateHtListByIndex', that.updateHtListByIndex)
			uni.$on('addHtItemInListFun', that.addHtItemInListFun);
		},
		onBackPress() {
			uni.$off('deleteCardFun', that.deleteCardFun);
			uni.$off('updateHtListByIndex', that.updateHtListByIndex)
			uni.$off('addHtItemInListFun', that.addHtItemInListFun);
		},
		methods: {
			// 查询合同
			selectDataFun: function() {
				if (!that.isMore) {
					return
				}
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				let reqObj = {
					isQywx: that.isQywx,
					matchObj: that.matchObj,
					dateReq: that.dateReq,
					pageIndex: that.pageIndex,
					sortObj: that.sortObj,
					tabNoEqualArr: that.tabNoEqualArr,
					clientIdArr: that.clientIdArr,
					searchValue: that.searchValue
				}
				if(that.isQywx) {
					if(that.external_userid) {
						reqObj.matchObj.external_userid = that.external_userid;
					}
					reqObj.userid = that.userid;
					reqObj.uids = that.uids;
				} else {
					reqObj.depId = that.depId;
				}
				let reqData = {
					action: 'getHeTong',
					params: reqObj
				}
				that.isMore = false;
				this.triggered = false;
				/* crmHeTongApi(reqData)
					.then(res => {
						this.triggered = false;
						let data = res.result.data;
						if (that.pageIndex == 1) {
							that.list = [];
						}
						if (data.length == 20) {
							that.pageIndex += 1;
							that.isMore = true;
						} else {
							that.isMore = false;
						}
						that.list = that.list.concat(data);
					}) */
			},
			clickFun: function(item, index) {
				if(that.pageType == 'genjin') {
					uni.$emit('gjOrderBindFun', item)
					uni.navigateBack()
				} else if(that.pageType == 'hkjh') {
					uni.$emit('hetongBindFun', {
						htName: item.htName,
						htId: item._id,
						htCode: item.htCode || '',
						htPrice: item.htPrice,
						clientId: item.clientId || '',
						clientName: item.clientName,
						external_userid: item.external_userid || ''
					})
					uni.navigateBack()
				} else if(that.pageType == 'hkd') {
					uni.$emit('hetongBindFun', item)
					uni.navigateBack()
				}
			},
			// 下拉刷新
			onRefresh: function() {
				if(that.triggered) return
				that.triggered = true;
				that.cxGetDataFun();
			},
			onRestore: function(e) {
				that.triggered = false; // 需要重置
			},
			// 重新获取数据
			cxGetDataFun: function() {
				that.pageIndex = 1;
				that.isMore = true;
				that.selectDataFun();
			},
			deleteCardFun: function(e) {
				let arr = that.list;
				arr.splice(e.index, 1);
				that.list = arr;
			},
			// add页面新增数据
			addHtItemInListFun: function(e) {
				that.cxGetDataFun()
			},
			// 通过下标更新list数据
			updateHtListByIndex: function(e) {
				that.$set(that.list, parseInt(e.index), e.obj)
			},
		}
	}
</script>

<style>
	page {
		background-color: #F8F8F8;
	}
</style>
