<template>
	<!-- 信息审核中 -->
	<view class="cu-modal show" >
		<view class="cu-dialog" style="width: 70%;">
			<view class="cu-bar bg-white justify-end">
				<view class="content"></view>
				<!-- <view class="action" @tap="status=false">
					<text class="cuIcon-close text-red"></text>
				</view> -->
			</view>
			
			<view class=" _flex-center modalInfo bg-white">
			    <image src="../../static/order.png" class="tableNum _flex-center"></image>
				<view class="edit flex_center">
					<text>已经收到您的提交资料</text>
					<text class="mCol">{{status==0 || secondStatus ==0?'请耐心等待审核':secondStatus==2?'审核失败，可重新提交信息':status==1?'信息已审核,管理员会与您联系哦~':status==2?'审核失败，可重新提交信息':''}} ~</text>
				</view>
				<view class="clearbtn mBg _cff _f32" @click="clickUpdataInfo()" :hidden="secondStatus==1 || secondStatus==0">
                   {{status==2?'完善资料':secondStatus ==2?'重新提交':''}}
				</view>
				<view class="clearbtn  mCol _f32" @click="backPage()">
					返回
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			status:{
				type:Number,
				default:0
			},
			second:{
				type:Boolean,
				default:false
			},
			secondStatus:{
				type:Number,
				default:0
			}
		},
		methods:{
			clickUpdataInfo(){
				console.log(this.status,this.second)
				this.$emit('clickUpdataInfo',this.second)
			},
			
			// 返回上一页
			backPage(){
				uni.navigateBack(-1)
			},
		}
	}
</script>

<style>
	.clearbtn{
		border: 1upx solid #FEB026;
	}
</style>
