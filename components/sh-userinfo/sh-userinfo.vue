<template>
	<view>
		<view class="sh-userinfo-box">
			<view class="user-bg"></view>
			<view class="head-wrap">
				<view class="titleNav pad">
					<view class="status-bar"></view>
					<text class="nav-title x-f"><!-- <text @tap="onService" class="cuIcon-servicefill"></text> --></text>
				</view>
				<view class="user-head x-bc">
					<view class="x-f">
						<!-- 微信小程序 -->
						<view class="info-box">
							<view class="x-f">
								<view class="head-img-wrap">
									<image
										class="head-img"
										@tap.stop="jump('/pages/mine/info')"
										:src="userInfo.avatarUrl || '/static/imgs/base_avatar.png'"
										mode="aspectFill"
									></image>
									<block v-if="platform !== 'H5'">
										<button v-if="platform === 'wxMiniProgram'" @click="refreshWechatUser" class="cu-btn refresh-btn x-c">
											<text class="cuIcon-refresh" :class="{ 'refresh-rotate': isRefresh }"></text>
										</button>
										<button v-if="platform === 'wxOfficialAccount'" @tap="refreshWechatUser" class="cu-btn refresh-btn x-c">
											<text class="cuIcon-refresh" :class="{ 'refresh-rotate': isRefresh }"></text>
										</button>
									</block>
								</view>
								<text @tap.stop="jump('/pages/mine/info')" class="user-name one-t">{{ userInfo.username || '请登录~' }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 绑定手机 -->
		<view class="notice-box x-bc pad" v-if="!userInfo.phoneNumber && userInfo.username">
			<view class="notice-detail one-t">点击绑定手机号，确保账户安全</view>
			<button class="bindPhone cu-btn" open-type="getPhoneNumber" @getphonenumber="bindPhone">去绑定</button>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {},
	data() {
		return {
			platform: uni.getStorageSync('platform'), //当前平台。
			isRefresh: false //更新
		};
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo,
			balInfo: state => state.user.balInfo
		})
	},
	props: {
		detail: {
			type: Object,
			default: null
		}
	},
	methods: {
		...mapActions(['getUserDetails']),
		jump(path, query) {
			this.$Router.push({
				path: path,
				query: query
			});
		},
		// 跳转门店
		goStore() {
			if (this.userInfo.store_id) {
				uni.setStorageSync('storeId', this.userInfo.store_id);
				this.jump('/pages/app/merchant/index', { storeId: this.userInfo.store_id });
			} else {
				if (uni.getStorageSync('storeId')) {
					this.jump('/pages/app/merchant/index');
				} else {
					this.jump('/pages/app/merchant/list');
				}
			}
			//  #ifdef MP-WEIXIN
			this.$store.dispatch('getMessageIds', 'store');
			//  #endif
		},
		// 跳转客服
		onService() {
			this.$Router.push('/pages/public/kefu/index');
		},
		// 更新信息
		onRefresh() {
			const that = this;
			that.isRefresh = true;
			setTimeout(() => {
				that.isRefresh = false;
			}, 200);
		},
		refreshWechatUser(e) {
			const that = this;
			this.onRefresh();
			if (this.platform === 'wxOfficialAccount') {
				let wechat = new Wechat();
				wechat.login();
			} else if (this.platform === 'wxMiniProgram') {
				uni.getUserProfile({
					desc: 'Wexin', // 这个参数是必须的
					success: res => {
						that.$store.commit('FORCE_OAUTH', true);
					},fail: (err) => {
						    // 获取失败，可能用户拒绝授权，尝试引导用户到设置页面
						    if (err.errMsg.indexOf('user deny') > -1) {
						      uni.showModal({
						        title: '提示',
						        content: '需要获取您的信息，请确认授权',
						        success: (modalRes) => {
						          if (modalRes.confirm) {
						            // 引导用户到设置页面
						            uni.openSetting();
						          }
						        }
						      });
						    }
						  }
				});
			}
		},
		bindPhone(e) {
			console.log(e);
			let me = this;
			me.$api('user.getWxMiniPhoneNumber', {
				sessionKey: uni.getStorageSync('session_key'),
				openid: uni.getStorageSync('openid'),
				encryptedData: e.detail.encryptedData,
				iv: e.detail.iv
			}).then(res => {
				if (res.flag) {
					me.getUserDetails();
					/* me.jump('/pages/user/edit-phone', { fromType: 'bind',phone:res.data }) */
				}
			});
		}
	}
};
</script>

<style lang="scss">
.sh-userinfo-box {
	position: relative;
	height: 250rpx;
	.user-bg {
		width: 100%;
		background: linear-gradient(90deg, rgba(72,118,225, 1), rgba(68, 118, 255, 1), rgba(58,100,205, 1));
		height: 250rpx;
	}
	.head-wrap {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		z-index: 9;
		top: 0;

		.nav-title {
			font-size: 38rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #fff;
			position: relative;
			.cuIcon-servicefill {
				position: absolute;
				z-index: 7;
				color: #fff;
				top: 0rpx;
				right: 30rpx;
				font-size: 50rpx;
			}
		}
		.status-bar {
			// #ifndef H5
			height: var(--status-bar-height);
			// #endif
			// #ifdef H5
			height: 50rpx;
			// #endif
			width: 750rpx;
		}
	}

	.user-head {
		padding-top: 50rpx;
		.info-box {
			padding-left: 30rpx;
			.head-img-wrap {
				position: relative;
				.refresh-btn {
					position: absolute;
					padding: 0;
					background: none;
					width: 34rpx;
					height: 34rpx;
					border-radius: 50%;
					background: #c9912c;
					top: 0;
					right: 20rpx;
					.cuIcon-refresh {
						color: #fff;
						font-size: 24rpx;
					}
					.refresh-rotate {
						transform: rotate(360deg);
						transition: all 0.2s;
					}
				}
			}
			.head-img {
				width: 94rpx;
				height: 94rpx;
				border-radius: 50%;
				background: #ccc;
				margin-right: 25rpx;
				overflow: hidden;
			}

			.user-name {
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #fff;
				line-height: 30rpx;
				width: 130rpx;
			}
		}
		.tag-box {
			background: rgba(0, 0, 0, 0.2);
			border-radius: 21rpx;
			line-height: 38rpx;
			padding-right: 10rpx;
			margin-left: 10rpx;
			.cuIcon-refresh {
				color: #fff;
				margin: 0 10rpx;
			}
			.tag-img {
				width: 40rpx;
				height: 40rpx;
				margin-right: 6rpx;
				border-radius: 50%;
			}

			.tag-title {
				font-size: 20rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
				line-height: 20rpx;
			}
		}
		.code-btn {
			background: none;
			.cuIcon-qr_code {
				font-size: 50rpx;
				color: #fff;
			}
		}
		.merchant-btn {
			padding: 0;
			width: 136rpx;
			height: 46rpx;
			background: rgba(255, 255, 255, 1);
			border-radius: 23rpx 0px 0px 23rpx;
			font-size: 20rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(168, 112, 13, 1);
		}
	}
	.wallet {
		font-size: 20rpx;
		padding-left: 140rpx;
		.money {
			margin-right: 40rpx;
		}
	}
}
// 绑定微信公众号
.notice-box {
	width: 750rpx;
	height: 70rpx;
	background: rgba(253, 239, 216, 1);
	padding: 0 35rpx;

	.notice-detail {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(204, 149, 59, 1);
	}

	.bindPhone {
		width: 135rpx;
		height: 52rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		border-radius: 26rpx;
		padding: 0;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}
}
</style>
