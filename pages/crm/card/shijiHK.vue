<template>
	<view class="myCard" @click="gotoDetailFun">
		<view class="cardTopName">回款编号：{{item.hkdCode}}</view>
		<view class="cardRow">
			<view>合同名称：</view>
			<view>{{item.htName}}</view>
		</view>
		<view class="cardRow">
			<view>客户名称：</view>
			<view>{{item.clientName}}</view>
		</view>
		<view class="cardRow">
			<view>回款方式：</view>
			<view>{{item.hkdType}}</view>
		</view>
		<view class="cardRow">
			<view>回款金额：</view>
			<view>{{item.hkdPrice}}</view>
		</view>
		<view class="cardRow">
			<view>回款日期：</view>
			<view>{{$u.timeFormat(item.hkdDateTime, 'yyyy-mm-dd')}}</view>
		</view>
		<view class="fzrAbsolute" v-if="item.fuZeRenId && !isDetail">
			<text class="fzrLeft">负责人：</text>
			<text class="fzrRight">{{item.fuZeRenName}}</text>
		</view>
		<view v-if="!isDetail && !isSelect" class="lookDetail">
			<text>查看详情</text>
			<u-icon name="arrow-right" size="36"></u-icon>
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
			isSelect: {
				type: Boolean,
				default: false
			},
			isDetail: {
				type: Boolean,
				default: false
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
		methods: {
			gotoDetailFun: function() {
				if(this.isSelect) {
					return
				}
				uni.$hkdInfo = this.item;
				uni.navigateTo({
					url: '/pages/crm/huikuan/detail?index=' + this.index + '&isQywx=' + this.isQywx
				})
			}
		}
	}
</script>

<style>
	.progress {
		width: 200rpx !important;
		margin-left: 26rpx;
	}
	.fzr {
		position: absolute;
		right: 26rpx;
		bottom: 74rpx;
		font-size: 15px;
	}
	.fzrLeft {
		color: #ADADAD;
	}
	.fzrRight {
		font-weight: bold;
		color: #ff941a;
	}
</style>

