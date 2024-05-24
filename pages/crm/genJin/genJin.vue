<template>
	<view>
		<dataNull v-if="gjList.length == 0" src="/static/img/chahua/gjNull.png" title="抱歉" title1="暂无公告">
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
	} from '../../../static/utils/date.js'
	import dataNull from '@/components/dataNull/dataNull.vue'
	import genjin from '../card/genjin.vue'
	import getMore from '@/components/getMore/getMore.vue'
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
				scrollHeight: '667px',
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
		onLoad(e) {
			that = this;
			let obj = {};
			uni.getSystemInfo({
				success(res) {
					that.scrollHeight = res.windowHeight - 40 + 'px';
				}
			})
			that.selectDataFun()
			uni.$on('deleteCardFun', that.deleteCardFun);
			uni.$on('updateGjListByIndex', that.updateGjListByIndex)
			uni.$on('addGjItemInListFun', that.addGjItemInListFun)
		},
		onBackPress() {
			uni.$off('deleteCardFun', that.deleteCardFun);
			uni.$off('updateGjListByIndex', that.updateGjListByIndex)
			uni.$off('addGjItemInListFun', that.addGjItemInListFun);
		},
		methods: {
			// 查询公告
			selectDataFun: function() {
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
				/* crmGenJinApi(reqData)
					.then(res => {
						this.triggered = false;
						let data = res.result.data;
						if (that.pageIndex == 1) {
							that.gjList = [];
						}
						if (data.length == 20) {
							that.pageIndex += 1;
							that.isMore = true;
						} else {
							that.isMore = false;
						}
						that.gjList = that.gjList.concat(data);
					}) */
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
