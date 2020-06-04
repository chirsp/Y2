<template>
	<view>
		<view class="top flex_row  flex_ai _f30">
			<view class="flex_col flex_ai">
				<text class="mCol _fw">￥{{cashinfo.balance_money || '0.00'}}</text>
				<text  class="box">余额</text>
			</view>
			<view class="flex_col flex_ai">
				<text class="mCol _fw">￥{{ parseFloat(cashinfo.freeze_money)>0?cashinfo.freeze_money:'0.00'}}</text>
				<text  class="box">冻结金额</text>
			</view>
			<view class="flex_col flex_ai">
				<text class="mCol _fw">￥{{cashinfo.withdrawal_money || '0.00'}}</text>
				<text class="box">累计提现</text>
			</view>
		</view>
		
		<view class="list _f30">
			<view class="item flex_sb flex_ai" v-for="(item,index) in items" :class="index?'bor-t':''" :key='index' @click="goLink(item.path)">
				<text>{{item.name}}</text>
				<image src="../../static/image/select.png" class="more-icon"></image>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { mapState,mapMutations } from 'vuex'
	export default{
		data(){
			return{
				items:[
					{name:"提现记录",path:"/busines/page/shopOwner/withdrawalRecode"},
					{name:"申请提现",path:"/busines/page/shopOwner/withdrawal"},
				],
				cashinfo:""
			}
		},
		computed: mapState(['userInfo']),
		onShow() {
			this.getUserInfo()
		},
		onPullDownRefresh() {
			this.getUserInfo()
		},
		methods:{
		...mapMutations(['_setUserInfo']),
		// 获取用户信息
		getUserInfo(){
			this.$api.ajax('smdc/Withdrawal/index',{
				shop_id:this.$store.state.shopId
			},res=>{
				setTimeout(function(){
					uni.stopPullDownRefresh()
				},2000)
				this.cashinfo = res.data
				
			})
		},
		
		goLink(path){
				uni.navigateTo({
					url:path
				})
			},
		},
	}
</script>

<style lang="less">
.list{
		background:rgba(255,255,255,1);
		box-shadow:0upx 3upx 6upx rgba(0,0,0,0.1);
		opacity:1;
		padding: 0 20upx;
		.item{
			padding: 25upx;
		}
	}
.bor-t{
	border-top: 1upx solid #EEEEEE;
}
.top{
	margin: 30upx;
	background:rgba(255,255,255,1);
	box-shadow:0upx 3upx 6upx rgba(0,0,0,0.1);
	opacity:1;
	border-radius:20upx;
	justify-content: space-around;
	padding: 60upx 30upx;
	.box{
		margin-top: 20upx;
	}
}
.cashBtn{
	padding: 10upx 20upx;
	border-radius: 10upx;
}
.more-icon{
	width: 30upx;
	height: 30upx;
}
</style>