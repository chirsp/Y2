<template>
	<view>
		<!-- 账户余额 start -->
		<view class="balance">
			<view class="balance1">账户余额(元)</view>
			<view class="balance2">{{money}}</view>
			<view class="balance3" @click="goVip">去充值</view>
		</view>
		<!-- 账户余额 end -->

		<!-- 账单明细 start -->
		<view class="title" v-if="month.length">账单明细</view>
		<!-- <view class="billing-details" v-for="item in 5" :key="item">
			<view class="billing">
				<view class="time">5月</view>
				<view class="list" v-for="list in 6" :key="list">
					<view class="list-1">
						<view>赠送100元</view>
						<view class="list-1-price">￥100</view>
					</view>
					<view class="list2">
						<view>2019-05-20 16：58</view>
						<view class="list-2-price">在线支付</view>
					</view>
				</view>
			</view>
		</view> -->
		<!-- 账单明细 end -->
		<view v-if="!list.length" class="toast-info">暂无记录</view>
		<view class="billing">
			<block v-for="item in list" :key="item.id">
					<view class="x-flex">
					<view class="cuIcon-redpacket redpacket"></view>
					<view class="list">
						<view class="list-1">
							<view>赠送{{item.add_price}}元</view>
							<view class="list-1-price">充值￥{{item.price}}</view>
						</view>
						<view class="list2">
							<view>{{item.create_time}}</view>
							<view class="list-2-price"></view>
						</view>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				money:0,
				month:[],
				billList:[],
				list:[],
				page:1,
				more:true
			}
		},
		onLoad(e) {
			if(e.money){
				this.money=e.money;
			}
			this.getData();
		},
		onReachBottom() {
			if(this.more){
				this.getData();
			}
		},
		methods: {
			goVip() {
				this.$api.openWin('../vip/vip');
				// uni.reLaunch({
				// 	url:'../vip/vip'
				// })
			},
			getData() {
				let _this = this;
				this.$api.ajax('smdc/Part/yuerlog',{
					shop_id:this.$store.state.shopId,
					page:this.page,
					limit:10
				},function(ret){
					let data=ret.data;
					if(data.length){
						_this.page=_this.page+1;
						_this.list=_this.list.concat(data);
					}else{
						_this.more=false;
					}
				});
			}
		},
	}
</script>

<style lang="scss">
	/* 账户余额 start */
	.balance {
		height: 427upx;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.balance1 {
		color: 38upx;
		font-size: #222222;
		margin: 64upx 0 41upx 0;
	}

	.balance2 {
		color: $skin;
		font-size: 64upx;
		font-weight: bold;
		margin-bottom: 50upx;
	}

	.balance3 {
		width: 485upx;
		height: 80upx;
		text-align: center;
		line-height: 80upx;
		color: #FFFFFF;
		font-size: 40upx;
		background-color: $skin;
		border-radius: 10upx;
	}
	/* 账户余额 end */
	/* 账单明细 start */
	.title {
		height: 32upx;
		line-height: 32upx;
		color: #444444;
		font-size: 34upx;
		margin: 19upx 0 19upx 37upx;
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
		flex: 1;
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
		color: $skin;
	}

	.list2 {
		color: #666666;
		font-size: 28upx;
		margin-top: 19upx;
	}

	.list-2-price {
		color:$skin;
	}
	/* 账单明细 end */
	.white-block{
		height: 80upx;
	}
</style>
