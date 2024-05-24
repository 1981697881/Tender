<template>
	<view class="content">
		<!-- 此处为了让reload时不自动滚动到顶部，需要设置auto-clean-list-when-reload和auto-scroll-to-top-when-reload为false，即在reload时关闭自动清空数组和自动滚动到顶部 -->
		<z-paging ref="paging" :auto-clean-list-when-reload="false" :auto-scroll-to-top-when-reload="false" style="height: calc(100% - 0px);" @scrolltolower="scrollToBottomFun">
			<!--客户基本信息-->
			<khCard :item="khInfo" :isSelect="true"></khCard>
			<!--客户阶段-->
			<view class="myCard">
				<view class="cardTopName disFlexJ">
					<text>投标进度</text>
					<view v-if="khInfo.status == 1" style="color: #F29100;" @click="pageBianjiFun()">
						修改
						<u-icon name="edit-pen-fill" color="#F29100"></u-icon>
					</view>
				</view>
				<u-steps class="width100" mode="number" active-color="#00aa00" :list="jieDuanList" :current="khInfo.projectStatus"></u-steps>
			</view>
			<!--tab-->
			<view class="uTabsView">
				<u-tabs :list="tabList" :is-scroll="true" duration="0.08" :current="tabIndex" :show-bar="false" font-size="32" @change="tabChange"></u-tabs>
			</view>
			<!-- 自定义下拉刷新view -->
			<!-- <custom-refresher slot="refresher" :status="refresherStatus"></custom-refresher> -->
			<!-- list数据，建议像下方这样在item外层套一个view，而非直接for循环item，因为slot插入有数量限制 -->
			<view class="contentView">
				<!--详细信息-->
				<view v-if="tabIndex == 0">
					<khDetail :khInfo="khInfo"></khDetail>
				</view>
				<!--加载更多-->
				<getMore :isMore="tabList[tabIndex].isMore"></getMore>
			</view>
		</z-paging>
	</view>
</template>

<script>
	let that = '';
	import khCard from '../card/kehu.vue'
	import khDetail from '@/components/detail/kehuDetail'
	import getMore from '@/components/getMore/getMore.vue'
	export default {
		components: {
			khCard,
			khDetail,
			getMore
		},
		data() {
			return {
				selectList: [],
				jieDuanIndex: 0,
				jieDuanList: [
					{ value: 0, name: '报名'},
					{ value: 1, name: '询价'},
					{ value: 2, name: '评标'},
					{ value: 3, name: '公布'},
					{ value: 4, name: '结束'}
				],
				stateIndex: 0,
				selectShow: false,
				khInfo: {},
				dataList: [],
				tabList: [ 
					{ name: '详细信息', arr: [], pageIndex: 1, isMore: false },
				],
				tabIndex: 0,
				refresherStatus: 0,
				cardIndex: -1,
				isLoadSelectKhById: false
			}
		},
		onLoad() {
			that = this;
			let e = this.$Route.query
			that.cardIndex = e.index || -1;
			that.khInfo = uni.$khInfo || {};
			that.setJieduanAndStateFun()
			if(e.fromDetail) {
				that.selectKhByIdFun(e._id)
			}
		},
		onBackPress(e) {
			if(e.from == 'backbutton' && this.cardIndex != -1) {
				uni.$emit('updateListByIndex', { index: this.cardIndex, obj: this.khInfo})
			}
		},
		onShow() {
			if(that.isLoadSelectKhById) {
				that.selectKhByIdFun();
			}
		},
		methods: {
			tabChange(index) {
				this.tabIndex = index;
				let item = that.tabList[index];
				if(item.arr && item.arr.length > 0) {
					return
				}
				if(index == 1) {
					that.getGenJinFun()
				} else if(index == 2) {
					that.selectLxrFun()
				} else if(index == 3) {
					that.getShangjiFun()
				} else if(index == 4) {
					that.getBaojiaDanFun()
				} else if(index == 5) {
					that.getHeTongFun()
				} else if(index == 6) {
					that.getHuiKuanJhFun()
				} else if(index == 7) {
					that.getHuiKuanDanFun()
				} else if(index == 8) {
					
				} else if(index == 9) {
					
				} else if(index == 10) {
					
				}
			},
			scrollToBottomFun: function(e) {
				let index = that.tabIndex;
				let isMore = that.tabList[index].isMore;
				if(!isMore) {
					return
				}
				if(index == 1) {
					that.getGenJinFun()
				} else if(index == 2) {
					that.selectLxrFun()
				} else if(index == 3) {
					that.getShangjiFun()
				} else if(index == 4) {
					that.getBaojiaDanFun()
				} else if(index == 5) {
					that.getHeTongFun()
				} else if(index == 6) {
					that.getHuiKuanJhFun()
				} else if(index == 7) {
					that.getHuiKuanDanFun()
				} else if(index == 8) {
					
				} else if(index == 9) {
					
				} else if(index == 10) {
					
				}
			},
			// 给tabList中的arr赋值
			setTabArrFun: function(data, item) {
				if (item.pageIndex == 1) {
					item.arr = [];
				}
				if (data.length >= 10) {
					item.pageIndex += 1;
					item.isMore = true;
				} else {
					item.isMore = false;
				}
				item.arr = item.arr.concat(data);
				that.$set(that.tabList, that.tabIndex, item)
			},
			// 修改客户信息
			pageBianjiFun: function() {
				uni.$infoObj = that.khInfo;
				uni.navigateTo({
					url: './addKeHu?type=update'
				})
			},
			// 新增sheet回调方法
			pageAddSheetFun: function(e) {
				console.log(e)
				let url = '/pages/crm/';
				if(e == 0) {
					url += 'genJin/add?companyName=' + that.khInfo.companyName + '&clientId=' + that.khInfo._id
				} else if(e == 1) {
					url += 'lianxiren/addLxr?companyName=' + that.khInfo.companyName + '&clientId=' + that.khInfo._id
				} else if(e == 2) {
					url += 'shangji/addSj?companyName=' + that.khInfo.companyName + '&clientId=' + that.khInfo._id
				} else if(e == 3) {
					url += 'baoJiaDan/addBjd?companyName=' + that.khInfo.companyName + '&clientId=' + that.khInfo._id
				} else if(e == 4) {
					url += 'hetong/addHt?companyName=' + that.khInfo.companyName + '&clientId=' + that.khInfo._id
				} else if(e == 5) {
					url += 'huikuanJH/addHkjh?companyName=' + that.khInfo.companyName + '&clientId=' + that.khInfo._id
				} else if(e == 6) {
					url += 'huikuan/addHk?companyName=' + that.khInfo.companyName + '&clientId=' + that.khInfo._id
				} else if(e == 7) {
					url += 'faPiao/addFp?companyName=' + that.khInfo.companyName + '&clientId=' + that.khInfo._id
				} else if(e == 8) {
					url += 'returnHk/add?companyName=' + that.khInfo.companyName + '&clientId=' + that.khInfo._id
				}
				uni.navigateTo({
					url
				})
			},
			// 更多回调方法
			pageDeleteShowFun: function(e) {
				uni.showModal({
					title: '提示',
					content: '是否确认删除客户名称为：' + that.khInfo.companyName + '的客户吗?',
					success(res) {
						if(res.confirm) {
							uni.showLoading({
								title: '删除中...',
								mask: true
							})
							let reqData = {
								action: 'update',
								params: {
									_id: that.khInfo._id,
									req: {
										isDelete: 1,
										update_date: new Date().getTime()
									}
								}
							}
							crmKeHuApi(reqData)
							.then(res => {
								uni.showToast({
									title: '删除成功!',
									duration: 888,
									icon: 'none'
								})
								if(that.cardIndex != -1) {
									uni.$emit('deleteKhFun', {index: that.cardIndex})
								}
								that.addCzjlFun();
								setTimeout(()=> {
									uni.navigateBack()
								}, 666)
							})
						}
					}
				})
			},
			addCzjlFun: function() {
				let czjlObj = {
					create_date: new Date().getTime(),
					czRen: uni.$userInfo._id,
					pageType: 'client',
					dataId: this.khInfo._id,
					type: '删除'
				}
				uni.$czjlApiAddFun(czjlObj);
			},
			// 设置客户阶段和状态
			setJieduanAndStateFun: function() {
				// let state = that.khInfo.companyState;
				let jieduan = that.khInfo.jieDuan;
				let sList = that.stateList;
				let jList = that.jieDuanList;
				// for(var i = 0; i < sList.length; i++) {
				// 	if(sList[i].name == state) {
				// 		that.stateIndex = i;
				// 		break;
				// 	}
				// }
				for(var i = 0; i < jList.length; i++) {
					if(jList[i].name == jieduan) {
						that.jieDuanIndex = i;
						break;
					}
				}
			},
			// 根据id查询客户
			selectKhByIdFun: function(_id) {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				let reqData = {
					action: 'selectKhById',
					params: {
						_id: ''
					}
				}
				if(_id) {
					reqData.params._id = _id;
				} else {
					reqData.params._id = that.khInfo._id;
				}
				crmKeHuApi(reqData)
				.then(res => {
					let data = res.result.data;
					if(data.length > 0) {
						that.khInfo = data[0]
						that.setJieduanAndStateFun()
					} else {
						uni.showModal({
							title: '提示',
							content: '相关内容不存在，或者已被删除！',
							showCancel: false,
							success() {
								uni.navigateBack()
							}
						})
					}
				})
			},
			cxPGetDataFun: function(e) {
				uni.showToast({
					title: e + 'i',
					duration: 1000,
					icon: 'none',
					mask: true
				})
				uni.$emit('cxGetDataFun');
				setTimeout(() => {
					uni.navigateBack()
				},  1000)
			}
		}
	}
</script>

<style>
	/* 注意，1、父节点需要固定高度，z-paging的height:100%才会生效 */
	/* 注意，2、请确保z-paging与同级的其他view的总高度不得超过屏幕宽度，以避免超出屏幕高度时页面的滚动与z-paging内部的滚动冲突 */

	/*如果有scoped，page的css设置建议放在App.vue中 */
	page {
		height: 100%;
		background-color: #F8F8F8;
	}

	.content {
		height: 100%;
		/* 父节点建议开启flex布局 */
		display: flex;
		flex-direction: column;
	}
	.uTabsView {
		border-bottom: 1rpx solid #DDDDDD;
		z-index: 100;
		position: sticky;
		top :0;
	}

	.contentView {
		/* background-color: #FFFFFF; */
		min-height: calc(100vh - 45px);
	}
	.flexRow {
		display: flex;
		font-size: 30rpx;
		margin-bottom: 8rpx;
	}
	.flexRow>view {
		width: 50%;
		display: flex;
	}
	.flexRow>view>text:first-child {
		width: 166rpx;
	}
	.item {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.item-detail {
		padding: 5rpx 15rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: white;
		background-color: #007AFF;
	}

	.item-line {
		position: absolute;
		bottom: 0rpx;
		left: 0rpx;
		height: 1px;
		width: 100%;
		background-color: #eeeeee;
	}
	.uTabsView {
		top: -2px !important;
	}
	.width100 {
		width: 100%;
		margin: 26rpx 0;
	}
	.u-steps__item, .u-steps__item--row {
		width: 200px !important;
	}
</style>
