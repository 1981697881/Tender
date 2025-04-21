<template>
	<view class="content">
		<!-- <view class="swiper-item">
			<view v-for="(item, index) in cardList" :key="index" @click="chlickItem(item)" class="kongKimCard">
				<view :style="{backgroundImage: item.bgColor}">
					<image :src="item.src" mode="aspectFill"></image>
				</view>
				<view>{{item.name}}</view>
			</view>
		</view> -->
		<view class="banner-swiper-box mb10">
			<swiper class="banner-carousel app-selector-rect" circular @change="swiperChange" :autoplay="true">
				<swiper-item v-for="(item, index) in list" :key="index" class="carousel-item " @tap="jump(item.path)">
					<image class="swiper-image " :src="item.image" mode="scaleToFill" lazy-load></image>
				</swiper-item>
			</swiper>
			<view class="banner-swiper-dots">
				<text :class="swiperCurrent === index ? 'banner-dot-active' : 'banner-dot'" v-for="(dot, index) in detail.list.length" :key="index"></text>
			</view>
		</view>
		<view class="gray32"></view>
		<view class="sign-up">
			<view class="remind">
				注：请各投标单位选择正确的项目类型进行报名。感谢配合！
			</view>
			<button class="cu-btn" @tap="chlickItem({url:'pages/crm/kehu/kehu'})" >项目报名</button>
		</view>
		<!-- <view class="tilte">投标数据</view>
		<view class="dateSelectRow">
			 <view>
				<text>开始日期: </text>
				<picker mode="date" :value="startDate" start="1999-02-15" end="2100-02-15" @change="bindsDateChange">
					<text class="dateText">{{startDate}}</text>
				</picker>
			</view>
			<view>
				<text>结束日期: </text>
				<picker mode="date" :value="endDate" start="1999-02-15" end="2100-02-15" @change="bindeDateChange">
					<text class="dateText">{{endDate}}</text>
				</picker>
			</view> 
		</view>-->
		<!-- <businessFunnel v-if="baoBiaoShow" :startDateTime="startDateTime" :endDateTime="endDateTime"
			 :depId="depId" :fuZeRenId="fuZeRenId"></businessFunnel>
		<view class="textCenter">暂无更多~</view> -->
		<!-- 登录提示 -->
		<app-login-modal></app-login-modal>
		<!--无网络提示-->
		<u-no-network></u-no-network>
	</view>
</template>

<script>
	let that;
	/* import businessFunnel from '@/components/dashBoard/businessFunnel/businessFunnel.vue'; */
	import {
		getDayByNumFun,
		getDayFun,
		getMonthFun
	} from '@/static/utils/date.js'
	import { mapMutations, mapActions, mapState } from 'vuex';
	export default {
		components: {
			/* businessFunnel, */
		},
		data() {
			return {
				background: {
					'background-image': 'linear-gradient(45deg, #007aff, #10a5e3)'
				},
				keyword: '',
				startDate: '',
				list: [{path: '',image: 'http://www.zhongyaodaili.com/UploadFiles/2021410114520218.png'}],
				endDate: '',
				startDateTime: 0,
				endDateTime: 0,
				depId: '',
				depName: '',
				qwDepName: '',
				department_id: '',
				fuZeRenId: '',
				fuZeRenName: '',
				bmSelectShow: false,
				qwBmSelectShow: false,
				userSelectShow: false,
				baoBiaoShow: true, //报表是否展示
				cardList: [{
						bgColor: 'linear-gradient(45deg, #007aff, #00aaff)',
						src: '/common/icon/client.png',
						name: '报名',
						url: 'pages/crm/kehu/kehu',
						menu_id: 'client'
					},
					/* {
						bgColor: 'linear-gradient(45deg, #62dbff, #ff5aaa)',
						src: '/common/icon/business.png',
						name: '保证金',
						url: 'pages/crm/shangji/shangji',
						menu_id: 'business'
					}, 
					{
						bgColor: 'linear-gradient(45deg, #55aaff, #62dbff)',
						src: '/common/icon/genjin.png',
						name: '公告',
						url: 'pages/crm/genJin/genJin',
						menu_id: 'followUp'
					},
					 {
						bgColor: 'linear-gradient(45deg, #00d6d6, #a0efef)',
						src: '/common/icon/baojiadan.png',
						name: '报价单',
						url: 'pages/crm/baoJiaDan/baoJiaDan',
						menu_id: 'quotation'
					}, 
					{
						bgColor: 'linear-gradient(45deg, #ffaa00, #ffaa7f)',
						src: '/common/icon/contract.png',
						name: '合同',
						url: 'pages/crm/hetong/hetong',
						menu_id: 'contract'
					}*/
				],
				xsUserList: [],
				swiperCurrent: 0, //轮播下标
				qwXsUserList: [],
				qwSelectUserList: [],
				xsUserIds: [],
				uids: [],
				userid: '',
				qwFuZeRenName: '',
				totalNum: 0,
				loadingNum: 0,
				qwConfigEnable: false
			}
		},
		onLoad() {
			that = this;
			let dArr = getMonthFun()
			dArr[1] -= 1;
			that.startDateTime = dArr[0];
			that.endDateTime = dArr[1];
			that.startDate = this.$u.timeFormat(dArr[0], 'yyyy-mm-dd');
			that.endDate = this.$u.timeFormat(dArr[1], 'yyyy-mm-dd');
			that.baoBiaoShow = true;
			
		},
		onShow() {
			that.totalNum = 0;
			that.loadingNum = 0;
			// if (uni.$qwUser && uni.$qwUser.userid) {
			if (that.qwConfigEnable) {
				that.getQywxBacklogFun();
			}
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo,
			}),
		},
		methods: {
			// 轮播切换
			swiperChange(e) {
				this.swiperCurrent = e.detail.current;
				/* this.initBgColor(); */
			},
			...mapActions(['getUserDetails']),
			// 初始化
			init() {
				return Promise.all([this.getUserDetails()])
					.then(() => {
						uni.stopPullDownRefresh();
					})
					.catch(() => {
						uni.stopPullDownRefresh();
					});
			},
			chlickItem(item){
				let that = this
				that.init();
				console.log(123)
				console.log(this.userInfo)
				/* if(that.userInfo.type != null && that.userInfo.type != '0'){ */
					that.jump(item.url)
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
			// 路由跳转
			jump(path, parmas) {
				this.$Router.push({
					path: path,
					query: parmas
				});
			},
			
			bindsDateChange: function(e) {
				let data = e.detail.value;
				that.startDate = data;
				that.startDateTime = new Date(data + ' 00:00:00').getTime()
			},
			bindeDateChange: function(e) {
				let data = e.detail.value;
				that.endDate = data;
				that.endDateTime = new Date(data + ' 23:59:59').getTime()
			},
			
			getQywxBacklogFun: function() {
				let userid = '';
				let uids = [];
				let qwUser = uni.getStorageSync('qwUser');
				if (!qwUser.isleader) {
					userid = qwUser.userid;
				} else {
					uids = uni.$qwXsUserIdList;
				}
				let dArr = getDayFun();
				let dArr1 = getDayByNumFun(-7);
				let dArr2 = getDayByNumFun(-30);
				let reqData = {
					action: 'getQywxBacklogNum',
					params: {
						userid: userid,
						uids: uids,
						sTime: dArr[0],
						eTime: dArr[1],
						sTime1: dArr1[1],
						eTime1: dArr1[0],
						sTime2: dArr2[1],
						eTime2: dArr2[0]
					}
				}
				uni.showLoading({
					title: '刷新中...',
					mask: true
				})
				baobiaoApi(reqData)
					.then(res => {
						that.loadingNum += 1;
						let obj = res.result;
						let total = obj.client + obj.business + obj.quotation + obj
							.contract + obj.hkjh +
							obj.hkd + obj.daoqiContract + obj.hkTixing;
						that.totalNum += total;
						that.total2 = total;
						if (that.totalNum > 0 && that.loadingNum == 2) {
							if (that.totalNum > 99) {
								that.totalNum = '99+'
							}
							uni.setTabBarBadge({
								index: 1,
								text: that.totalNum + ''
							})
						} else {
							uni.hideTabBarRedDot({
								index: 1
							})
						}
					})
			},
		}
	}
</script>
<style  lang="scss">
	// 轮播
	.banner-swiper-box {
		background: #fff;
	}
	
	.sign-up{
		width: 100%;
		height: 600rpx;
		line-height: 500rpx;
		text-align: center;
		.remind{
			text-align: center;
			line-height: 60rpx;
			font-size: 24rpx;
			color: 	#CD5C5C;
			text-shadow:2rpx 3rpx 1rpx pink;
		}
		button{
			height: 200rpx;
			width: 200rpx;
			color: white;
			font-size: 34rpx;
			background: linear-gradient(90deg, rgba(72,118,225, 1), rgba(68, 118, 255, 1), rgba(58,100,205, 1));
			border-radius: 50%;
			box-shadow: 1px 1px #C0C4CC;
		}
	}
	.banner-swiper-box,
	.banner-carousel {
		width: 750rpx;
		height: 350rpx;
		position: relative;
	
		.carousel-item {
			width: 100%;
			height: 100%;
			// padding: 0 28upx;
			overflow: hidden;
		}
	
		.swiper-image {
			width: 100%;
			height: 100%;
			// border-radius: 10upx;
			// background: #ccc;
		}
	}
	
	.banner-swiper-dots {
		display: flex;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 20rpx;
		z-index: 66;
	
		.banner-dot {
			width: 14rpx;
			height: 14rpx;
			background: rgba(255, 255, 255, 1);
			border-radius: 50%;
			margin-right: 10rpx;
		}
	
		.banner-dot-active {
			width: 14rpx;
			height: 14rpx;
			background: #a8700d;
			border-radius: 50%;
			margin-right: 10rpx;
		}
	}
</style>
<style>
	
	.slot-wrap-left {
		height: 50px;
		line-height: 50px;
		padding: 0 26rpx;
		color: #FFFFFF;
		font-size: 18px;
		display: flex;
		align-items: center;
	}

	.slot-wrap-left>view {
		padding: 0 6rpx;
		margin-right: 26rpx;
		position: relative;
	}

	.activeTab {
		border-bottom: 3px solid #FFFFFF;
		font-weight: bold;
		font-size: 20px
	}

	.content {
		height: auto;
		background: #FFFFFF;
		/* padding-bottom: 60rpx; */
	}

	.search-wrap {
		margin: 0 20rpx;
		flex: 1;
	}

	.navbar-right {
		margin-right: 24rpx;
		display: flex;
	}

	.swiperIndex {
		height: calc(100% - 50px);
	}

	.scroll-swiper {
		padding-bottom: 60rpx;
		height: 100%;
	}

	.scroll-collapes {
		background-color: #f5f5f5;
		padding: 0 26rpx;
		box-sizing: border-box;
	}

	.swiper-item {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 26rpx 26rpx 0;
	}

	.kongKimCard {
		width: 120rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 26rpx;
	}

	.kongKimCard>view:first-child {
		width: 100rpx;
		height: 100rpx;
		border-radius: 20rpx;
	}

	.kongKimCard>view:first-child>image {
		width: 64rpx;
		height: 64rpx;
		margin: 18rpx;
	}

	.kongKimCard>view:last-child {
		text-align: center;
		font-size: 13px;
		font-weight: bold;
		margin-top: 8rpx;
	}

	.shoufengqin {
		width: 100%;
		padding: 0 26rpx;
		display: flex;
		align-items: center;
		box-sizing: border-box;
	}

	.shoufengqinIcon {
		width: 56rpx;
		height: 56rpx;
	}

	.tilte {
		font-size: 32rpx;
		font-weight: bold;
		margin: 32rpx 0 0 32rpx;
	}

	.dbCard {
		width: 686rpx;
		margin: 26rpx 32rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 26rpx 16rpx;
		border: 1rpx solid #DDDDDD;
		border-radius: 26rpx;
	}

	.dbCard:active {
		background-color: #DDDDDD;
	}

	.dbCard image {
		width: 50rpx;
		height: 50rpx;
	}

	.dbCard>view {
		display: flex;
		align-items: center;
	}

	.dbCard>view>text {
		margin: 0 16rpx;
	}

	.dbNum {
		font-size: 15px;
		color: #007AFF;
	}

	.depUserSelect {
		margin: 0 32rpx;
		font-size: 15px;
		padding: 26rpx 0 16rpx;
	}

	.dateSelectRow {
		margin: 0 32rpx;
		font-size: 15px;
		display: flex;
		justify-content: space-between;
	}

	.dateSelectRow>view {
		display: flex;
		align-items: center;
		padding: 26rpx 0 16rpx;
	}

	.dateText {
		font-weight: bold;
		padding-left: 10rpx;
	}
</style>
