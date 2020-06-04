<template>
	<view>
	<!-- 	<view v-if="loading">
			<loading></loading>
		</view> -->
		<view class="tab3 mar-20" v-if="data.length">
			<view class="tab3-1 bor-bt">
				<view class="tab3-1-1">桌&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号:</view>
				<view class="tab3-1-2">{{deskId }}</view>
			</view>
			<view class="tab3-1" :class="_config.table_fee?'bor-bt':''">
				<view class="tab3-1-1">用餐人数:</view>
				<view class="tab3-1-2">{{deskNum }}人</view>
			</view>
			<view class="tab3-1" v-if="_config.table_fee">
				<view class="tab3-1-1">餐&nbsp;&nbsp;位&nbsp;&nbsp;费:</view>
				<view class="tab3-1-2">￥{{_config.table_fee}}/人</view>
			</view>
		</view>
		<block v-for="(item,index) in data" v-if="item.food.length" :key='index'>
			<view class="block">
				<view class="tab2">
					<view class="tab2-1">共{{ item.food ? item.food.length : '' }}件商品</view>
					<!-- 订单商品列表 start -->
					<block v-if="item.food.length" v-for="list in item.food" :key="list.id">
						<view class="tab2-2">
							<view class="tab2-2-1">
								<view class="tab2-2-1-img">
									<image :src="list.cover ? list.cover[0] : '/static/noImg.png'" mode="aspectFill"></image>
								</view>
								<view class="tab2-2-1-1">
									<view class="tab2-2-2-1">
										<view class="tab2-2-2-1-title1">{{ list.name }}</view>
										<view class="tab2-2-2-1-title2">
											￥{{parseFloat(list.num) * parseFloat(list.price)}}
										</view>
									</view>
									<view class="tab2-2-1-2">
										<text>×{{ list.num }}</text>
									    <text>{{ (list.is_refund==1 || list.refund_status==2)?'已退菜':list.refund_status==1?'退菜审核中':list.refund_status==3?'退菜审核失败':list.is_delivery==1?'已配送':list.is_finish==1?'配送中':!list.deal_user_id?'等待制作': dishStatus[list.make_status] +'中'}}</text>											
									</view>
								</view>
							</view>
						</view>
					</block>
                   <view class="tab3-1 bor-bt">
						<view class="tab3-1-1">下单时间:</view>
						<view class="tab3-1-2">{{ $api.format(item.create_time) }}</view>
                   </view>
				   <view class="tab3-1 bor-bt" v-if=" item.couponid">
				   	<view class="tab3-1-1">已优惠:</view>
				   	<view class="tab3-1-2">{{ '-￥'+ item.coupon_price+'元'}}</view>
				   </view>
				   <view class="tab3-1">
				   	<view class="tab3-1-1">实付金额:</view>
				   	<view class="tab3-1-2">￥{{ item.total_fee}}元</view>
				   </view>
					<!-- 订单商品列表 end -->
				</view>
				
			</view>
		</block>
	<view class="white-block"></view>
	<x-footer></x-footer>
	<nodata v-if="data.length==0 && !loading" msg="本桌还未点单哦~"></nodata>
	<showmodal :modal='scanModal' msg='是否呼叫服务员' @sure='sure' @hide='hide' v-if="scanModal"></showmodal>
    <drag-button :isDock="true" :existTabBar="true" showImg="/static/newimg/hujiao.png" @btnClick="btnClick" />
	</view>
</template>

<script>
	import xFooter from '../../components/footer.vue';
	import { mapState } from 'vuex';
	import dragButton from "../../components/drag-button.vue";
	import nodata from '../../components/nodata.vue';
	import showmodal from '../../components/showmodal.vue';
	export default {
		data() {
			return {
				data: '',
				isLoad: false,
				loading: true,
				dishStatus:"",
				deskId:"",
				deskNum:"",
				scanModal: false,
				
			};
		},
		components:{nodata,xFooter,showmodal,dragButton},
		computed: mapState(['_config','needScan']),
		onShow() {
			if(this.needScan){
				uni.redirectTo({
					url:'../index/scan'
				})
				return
			}
		},
		onLoad(e) {
			if(!this.needScan){
				this.getData();
				this.getdishStatus()
			}
		},
		onPullDownRefresh() {
			this.getData();
		},
		methods: {
			// 确认呼叫服务员弹窗操作
			sure(e) {
				if (e) {
					let _this = this;
					_this.$api.ajax(
						'smdc/message/toAddWaitMessage', {
							shop_id: _this.$store.state.shopId,
							no: _this.$store.state.deskId,
						},
						function(ret) {
							_this.scanModal = false
							_this.$api.toast('稍等片刻,服务员马上就来!')
							
						})
				}
			},
			hide(e) {
				this.scanModal = false
			},
			
			// 呼叫服务员
			btnClick() {
				console.log(this.$store.state.serviveTiem)
				let lasttime = uni.getStorageSync('serviveTiem')
				let nowtime = new Date().getTime()
				let stime = this.$store.state.serviveTiem *60 *1000
				if(nowtime >(lasttime+stime)){
					this.scanModal =true
				}else{
					this.$api.toast('您的呼叫服务我们已经收到,当前服务员正在忙，请稍等片刻哦~')
				}
			},
			
			// 获取菜品状态列表
			getdishStatus() {
				let _this = this;
				_this.load = true
				_this.$api.ajax('smdc/food_process/FoodProcessList', {
					shop_id: _this.$store.state.shopId,
				}, function(ret) {
					_this.dishStatus = ret.data
				}, 'POST')
			},
			
			// 获取订单数据
			getData() {
				let _this = this;
				_this.$api.ajax(
					'smdc/order/deskOrder', {
						deskid:this.$store.state.deskId,
						shop_id: this.$store.state.shopId
					},
					function(ret) {
						_this.loading = false;
						let data = ret.data;
						_this.deskId = _this.$store.state.deskId
						_this.deskNum = _this.$store.state.deskNum
						_this.data = data;
					} ,"POST",true);
			},
			getPrice(sale_price, price, num) {
				let res = sale_price == '0.00' ? parseInt(num) * parseFloat(price) : parseInt(num) * parseFloat(sale_price);
				return res;
			}
		}
	};
</script>

<style lang="scss">
	.nocounp-img {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 30upx;
		color: #666666;

		.img {
			width: 475upx;
			height: 351upx;
			margin: 100upx 0 0 0;
		}
	}

	.block {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.tab1 {
		width: 700upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #ffffff;
		border-radius: 20upx;
		margin-top: 37upx;
		padding: 44upx 0;
	}

	.tab1-1 {
		color: #222222;
		font-size: 34upx;
		/* font-weight: bold; */
	}

	.tab1-1-tip {
		font-size: 24upx;
		margin: 5upx;
		color: #999999;
	}

	.tab1-1-cancel {
		border: 1upx solid #EEEEEE;
		padding: 10upx 17upx;
		font-size: 24upx;
		margin-top: 20upx;
	}

	.tab1-2 {
		color: #888888;
		font-size: 24upx;
		/* 	font-weight: bold; */
		margin: 30upx 0 32upx 0;
	}

	.tab1-3 {
		color: #222222;
		font-size: 28upx;
		margin-bottom: 34upx;
	}

	.tab1-4 {
		width: 129upx;
		height: 41upx;
		color: #666666;
		font-size: 22upx;
		border: 1px solid #bfbfbf;
		border-radius: 4upx;
		text-align: center;
		line-height: 42upx;
	}

	.tab2 {
		background-color: #ffffff;
		border-radius: 30upx;
		display: flex;
		flex-direction: column;
		padding: 0 30upx 30upx 30upx;
		margin-bottom: 30upx;
	}

	.tab2-1 {
		height: 89upx;
		color: #222222;
		font-size: 30upx;
		line-height: 89upx;
		border-bottom: 1upx solid #eeeeee;
	}

	.tab2-3 {
		display: flex;
		justify-content: flex-end;
		align-items: baseline;
		margin-top: 30upx;
	}

	.price1 {
		color: #666666;
		font-size: 24upx;
		margin-right: 17upx;
	}

	.price2 {
		color: #fc5f34;
		font-size: 32upx;
	}

	/* 订单商品列表 start */
	.tab2-2 {
		display: flex;
		flex-direction: column;
		border-bottom: 1upx solid #eeeeee;
		padding: 20upx 0;
	}

	.tab2-2-2 {
		display: flex;
		justify-content: space-between;
	}

	.tab-2-2-1-img {
		margin-right: 11upx;
	}

	.tab-2-2-1-img image {
		width: 29upx;
		height: 29upx;
	}

	.tab-2-2-l {
		color: #222222;
		font-size: 28upx;
		display: flex;
	}

	.tab-2-2-r {
		display: flex;
		color: #444444;
		font-size: 26upx;
	}

	.tab-2-2-r-img image {
		width: 14upx;
		height: 22upx;
	}

	.tab-2-2-r-img {
		margin-left: 17upx;
	}

	.tab2-2-1 {
		display: flex;
	}

	.tab2-2-1-img image {
		width: 96upx;
		height: 96upx;
		margin-right: 17upx;
		border-radius: 10upx;
	}

	.tab2-2-2-1 {
		width: 534upx;
		color: #222222;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.tab2-2-2-1-title1 {
		font-weight: bold;
		font-size: 24upx;
	}

	.tab2-2-2-1-title2 {
		font-size: 26upx;
	}

	.tab2-2-1-2 {
		color: #888888;
		font-weight: bold;
		font-size: 26upx;
		margin-top: 20upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	/* 订单商品列表 end */
	.tab3 {
		width: 704upx;
		background-color: #ffffff;
		border-radius: 30upx;
		padding: 0 30upx;
		font-size: 26upx;
		color: #222222;
	}
    .bor-bt{
		border-bottom: 1upx solid #eeeeee;
	}
	.tab3-1 {
		display: flex;
		padding: 30upx 0;
		align-items: center;
	}

	.tab3-1-1 {
		width: 26%;
		color: #222;
		font-weight: bold;
		font-size: 30rpx;
	}
	.tab4 {
		width: 100%;
		height: 98upx;
		display: flex;
		position: fixed;
		bottom: 0;
	}

	.tab4-1 {
		width: 100%;
		background-color: #fc6840;
		color: #ffffff;
		font-size: 36upx;
		text-align: center;
		line-height: 98upx;
		border-radius: 0;
	}

	.tab4-2 {
		width: 100%;
		background-color: #fdb62e;
		color: #222222;
		font-size: 36upx;
		text-align: center;
		line-height: 98upx;
		border-radius: 0;
	}

	.white-block {
		height: 118upx;
	}

	.border-bottom {
		border: none;
	}

	.select-coupon {
		padding-top: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 26rpx;
		color: #222;

		.left {
			display: flex;
			align-items: center;

			.icon {
				width: 40upx;
				height: 40upx;
				margin-right: 10rpx;
			}
		}

		.right {
			display: flex;
			align-items: center;
		}
	}
	.mar-20{
		margin: 20upx;
	}
</style>
