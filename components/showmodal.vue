<template>
	<view>
		<view class="cu-modal" :class="modal?'show':''" >
			<view class="cu-dialog" style="width: 78%;">
				<view class="cu-bar bg-white justify-end">
					<view class="content">系统提示</view>
					<view class="action" @click="hideShow()">
						<text class="cuIcon-close"></text>
					</view>
				</view>
				<view class="">
					<view class="_f30 _c22 padding-xl">{{msg}}</view>
					<view class="flex_row flex_sb submitBox _f34">
						<view class="_flex-center sure" @click="hide()">
							{{cancelText}}
						</view>
						<view class=" _flex-center mCol" @click="sure()">
							{{comfirmText}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		props:{
			modal:{
				type:Boolean,
				default:false
			},
			msg:{
				type:String,
				default:"确定进行此操作?"
			},
			comfirmText:{
				type:String,
				default:"确定"
			},
			cancelText:{
				type:String,
				default:"取消"
			},
			hidedeal:{
				type:Boolean,
				default:false
			}
		},
		methods:{
			sure(){
				this.$emit('sure',{modal:this.modal})
			},
			hide(){
	            this.$emit('hide',{modal:false})
			},
			hideShow(){
				this.$emit('hide',{modal:false,hidedeal:this.hidedeal})
			}
		}
	}
</script>

<style lang="less">
	.submitBox{
		padding: 30upx 0;
		border-top: 1upx solid #EEEEEE;
		.sure{
			border-right: 1upx solid #EEEEEE;
		}
	}
	.submitBox view{
		width: 50%;
	}
	.flex_row{
		display: flex;
		flex-direction: row;
	}
	._f30{
		font-size: 30upx;
	}
	._c22{
		color: #222;
	}
	.flex_sb{
		justify-content: center;
	}
	._f34{
		font-size: 34upx;
	}
	._flex-center{
		justify-content: center;
	}
	
</style>