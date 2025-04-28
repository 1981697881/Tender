<template>
	<view>
		<!--基础信息-->
		<view class="btName">基础信息</view>
		<!-- <view class="flex-white-plr26 ptb20 mt32 bdb_f5" :class="clientDisabled ? 'disabledStyle' : ''" >
			<text class="mr26">项目名称
				<text class="redXingh">*</text>
			</text>
			<view  :class="form.projectName ? '' : 'cBlack'" @click="selectKehuFun">
				<text style="display: inline-block;width: 450rpx;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;text-align: center;">{{form.projectName ? form.projectName : '请选择'}}</text>
				<u-icon class="ml26" v-if="!isNotice" name="arrow-right" size="40" color="#888888"></u-icon>
			</view>
		</view> -->
		<view class="flex-white-plr26 ptb10 bdb_f5">
			<text class="mr26">
				<text>项目编号</text>
				<text class="redXingh">*</text>
			</text>
			<u-input :disabled="isNotice" v-model="form.projectNum" confirm-type="search" @confirm="onSearchInput" placeholder="必填" />
		</view>
		<view class="flex-white-plr26 ptb10 bdb_f5">
			<text class="mr26">
				<text>项目名称</text>
				<text class="redXingh">*</text>
			</text>
			<u-input :disabled="isNotice" v-model="form.projectName" placeholder="必填" />
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
			<uni-file-picker :auto-upload="false" v-model="form.businessCertificate" :limit="1" file-mediatype="image"
				mode="grid" file-extname="png,jpg" @select="select($event, 'fault',form.businessCertificate)" @delete="delFile($event, 'fault',form.businessCertificate)" />
		</view>
		<view class="flex-white-plr26 ptb10 bdb_f5">
			<text class="mr26">相关资质证明</text>
		</view>
		<view class="text-center bg-white">
			<uni-file-picker :auto-upload="false" v-model="form.relevantInformation" :limit="1" file-mediatype="image"
				mode="grid" file-extname="png,jpg" @select="select($event, 'certificate',form.relevantInformation)" @delete="delFile($event, 'certificate',form.relevantInformation)" />
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
	import { mapMutations, mapActions, mapState } from 'vuex';
	import AppPay from '@/common/app-pay';
	let that = '';
	import {
		API_URL
	} from '@/env'
	export default {
		data() {
			return {
				isNotice: false,
				debounceTimer: null,
				imageUrl: '',
				searchValue: '',
				form: {
					projectName: '',
					projectNum: '',
					companyName: '',
					transactorsName: '',
					contactNumber: '',
					mailbox: '',
					regFee: 1,
					businessCertificate: [],
					relevantInformation: []
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
				that.form.regFee = e.regFee
				that.form.projectName = e.projectName
				that.form.projectNum = e.projectNumber
				that.isNotice = true
			}
			if (e.type == 'update') {
				that.pageType = e.type;
				if (uni.$addInfo) {
					this.form = uni.$addInfo
				}
				this.form.businessCertificate = JSON.parse(uni.$addInfo.businessCertificate)
				this.form.relevantInformation = JSON.parse(uni.$addInfo.relevantInformation)
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
			uni.$on('kehuBindFun', that.gjKehuBindFun)
		},
		onBackPress() {
			uni.$off('kehuBindFun', that.gjKehuBindFun)
		},
		created: function() {
			this.imageUrl = API_URL.replace("/tendering", "") + 'uploadFiles/image/'
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo,
			}),
		},
		onUnload() {
		    if (this.debounceTimer) clearTimeout(this.debounceTimer);
		},
		methods: {
			 onKeyInput(event) {
			            this.searchValue = event;
			            
			            if (this.debounceTimer) clearTimeout(this.debounceTimer);
			            this.debounceTimer = setTimeout(() => {
			                this.getProject();
			            }, 1000);
			        },
			onSearchInput: function(event) {
				this.searchValue = event
				this.getProject()
			},
			// 查询
			getProject: function() {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				that.$api('bidding.projectInitiationList', {pageNum: 1,pageSize: 1, projectName: this.searchValue}, {
				}).then(res => {
					if (res.flag ) {
						if(res.data.records.length>0){
							const data = res.data.records[0]
							that.form.projectNum = data.pojectNo;
							that.form.projectName = data.projectName;
							that.form.regFee = data.regFee;
						}
						uni.hideLoading();
					}
				});
				
			},
			// 绑定项目
			gjKehuBindFun: function(e) {
				let that = this;
				console.log(this.isNotice)
				console.log(e)
				if(!that.isNotice) {
					if(e.projectNum != '' && e.projectName != '') {
						that.form.projectNum = e.projectNum;
						that.form.projectName = e.projectName;
						that.form.regFee = e.regFee;
					}
				}
			},
			// 选择所属客户
			selectKehuFun: function() {
				if(!that.isNotice) {
					uni.navigateTo({
						url: '../kehu/kehuGh?type=application'
					})
				}
			},
			// 选择文件后触发 - 支持多选
			select(e, action, val) {
				let that = this
				// tempFiles - Array[Files]
				// 控制台查看该组件的files数据类型
				// console.log('选择文件：', e);
				e.tempFiles.map((item, index) => {
					uni.uploadFile({
						url: API_URL + 'file/imgUpload',
						filePath: item.url,
						name: 'imgS',
						header: {
							Authorization: uni.getStorageSync('token')
						},
						success: function(uploadFileRes) {
							let data = JSON.parse(uploadFileRes.data);
							if (action === 'fault') {
								// 故障图片
								if (!val instanceof Array) {
									val = []
								}
								let actionData = val;
								actionData.push({
									path: that.imageUrl + data.data,
									uuid: data.data
								});
							} else if (action === 'certificate') {
								// 凭证图片
								if (!val instanceof Array) {
									val = []
								}
								let actionData = val;
								actionData.push({
									path: that.imageUrl + data.data,
									uuid: data.data
								});
							}
							uni.showToast({
								icon: 'success',
								title: data.msg
							});
						},
						fail: err => {
							console.log('uploadImage fail', err);
							uni.showModal({
								content: err.errMsg,
								showCancel: false
							});
						}
					});
				});
			},
			// 文件从列表移除时触发
			delFile(e, action, val) {
				// tempFile - Object[Files]
				const {
					url
				} = e.tempFile;
				console.log(e.tempFile)
				// 需要操作的目标对象
				if (action === 'fault') {
					// 故障图片
					let actionData = val;
					for (let i = 0; i < actionData.length; i++) {
						// 删除对应的file
						if (actionData[i].uuid === e.tempFile.uuid) {
							actionData.splice(i, 1);
							return;
						}
					}
				} else if (action === 'certificate') {
					// 凭证图片
					let actionData = val;
					for (let i = 0; i < actionData.length; i++) {
						// 删除对应的file
						if (actionData[i].uuid === e.tempFile.uuid) {
							actionData.splice(i, 1);
							return;
						}
					}
				}

			},
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
				var params = {...this.form}
				params.nickName = this.userInfo.nickName
				console.log(params.businessCertificate)
				params.businessCertificate = params.businessCertificate.length>0?params.businessCertificate[0]["path"]:""
				params.relevantInformation = params.relevantInformation.length>0?params.relevantInformation[0]["path"]:""
				that.$api('bidding.signUp', params).then(res => {
					if (res.flag) {
						uni.hideLoading();
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 888,
							mask: true
						})
						uni.showModal({
							title: '提示',
							content: '检测到尚未缴费，是否立即缴费',
							success(reso) {
								if(reso.confirm) {
									let params = {
										amount: that.form.regFee,
										openId: that.userInfo.openid,
										payType: 1,
										regId: res.data["id"],
										pojectNo: that.form.projectNum,
										projectName: that.form.projectName
									};
									let pay = new AppPay(params, "wechat", {}, 0 );
									uni.$khInfo = that.form;
								}else{
									that.$Router.back();
								}
							}
						})
					}else{
						uni.hideLoading();
						uni.showToast({
							title: res.msg,
							icon: 'error',
							duration: 888,
							mask: true
						})
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
