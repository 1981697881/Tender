<template>
	<view class="myCard" @click="gotoDetailFun">
		<view class="cardTopName">合同名称：{{item.htName}}</view>
		<view class="cardRow" v-if="item.htCode">
			<view>合同编号：</view>
			<view>{{item.htCode}}</view>
		</view>
		<view class="cardRow">
			<view>合同金额：</view>
			<view>{{item.htPrice}}</view>
		</view>
		<view class="cardRow">
			<view>签约日期：</view>
			<view>{{$u.timeFormat(item.qianYueDateTime, 'yyyy-mm-dd')}}</view>
		</view>
		<view class="cardRow" v-if="item.fuZeRenId && !isDetail">
			<text class="fzrLeft">负责人：</text>
			<text class="fzrRight">{{item.fuZeRenName}}</text>
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
				uni.$htInfo = this.item;
				console.log(uni.$htInfo)
				uni.navigateTo({
					url: '/pages/crm/hetong/detail?index=' + this.index + '&isQywx=' + this.isQywx
				})
			}
		}
	}
</script>

<style>
	
</style>

