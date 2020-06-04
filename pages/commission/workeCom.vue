<template>
	<view>
		<view class="top">
			<view class="top-1">
				<view class="top-img center">
					<image :src="userInfo.avatarurl" mode=""></image>
				</view>
				<view class="top-des">
					<view class="top-des-1">{{userInfo.worker.username}}</view>
					<view>{{userInfo.worker.type}}</view>
				</view>
			</view>
			
			<view class="top-2">
				<text class="top-2-title">今日收入</text>
				<text class="top-2-1">120.0</text>
			</view>
		</view>
	

		<view class="block">
			<view class="block-1 border-right">
				<view>可提现佣金(元)</view>
				<view class="block-1-1 price">0.00</view>
			</view>
			<view class="block-1">
				<view>餐桌数</view>
				<view class="block-1-1">0</view>
			</view>
		</view>

		<view class="block">
			<view class="block-1 border-right">
				<view>成功提现佣金(元)</view>
				<view class="block-1-1 price">0.00</view>
			</view>
			<view class="block-1">
				<view>提现订单数</view>
				<view class="block-1-1">0</view>
			</view>
		</view>
		<!-- <view class="recode-list">			
			<view class="x-flex-sp recode-list-item" @click="nav('./withdrawal/withdrawal')">
				<view class="">提现</view>
				<view class="cuIcon-right"></view>
			</view>
			<view class="x-flex-sp recode-list-item" @click="nav('./commissionRecode/commissionRecode')">
				<view class="">佣金记录</view>
				<view class="cuIcon-right"></view>
			</view>
			<view class="x-flex-sp recode-list-item" @click="nav('./withdrawalRecode/withdrawalRecode')">
				<view class="">提现记录</view>
				<view class="cuIcon-right"></view>
			</view>
		</view> -->
	</view>
</template>

<script>
	import { mapState,mapMutations } from 'vuex'
	export default {
		data() {
			return {
				data:"",
				id:"",
			}
		},
		computed: mapState(['userInfo']),
		onLoad(e) {
			this.id=e.id
			this.getData();
		},
		onShow() {
			this.getUserInfo();
		},
		methods: {
			...mapMutations(['_setUserInfo']),
			
			// 获取用户信息
			getUserInfo(){
				this.$api.ajax('smdc/user/userinfo',{
					shop_id:this.$store.state.shopId
				},res=>{
					this._setUserInfo(res.data);
				})
				
			},
			getData() {
				let _this = this;
				this.$api.ajax('smdc/Smdc_Worker/workerInfo',{
					shop_id:this.$store.state.shopId,
					id:this.id
				},function(ret){
					_this.data=ret.data;
				},"POST");
			},
		}
	}
</script>

<style lang="scss">
	.noData{
		line-height: 80upx;
		text-align: center;
		color: #888;
	}
	.x-sticky{
		position: sticky;
		top: 0;
		z-index: 980;
	}
	.top {
		padding-top: 20upx;
		background-color: #FC6840;
	}
	.add-cash{
		font-size: 26upx;
		padding: 2upx 14upx;
		color: #fff;
		border:1upx solid #fff;
		border-radius: 10upx;
	}

	.top-img image {
		width: 85upx;
		height: 85upx;
		border-radius: 50%;
		margin-right: 20upx;
		margin-left: 40upx;
	}

	.top-1 {
		color: #FFFFFF;
		display: flex;
	    flex-direction: row;
		align-items: center;
	}

	.top-des {
		display: flex;
		flex-direction: column;
		font-size: 26upx;
	}

	.top-des-1 {
		font-size: 30upx;
		font-weight: bold;
		margin: 14upx 0 10upx 0;
		
	}

	.top-2 {
		display: flex;
		flex-direction: column;
		color: #FFFFFF;
		justify-content: center;
		align-items: center;
		margin-bottom: 30upx;
		
	}
    .top-2-title{
		font-size: 30upx;
		margin: 30upx 0;
	}
	.top-2-1 {
		font-weight: bold; 
		font-size: 80upx;
		margin-bottom: 26upx;
	}

	.block {
		display: flex;
		background-color: #FFFFFF;
		margin-bottom: 30upx;
		padding: 47upx 0;
	}

	.block-1 {
		width: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 28upx;
	}

	.block-1-1 {
		margin-top: 22upx;
		font-size: 50upx;
		font-weight: bold;
	}

	.border-right {
		border-right: 1upx solid #EEEEEE;
	}

	.price {
		color: #FC6840;
	}
	
	.billing-details {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.billing {
		width: 100%;
		background-color: #FFFFFF;
		margin-bottom: 28upx;
		display: flex;
		flex-direction: column;
		color: #222222;
	}

	.time {
		font-size: 34upx;
		margin: 28upx 0 23upx 40upx;
	}
	
	.redpacket{
		font-size: 50upx;
		color: $skin;
		padding: 0 30upx;
	}

	.list {
		display: flex;
		flex:1;
		flex-direction: column;
		border-top: 1upx solid #EEEEEE;
		padding: 27upx 41upx 30upx 0;
	}

	.list-1,
	.list2 {
		display: flex;
		justify-content: space-between;
	}

	.list-1 {
		font-size: 34upx;
		color: #222222;
	}

	.list-1-price {
		color: #FC6840;
	}

	.list2 {
		color: #666666;
		font-size: 28upx;
		margin-top: 19upx;
	}

	.list-2-price {
		color: #FF9000;
	}
	/* 账单明细 end */
	.white-block{
		height: 80upx;
	}
	
	.recode-list{
		// margin-top: 30upx;
		font-size: 26upx;
		color: #222222;
		background: #fff;
		padding: 0 30upx;
		.recode-list-item{
			line-height: 110upx;
			height: 110upx;
			border-bottom: 1upx solid #eee;
		}
	}
</style>
