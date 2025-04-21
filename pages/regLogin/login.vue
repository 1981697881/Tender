<!-- 蓝色简洁登录页面 -->
<template>
	<view class="t-login">
		<!-- 页面装饰图片 -->
		<image class="img-a" src="@/common/login/2.png"></image>
		<image class="img-b" src="@/common/login/3.png"></image>
		<!-- 标题 -->
		<view class="t-b">{{ title }}</view>
		<view v-if="current == 0" class="cl" style="margin-top: 40rpx;">
			<view class="t-a">
				<image src="@/common/login/sj.png"></image>
				<input name="username" placeholder="请输入账号/手机号" maxlength="11" v-model="username" />
				<u-icon v-if="username" @click="username = ''" class="uIconR" name="close-circle-fill" color="#8a8a8a"
					size="40"></u-icon>
			</view>
			<view v-if="isMmLogin" class="t-a">
				<image src="@/common/login/yz.png"></image>
				<input type="number" name="yzm" maxlength="6" placeholder="请输入验证码" v-model="yzm" />
				<!-- <view >发送短信</view> -->
				<u-button v-if="showText" class="t-c" @tap="getCode()" :ripple="true" ripple-bg-color="#909399">发送短信
				</u-button>
				<view v-else class="t-c" style="background-color: #A7A7A7;">重新发送({{ second }})</view>
			</view>
			<view v-else class="t-a">
				<image src="@/common/login/mm.png"></image>
				<input name="password" :password="isShowP" placeholder="请输入密码" v-model="password" />
				<view v-if="password">
					<u-icon v-if="isShowP" @click="isShowP = false" class="uIconR" name="eye-fill" color="#8a8a8a"
						size="40"></u-icon>
					<u-icon v-else class="uIconR" @click="isShowP = true" name="eye-off" color="#8a8a8a" size="40">
					</u-icon>
				</view>
			</view>
			<u-button class="loginBtn" type="primary" ripple-bg-color="#909399" @click="loginBtn">登 录</u-button>
		</view>
		<view v-else style="margin-top: 40rpx;">
			<!-- <u-button shape="circle" :ripple="true" @click="gotoZcFun(0)">加入已有企业</u-button> -->
			<view style="margin-top: 50rpx;">
				<u-button shape="circle" @click="gotoZcFun(1)">企业用户注册</u-button>
			</view>
			<view style="margin-top: 50rpx;">
				<u-button shape="circle" @click="gotoZcFun(2)">个人用户注册</u-button>
			</view>
		</view>
		<!-- <view v-if="current == 0" class="spaceRow">
			<text @click="gotoZcFun(3)">忘记密码</text>
			<text v-if="!isMmLogin && !yjLoginOk" @click="isMmLogin = true">验证码登录</text>
			<text v-else-if="!isMmLogin && yjLoginOk" @click="yiJianLoginFun">一键登录</text>
			<text v-else @click="isMmLogin = false">密码登录</text>
		</view> -->
		<!-- <button type="default" open-type="getUserInfo" @getuserinfo="getuserinfoFun">微信登录</button> -->
	</view>
</template>
<script>
	let that = ''
	import { mapMutations, mapActions, mapState } from 'vuex';
	export default {
		data() {
			return {
				title: '中曜招标', 
				second: 60, //默认60秒
				showText: true, //判断短信是否发送
				username: '', //手机号码
				codeMobile: '', // 发送验证码的手机号
				password: '', // 密码
				yzm: '', //验证码
				isMmLogin: false,
				isShowP: true,
				tabList: [{
					name: '登录'
				}, {
					name: '注册'
				}],
				current: 0,
				yjLoginOk: uni.yjLoginOk,
				qwConfig: {}
			};
		},
		onLoad() {
			that = this;
			let search = '';
			// #ifdef H5
			search = window.location.href;
			// #endif
			/* if(search && search.indexOf("?code") != -1) {
				search = search.split("?code=")[1];
				search = search.split("&")[0];
				that.getAccess_tokenFun(search);
			} else {
				let env = envjudge();
				that.getQywxConfigFun();
				if(env == 'com-wx-mobile') {
					that.qywxLoginNavigateFun();
				}
			} */
		},
		methods: {
			...mapActions(['setTokenAndBack']),
			tabChange: function(index) {
				this.current = index
			},
			//当前登录按钮操作
			loginBtn() {
				if (!that.username) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					});
					return;
				}
				if (!that.username) {
					uni.showToast({
						title: '请输入账号',
						icon: 'none'
					});
					return;
				}
				if (!that.isMmLogin) {
					if (that.password == '') {
						uni.showToast({
							title: '请输入登录密码',
							icon: 'none'
						});
						return;
					}
					that.loginFun()
				} else {
					if (that.yzm == '' || that.yzm.length < 6) {
						uni.showToast({
							title: '请输入6位数验证码!',
							icon: 'none'
						});
						return;
					}
					if (that.codeMobile != that.username) {
						uni.showModal({
							title: '提示',
							content: '当前手机号与接收验证码的手机号不一致，请检查！',
							showCancel: false
						})
						return
					} else {
						that.loginBySmsFun();
						// that.verifyCodeFun();
					}
				}
			},
			// 云函数账号密码登录
			loginFun: function() {
				let that = this;
				uni.showLoading({
					title: '登录中...'
				})
				let reqData = {
					action: 'login',
					params: {
						username: that.username,
						password: that.password,
						needPermission: true
					}
				}
				that.$api('user.login', {
					username: that.username,
					password: that.password,
				}).then(res => {
					if (res.flag) {
						uni.hideLoading();
						uni.showToast({
							title: '登录成功!',
							icon: 'none',
							duration: 1688,
						})
						that.setTokenAndBack(res.data);
						console.log(uni.getStorageSync('token'))
						that.$Router.replace({
							path: '/pages/index/index',
							query: {}
						});
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 1688,
						})
						uni.hideLoading();
					}
				});
				/* crmMyAppUserApi(reqData)
					.then(res => {
						uni.setStorageSync('uni_id_token', res.result.token)
						uni.setStorageSync('uni_id_token_expired', res.result.tokenExpired)
						uni.$userInfo = res.result.userInfo;
						uni.setStorageSync('userInfo', res.result.userInfo);
						let qwUser = res.result.userInfo.qwUser;
						if(qwUser && qwUser._id) {
							uni.setStorageSync('qwUser', qwUser);
						}
						uni.showToast({
							title: '登录成功!',
							icon: 'none',
							duration: 1688,
						})
						if(uni.$userInfo && uni.$userInfo._id) {
							crmMyAppUserApi({
								action: 'getCurrentUserInfo'
							})
							.then(n => {
								uni.$userRoles = n.result.navMenu;
							})
						}
						setTimeout(() => {
							uni.reLaunch({
								url: '../index/index'
							})
						}, 888)
					}) */
			},
			//获取短信验证码btn
			getCode() {
				if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(that.username)) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					});
					return
				}
				var interval = setInterval(() => {
					that.showText = false;
					var times = that.second - 1;
					//that.second = times<10?'0'+times:times ;//小于10秒补 0
					that.second = times;
				}, 1000);
				setTimeout(() => {
					clearInterval(interval);
					that.second = 60;
					that.showText = true;
				}, 60000);
				//这里请求后台获取短信验证码
				that.sendSmsCodeFun();
			},
			// 发送验证码
			sendSmsCodeFun: function() {
				uni.showLoading({
					title: '发送中...'
				})
				let reqData = {
					action: 'sendSmsCode',
					params: {
						mobile: that.username,
						type: 'login'
					}
				};
				crmMyAppUserApi(reqData)
					.then(res => {
						that.codeMobile = that.username;
						uni.showToast({
							title: '发送成功，请注意查收!',
							icon: 'none'
						})
					})
			},
			// 校验验证码
			verifyCodeFun: function() {
				uni.showLoading({
					title: '正在登录...'
				})
				let reqData = {
					action: 'verifyCode',
					params: {
						mobile: that.username,
						code: that.yzm,
						type: 'login'
					}
				};
				crmMyAppUserApi(reqData)
					.then(res => {

					})
			},
			//验证码登录
			loginBySmsFun: function() {
				uni.showLoading({
					title: '登录中...'
				})
				let reqData = {
					action: 'loginBySms',
					params: {
						mobile: that.username,
						code: that.yzm
					}
				};
				crmMyAppUserApi(reqData)
					.then(res => {
						uni.setStorageSync('uni_id_token', res.result.token)
						uni.setStorageSync('uni_id_token_expired', res.result.tokenExpired)
					})
			},
			gotoZcFun: function(i) {
				uni.navigateTo({
					url: 'reg?index=' + i
				})
			},
			yiJianLoginFun: function() {
				uni.login({
					provider: 'univerify',
					univerifyStyle: {
						fullScreen: true
					},
					success: (res) => {
						console.log(res)
						uni.closeAuthView();
						uni.showLoading({
							title: '登录中...'
						})
						let reqData = {
							action: 'loginByUniverify',
							params: res.authResult
						};
						crmMyAppUserApi(reqData)
							.then(res => {
								const username = e.result.username || e.result
									.mobile ||
									'一键登录新用户'

								uni.setStorageSync('uni_id_token', e.result.token)
								uni.setStorageSync('username', username)
								uni.setStorageSync('login_type', 'online')
							})
					},
					fail: (err) => {
						uni.closeAuthView();
					}
				})
			},
			getuserinfoFun: function(t) {
				console.log(t)
				uni.showLoading({
					title: '登录中...'
				})
				let that = this;
				var user = t.detail.userInfo;
				if (user) {
					uni.getSetting({ // 确认是否授权成功
						success(res) {
							if (res.authSetting["scope.userInfo"]) {
								uni.login({ // 获取登录code
									success(obj) {
										console.log(obj)
										user.code = obj.code;
										// that.XCXUserLogin(user);
									}
								})
							} else {
								uni.hideLoading();
								uni.showToast({
									title: '授权失败',
									duration: 1500,
									icon: 0
								})
							}
						}
					});
				} else {
					uni.hideLoading();
					uni.showToast({
						title: '授权失败',
						duration: 1500,
						icon: 'none'
					})
				}
			},
			// 获取企业微信access_token
			getAccess_tokenFun: function(code) {
				if(code) {
					uni.showLoading({
						title: '授权中...',
						mask: true
					})
				} else {
					uni.showLoading({
						title: '加载中...',
						mask: true
					})
				}
				let reqData = {
					action: 'getAccess_token'
				}
				qywxBasicsApi(reqData)
				.then(res => {
					uni.hideLoading();
					let data = res.result.data;
					if(data.errcode == 0) {
						uni.setStorageSync('qywx_token', data.access_token);
						if(code) {
							that.qywxLoginFun(code, data.access_token);
						}
					} else {
						uni.showModal({
							title: '提示',
							content: data.errmsg,
							showCancel: false
						})
					}
				})
			},
			// 企业微信-获取访问用户身份
			qywxLoginFun: function(code, access_token) {
				uni.showLoading({
					title: '登录中...',
					mask: true
				})
				let reqData = {
					action: 'getQywxUserInfo',
					params: {
						code,
						access_token,
						needPermission: true
					}
				}
				qywxBasicsApi(reqData)
				.then(res => {
					uni.setStorageSync('uni_id_token', res.result.token)
					uni.setStorageSync('uni_id_token_expired', res.result.tokenExpired)
					uni.$userInfo = res.result.userInfo;
					uni.setStorageSync('userInfo', res.result.userInfo);
					let qwUser = res.result.userInfo.qwUser;
					if(qwUser && qwUser._id) {
						uni.setStorageSync('qwUser', qwUser);
						qywxAddressBookApi({action: 'syncQywxAddressBook'})
						let reqData = {
							action: 'syncQywxClientList',
							params: {
								data: {
									limit: 100,
									userid_list: []
								}
							}
						}
						qywxClientApi(reqData)
					}
					uni.showToast({
						title: '登录成功!',
						icon: 'none',
						duration: 1688,
					})
					if(uni.$userInfo && uni.$userInfo._id) {
						crmMyAppUserApi({
							action: 'getCurrentUserInfo'
						})
						.then(n => {
							uni.$userRoles = n.result.navMenu;
						})
					}
					setTimeout(() => {
						uni.reLaunch({
							url: '../index/index'
						})
					}, 888)
				})
			},
			// 获取企业微信配置
			getQywxConfigFun: function() {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				qywxBasicsApi({
					action: 'getQywxConfig'
				})
				.then(res => {
					let data = res.result.data || [];
					console.log(data)
					if(data && data.length > 0) {
						that.qwConfig = data[0];
						uni.setStorageSync('qwConfigEnable', that.qwConfig.enable || false)
						if(that.qwConfig.enable) {
							that.getAccess_tokenFun();
						}
					}
				})
			},
			// 企业微信登录跳转
			qywxLoginNavigateFun: function() {
				uni.showLoading({
					title: '授权中...',
					mask: true
				})
				qywxBasicsApi({
					action: 'getQywxConfig'
				})
				.then(res => {
					let data = res.result.data || [];
					if(data && data.length > 0) {
						that.qwConfig = data[0];
						let urlPage = '/crmH5#/pages/regLogin/login';
						let obj = that.qwConfig;
						let REDIRECT_URI = encodeURIComponent(obj.redirect_uri + urlPage);
						let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${obj.appid}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=snsapi_userinfo&state=qywxUrl&connect_redirect=1#wechat_redirect`;
						window.location.replace(url)
					}
				})
			}
		}
	};
</script>
<style>
	.img-a {
		position: absolute;
		width: 100%;
		top: -280rpx;
		right: -100rpx;
	}

	.img-b {
		position: absolute;
		width: 50%;
		bottom: 0;
		left: -50rpx;
		margin-bottom: -200rpx;
	}

	.t-login {
		width: 600rpx;
		margin: 0 auto;
		font-size: 28rpx;
		color: #000;
	}

	.t-login .loginBtn {
		font-size: 30rpx;
		font-weight: bold;
		background-image: linear-gradient(45deg, #007aff, #019eff);
		color: #fff;
		height: 90rpx;
		line-height: 90rpx;
		/* border-radius: 50rpx; */
		box-shadow: 0 5px 7px 0 rgba(86, 119, 252, 0.2);
	}

	.t-login input {
		padding: 0 120rpx 0 120rpx;
		height: 90rpx;
		line-height: 90rpx;
		margin-bottom: 50rpx;
		background: #f8f7fc;
		border: 1px solid #e9e9e9;
		font-size: 32rpx;
		border-radius: 50rpx;
	}

	.t-login .t-a {
		position: relative;
	}

	.t-login .t-a image {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		left: 40rpx;
		top: 28rpx;
		border-right: 2rpx solid #dedede;
		padding-right: 20rpx;
	}

	.t-login .t-b {
		text-align: left;
		font-size: 46rpx;
		color: #000;
		padding: 200rpx 0 60rpx 0;
		font-weight: bold;
	}

	.t-login .t-c {
		position: absolute;
		right: 22rpx;
		top: 22rpx;
		background: #5677fc;
		color: #fff;
		font-size: 24rpx;
		border-radius: 50rpx;
		height: 50rpx;
		line-height: 50rpx;
		padding: 0 25rpx;
	}

	.t-login .t-d {
		text-align: center;
		color: #999;
		margin: 80rpx 0;
	}

	.t-login .t-e {
		text-align: center;
		width: 250rpx;
		margin: 80rpx auto 0;
	}

	.t-login .t-g {
		float: left;
		width: 50%;
	}

	.t-login .t-e image {
		width: 50rpx;
		height: 50rpx;
	}

	.t-login .t-f {
		text-align: center;
		margin: 200rpx 0 0 0;
		color: #666;
	}

	.t-login .t-f text {
		margin-left: 20rpx;
		color: #aaaaaa;
		font-size: 27rpx;
	}

	.t-login .uni-input-placeholder {
		color: #000;
	}

	.cl {
		zoom: 1;
	}

	.cl:after {
		clear: both;
		display: block;
		visibility: hidden;
		height: 0;
		content: '\20';
	}

	.uTabs {
		/* margin-bottom: 50rpx; */
		width: 260rpx;
	}

	.spaceRow {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 36rpx;
	}

	.uIconR {
		position: absolute;
		right: 16rpx;
		top: 10rpx;
		padding: 20rpx;
	}
</style>
