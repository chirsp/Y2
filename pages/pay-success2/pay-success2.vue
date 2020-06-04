<template>
	<view class="page">
		<view class="x-mask"></view>
		<view class="content">
			<view class="ok-block">
				<image src="/static/gou.png" class="pay-ok-img"></image>
				<view class="pay-ok-tips">充值成功</view>
				<view class="code">现在点餐更实惠,快去点餐吧~</view>
				<view class="btn btn1" @click="back">完成</view>
				<view class="btn btn2" @click="goMenu">去点餐</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			back() {
				uni.navigateBack();
			},
			goMenu() {
				uni.reLaunch({
					url:'../menu/menu'
				})
			}
		}
	}
</script>

<style>
	.x-mask{
		background: rgba(0,0,0,0.3);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 970;
	}
	.content{
		position: fixed;
		z-index: 980;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.ok-block {
		width: 538upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: #fff;
		border-radius: 30upx;
		padding-bottom: 84upx;
	}

	.bk {
		position: relative;
	}

	.bk-img {
		width: 538upx;
		height: 313upx;
		background-color: #FFFFFF;
		border-radius: 30upx;
	}

	.ok-block-b {
		height: 449upx;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 30upx;
	}

	.bk icon {
		position: absolute;
		right: -52upx;
		top: -60upx;
	}

	.pay-ok-img {
		width: 92upx;
		height: 92upx;
		margin-top: 89upx;;
	}

	.pay-ok-tips {
		color: #FC6840;
		font-size: 43upx;
		font-weight: 400;
		margin-top: 30upx;
	}

	.code{
		font-size: 30upx;
		color: #222222;
		margin-top: 70upx;
	}

	.btn {
		width: 452upx;
		font-size: 32upx;
		text-align: center;
		border-radius: 34upx;
	}
	
	.btn1 {
		background-color: #FF861B;
		color: #FFFFFF;
		margin-top: 60upx;
		line-height: 80upx;
		height: 80upx;
	}
	
	.btn2 {
		color: #FC6840;
		background-color: #FFFFFF;
		margin-top: 30upx;
		border: 1px solid #FFB527;
		line-height: 78upx;
		height: 78upx;
	}
</style>
