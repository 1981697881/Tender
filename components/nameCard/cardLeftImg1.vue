<template>
	<view>
		<view class="nameCard">
			<image class="bgImg" :src="bjImg" mode="aspectFill"></image>
			<view class="cardInfo">
				<view class="leftRightView">
					<view class="leftView">
						<image :src="item.avatar || AppLogo" mode="aspectFill"></image>
					</view>
					<view class="rightView">
						<view class="nameZhiwei">
							<text>{{item.name || '姓名'}}</text>
							<text>{{item.zhiWei || '暂未填写职位'}}</text>
						</view>
						<view class="clientName">{{item.clientName || '暂未填写公司'}}</view>
					</view>
				</view>
				<view class="cardText">{{item.phone || '暂未填写联系方式'}}</view>
				<view class="cardText">{{item.email || '暂未填写邮箱'}}</view>
				<view class="cardText">{{item.address || '暂未填写地址'}}</view>
				<!-- <image class="codeImg" :src="item.xcxImg" mode="aspectFill"></image> -->
			</view>
			<view class="cardShadow"></view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default: () => {}
			},
			bjImg: {
				type: String,
				default: ''
			},
			xcxImg: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				AppLogo: 'https://zy.gzfzdev.com/file/logo.png'
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.nameCard {
		width: 100%;
		height: 390rpx;
		background-color: #DDDDDD;
		border-radius: 16rpx;
		position: relative;
		overflow: hidden;
	}
	.bgImg {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}
	.cardInfo {
		position: absolute;
		top: 40rpx;
		left: 40rpx;
		color: #FFFFFF;
		z-index: 10;
	}
	.clientName {
		font-size: 14px;
	}
	.nameZhiwei {
		margin-bottom: 18rpx;
	}
	.nameZhiwei>text:first-child {
		font-size: 20px;
		font-weight: bold;
		padding-right: 16rpx;
	}
	.cardText {
		margin-top: 8rpx;
	}
	.cardShadow {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background-image: linear-gradient(to right, rgba(0,0,0, 0.2), rgba(0,0,0, 0.06));
		z-index: 8;
	}
	.leftRightView {
		display: flex;
		align-items: center;
		margin-bottom: 40rpx;
	}
	.leftView {
		width: 128rpx;
		height: 128rpx;
		background-color: #D8D8D8;
		border-radius: 26rpx;
		margin-right: 26rpx;
		overflow: hidden;
	}
	.leftView>image {
		width: 100%;
		height: 100%;
	}
	.rightView {
		width: 440rpx;
	}
	.codeImg {
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
		position: absolute;
		bottom: 6rpx;
		right: -20rpx;
	}
</style>

