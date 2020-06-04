<template>
	<view v-if="data">
		<block v-if="data.admin_check === 1 && data.status== 0">
			<view class="block">
				<view class="tab2">
					<view class="tab2-1">共{{ data.food ? data.food.length : '' }}件商品</view>
					<!-- 订单商品列表 start -->
					<block v-if="data.food.length" v-for="list in data.food" :key="list.id">
						<view class="tab2-2">
							<view class="tab2-2-1">
								<view class="tab2-2-1-img">
									<image :src="list.cover ? list.cover[0] : '/static/noImg.png'" mode="aspectFill"></image>
								</view>
								<view class="tab2-2-1-1">
									<view class="tab2-2-2-1 mar-20">
										<view class="tab2-2-2-1-title1" :hidden="list.tid || list.tid !='0'">{{ list.name }}</view>
										<view class="tab2-2-2-1-title1" :hidden="!list.tid || list.tid =='0'">{{ list.name }}--{{list.label_name}}</view>
										<view class="tab2-2-2-1-title2">
											￥{{list.pricex}}
										</view>
									</view>
									<view class="flex_row flex_sb">
										<text>×{{ list.num }}</text>
									</view>
								</view>
							</view>
						</view>
					</block>
					
					<view class="tab3-1">
						<view class="tab3-1-1">桌 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号:</view>
						<view class="tab3-1-2">{{ data.deskid }}</view>
					</view>
					<view class="tab3-1">
						<view class="tab3-1-1">用餐人数:</view>
						<view class="tab3-1-2">{{ data.custom }}人</view>
					</view>
					<view class="tab3-1">
						<view class="tab3-1-1">餐&nbsp;&nbsp;位&nbsp;&nbsp;费:</view>
						<view class="tab3-1-2">￥{{alreadyOId?'0':_config.table_fee?_config.table_fee:'0'}}/人</view>
					</view>
					<view class="tab3-1" >
						<view class="tab3-1-1">调&nbsp;&nbsp;味&nbsp;&nbsp;费:</view>
						<view class="tab3-1-2">￥{{alreadyOId?'0':_config.season_fee?_config.season_fee:'0'}}/人</view>
					</view>
					<view class="tab3-1 bor-bt" >
						<view class="tab3-1-1">纸&nbsp;&nbsp;巾&nbsp;&nbsp;费:</view>
						<view class="tab3-1-2">￥{{alreadyOId?'0':_config.tissue_fee?_config.tissue_fee:'0'}}/桌</view>
					</view>

					<view class="select-coupon" @click="showCoupon" v-if="!data.couponid &&  _config.is_open_coupon =='1'">
						<view class="left">
							<image src="/static/coupon_icon.png" class="icon"></image>
							<view>可用优惠券</view>
						</view>

						<view class="right">
							<view v-if="couponInfo" style="color: red;">{{couponInfo.coupon_name}}</view>
							<view v-else>{{couponList.length ? couponList.length+'张优惠券' : '暂无优惠券'}}</view>
							<text class="lg text-gray cuIcon-right"></text>
						</view>
					</view>

					<!-- 优惠券窗口 -->
					<view class="cu-modal bottom-modal" :class="show_coupon?'show':''">
						<view class="cu-dialog">
							<view class="cu-bar bg-white">
								<view class="action text-blue" @tap="useCoupon(false)">不使用用优惠券</view>
								<view class="action text-green" @tap="useCoupon(true)">确定</view>
							</view>
							<view class="">
								<scroll-view scroll-y style="height: 800upx;">
									<block v-for="(item,i) in couponList" :key="i" v-if="couponList.length">
										<coupon :list="item" :index="i" :current="current" @selectCoupon="selectCoupon"></coupon>
									</block>
									<view v-if="couponList.length==0" class="nocounp-img">
										<image class="img" src="../../../static/newimg/nocounp.png" mode=""></image>
										<text class="notip">暂无可用优惠券</text>
									</view>
								</scroll-view>
							</view>
						</view>
					</view>

					<!-- 订单商品列表 end -->
					<view class="tab2-3">
						<view v-if="data.couponid" class="price1">共优惠￥{{ data.coupon_price }}</view>
						<view v-else-if="couponInfo.coupon_price" class="price1">共优惠￥{{ couponInfo.coupon_price }}</view>
						<view class="price2">￥{{ couponInfo ? totalMoney2 : data.total_price }}</view>
					</view>
				</view>
				<view class="white-block"></view>
			</view>
		</block>
		<block v-else>
			<view class="block">
				<view class="tab2">
					<view class="tab2-1">共{{ data.food ? data.food.length : '' }}件商品</view>
					<!-- 订单商品列表 start -->
					<block v-if="data.food.length" v-for="list in data.food" :key="list.id">
						<view class="tab2-2">
							<view class="tab2-2-1">
								<view class="tab2-2-1-img">
									<image :src="list.cover ? list.cover[0] : '/static/noImg.png'" mode="aspectFill"></image>
								</view>
								<view class="tab2-2-1-1">
									<view class="tab2-2-2-1 mar-20">
										<view class="tab2-2-2-1-title1" :hidden="list.tid || list.tid !='0'">{{ list.name }}</view>
										<view class="tab2-2-2-1-title1" :hidden="!list.tid || list.tid =='0'">{{ list.name }}--{{list.label_name}}</view>
										<view class="tab2-2-2-1-title2">
											￥{{list.pricex}}
										</view>
									</view>
									<view class="flex_row flex_sb">
										<text>×{{ list.num }}</text>
										<view v-if="type !=1 && data.status==1">
											
											<text>{{data.admin_check==2?'已取消':(list.is_refund==1 || list.refund_status==2)?'已退菜':list.refund_status==1?'退菜审核中':list.refund_status==3?'退菜审核失败':list.is_delivery==1?'已配送':list.is_finish==1?'配送中':!list.deal_user_id?'等待制作':dishStatus[list.make_status]+'中' }}</text>
											
										</view>
									</view>
								</view>
							</view>
						</view>
					</block>

					<view class="tab3-1">
						<view class="tab3-1-1">桌 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号:</view>
						<view class="tab3-1-2">{{ data.deskid }}</view>
					</view>
					<view class="tab3-1">
						<view class="tab3-1-1">用餐人数:</view>
						<view class="tab3-1-2">{{ data.custom }}人</view>
					</view>
					<view class="tab3-1">
						<view class="tab3-1-1">餐&nbsp;&nbsp;位&nbsp;&nbsp;费:</view>
						<view class="tab3-1-2">￥{{alreadyOId?'0':_config.table_fee?_config.table_fee:'0'}}/人</view>
					</view>
					<view class="tab3-1" >
						<view class="tab3-1-1">调&nbsp;&nbsp;味&nbsp;&nbsp;费:</view>
						<view class="tab3-1-2">￥{{alreadyOId?'0':_config.season_fee?_config.season_fee:'0'}}/人</view>
					</view>
					<view class="tab3-1 bor-bt" >
						<view class="tab3-1-1">纸&nbsp;&nbsp;巾&nbsp;&nbsp;费:</view>
						<view class="tab3-1-2">￥{{alreadyOId?'0':_config.tissue_fee?_config.tissue_fee:'0'}}/桌</view>
					</view>

					<!-- 订单商品列表 end -->
					<view class="tab2-3">
						<view v-if="data.coupon_price && data.coupon_price != '0.00'" class="price1">共优惠￥{{ data.coupon_price }}</view>
						<view class="price2">订单实付:￥{{data.total_fee || '0.00' }}</view>
					</view>
				</view>
				<view class="white-block"></view>
			</view>
		</block>
		
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	export default {
		data() {
			return {
				orderId: 0,
				alreadyOId:'',//上一个页面传下来的，判断桌子是否已经下单的id
				data: '',
				isNoPay: false,
				isLoad: false,
				show_coupon: false, //优惠券弹窗 
				couponList: [],
				couponInfo: '',
				totalMoney2: 0,
				current: 0,
				payTypeList: [{
					id: 1,
					name: "微信支付"
				}],
				pay_current: 0,
				formId: '',
				minute: 30,
				second: 0,
				hour: 0,
				reset: false,
				dishStatus: '',
				type: '', //1代表是点单页面进入的订单详情
				refundModal:false,
				list:"",
				refundtype:"",
				cancle_time:this.$store.state.cancle_time 
			};
		},
		computed: mapState(['_config']),
		onPullDownRefresh() {
			this.getData()
		},
		onLoad(e) {
			if (e.orderId) {
				this.orderId = e.orderId;
				this.type = e.type
				// this.getdishStatus()
				this.getData();
			}
		    e.alreadyOId && (this.alreadyOId = e.alreadyOId)
		},
		onShow() {
			this.orderId && this.getData()
		},
		methods: {
			// 获取菜品状态列表
			// getdishStatus() {
			// 	let _this = this;
			// 	_this.$api.ajax('smdc/food_process/FoodProcessList', {
			// 		shop_id: _this.$store.state.shopId,
			// 	}, function(ret) {
			// 		_this.dishStatus = ret.data
			// 	}, 'POST')
			// },

			// 用户退菜
			returnFood(list,type) {
			    this.refundModal = true
				this.refundtype = type 
				this.list = list
			},
		
			hide(){
				this.refundModal = false
			},
			// sure(){
			// 	let _this = this;
			// 	if(_this.refundtype==1){
			// 	    var url = "smdc/order/orderRefund"
			// 	}else if(_this.refundtype == 2){
			// 		var url = "smdc/order_Refund/add"
			// 	}
			// 	_this.$api.ajax(url, {
			// 		shop_id: _this.$store.state.shopId,
			// 		order_id: _this.orderId,
			// 		type: 0,
			// 		sale_food_id: _this.list.id,
			// 		deskid:_this.$store.state.deskId,
			// 		money:_this.list.pricex,
			// 	}, function(ret) {
			// 		_this.refundModal = false
			// 		if(ret.status==0){
			// 			uni.showModal({
			// 			  title: '系统提示',
			// 			  content: ret.msg,
			// 			  success (res) {
			// 			    if (res.confirm) {
			// 			      _this.getData()
			// 			    } else if (res.cancel){
			// 					_this.getData()
			// 				}
			// 			  }
			// 			})
			// 		}else{
			// 			_this.getData()
			// 		}
			// 	}, 'POST',true)
			// },

			// 倒计时取消订单
			// timeUp() {
			// 	var _this = this
			// 	_this.$api.ajax('smdc/order/cancelOrder', {
			// 		shop_id: _this.$store.state.shopId,
			// 		id: this.orderId
			// 	}, function(ret) {
			// 		_this.$api.toast('订单已取消', 'success');
			// 		setTimeout(function() {
			// 			_this.$store.commit('_clearOrderId');
			// 			_this.getData()
			// 		}, 1000)
			// 	}, 'POST');
			// },
			getData() {
				let _this = this;
				_this.$api.ajax(
					'smdc/order/get_shop_order_detail', {
						order_id: _this.orderId,
						shop_id: this.$store.state.shopId
					},
					function(ret) {
						setTimeout(function(){
							uni.stopPullDownRefresh()
						},2000)
						let data = ret.data;
						data.food.map(item => (
							item.sale_price == '0.00' ? item.pricex = (parseInt(item.num) * parseFloat(item.price)).toFixed(2) : item.pricex =
							(parseInt(item.num) * parseFloat(item.sale_price)).toFixed(2)
						));
						// 计算支付倒计时
						// let nowtime = data.time; //获取当前时间
						// let canceltime = _this.cancle_time * 60 //15min的秒数,订单超过15分钟未支付就自动取消
						// let endTime = data.create_time + canceltime; // 最晚可以支付结束时间
						// let usedTime = endTime - nowtime ; // 支付相差的秒数
						// if (usedTime> 0 && data.status==0 && data.admin_check==1 ) { 
						// 	let days = Math.floor(usedTime / (24 * 3600)); // 计算出天数
						// 	let hours = Math.floor((usedTime % (24 * 3600))/3600);
						// 	let minutes = Math.floor(((usedTime % (24 * 3600))%3600)/60);
						// 	let miao = usedTime%60;
						// 	_this.hour = hours
						// 	_this.minute = minutes
						// 	_this.second = miao
						// } else if(data.admin_check === 1 && data.status==0){
						// 	_this.hour =0
						// 	_this.minute = 0
						// 	_this.second = 0
						// 	_this.timeUp() 
						// }
						_this.data = data
					},"POST",true
				);
			},
			// setCoupon(e) {
			// 	if (e.detail.formId) {
			// 		this.formId = e.detail.formId
			// 	}
			// 	if (this.couponInfo) {
			// 		let _this = this;
			// 		_this.$api.ajax('smdc/order/set_order_info', {
			// 			shop_id: _this.$store.state.shopId,
			// 			order_no: _this.data.order_no,
			// 			total_price: _this.totalMoney2,
			// 			couponid: _this.couponInfo ? _this.couponInfo.id : 0,
			// 			coupon_price: _this.couponInfo ? _this.couponInfo.coupon_price : 0
			// 		}, function(ret) {
			// 			_this.pay();
			// 		}, 'POST')
			// 	} else {
			// 		this.pay();
			// 	}
			// },
			// pay() {
			// 	if (this.payTypeList[this.pay_current].id == 1) {
			// 		this.pay_wx();
			// 	} else {
			// 		this.$api.toast("支付方式异常");
			// 	}
			// },

			// pay_wx() {
			// 	let _this = this;

			// 	// #ifdef APP-PLUS 
			// 	let url = 'smdc/order/apppay'
			// 	// #endif

			// 	// #ifdef MP-WEIXIN
			// 	let url = 'smdc/order/wxpay'
			// 	// #endif

			// 	_this.$api.ajax(url, {
			// 		out_trade_no: _this.data.order_no,
			// 		shop_id: _this.$store.state.shopId,
			// 		formid: _this.formId,
			// 	}, function(ret) {
			// 		_this.$api.wxPay(ret.data, '/pages/my-orders/my-orders')
			// 	}, 'POST')
			// },
			// goMenu() {
			// 	this.$store.commit('_setOrderId', {
			// 		orderId: this.data.id,
			// 		orderNo: this.data.order_no
			// 	});
			// 	uni.reLaunch({
			// 		url: '/pages/menu/menu'
			// 	})
			// },
			// closeOrder() {
			// 	this.$api.tempToast();
			// },
			showCoupon() {
				if (this.couponList.length) {
					this.show_coupon = true;
				}
			},
			hideCoupon() {
				this.show_coupon = false;
			},
			selectCoupon(e) {
				console.log(e);
				this.current = e;
			},
			useCoupon(isUse) {
				if (isUse) {
					this.couponInfo = this.couponList[this.current];
					let totalMoney2 = parseFloat(this.data.total_fee) - parseFloat(this.couponList[this.current].coupon_price);
					this.totalMoney2 = parseFloat(totalMoney2).toFixed(2);
					//支付方式变为微信
					// if(this.payTypeList[this.pay_current].id==2){
					// 	this.pay_current=0;
					// 	this.$api.toast('优惠券不能和余额支付同时使用','none','2000');
					// }
				} else {
					this.couponInfo = '';
				}
				this.hideCoupon();
			},
			// selectPayType(e) {
			// 	console.log(e);
			// 	this.pay_current = e.detail.value;
			// 	// if(this.payTypeList[e.detail.value].id==2){
			// 	// 	if(this.couponInfo){
			// 	// 		this.couponInfo='';				
			// 	// 		this.$api.toast('优惠券不能和余额支付同时使用','none','2000');
			// 	// 	}
			// 	// }
			// },
			// getPrice(sale_price, price, num) {
			// 	let res = sale_price == '0.00' ? parseInt(num) * parseFloat(price) : parseInt(num) * parseFloat(sale_price);
			// 	return res;
			// },

			// 评价订单
			// evalOrder() {
			// 	uni.navigateTo({
			// 		url: '/pages/my-orders/evalOrder?id=' + this.orderId
			// 	})
			// },
		}
	};
</script>

<style lang="scss">
    .bor-bt{
		border-bottom: 1upx solid #eee;
	}
	.return_food {
		padding: 10upx 15upx;
		border-radius: 10upx;
		margin-right: 20upx;
	}

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
		margin: 30upx 0;
		display: flex;
		flex-direction: column;
		padding: 0 30upx 30upx 30upx;
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

	.tab3-1 {
		display: flex;
		padding: 30upx 0;
		// border-bottom: 1upx solid #eeeeee;
	}

	.tab3-1-1 {
		width: 22%;
		color: #222222;
		font-size: 30upx;
		font-weight: bold;
		text-align-last: justify;
		margin-right: 6%;
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

	.mar-20 {
		margin-bottom: 20upx;
	}
</style>
