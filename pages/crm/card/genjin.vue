<template>
	<view class="card" @click="gotoDetailFun">
		<view class="khName">项目名称：{{item.projectName}}</view>
		<view class="lrView">
			<view>公告类型：</view>
			<view>{{item.noticeType}}</view>
		</view>
		<view class="lrView">
			<view>公布标题：</view>
			<view class="liangHang">{{item.noticeTitle}}</view>
		</view>
		<view v-if="item.releaseDate" class="lrView">
			<view>公布时间：</view>
			<view>{{$u.timeFormat(item.releaseDate, 'yyyy-mm-dd hh:MM:ss')}}</view>
		</view>
		<view class="lrView">
			<view>作者：</view>
			<view class="liangHang">{{item.author}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default: () => {}
			},
			index: {
				type: Number,
				default: 0
			},
			isQywx: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				
			}
		},
		created() {
			console.log(this.item)
		},
		methods: {
			gotoDetailFun: function() {
				uni.$gjInfo = this.item;
				this.jump('/pages/crm/genJin/detail',{index: this.index})
			},
			// 路由跳转
			jump(path, parmas) {
				this.$Router.push({
					path: path,
					query: parmas
				});
			},
		}
	}
</script>

<style>
	.card {
		width: 686rpx;
		margin: 32rpx;
		background-color: #FFFFFF;
		padding: 16rpx;
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
		margin-bottom: 16rpx;
		padding-bottom: 10rpx;
		border-bottom: 1rpx solid #e8e8e8;
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

