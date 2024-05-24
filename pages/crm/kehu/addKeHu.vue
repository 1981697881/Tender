<template>
	<view>
		<!--基础信息-->
		<view class="btName">基础信息</view>
		<view class="flex-white-plr26 ptb10 bdb_f5">
			<text class="mr26">
				<text>项目名称</text>
				<text class="redXingh">*</text>
			</text>
			<u-input :disabled="isNotice" v-model="form.projectName" placeholder="必填" />
		</view>
		<view class="flex-white-plr26 ptb10 bdb_f5">
			<text class="mr26">
				<text>项目编号</text>
				<text class="redXingh">*</text>
			</text>
			<u-input :disabled="isNotice" v-model="form.projectNum" placeholder="必填" />
		</view>
		<view class="flex-white-plr26 ptb10 bdb_f5">
			<text class="mr26">
				<text>投标公司名称</text>
				<text class="redXingh">*</text>
			</text>
			<u-input v-model="form.companyName" placeholder="必填" />
		</view>
		<view class="flex-white-plr26 ptb10 bdb_f5">
			<text class="mr26">
				<text>办理人姓名</text>
				<text class="redXingh">*</text>
			</text>
			<u-input v-model="form.transactorsName" placeholder="必填" />
		</view>
		<view class="flex-white-plr26 ptb10 bdb_f5">
			<text class="mr26">联系电话
				<text class="redXingh">*</text>
			</text>
			<u-input v-model="form.contactNumber" placeholder="必填" />
		</view>
		<view class="flex-white-plr26 ptb10 bdb_f5">
			<text class="mr26">邮箱
				<text class="redXingh">*</text>
			</text>
			<u-input v-model="form.mailbox" placeholder="必填" />
		</view>
		<!--扩展信息-->
		<view class="btName">扩展信息</view>
		<view class="flex-white-plr26 ptb20 bdb_f5 mt32">
			<text class="mr26">营业执照</text>
		</view>
		<view class="text-center bg-white">
			<uni-file-picker :auto-upload="false" v-model="form.businessCertificate" :limit="3" file-mediatype="image"
				mode="grid" file-extname="png,jpg" @select="select" @delete="delFile" />
		</view>
		<view class="flex-white-plr26 ptb10 bdb_f5">
			<text class="mr26">相关资质证明</text>
		</view>
		<view class="text-center bg-white">
			<uni-file-picker :auto-upload="false" v-model="form.relevantInformation" :limit="3" file-mediatype="image"
				mode="grid" file-extname="png,jpg" @select="select" @delete="delFile" />
		</view>
		<!--提交按钮-->
		<view class="submitView">
			<u-button type="primary" class="submitBtn" :ripple="true" ripple-bg-color="#909399" @click="submitBtn">
				{{pageType =='' ? '提交' : '保存'}}
			</u-button>
		</view>
	</view>
</template>

<script>
	let that = '';
	export default {
		data() {
			return {
				isNotice: false,
				form: {
					projectName: '',
					projectNum: '',
					companyName: '',
					transactorsName: '',
					contactNumber: '',
					mailbox: '',
					businessCertificate: '',
					relevantInformation: ''
				}
			}
		},
		onLoad(options) {
			that = this;
			let q = decodeURIComponent(options.q);
			if (typeof that.GetRequest(q).exchangeCode != "undefined") {
				that.exchange.type = 'exchangeCode'
				that.exchange.pojectNo = that.GetRequest(q).pojectNo
			}
			let e = this.$Route.query
			if(typeof e.projectName != "undefined"){
				that.form.projectName = e.projectName
				that.form.projectNum = e.projectNumber
				that.isNotice = true
			} 
			if (e.type == 'update') {
				that.pageType = e.type;
				if (uni.$addInfo) {
					this.form = uni.$addInfo
				}
				if (e.type == 'update') {
					uni.setNavigationBarTitle({
						title: '修改报名信息'
					})
				}
			} else {
				uni.setNavigationBarTitle({
					title: e.name
				})
			}
		},
		methods: {
			GetRequest(urlStr) {
				if (typeof urlStr == 'undefined') {
					var url = decodeURI(location.search); //获取url中"?"符后的字符串
				} else {
					var url = '?' + urlStr.split('?')[1];
				}
				var theRequest = new Object();
				if (url.indexOf('?') != -1) {
					var str = url.substr(1);
					var strs = str.split('&');
					for (var i = 0; i < strs.length; i++) {
						theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1]);
					}
				}
				return theRequest;
			},
			// 提交按钮
			submitBtn: function() {
				if (that.form.projectName == '') {
					uni.showModal({
						title: '提示',
						content: '项目名称不能为空，请输入！',
						showCancel: false
					})
					return
				}
				if (that.form.projectNum == '') {
					uni.showModal({
						title: '提示',
						content: '项目编号不能为空，请输入！',
						showCancel: false
					})
					return
				}
				if (that.form.companyName == '') {
					uni.showModal({
						title: '提示',
						content: '投标公司不能为空，请输入！',
						showCancel: false
					})
					return
				}
				if (that.form.transactorsName == '') {
					uni.showModal({
						title: '提示',
						content: '办理人姓名不能为空，请输入！',
						showCancel: false
					})
					return
				}
				if (that.form.contactNumber == '') {
					uni.showModal({
						title: '提示',
						content: '联系电话不能为空，请输入！',
						showCancel: false
					})
					return
				}
				if (that.form.mailbox == '') {
					uni.showModal({
						title: '提示',
						content: '邮箱不能为空，请输入！',
						showCancel: false
					})
					return
				}
				let action = 'addKeHu';
				if (that.pageType == 'update') {
					action = 'update'
					uni.showLoading({
						title: '修改中...'
					})
				} else if (that.pageType == 'zhuanClient') {
					uni.showLoading({
						title: '保存中...'
					})
				} else {
					uni.showLoading({
						title: '提交中...'
					})
				}
				that.$api('bidding.signUp', this.form).then(res => {
					if (res.flag) {
						uni.hideLoading();
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 888,
							mask: true
						})
						this.$Router.back();
					}
				});
				/* crmKeHuApi(reqData)
				.then(res => {
					if (action == 'update') {
						uni.showToast({
							title: '客户修改成功',
							icon: 'none',
							duration: 888,
							mask: true
						})
						setTimeout(()=> {
							uni.navigateBack()
						}, 888)
					} else {
						if(that.pageType == 'zhuanClient') {
							that.zhuanWeiClientId = res.result.id;
						}
						uni.showToast({
							title: '客户新增成功',
							icon: 'none',
							duration: 1000,
							mask: true
						})
						let addObj = reqObj.req;
						addObj._id = res.result.id;
						if(that.isAdd) {
							uni.$emit('addItemInListFun', addObj)
						}
						setTimeout(()=> {
							addObj.cjRenName = uni.$userInfo.nickname;
							addObj.fuZeRenName = uni.$userInfo.nickname;
							uni.$khInfo = addObj;
							uni.redirectTo({
								url: './khDetail?index=0'
							})
						}, 1000)
					}
				}) */
			},

			setThreadDataFun: function() {
				let jjj = {
					action: 'update',
					params: {
						_id: that.xgInfoObj._id,
						req: {
							status: 2
						}
					}
				}
				threadApi(jjj)
					.then(res => {
						uni.$emit('threadListChangeFun');
					})
				let rrr = {
					action: 'zhuanClientCz',
					params: {
						dataId: that.xgInfoObj._id,
						clientId: that.zhuanWeiClientId
					}
				}
				czjlApi(rrr)
				let ooo = {
					action: 'zhuanClientGj',
					params: {
						dataId: that.xgInfoObj._id,
						clientId: that.zhuanWeiClientId
					}
				}
				threadGjApi(ooo)
			},
			
		}
	}
</script>

<style>
	page {
		background-color: #F8F8F8;
		padding-bottom: 260rpx;
	}

	.u-radio {
		width: 200rpx !important;
	}

	.uni-file-picker__container {
		justify-content: center;
	}
</style>
