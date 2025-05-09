<template>
	<view>
		<!--关联信息-->
		<view class="btName">公告信息</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">项目名称</text>
			<view class="width276 color333 flexC" v-if="infoObj.projectName">
				<text>{{infoObj.projectName}}</text>
			</view>
			<view v-else class="width276">暂无</view>
		</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">公告类型</text>
			<view v-if="infoObj.noticeType" class="width276 color333">{{infoObj.noticeType}}</view>
			<view v-else class="width276">暂无</view>
		</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">作者</text>
			<view v-if="infoObj.author" class="width276 color333">{{infoObj.author}}</view>
			<view v-else class="width276">暂无</view>
		</view>
		<view class="flex-white-plr26 ptb20 bdb_f5">
			<text class="mr26">发布时间</text>
			<view v-if="infoObj.releaseDate" class="width276 color333">{{infoObj.releaseDate}}</view>
			<view v-else class="width276">暂无</view>
		</view>
		<!--基础信息-->
		<view class="btName">公告内容</view>
		<view class="tab-detail pb20">
			<view class="rich-box"><u-parse :html="infoObj.noticeText"></u-parse></view>
		</view>
		<!--系统信息-->
		<view class="noMoreTs">暂无更多~</view>
		<view class="submitView">
			<u-button type="success" class="submitBtn" :ripple="true" ripple-bg-color="#909399" @click="submitBtn">
				报名
			</u-button>
		</view>
	</view>
</template>

<script>
	let that = ''
	export default {
		components: {
		},
		data() { 
			return {
				infoObj: {},
				cardIndex: 0,
				isLoadSelectPageById: false,
				isQywx: false
			}
		},
		watch: {
			infoObj: function(n, o) {
				
			}
		},
		onLoad() {
			let that = this;
			let e = this.$Route.query
			that.infoObj = uni.$gjInfo || {}
			that.cardIndex = e.index;
		},
		onShow() {
			
		},
		onBackPress(e) {
			if(e.from == 'backbutton' && this.cardIndex != -1) {
				uni.$emit('updateGjListByIndex', { index: this.cardIndex, obj: this.infoObj})
			}
		},
		methods: {
			submitBtn(){
				let that = this;
				uni.showActionSheet({
					itemList: ['询价项目', '公开招标、磋商(谈判)项目', '企业标'],
					success: function(res) {
						if (res.tapIndex == 0) {
							that.jump('pages/crm/kehu/addKeHu', {
								"isAdd": 1,
								"name": "询价项目",
								"projectName": that.infoObj.projectName,
								"projectNumber": that.infoObj.projectNumber,
								"projectType": that.infoObj.projectType
							})
						} else if (res.tapIndex == 1) {
							that.jump('pages/crm/kehu/addKeHu', {
								"isAdd": 1,
								"name": "公开招标、磋商(谈判)项目",
								"projectName": that.infoObj.projectName,
								"projectNumber": that.infoObj.projectNumber,
								"projectType": that.infoObj.projectType
								
							})
						} else {
							that.jump('pages/crm/kehu/addKeHu', {
								"isAdd": 1,
								"name": "企业标",
								"projectName": that.infoObj.projectName,
								"projectNumber": that.infoObj.projectNumber,
								"projectType": that.infoObj.projectType
							})
						}
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
			},
			jump(path, query) {
				this.$Router.push({
					path: path,
					query: query
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F8F8F8;
		padding-bottom: 88px;
	}
	.tab-detail {
		min-height: 300rpx;
		background: #fff;
		.rich-box {
			/deep/ img {
				display: block;
			}
		}
	}
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
	.noMoreTs {
		width: 100%;
		margin: 32rpx 0;
		text-align: center;
	}
	.bottomClass {
		width: 100%;
		position: fixed;
		bottom: 0;
	}
</style>
