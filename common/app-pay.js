/**
 * AppPay v1.0.0
 * @Class AppPay
 * @description app-pay 1.0.0 统一支付
 * @Author llidongtony
 * @Date 2020-04-09
 * @Email lidongtony@qq.com
 */
import api from '@/common/request/index'
import store from '@/common/store'
import tools from '@/common/utils/tools'
// #ifdef H5
import wxsdk from '@/common/wechat/sdk'
import Wechat from '@/common/wechat/wechat'
// #endif
import Router from '@/common/router';



export default class AppPay {


	//						wxOfficialAccount			wxMiniProgram			App						H5
	// 			wechat			公众号JSSDK支付				小程序支付			微信开放平台支付			H5网页支付
	//			alipay			复制网址						复制网址				支付宝开放平台支付		    直接跳转链接
	// 			wallet			v							v					v						v


	constructor(params,payment, order, entrance) {
		this.payment = payment;
		this.params = params;
		this.order = order;
		this.entrance = entrance;
		this.platform = uni.getStorageSync('platform');
		let payMehod = this.getPayMethod();
		payMehod();

	}

	getPayMethod() {
		var payMethod = {
			'wxOfficialAccount': {
				'wechat': () => {
					this.wxOfficialAccountPay()
				},
				'alipay': () => {
					this.copyPayLink()
				},
				'wallet': () => {
					this.walletPay()
				}
			},
			'wxMiniProgram': {
				'wechat': () => {
					this.wxMiniProgramPay()
				},
				'alipay': () => {
					this.copyPayLink()
				},
				'wallet': () => {
					this.walletPay()
				}
			},
			'App': {
				'wechat': () => {
					this.wechatPay()
				},
				'alipay': () => {
					this.aliPay()
				},
				'wallet': () => {
					this.walletPay()
				},
			},
			'H5': {
				'wechat': () => {
					this.wechatWapPay()
				},
				'alipay': () => {
					this.goToPayLink()
				},
				'wallet': () => {
					this.walletPay()
				},
			},
		}
		return payMethod[this.platform][this.payment];
	}



	prepay() {
		let that = this;
		uni.showLoading({
			title: '支付中',
			mask: true
		});
		return new Promise((resolve, reject) => {
			let that = this;
			let params = that.params;
			console.log(params)
			if (uni.getStorageSync('openid')) {
				params.openId = uni.getStorageSync('openid');
			}
			api('pay.prepay', params).then(res => {
				if (res.flag) {
					if (res.data === 'no_openid') {
						uni.hideLoading();
						uni.showModal({
							title: '微信支付',
							content: '点击确定后请再次使用微信支付',
							success: function(res) {
								if (res.confirm) {
									//静默获取openid
									let wechat = new Wechat();
									wechat.wxOfficialAccountBaseLogin();
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							},
							fail: (err) => {
								uni.hideLoading();
							}
						});

					} else {
						uni.hideLoading();
						resolve(res);
					}
				} else {
					uni.hideLoading();
					uni.showToast({
						title: res.data.err_code_des,
						icon: 'none'
					})
				}
			})
		});
	}



	async wxOfficialAccountPay() {
		let that = this;
		let result = await this.prepay();
		wxsdk.wxpay(result.data.pay_data, (res) => {
			if (res.errMsg == "chooseWXPay:ok") {
				Router.replace({
					path: '/pages/order/payment/result',
					query: {
						orderSn: that.order.order_sn,
						type: that.payment,
						pay: 1
					}
				});
			} else if (res.errMsg === 'chooseWXPay:cancel') {
				//取消支付

			} else {
				Router.replace({
					path: '/pages/order/payment/result',
					query: {
						orderSn: that.order.order_sn,
						type: that.payment,
						pay: 0
					}
				});
			}
		});

	}
	//

	async wechatWapPay() {
		let that = this;
		let result = await this.prepay();
		if (result.code === 1) {
			var url = result.data.pay_data.match(/url\=\'(\S*)\'/);
			let reg = new RegExp('&amp;', 'g') //g代表全部
			let newUrl = url[1].replace(reg, '&');
			let domain = uni.getStorageSync('sysInfo').domain; //域名需要https
			let params = encodeURIComponent(
				`${domain}/pages/order/payment/result?orderSn=${that.order.order_sn}&type=${that.payment}`)
			window.location.href = newUrl + '&redirect_url=' + params;
		}
	}

	async wxMiniProgramPay() {
		let that = this;
		let result = await this.prepay();
		let payData = result.data;
		uni.requestPayment({
			provider: 'wxpay',
			timeStamp: payData.timeStamp,
			nonceStr: payData.nonceStr,
			package: payData.package,
			signType: payData.signType,
			paySign: payData.paySign,
			success: function(res) {
				console.log(res)
				uni.showToast({
					title: "支付成功",
					icon: 'success'
				})
				Router.replace({
					path: '/pages/crm/kehu/result',
					query: {
						orderSn: that.params,
						type: that.payment,
						pay: 1
					}
				});
			},
			fail: function(err) {
				console.log('支付取消或者失败:', err);
				uni.showToast({
					title: err,
					icon: 'error'
				})
				if (err.errMsg !== "requestPayment:fail cancel") {
					Router.replace({
						path: '/pages/crm/kehu/result',
						query: {
							orderSn: that.params,
							type: that.payment,
							pay: 0
						}
					});
				}else{
					if(that.entrance == 0){
						Router.back()
					}
				}
			}
		});
	}

	async walletPay() {
		let that = this;
		let result = await this.prepay();
		if (result.code === 1) {
			Router.replace({
				path: '/pages/order/payment/result',
				query: {
					orderSn: that.order.order_sn,
					type: that.payment,
					pay: 1
				}
			});
		}
	}

	async copyPayLink() {
		let that = this;
		let result = await this.prepay();
		if (result.code === 1) {
			//引入showModal 点击确认 复制链接；
			uni.showModal({
				title: '支付宝支付',
				content: '复制链接到外部浏览器',
				confirmText: '复制链接',
				success: (res) => {
					if (res.confirm) {
						uni.setClipboardData({
							data: result.data.pay_data,
							success: function(data) {
								//#ifdef H5
								tools.toast('已复制到剪切板');
								//#endif
							},
							fail: function(err) {},
							complete: function(res) {}
						});

					} else if (res.cancel) {

					}
				}
			})


		}
	}

	async goToPayLink() {
		let that = this;
		let result = await this.prepay();
		if (result.code === 1) {
			window.location = result.data.pay_data;
		}
	}

	async aliPay() {
		let that = this;
		let result = await this.prepay();
		if (result.code === 1) {
			uni.requestPayment({
				provider: 'alipay',
				orderInfo: result.data.pay_data, //支付宝订单数据
				success: function(res) {
					Router.replace({
						path: '/pages/order/payment/result',
						query: {
							orderSn: that.order.order_sn,
							type: that.payment,
							pay: 1
						}
					});
				},
				fail: function(err) {
					console.log('支付取消或者失败:', err);
					if (err.errMsg !== "requestPayment:fail cancel") {
						Router.replace({
							path: '/pages/order/payment/result',
							query: {
								orderSn: that.order.order_sn,
								type: that.payment,
								pay: 0
							}
						});
					}
				}
			});
		}
	}

	async wechatPay() {
		let that = this;
		let result = await this.prepay();
		if (result.code === 1) {
			uni.requestPayment({
				provider: 'wxpay',
				orderInfo: JSON.parse(result.data.pay_data), //微信订单数据(官方说是string。实测为object)
				success: function(res) {
					Router.replace({
						path: '/pages/order/payment/result',
						query: {
							orderSn: that.order.order_sn,
							type: that.payment,
							pay: 1
						}
					});
				},
				fail: function(err) {
					console.log('支付取消或者失败:', err);
					if (err.errMsg !== "requestPayment:fail cancel") {
						Router.replace({
							path: '/pages/order/payment/result',
							query: {
								orderSn: that.order.order_sn,
								type: that.payment,
								pay: 0
							}
						});
					}
				}
			});
		}
	}

}
