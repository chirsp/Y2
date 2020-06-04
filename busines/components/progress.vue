<template>
	<view class="bg-white width100">
		<view class="flex_ai flex_row margin-top">
			<view class="cu-progress round flex_row flex_ai" style="height: 15upx;">
				<view class="bg-yellow" :style="[{ width:loading? num+'%':''}]"></view>
			</view>
			<text class="margin-left">{{num}}%</text>
		</view>
	</view>
</template>

<script>
	export default{
	props: {
		loading: {
			type: Boolean,
			default: false,
		},
		num:{
			type:Number,
			default:0
		}
	},
	
	data(){
		return{
			
		}
	},
	
	methods:{
		
	}
	}
</script>

<style lang="less">
	.width100{
		width: 100%;
	}
</style>
