<template>
	<view>
		<view class="top flex_row flex_sb flex_ai _f30">
			<view class="left">
				可提现佣金(元)：
				<text class="_c66">共</text> 
				<text class="mCol">{{userInfo.worker.money}}</text>
				<text class="_c66">元</text>
			</view>
			<view class="mBg _cff cashBtn" @click="toCash()">提现</view>
		</view>
		
		<view class="list">
			<view class="item" v-for="(item,index) in items" :class="index?'bor-t':''" :key='index' @click="goLink(item.path)">
				{{item.name}}
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
					{name:"佣金记录",path:"/pages/my-commission/commissionRecode/commissionRecode"},
					{name:"提现记录",path:"/pages/my-commission/withdrawalRecode/withdrawalRecode"}
				]
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
			this.$api.ajax('smdc/user/userinfo',{
				shop_id:this.$store.state.shopId
			},res=>{
				setTimeout(function(){
					uni.stopPullDownRefresh()
				},2000)
				this._setUserInfo(res.data);
			})
			
		},
		
		// 提现
		toCash(){
			this.$api.openWin('/pages/my-commission/withdrawal/withdrawal')
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
		padding: 0 30upx;
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
	padding: 60upx 30upx;
	.left text{
		margin-left: 10upx;
	}
}
.cashBtn{
	padding: 10upx 20upx;
	border-radius: 10upx;
}
</style>