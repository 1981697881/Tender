<template>
	<view>
		<!--基础信息-->
		<view class="btName">基础信息</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">合同单号</text>
			<view v-if="infoObj.htCode" class="width276 color333">{{infoObj.htCode}}</view>
			<view v-else class="width276">暂无</view>
		</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">合同名称</text>
			<view class="width276 color333 flexC" v-if="infoObj.htName">
				<text>{{infoObj.htName}}</text>
			</view>
			<view v-else class="width276">暂无</view>
		</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">合同金额</text>
			<view class="width276 color333 flexC" v-if="infoObj.htPrice">
				<text>{{infoObj.htPrice}}</text>
			</view>
			<view v-else class="width276">暂无</view>
		</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">签约公司</text>
			<view v-if="infoObj.clientName" class="width276 blueColor">
				<text>{{infoObj.clientName}}</text>
			</view>
			<view v-else class="width276">暂无</view>
		</view>
		<view v-if="!isQywx" class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">联系人</text>
			<view class="width276 blueColor flexC" v-if="infoObj.clientLxr">
				<text>{{infoObj.clientLxr}}</text>
			</view>
			<view v-else class="width276">暂无</view>
		</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">合同类型</text>
			<view class="width276 color333 flexC" v-if="infoObj.htType">
				<text>{{infoObj.htType}}</text>
			</view>
			<view v-else class="width276">暂无</view>
		</view>
		<!--其他日期-->
		<view class="btName">其他信息</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">签约日期</text>
			<view v-if="infoObj.qianYueDateTime" class="width276 color333">{{$u.timeFormat(infoObj.qianYueDateTime, 'yyyy年mm月dd日 hh时MM分ss秒')}}</view>
			<view v-else class="width276">暂无</view>
		</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">生效日期</text>
			<view v-if="infoObj.startDateTime" class="width276 color333">{{$u.timeFormat(infoObj.startDateTime, 'yyyy年mm月dd日 hh时MM分ss秒')}}</view>
			<view v-else class="width276">暂无</view>
		</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">失效日期</text>
			<view v-if="infoObj.shiXiaoDateTime" class="width276 color333">{{$u.timeFormat(infoObj.shiXiaoDateTime, 'yyyy年mm月dd日 hh时MM分ss秒')}}</view>
			<view v-else class="width276">暂无</view>
		</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">收货人</text>
			<view v-if="infoObj.shRen" class="width276 color333">{{infoObj.shRen}}</view>
			<view v-else class="width276">暂无</view>
		</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">收货电话</text>
			<view v-if="infoObj.shPhone" class="width276 color333">{{infoObj.shPhone}}</view>
			<view v-else class="width276">暂无</view>
		</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">收货地址</text>
			<view v-if="infoObj.shAddr" class="width276 color333">{{infoObj.shAddr}}</view>
			<view v-else class="width276">暂无</view>
		</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">备注</text>
			<view v-if="infoObj.describe" class="width276 color333">{{infoObj.describe}}</view>
			<view v-else class="width276">暂无</view>
		</view>
		<!--系统信息-->
		<view class="btName">系统信息</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">负责人</text>
			<view v-if="infoObj.fuZeRenId" class="width276 color333">{{infoObj.fuZeRenName}}</view>
			<view v-else class="width276">暂无</view>
		</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">创建人</text>
			<view v-if="infoObj.cjRenId" class="width276 color333">{{infoObj.cjRenName}}</view>
			<view v-else class="width276">暂无</view>
		</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">创建时间</text>
			<view v-if="infoObj.create_date" class="width276 color333">{{$u.timeFormat(infoObj.create_date, 'yyyy年mm月dd日 hh时MM分ss秒')}}
			</view>
			<view v-else class="width276">暂无</view>
		</view>
	</view>
</template>

<script>
	let that = ''
	export default {
		props: {
			infoObj: {
				type: Object,
				default: () => {}
			},
			isQywx: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {

			};
		},
		created() {
			that = this;
		},
		methods: {
			// 跳往百度
			gotoBaiDuFun: function(type) {
				uni.navigateTo({
					url: '/pages/webview/webview?name=' + that.infoObj.clientName + '&type=' + type
				})
			},
			// 拨打电话
			makePhoneCallFun: function(str) {
				uni.makePhoneCall({
					phoneNumber: str
				})
			},
			// 打开定位
			getLocationFun: function() {
				uni.openLocation({
					latitude: that.infoObj.latitude,
					longitude: that.infoObj.longitude,
					address: that.infoObj.address,
					success: function() {
						console.log('success');
					}
				});
			},
			navigateToFun: function(str) {
				if(str == 'client') {
					if(this.isQywx) {
						uni.navigateTo({
							url: '/qywxPage/view/qywxClient/khDetail?fromDetail=1&external_userid=' + that.infoObj.external_userid
						})
					} else {
						uni.navigateTo({
							url: '/pages/crm/kehu/khDetail?fromDetail=1&_id=' + that.infoObj.clientId
						})
					}
				} else if(str == 'lxr') {
					uni.navigateTo({
						url: '/pages/crm/lianxiren/detail?fromDetail=1&_id=' + that.infoObj.clientLxrId
					})
				} else if(str == 'sj') {
					if(this.isQywx) {
						uni.navigateTo({
							url: '/pages/crm/shangji/detail?fromDetail=1&isQywx=true&_id=' + that.infoObj.sjId
						})
					} else {
						uni.navigateTo({
							url: '/pages/crm/shangji/detail?fromDetail=1&_id=' + that.infoObj.sjId
						})
					}
				} else if(str == 'bjd') {
					if(this.isQywx) {
						uni.navigateTo({
							url: '/pages/crm/baoJiaDan/detail?fromDetail=1&isQywx=true&_id=' + that.infoObj.bjdId
						})
					} else {
						uni.navigateTo({
							url: '/pages/crm/baoJiaDan/detail?fromDetail=1&_id=' + that.infoObj.bjdId
						})
					}
				}
			}
		}
	}
</script>

<style>
	.color333 {
		color: #666666;
	}

	.btName {
		margin-bottom: 16rpx;
	}

	.flexC {
		display: flex;
		align-items: center;
	}
	.p8Img {
		padding: 8rpx;
		width: 40rpx;
		height: 40rpx;
		margin-left: 16rpx;
	}
	.p8 {
		padding: 8rpx;
	}
</style>
