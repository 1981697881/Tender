<script>
import Vue from 'vue';
import { mapMutations, mapActions, mapState } from 'vuex';
import Wechat from './common/wechat/wechat';
import store from '@/common/store';
export default {
	methods: {
		//应用初始化,获取模板,获取页面路由,获取用户信息,保存用户Token并返回初始进入页面
		...mapActions(['getAppInit', 'getTemplate', 'getRoutes', 'getUserDetails', 'setTokenAndBack']),
		// 获取系统栏高度
		async setAppInfo() {
			let that = this;
			let platform = '';
			return new Promise((resolve, reject) => {
				uni.getSystemInfo({
					success: function(e) {
						Vue.prototype.StatusBar = e.statusBarHeight;
						// #ifdef H5
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
						if (that.$wxsdk.isWechat()) {
							platform = 'wxOfficialAccount';
						} else {
							platform = 'H5';
						}
						// #endif
						// #ifdef APP-PLUS
						platform = 'App';
						if (e.platform == 'android') {
							uni.setStorageSync('isAndroid', true);
							Vue.prototype.CustomBar = e.statusBarHeight + 50;
						} else {
							Vue.prototype.CustomBar = e.statusBarHeight + 45;
							uni.setStorageSync('isAndroid', false);
						}
						// #endif
						// #ifdef MP-WEIXIN
						platform = 'wxMiniProgram';
						 new Wechat().getWxMiniProgramSessionKey();
						let custom = wx.getMenuButtonBoundingClientRect();
						Vue.prototype.Custom = custom;
						Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
						// #endif
						uni.setStorageSync('platform', platform);
						resolve(platform);
					}
				});
			});
		},
		// 自动登录
		async autoLogin(data) {
			let initData = data;
			var wechat = new Wechat();
			console.log(uni.getStorageSync('token'))
			if (!uni.getStorageSync('token')) {
				// #ifdef MP-WEIXIN
				await wechat.login();
				// #endif
				this.getUserDetails();
			}
		}
	},
	onLaunch: async function(options) {
		let that = this;
		if (options.query.mode === 'save') {
			//截图模式
			uni.setStorageSync('screenShot', true);
			uni.setStorageSync('shop_id', options.query.shop_id);
		}
		// #ifdef MP-WEIXIN
		if (options.scene !== 1154) {
			var wechat = new Wechat();
			wechat.checkMiniProgramUpdate();
		}
		// #endif
		await this.setAppInfo();
		try {
			/* await this.getTemplate(options);
			let init = await this.getAppInit(options); */
			await this.autoLogin();
			if (process.env.NODE_ENV === 'development') {
				await this.getRoutes();
			}
		} catch (e) {
			console.log(e);
		}
	},
	onShow: function() {
		this.$store.commit('CART_NUM');
	},
	onHide: function() {}
};
</script>

<style lang="scss">
@import 'static/colorui/main.css';
@import 'static/colorui/icon.css';
// 其他scss集成在uni.scss,(变量,class,minix)

uni-radio:not([disabled]) .uni-radio-input:hover,
uni-checkbox:not([disabled]) .uni-checkbox-input:hover {
	border-color: #ccc !important;
}

page {
	-webkit-overflow-scrolling: touch; //ios滑动不流畅
	height: 100%;
	background: #f6f6f6;
	width: 100%;
	font-size: 30upx;
	font-family: NotoSansHans-Bold;
	word-break: break-all; //英文文本不换行
	color: #333;
}
::-webkit-scrollbar {
	width: 0;
	height: 0;
	color: transparent;
	display: none;
}

uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked{
	background-color: #007aff;
}

/* .primary{
	color: $u-type-primary;
} */

.text-align{
	&-left{
		text-align: left;
	}
	&-right{
		text-align: right;
	}
}

.a-cell {
	&-title {
		display: flex;
		justify-items: center;
		// 小程序上没有垂直居中，需要加这个
		align-items: center;
		&-left {
			margin-right: 30rpx;
			&::after {
				content: '*';
				color: #ff0000;
				position: relative;
				left: 4rpx;
				visibility: hidden;
			}
			&.required::after {
				visibility: visible;
			}
		}

		&-right {
			flex: 1;

			&.to-right {
				text-align: right;
				text-overflow: ellipsis;
				/* 超出部分省略号 */
				overflow: hidden;
				word-break: break-all;
				/* break-all(允许在单词内换行。) */
				display: -webkit-box;
				/** 对象作为伸缩盒子模型显示 **/
				-webkit-box-orient: vertical;
				/** 设置或检索伸缩盒对象的子元素的排列方式 **/
				-webkit-line-clamp: 1;
				/** 显示的行数 **/
			}
		}
	}

	&-bd {
		margin-top: 10rpx;

		
	}
}
// 提示文字
		.placeholder {
			font-size: 24rpx;
			color: #d1d1d1;
		}
.a-cell-box {
	margin-bottom: 20rpx;
	background-color: #ffffff;
	position: relative;
	width: 100%;
	display: flex;
	flex-direction: column;
	padding: 20rpx 30rpx;

	// 下边框 -- 参考uni-app项目演示
	&:after {
		position: absolute;
		z-index: 10;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		background-color: #c8c7cc;
	}

	// 上边框
	&::before {
		position: absolute;
		z-index: 10;
		right: 0;
		top: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		background-color: #c8c7cc;
	}
}
// 小程序下这个字体修改不能，强制跟随父样式
.uni-steps__column-title{
	font-size: inherit !important;
}

// 微信小程序编译uni-button后的样式会丢失，这里要用button
button{
	font-size: inherit !important;
}
</style>
<style lang="scss">
	@import "uview-ui/index.scss";
	.slot-wrap {
		display: flex;
		align-items: center;
		flex: 1;
		padding: 0 16rpx;
	}

	.right-item {
		margin: 0 12rpx;
		position: absolute;
		right: 18rpx;
		color: #ffffff;
		display: flex;
	}

	.textCenter {
		width: 100%;
		text-align: center;
		font-size: 15px;
		color: #808080;
		margin-top: 88rpx;
	}

	.h200 {
		height: 200px;
	}

	.h100 {
		height: 100px;
	}

	.mt32 {
		margin-top: 32rpx;
	}

	.bgWhite {
		background-color: #FFFFFF;
	}

	.p26 {
		padding: 26rpx !important;
	}

	.ptb20 {
		padding-top: 20rpx;
		padding-bottom: 20rpx;
	}

	.ptb10 {
		padding-top: 10rpx;
		padding-bottom: 10rpx;
	}

	.plr0 {
		padding-left: 0 !important;
		padding-right: 0 !important;
	}

	.flex-white-plr26 {
		background-color: #FFFFFF;
		padding-left: 26rpx;
		padding-right: 26rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 15px;
	}

	.flex-white-plr26-column {
		background-color: #FFFFFF;
		padding-left: 26rpx;
		padding-right: 26rpx;
		display: flex;
		flex-direction: column;
		font-size: 15px;
	}

	.bdb_f5 {
		border-bottom: 1rpx solid #f5f5f5;
	}

	.mr16 {
		margin-right: 16rpx;
	}

	.mr26 {
		margin-right: 26rpx;
	}

	.mlr26 {
		margin: 0 26rpx;
	}

	.mtb32 {
		margin: 32rpx 0;
	}

	.mr32 {
		margin-right: 32rpx;
	}

	.ml26 {
		margin-left: 26rpx;
	}

	.mb0 {
		margin-bottom: 0 !important;
	}

	.pb0 {
		padding-bottom: 0 !important;
	}
	.redXingh {
		color: #FF0000;
		font-size: 18px;
	}

	.udropdown {
		background-color: #FFFFFF;
		position: fixed !important;
		top: 44px;
		left: 0;
		// z-index: 666;
	}

	.width276 {
		width: 546rpx;
		color: #c5c5c5;
		font-size: 14px;
	}

	.cBlack {
		color: #c5c5c5;
	}

	.btName {
		margin-bottom: -10rpx;
		margin-top: 16rpx;
		padding-left: 26rpx;
		font-size: 30rpx;
		color: #555555;
		font-weight: bold;
	}

	.width242 {
		width: 484rpx;
		color: #c5c5c5;
		font-size: 14px;
	}

	.myCard {
		width: 698rpx;
		padding: 26rpx 26rpx 10rpx;
		margin: 32rpx 26rpx;
		box-sizing: border-box;
		border-radius: 16rpx;
		box-shadow: #d8d8d8 0px 0px 16rpx;
		position: relative;
		background-color: #FFFFFF;
	}

	.cardRow {
		display: flex;
		align-items: center;
		font-size: 16px;
		margin-bottom: 8rpx;
	}

	.cardRow>view:first-child {
		width: 176rpx;
		color: #ADADAD;
	}

	.cardRow>view:last-child {
		width: 466rpx;
		color: #000000;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.cardTopName {
		font-size: 16px;
		margin-bottom: 8rpx;
		color: #000000;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: bold;
		border-bottom: 1rpx solid #DDDDDD;
		padding-bottom: 8rpx;
	}

	.submitView {
		width: 100%;
		padding: 16rpx 0 26rpx;
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0;
		left: 0;
		border-top: 1rpx solid #f1f1f1;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}

	.submitBtn {
		width: 666rpx;
	}

	.lookDetail {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 15px;
		color: #007AFF;
		margin-top: 12rpx;
		margin-bottom: 16rpx;
	}

	.lookDetail>text {
		margin-right: 6rpx;
	}

	.fzrAbsolute {
		position: absolute;
		right: 26rpx;
		bottom: 80rpx;
		font-size: 15px;
	}

	.fzrLeft {
		color: #ADADAD;
	}

	.fzrRight {
		font-weight: bold;
		color: #ff941a;
	}

	.statesRight {
		position: absolute;
		top: 26rpx;
		right: 16rpx;
		color: #19BE6B;
		font-weight: bold;
	}

	.blackColor {
		color: #333333;
	}

	.liangHang {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.yellowColor {
		color: #ffaa00 !important;
		font-weight: bold;
	}

	.greenColor {
		color: #3bb607 !important;
		font-weight: bold;
	}

	.redColor {
		color: #ff0000 !important;
		font-weight: bold;
	}

	.blueColor {
		color: #007AFF;
	}

	.colorGray {
		color: #888888;
	}

	.disFlexJ {
		display: flex;
		justify-content: space-between;
	}

	.width686 {
		width: 686rpx;
		margin: 32rpx;
	}

	.mt26Bt {
		border-top: 26rpx solid #EEEEEE;
	}

	.bgeee {
		background-color: #EEEEEE;
		margin: 0;
		padding: 16rpx 26rpx;
	}

	.gray32 {
		width: 100%;
		height: 32rpx;
		background-color: #EEEEEE;
	}
	.disabledStyle {
		background-color: #efefef !important;
	}
</style>
