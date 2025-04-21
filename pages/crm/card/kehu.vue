<template>
	<view>
		<view class="card">
			<view class="topRow1" @click="gotoDetailFun">
				<view class="name">
					<text>{{item.projectName || '暂无'}}</text>
				</view>
				<view>
					<text class="colorGray">项目编号：</text>
					<text>{{item.projectNum || item.pojectNo}}</text>
				</view>
				<view v-if="!item.name">
					<text class="colorGray">提交日期：</text>
					<text>{{item.createDate}}</text>
				</view>
				<view v-else>
					<text class="colorGray">填制日期：</text>
					<text>{{item.fillingDate}}</text>
				</view>
				<view v-if="!item.name">
					<text class="colorGray">是否缴费：</text>
					<text :class="item.status=='1'?'greenColor':'redColor'">{{item.status=="1"?"已缴费":"未缴费"}}</text>
				</view>
				<view v-else>
					<text class="colorGray">是否审核：</text>
					<text :class="(item.secondStatus !=  '1' || item.firstStatus !=  '1')?'redColor':'greenColor'">{{(item.secondStatus !=  '1' || item.firstStatus !=  '1')?"未审核":"已审核"}}</text>
				</view>
				<!--客户阶段-->
				<view class="khJieDuan">
					<text style="color: #13B8FF;">{{item.jieDuan}}</text>
				</view>
				<!--客户状态-->
				<!-- <view class="khType" v-if="item.companyState">
					<text v-if="item.companyState == '潜在客户'" class="yellowColor">潜在客户</text>
					<text v-if="item.companyState == '初步接触'" style="color: #13B8FF;">初步接触</text>
					<text v-if="item.companyState == '持续跟进'" style="color: #00AAFF;">持续跟进</text>
					<text v-if="item.companyState == '成交客户'" style="color: #007aff;">成交客户</text>
					<text v-if="item.companyState == '忠诚客户'" class="greenColor">忠诚客户</text>
					<text v-if="item.companyState == '无效客户'" class="redColor">无效客户</text>
				</view> -->
			</view>
			<!--标签-->
			<view v-if="!item.name&&item.status!='1'" class="bottomRow">
				<view class="lxRow" v-if="userInfo.type=='1'&& (item.secondStatus !=  '1' || item.firstStatus !=  '1')"  @click.stop="audit({'id': item.projectId})">
					审核
				</view>
				<view class="lxRow" v-else>
				</view>
				<view class="lxRow" @click.stop="moreShowFun(item)">
					<image src="/common/icon/gengduosz.png" mode="aspectFill"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapMutations, mapActions, mapState } from 'vuex';
	import AppPay from '@/common/app-pay';
	export default {
		props: {
			item: {
				type: Object,
				default: () => {}
			},
			isSelect: {
				type: Boolean,
				default: false
			},
			index: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				sheetList: [{
						text: '添加跟进'
					},
					{
						text: '编辑'
					},
					{
						text: '删除'
					}
				],
				moreShow: false,
				allotShow: false,
				userList: []
			}
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo,
			}),
		},
		onShow() {
			if(that.isLoadSelectKhById) {
				that.selectKhByIdFun();
			}
		},
		methods: {
			moreShowFun: function(item) {
				let that = this
				let status = this.item.status;
				uni.$addInfo = this.item;
				let itemList = ['编辑'];
				if(item.status == null){
					itemList.push('支付');
				}
				uni.showActionSheet({
				    itemList: itemList,
				    success: function (res) {
						if(res.tapIndex == 0){
							that.jump('/pages/crm/kehu/addKeHu',{type: 'update'})
						} else if(res.tapIndex == 1){
							//测试订单
							let params = {
								amount: item.regFee,
								openId: that.userInfo.openid,
								payType: 1,

								regId: item.id,
								pojectNo: item.projectNum,
								projectName: item.projectName
							};
							uni.$khInfo = item;
							let pay = new AppPay(params, "wechat", {}, 1);
						}
				    },
				    fail: function (res) {
				        console.log(res.errMsg);
				    }
				});
			},
			gotoDetailFun: function() {
				if(this.isSelect) {
					return
				}
				uni.$khInfo = this.item;
				this.jump('/pages/crm/kehu/khDetail',{index: this.index})
			},
			audit: function(val) {
				let that = this
				uni.showLoading({
						title: '审核中...'
					})
				that.$api('bidding.audit', val).then(res => {
					if (res.flag) {
						uni.hideLoading();
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 888,
							mask: true
						})
						that.$emit('cxGetDataFun');
					}
				});
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
		width: 698rpx;
		padding: 26rpx 26rpx 10rpx;
		margin: 32rpx 26rpx;
		box-sizing: border-box;
		border-radius: 16rpx;
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

	.topRow1 {
		margin-bottom: 16rpx;
		font-size: 15px;
		color: #000;
		position: relative;
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
	.khJieDuan {
		position: absolute;
		right: 0;
		top: 50rpx;
		font-weight: bold;
	}
	.khType {
		position: absolute;
		right: 0;
		top: 72rpx;
		font-weight: bold;
	}
</style>
