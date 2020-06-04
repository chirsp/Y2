<template>
	<view class="toast-info">
		<image :src="img" class="nolistimg"></image>
		<text class="_c66">{{msg}}</text>
	</view>
</template>

<script>
	export default {
		name:"x-nodata",
		data(){
			return{
				
			}
		},
		props:{
			msg: {
				type: String,
				default: "暂无数据"
			},
			img:{
				type:String,
				default:"/static/newimg/nolist.png"
			}
		}
	}
	
</script>

<style>
	.toast-info{
		text-align: center;
		padding-top: 30upx;
		padding-bottom: 30upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.nolistimg{
		width: 370upx;
		height: 250upx;
		margin: 50upx auto;
	}
</style>
