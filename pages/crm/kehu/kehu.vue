<template>
	<view>
		<scroll-view scroll-y="true" :style="{height: scrollHeight}" @scrolltolower="selectKehuFun" refresher-enabled
			:refresher-threshold="200" :refresher-triggered="triggered" refresher-background="gray"
			@refresherrefresh="onRefresh" @refresherrestore="onRestore">
			<view v-if="list.length > 0">
				<view v-for="(item, index) in list" :key="index">
					<khCard :item="item" :isSelect="isSelect" :index="index" @cxGetDataFun="cxGetDataFun"></khCard>
				</view>
				<getMore :isMore="isMore" nullMsg="已加载全部~"></getMore>
				<view class="h200"></view>
			</view>
			<dataNull v-else src="/static/img/dataNull.png" title="暂无相关报名数据~"></dataNull>
		</scroll-view>
		<addBtn @tap="enroll"></addBtn>
	</view>
</template>

<script>
	let that = this;
	import {
		getDayFun,
		getDayByNumFun
	} from '@/static/utils/date.js'
	import dataNull from '@/components/dataNull/dataNull.vue'
	import addBtn from '@/components/addBtn/addBtn.vue'
	import getMore from '@/components/getMore/getMore.vue'
	import khCard from '../card/kehu.vue'
	export default {
		components: {
			dataNull,
			addBtn,
			getMore,
			khCard
		},
		data() {
			return {
				triggered: false,
				sxList: [],
				list: [],
				isMore: true,
				pageIndex: 1,
				scrollHeight: '667px',
				pageType: '',
				sortObj: {
					update_date: -1
				},
				optionsReq: {}, // 第一个下拉框请求参数
				dateReq: [], // 日期相关请求参数
				sxReq: JSON.stringify({}), // 筛选想请求参数
				matchObj: {},
				searchValue: '',
				isSelect: false,
				tabNoEqualArr: [], //标签页不等于数据
				depId: undefined
			}
		},
		onShow() {
			this.selectKehuFun();
		},
		onLoad(e) {
			that = this;
			let obj = {};
			if (e.type) {
				that.isSelect = true;
			}
			that.pageType = e.type ? e.type : '';
			uni.getSystemInfo({
				success(res) {
					that.scrollHeight = res.windowHeight - 40 + 'px';
				}
			})
			uni.$on('deleteKhFun', that.deleteKhFun)
			uni.$on('updateListByIndex', that.updateListByIndex)
			uni.$on('addItemInListFun', that.addItemInListFun)
			uni.$on('cxGetDataFun', that.cxGetDataFun)
		},
		onBackPress() {
			uni.$off('deleteKhFun', that.deleteKhFun)
			uni.$off('updateListByIndex', that.updateListByIndex)
			uni.$off('addItemInListFun', that.addItemInListFun)
			uni.$off('cxGetDataFun', that.cxGetDataFun)
		},
		methods: {
			enroll: function() {
				let that = this;
				uni.showActionSheet({
					itemList: ['询价项目', '公开招标、磋商(谈判)项目', '企业标'],
					success: function(res) {
						if (res.tapIndex == 0) {
							that.jump('pages/crm/kehu/addKeHu', {
								"isAdd": 1,
								"name": "询价项目"
							})
						} else if (res.tapIndex == 1) {
							that.jump('pages/crm/kehu/addKeHu', {
								"isAdd": 1,
								"name": "公开招标、磋商(谈判)项目"
							})
						} else {
							that.jump('pages/crm/kehu/addKeHu', {
								"isAdd": 1,
								"name": "企业标"
							})
						}

					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
			},
			jump(path, query) {
				this.$Router.push({
					path: path,
					query: query
				});
			},
			// 查询列表
			selectKehuFun: function() {
				if (!that.isMore) {
					return
				}
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				that.$api('bidding.registrations', {
				}).then(res => {
					if (res.flag) {
						that.list = res.data
						that.triggered = false;
						that.isMore = false;
						uni.hideLoading();
					}
				});
				
			},
			// 下拉框回调函数
			dropDownFun1: function(e) {
				let optionsReq = {};
				let tabNoEqualArr = [];
				let userInfo = uni.$userInfo;
				that.depId = undefined;
				if (e.label == '全部') {
					that.depId = userInfo.depManager_Id;
				} else if (e.label == '我负责的') {
					optionsReq.fuZeRenId = userInfo._id;
				} else if (e.label == '我创建的') {
					optionsReq.cjRenId = userInfo._id;
				} else if (e.label == '下属负责') {
					that.depId = userInfo.depManager_Id;
					tabNoEqualArr = [{
						field: 'fuZeRenId',
						value: userInfo._id
					}]
					optionsReq.department = userInfo.departmentId;
				} else if (e.label == '下属创建') {
					that.depId = userInfo.depManager_Id;
					tabNoEqualArr = [{
						field: 'cjRenId',
						value: userInfo._id
					}]
				}
				that.tabNoEqualArr = tabNoEqualArr;
				that.optionsReq = JSON.stringify(optionsReq);
				that.matchObj = Object.assign(optionsReq, JSON.parse(that.sxReq));
				that.cxGetDataFun();
			},
			// 下拉刷新
			onRefresh: function() {
				if (that.triggered) return
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
				that.selectKehuFun();
			},
			deleteKhFun: function(e) {
				let arr = that.list;
				arr.splice(e.index, 1);
				that.list = arr;
			},
			// 通过下标更新list数据
			updateListByIndex: function(e) {
				that.$set(that.list, parseInt(e.index), e.obj)
			},
			// add页面新增数据
			addItemInListFun: function(e) {
				let arr = that.list;
				arr.unshift(e);
				that.list = arr;
				uni.pageScrollTo({
					scrollTop: 0
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #F8F8F8;
	}

	.card {
		width: 698rpx;
		padding: 26rpx 26rpx 10rpx;
		margin: 32rpx 26rpx;
		box-sizing: border-box;
		border-radius: 8rpx;
		box-shadow: #d8d8d8 0px 0px 16rpx;
		position: relative;
		background-color: #FFFFFF;
	}

	.genjinBtn {
		position: absolute;
		right: 26rpx;
		top: 26rpx;
		background-color: #007AFF;
		color: #FFFFFF;
		text-align: center;
		padding: 6rpx 16rpx;
		border-radius: 6rpx;
		font-size: 14px;
	}

	.genjinBtn:active {
		background-color: #13B8FF;
	}

	.topRow {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
	}

	.txView {
		width: 128rpx;
		height: 128rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 26rpx;
	}

	.txViewImg {
		width: 100%;
		height: 100%;
	}

	.info {
		width: 492rpx;
		font-size: 15px;
		color: #000;
	}

	.name {
		font-size: 16px;
		margin-bottom: 8rpx;
		color: #000000;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: bold;
	}

	.bottomRow {
		width: 100%;
		padding-top: 16rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-top: 1rpx solid #f0f0f0;
		font-size: 15px;
		color: #007AFF;
	}

	.lxRow {
		display: flex;
		align-items: center;
	}

	.lxRow>image {
		width: 52rpx;
		height: 52rpx;
		margin-right: 26rpx;
	}

	.bqRow {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.bqRow>text {
		font-size: 14px;
		color: #888888;
	}

	.bqRow>view {
		padding: 6rpx 16rpx;
		font-size: 14px;
		background-color: rgba(255, 85, 127, 0.1);
		color: #ff5500;
		border-radius: 10rpx;
		margin: 6rpx 26rpx 20rpx 0;
	}
</style>
