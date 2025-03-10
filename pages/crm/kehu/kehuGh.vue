<template>
	<view>
		<!--搜索弹窗-->		<u-popup v-model="searchShow" mode="center" width="666rpx" border-radius="14" :closeable="false">			<view class="searchBox">				<view class="searchTitle">搜索</view>				<u-field v-model="searchValue" label="项目名称" placeholder="请输入项目名称"					clear-size="40"></u-field>				<view class="searchBtnRow">					<u-button type="warning" class="searchBtn" :ripple="true" ripple-bg-color="#909399" :plain="true" size="medium" @click="searchShow = false">取消</u-button>					<u-button type="primary" class="searchBtn" :ripple="true" ripple-bg-color="#909399" :plain="true" size="medium" @click="searchBoxFun">确认</u-button>				</view>			</view>		</u-popup>
		<scroll-view scroll-y="true" :style="{height: scrollHeight}" @scrolltolower="selectKehuFun" refresher-enabled
			:refresher-threshold="200" :refresher-triggered="triggered" refresher-background="gray"
			@refresherrefresh="onRefresh" @refresherrestore="onRestore">
			<view v-if="list.length > 0">
				<view v-for="(item, index) in list" :key="index" @click="khCardClickFun(item)">
					<khCard :item="item" :isSelect="isSelect" :index="index" @cxGetDataFun="cxGetDataFun"></khCard>
				</view>
				<getMore :isMore="isMore" nullMsg="已加载全部~"></getMore>
				<view class="h200"></view>
			</view>
			<dataNull v-else src="/static/img/dataNull.png" title="暂无项目相关数据~"></dataNull>
		</scroll-view>
		<addBtn :icons="'search'" @tap="searchShow = true"></addBtn>
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
				searchShow: false,
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
			/* uni.$on('deleteKhFun', that.deleteKhFun)
			uni.$on('updateListByIndex', that.updateListByIndex)
			uni.$on('addItemInListFun', that.addItemInListFun)
			uni.$on('cxGetDataFun', that.cxGetDataFun) */
		},
		onBackPress() {
			/* uni.$off('deleteKhFun', that.deleteKhFun)
			uni.$off('updateListByIndex', that.updateListByIndex)
			uni.$off('addItemInListFun', that.addItemInListFun)
			uni.$off('cxGetDataFun', that.cxGetDataFun) */
		},
		methods: {
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
				that.$api('bidding.projectInitiationList', {projectName: this.searchValue}, {
				}).then(res => {
					if (res.flag) {
						that.list = res.data.records
						that.triggered = false;
						that.isMore = false;
						uni.hideLoading();
					}
				});
				
			},
			// 客户点击方法
			khCardClickFun: function(item) {
				if (that.pageType == 'application') {
					console.log(item)
					uni.$emit('kehuBindFun', {  
						projectName: item.projectName,
						regFee: item.regFee,
						projectNum: item.pojectNo
					})
					uni.navigateBack()
				} 
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
	.topSxRow {
		display: flex;
		align-items: center;
		border-bottom: 1rpx solid #F8F8F8;
	}
	
	.topSearchView {
		width: 100rpx;
		background-color: #FFFFFF;
		height: 80rpx;
		display: flex;
		align-items: center;
		padding-left: 20rpx;
		box-sizing: border-box;
	}
	
	/*************************弹窗层******************************/
	.popupCard {
		width: 100%;
		padding: 26rpx 16rpx;
		border-bottom: 1rpx solid #efefef;
	}
	
	.popupTitle {
		font-size: 16px;
		font-weight: bold;
		margin-bottom: 26rpx;
	}
	
	.popupItem {
		font-size: 15px;
		color: #666666;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}
	
	.itemCard {
		width: 160rpx;
		height: 66rpx;
		text-align: center;
		background-color: #e6e6e6;
		margin-bottom: 26rpx;
		border-radius: 16rpx;
		margin-right: 28rpx;
		overflow: hidden;
	}
	
	.itemCard>view {
		height: 100%;
		line-height: 66rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	
	.itemCard:nth-child(3),
	.mr0 {
		margin-right: 0 !important;
	}
	
	.flexJs {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.popupBottomBtn {
		width: 100%;
		height: 100rpx;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		position: fixed;
		bottom: 0;
		font-size: 15px;
	}
	
	.settingView {
		width: 128rpx;
		height: 100% !important;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.popupBtn {
		width: 50%;
		height: 100% !important;
		line-height: 100rpx;
		text-align: center;
		color: #FFFFFF;
		border-radius: 0 !important;
	}
	
	.activeClass {
		background-image: linear-gradient(45deg, #007AFF, #00aaff);
		color: #FFFFFF;
	}
	
	.u-dropdown__menu__item {
		white-space: nowrap !important;
	}
	
	.dateRow {
		display: flex;
		align-items: center;
	}
	
	.DateInput {
		border: 1rpx solid #DEDEDE;
		padding: 10rpx 26rpx;
		border-radius: 8rpx;
	}
	
	.marLR16 {
		margin: 0 16rpx;
	}
	
	.uni-picker-container .uni-picker-custom {
		z-index: 888888 !important;
	}
	
	.u-drawer {
		z-index: 998 !important;
	}
	
	.searchBox {
		padding: 16rpx 26rpx;
	}
	
	.searchTitle {
		width: 100%;
		border-bottom: 1rpx solid #DDDDDD;
		font-size: 16px;
		font-weight: bold;
		text-align: center;
		padding-bottom: 16rpx;
	}
	
	.searchBtnRow {
		margin: 26rpx 0 16rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}
	
	.searchBtn {
		width: 200rpx;
		height: 66rpx;
	}
	
	.u-field {
		font-size: 15px !important;
	}
	
	.kehuRow {
		width: 100%;
		height: 66rpx;
		line-height: 66rpx;
		text-align: center;
		background-color: #e6e6e6;
		margin-bottom: 16rpx;
		border-radius: 16rpx;
	}
	
	.khScrollView {
		width: 100%;
		height: calc(100vh - 145px);
	}
	.checkBoxGroup {
		margin-bottom: 100rpx;
	}
	.warning {
		background-color: #ff9900;
	}
	.warning:active {
		background-color: #ffaa00;
	}
	.primary {
		background-color: #2979ff;
	}
	.primary:active {
		background-color: #55aaff;
	}
</style>
