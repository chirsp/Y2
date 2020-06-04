<template>
	<view>
		<scroll-view scroll-x class="bg-white nav x-sticky">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="index==current?'text-orange cur':''" v-for="(item,index) in tab" :key="index"
				 @click="tabSelect(index)">
					{{item.name}}
				</view>
			</view>
		</scroll-view>
		<view class="billing">
			<view class="x-flex" v-for="(item,index) in list" :key="index">
				<view class="cuIcon-refund" style="font-size: 50upx;"></view>
				<view class="list">
					<view class="list-1">
						<view>
							{{item.pay_type==2?'支付宝提现':item.pay_type==1?'微信提现':item.pay_type==3?'银行卡提现':''}}
						    <text style="font-size: 24upx;color:#888;margin-left:10upx" v-if="item.pay_type==3">
						    	尾号{{item.bank_card.substring(item.bank_card.length-4,item.bank_card.length)}}
						    </text>
						</view>
						
						<view>￥{{item.money}}</view>
					</view>
					<view class="list2">
						<view>{{$api.format(item.create_time)}}</view>
						<view v-if="item.apply_status==10">待审核</view>
						<view v-else-if="item.apply_status==40" style="color:#39B54A;">已打款</view>
						<view v-else-if="item.apply_status==30" style="color: red;">已拒绝</view>
					</view>
				</view>
			</view>
		</view>
		<view class="noData" v-if="!list.length">
			<xNodata msg='空空如也~'></xNodata>
		</view>
	</view>
</template>

<script>
	import xNodata from '../../../components/nodata.vue'
	export default {
		components:{xNodata},
		data() {
			return {
				// 10待审核 20审核通过 30驳回 40已打款 0=全部
				tab: [
					{name: '待审核',type:10}, 
					{name: '已审核',type:20}, 
					{name: '已打款',type:40}, 
					{name: '已拒绝',type:30},
					],
				current: 0, 
				load:false,
				page:1,
				list:[]
			};
		},
		onLoad() {
			this.getData();
		},
		onReachBottom() {
			if(!this.load){
				this.page++
				this.getData();
			}
		},
		// 暂时让下拉和下拉功能一样,不然下拉图标一直显示
		onPullDownRefresh() {
				if(!this.load){
					this.page++
					this.getData();
				}	
				},
		methods: {
			tabSelect(index) {
				this.current = index;
				this.page=1,
				this.list=[],
				this.getData();
			},
			getData() {
				let _this = this;
				_this.load = true
				_this.$api.ajax("smdc/Withdrawal/lists", {
					apply_status: this.tab[this.current].type,
					shop_id:this.$store.state.shopId,
					page:this.page,
					limit:10
				}, function(ret) {
					_this.load = false
					if(_this.page== 1){
						_this.list = ret.data
					}else{
						_this.list.concat(ret.data);
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.noData {
		line-height: 80upx;
		text-align: center;
		color: #888;
	}

	.x-sticky {
		position: sticky;
		top: 0;
		z-index: 980;
	}

	.top {
		height: 320upx;
		padding-top: 20upx;
		background-color: #FC6840;
	}

	.add-cash {
		font-size: 26upx;
		padding: 2upx 14upx;
		color: #fff;
		border: 1upx solid #fff;
		border-radius: 10upx;
	}

	.top-img image {
		width: 85upx;
		height: 85upx;
		border-radius: 50%;
	}

	.top-1 {
		color: #FFFFFF;
		/* 	font-weight: bold; */
		display: flex;
		align-items: center;
		margin-left: 40upx;
	}

	.top-des {
		display: flex;
		flex-direction: column;
		font-size: 26upx;
		margin-left: 12upx;
	}

	.top-des-1 {
		font-size: 26upx;
	}

	.top-2 {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #FFFFFF;
		font-size: 80upx;
		// margin-top: 30upx;
	}

	.top-2-1 {
		/* 	font-weight: bold; */
		font-size: 30upx;
		margin-bottom: 6upx;
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
		padding: 0 30rpx;
	}

	.time {
		font-size: 34upx;
		margin: 28upx 0 23upx 40upx;
	}

	.redpacket {
		font-size: 50upx;
		color: $skin;
		padding: 0 30upx;
	}

	.list {
		display: flex;
		flex: 1;
		flex-direction: column;
		border-top: 1upx solid #EEEEEE;
		padding: 20upx 30upx;
	}

	.list-1,
	.list2 {
		display: flex;
		justify-content: space-between;
	}

	.list-1 {
		font-size: 30upx;
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
	.white-block {
		height: 80upx;
	}
</style>
