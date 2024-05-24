<template>
	<view>
		<!--基础信息-->
		<view class="btName">基础信息</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">投标公司</text>
			<view class="width276 color333 flexC" v-if="khInfo.companyName">
				<text>{{khInfo.companyName}}</text>
			</view>
			<view v-else class="width276">暂无</view>
		</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">项目名称</text>
			<view class="width276 color333 flexC" v-if="khInfo.projectName">
				<text>{{khInfo.projectName}}</text>
			</view>
			<view v-else class="width276">暂无</view>
		</view>
		<view class="flex-white-plr26 ptb20 bdb_f5" >
			<text class="mr26">项目编号</text>
			<view v-if="khInfo.projectNum" class="width276 color333">
				<text>{{khInfo.projectNum}}</text>
			</view>
			<view v-else class="width276">暂无</view>
		</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">项目地址</text>
			<view v-if="khInfo.region" class="width276 color333">
				<text v-if="khInfo.region">{{khInfo.region}}</text>
			</view>
			<view v-else class="width276">暂无</view>
		</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">项目性质</text>
			<view v-if="khInfo.xingZhi" class="width276 color333">{{khInfo.xingZhi}}</view>
			<view v-else class="width276">暂无</view>
		</view>
		<!--扩展信息-->
		<!-- <view class="btName">扩展信息</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">营业执照</text>
			<view v-if="khInfo.type" class="width276 color333">{{khInfo.type}}</view>
			<view v-else class="width276">暂无</view>
		</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">资质证明</text>
			<view v-if="khInfo.zycdNum" class="width276 color333">{{khInfo.zycdNum}}星</view>
			<view v-else class="width276">暂无</view>
		</view> -->
		<!--系统信息-->
		<view class="btName">系统信息</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">负责人</text>
			<view v-if="khInfo.fuZeRenId" class="width276 color333">{{khInfo.fuZeRenName}}</view>
			<view v-else class="width276">暂无</view>
		</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">创建时间</text>
			<view v-if="khInfo.createDate" class="width276 color333">
				{{$u.timeFormat(khInfo.createDate, 'yyyy年mm月dd日 hh时MM分ss秒')}}
			</view>
			<view v-else class="width276">暂无</view>
		</view>
	</view>
</template>

<script>
	let that = ''
	export default {
		props: {
			khInfo: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {

			};
		},
		created() {
			that = this;
			console.log(that.khInfo)
		},
		methods: {
			
			// 拨打电话
			makePhoneCallFun: function(str) {
				uni.makePhoneCall({
					phoneNumber: str
				})
			},
			sendMsgFun: function(str) {
				if (!str) {
					uni.$myModalFun('该客户暂未设置联系方式！')
					return
				}
				// #ifdef APP-PLUS
				var msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);
				msg.to = [str];
				msg.body = '';
				plus.messaging.sendMessage(msg);
				// #endif
			},
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
