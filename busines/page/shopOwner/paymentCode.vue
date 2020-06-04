<template>
	<view class="content">
		<view class="code _flex-center">
			<text class="_f30">扫一扫，向我付款</text>
			<image src="" mode="aspectFill" class="codeImg"></image>
			<text class="_f30 mCol" @click="saveImg()">保存图片</text>
		</view>
		<view class="bottom flex_sb flex_ai ">
			<view class="left flex_row flex_ai">
				<image src="../../static/image/payList.png" class="paylistIcon"></image>
				<text class=" _f30">收款记录</text>
			</view>
			<image src="../../static/image/enter.png" class="enter-icon"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onShow() {

		},
		methods: {
			// 保存图片
			saveImg() {
				var _this = this
				uni.saveImageToPhotosAlbum({
					filePath: _this.codeImg,  //图片路径
					success: function() {
						console.log('save success');
					}
				});
			},
		},
	}
</script>

<style lang="less">
	.content {
		background: rgba(255, 255, 255, 1);
		box-shadow: 0upx 3upx 6upx rgba(0, 0, 0, 0.1);
		opacity: 1;
		border-radius: 20upx;
		margin: 30upx;

		.bottom {
			padding: 25upx 30upx;

			.left {
				.paylistIcon {
					width: 44upx;
					height: 44upx;
					margin-right: 16upx;
				}
			}

			.enter-icon {
				width: 17upx;
				height: 28upx;
			}
		}

		.code {
			padding: 36upx 0;
			border-bottom: 1upx solid #EEEEEE;

			.codeImg {
				width: 320upx;
				height: 320upx;
				margin: 32upx;
				background-color: #EEEEEE;
			}
		}
	}
</style>
