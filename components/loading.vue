<template>
	<view>
		<view class="loading">
			<image src="../static/loading.gif" class="loading-gif"></image>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'loading',
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	.loading{
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 800upx;
		.loading-gif{
			width: 400upx;
			height: 300upx;
		}
	}
</style>
