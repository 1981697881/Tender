<template>
	<view>
		<dataNull v-if="gjList.length == 0" src="https://zy.gzfzdev.com/file/gjNull.png" title="抱歉" title1="暂无公告">
		</dataNull>
		<view v-else>
			<scroll-view scroll-y="true" :style="{height: scrollHeight}" @scrolltolower="selectDataFun"
				refresher-enabled :refresher-threshold="200" :refresher-triggered="triggered"
				refresher-background="gray" @refresherrefresh="onRefresh" @refresherrestore="onRestore">
				<view v-for="(item, index) in gjList" :key="index">
					<genjin :item="item" :index="index" :isQywx="isQywx"></genjin>
				</view>
				<getMore :isMore="isMore"></getMore>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	let that = '';
	import {
		getDayByNumFun
	} from '@/static/utils/date.js'
	import dataNull from '@/components/dataNull/dataNull.vue'
	import genjin from '@/components/genjin.vue'
	import getMore from '@/components/getMore/getMore.vue'
	import { mapMutations, mapActions, mapState } from 'vuex';
	export default {
		components: {
			dataNull,
			getMore,
			genjin,
		},
		data() {
			return {
				triggered: false,
				gjList: [],
				isMore: true,
				pageIndex: 1,
				scrollHeight: '700px',
				matchObj: {},
				clientIdArr: [],
				searchValue: '',
				isQywx: false,
				external_userid: '',
				userid: '',
				uids: [],
				xsUserIds: []
			}
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo,
			}),
		},
		onLoad(e) {
			that = this;
			let obj = {};
			uni.getSystemInfo({
				success(res) {
					that.scrollHeight = res.windowHeight + 'px';
				}
			})
			that.selectDataFun()
		},
		methods: {
			...mapActions(['getUserDetails']),
			init() {
				return Promise.all([this.getUserDetails()])
					.then(() => {
						uni.stopPullDownRefresh();
					})
					.catch(() => {
						uni.stopPullDownRefresh();
					});
			},
			// 查询公告
			selectDataFun: function() {
				let that = this
				that.init();
				console.log(123)
				console.log(this.userInfo)
				/* if(that.userInfo.type != null && that.userInfo.type != '0'){ */
					if (!that.isMore) {
						return
					}
					uni.showLoading({
						title: '加载中...',
						mask: true
					})
					that.$api('bidding.noticeList', {
					}).then(res => {
						if (res.flag) {
							uni.hideLoading();
							that.gjList = res.data
							that.triggered = false;
							that.isMore = false;
						}
					});
				/* }else{
					uni.showModal({
						title: '提示',
						showCancel: false,
						content: '当前暂未登录或者登录授权过期，无法查看详细数据，请重新登录！',
						complete(res) {
							that.$Router.replace({
								path: '/pages/regLogin/login',
								query: {}
							});
						}
					})
				} */
				
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
				that.selectDataFun();
			},
			deleteCardFun: function(e) {
				let arr = that.gjList;
				arr.splice(e.index, 1);
				that.gjList = arr;
			},
			// add页面新增数据
			addGjItemInListFun: function(e) {
				that.cxGetDataFun()
			},
			// 通过下标更新list数据
			updateGjListByIndex: function(e) {
				that.$set(that.gjList, parseInt(e.index), e.obj)
			},
		}
	}
</script>

<style>
	page {
		background-color: #F8F8F8;
	}

	.card {
		width: 686rpx;
		margin: 32rpx;
		background-color: #FFFFFF;
		padding: 26rpx;
		border-radius: 26rpx;
		box-sizing: border-box;
		box-shadow: #dddddd 0px 0px 32rpx;
	}

	.bottomRow {
		display: flex;
		justify-content: space-between;
		border-top: 1rpx solid #dddddd;
		padding-top: 16rpx;
		margin-top: 16rpx;
	}

	.khName {
		font-size: 16px;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.lrView {
		display: flex;
		font-size: 16px;
	}

	.lrView>view:first-child {
		width: 176rpx;
		color: #ADADAD;
	}

	.lrView>view:last-child {
		width: 466rpx;
		color: #000000;
	}
</style>
