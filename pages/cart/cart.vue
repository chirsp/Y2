<template>
	<view class="">
		<view class="viwe1" v-if="cartList.length !='0'">
			<view class="x-flex-sp car-title">
				<view>已选菜品（共{{cartList.length}}道）</view>
				<view class="clearCart" @click="clearBuyCar">清空</view>
			</view>
			<scroll-view scroll-y style=" margin-bottom: 250upx">
			<view v-for="(item,index) in cartList" :key="index">
				<view v-if="item.nums && item.nums != '0'" style="padding: 0 30upx;">
					<goods :item="item" :index="index" type='2' @addNums="addNums" @removeNums="removeNums" :totalCount='totalCount'
					 :totalMoney='totalMoney'></goods>
				</view>
			</view>
			<view class="tab3">
				<view class="tab3-1">
					<view class="tab3-1-1">桌&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号:</view>
					<view class="tab3-1-2">{{ deskId }}</view>
				</view>
				<view class="tab3-1">
					<view class="tab3-1-1">用餐人数:</view>
					<view class="tab3-1-2">{{ deskNum }}人</view>
				</view>
				<view class="tab3-1" v-if="_config.table_fee">
					<view class="tab3-1-1">餐&nbsp;&nbsp;位&nbsp;&nbsp;费:</view>
					<view class="tab3-1-2">￥{{alreadyOId?'0':_config.table_fee?_config.table_fee:'0'}}/人</view>
				</view>
				<view class="tab3-1" v-if="_config.season_fee">
					<view class="tab3-1-1">调&nbsp;&nbsp;味&nbsp;&nbsp;费:</view>
					<view class="tab3-1-2">￥{{alreadyOId?'0':_config.season_fee?_config.season_fee:'0'}}/人</view>
				</view>
				<view class="tab3-1 bor-bt" v-if="_config.tissue_fee">
					<view class="tab3-1-1">纸&nbsp;&nbsp;巾&nbsp;&nbsp;费:</view>
					<view class="tab3-1-2">￥{{alreadyOId?'0':_config.tissue_fee?_config.tissue_fee:'0'}}/桌</view>
				</view>
				<view class="tab3-1">
					<view class="tab3-1-1">原价:</view>
					<view class="tab3-1-2">￥{{ originMoney.toFixed(2) || '0.00' }}</view>
				</view>
				<view class="tab3-1">
					<view class="tab3-1-1">优惠价:</view>
					<view class="tab3-1-2">￥{{ totalMoney.toFixed(2) || '0.00'}}</view>
				</view>
			</view>
			<view class="white-block"></view>
			</scroll-view>
			<button class="order-right" @click="checkOrder">确认下单</button>
		</view>
		<vie v-if="isShow">
				<!-- 请先添加菜品 -->
				<image src="../../static/cart.png" mode="widthFix" class="needcartBox"></image>
		</vie>
		<view v-if="status">
			<x-footer></x-footer>
		</view>
	</view>
</template>

<script>
	let sys = uni.getSystemInfoSync();
	import xFooter from '../../components/footer.vue';
	import goods from '../../components/goods.vue';
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				sys: sys, //系统信息
				keyWord: '',
				alreadyOId:'',
				scroll_h: 0, //scrollview高度
				current: 0, //当前选中的分类
				tab: [], //数据
				mask_show: false, //显示选中的菜
				totalCount: 0, //数量
				totalMoney: 0, //总价
				originMoney: 0, //原价
				status: 1,
				isIpx: -1,
				foodlist: [],
				page: 1,
				isLoad: false,
				refresh: false,
				TabCur: 0,
				scrollLeft: 0,
				listeva: "",
				order_id: '',
				cartList: '',
				orderId: "",
				orderNo: "",
				canwei_price: 0,
				scanModal: false,
				token:"",
				payTypeList: [{
					id: 1,
					name: "微信支付"
				}],
				pay_current: 0,
				shop_id:'',
				isShow:false
			};
		},
		computed: mapState(['_buyList', '_orderId', '_orderNo', '_config', 'deskNum', 'needScan','deskId']),
		components: {
			xFooter,
			goods,
		},
		onLoad() {
			this.isIpx = sys.model.indexOf('iPhone X');
			let wx_audit = this.$api.getStorage('wx_audit');
			this.status = wx_audit.status;
			// 餐位费  调味费  纸巾费
			this.canwei_price = (parseFloat(this._config.table_fee) + parseFloat(this._config.season_fee)) * parseFloat(this.deskNum) + parseFloat(this._config.tissue_fee)
		},
		onShow() {
			if (this.needScan) {
				uni.redirectTo({
					url: '../index/scan'
				})
				return
			}
			this.token = uni.getStorageSync('kejia_order_token')
			this.token && this.getCart()
			//this.getCart()
		},
		methods:{
			...mapMutations(['_addBuyList', '_removeBuyList', '_clearBuyList', '_initBuyList']),
			// 获取购物车列表
			getCart() {
				let _this = this;
				_this.$api.ajax('smdc/cart/cartList', {
					shop_id: _this.$store.state.shopId,
					deskid: _this.$store.state.deskId,
				}, function(ret) {
					_this.cartList = ret.data.foodlist
					if(_this.cartList.length == '0' ){
						_this.isShow = true
					}
					
					_this.originMoney = 0;
					_this.totalMoney = 0;
					for (var i=0; i<_this.cartList.length; i++)
					{
					      _this.originMoney += (_this.cartList[i].price * _this.cartList[i].nums);
					      _this.totalMoney += (_this.cartList[i].sale_price * _this.cartList[i].nums);
					}
					if(_this.canwei_price instanceof Number){
						_this.originMoney += parseFloat(_this.canwei_price);
						_this.totalMoney += parseFloat(_this.canwei_price);
					}
					
				},"POST",true)
			},
			//增加数量
			addNums(e) {
				let _this = this;
				let type = e.type
				if (type == 1) {
					var id = _this.foodlist[e.index].id
				} else {
					var id = _this.cartList[e.index].id
				}
				_this.$api.ajax('smdc/cart/add', {
					shop_id: _this.$store.state.shopId,
					deskid: _this.$store.state.deskId,
					id: id,
				}, function(ret) {
					_this.getCart()
				})
			},
			
			//减少数量
			removeNums(e) {
				let _this = this;
				let type = e.type
				if (type == 1) {
					var id = _this.foodlist[e.index].id
				} else {
					var id = _this.cartList[e.index].id
				}
				_this.$api.ajax('smdc/cart/sub', {
					shop_id: _this.$store.state.shopId,
					deskid: _this.$store.state.deskId,
					id: id,
				}, function(ret) {
					_this.getCart()
				})
			},
			
			//清空购物车
			clearBuyCar() {
				let _this = this;
				_this.$api.ajax('smdc/cart/clearAll', {
					shop_id: _this.$store.state.shopId,
					deskid: _this.$store.state.deskId,
				}, function(ret) {
					_this.getCart()
					_this.mask_show = false
				})
			},
			//获取选中的商品集合
			// getOrder() {
			// 	// if (this.totalCount == 0 || this.totalCount == '0') {
			// 	// 	return;
			// 	// }
			// 	this.checkOrder()
			// },
			// 检测同一个桌号是否已经有下单
			checkOrder() {
				let that = this
				that.$api.ajax('smdc/desk/getDetail', {
					shop_id: that.$store.state.shopId,
					no: that.$store.state.deskId,
				}, function(e) {
					console.log(JSON.stringify(e));
					if (e.data && e.data.order_id) {
						let alreadyOId = e.data.order_id
						that.addfunction(alreadyOId)
					} else {
						let alreadyOId = ""
						// that.totalMoney = parseFloat(that.totalMoney) + parseFloat(that.canwei_price)
						that.addfunction(alreadyOId)
					}
				}, "POST")
			},
			
			// 提交订单
			addfunction(alreadyOId) {
				let _this = this;
				_this.$api.ajax('smdc/order/addorder', {
					shop_id: _this.$store.state.shopId,
					deskid: _this.$store.state.deskId,
					custom: _this.$store.state.deskNum,
					sale_type: _this.eatType || 0,
					total_price: _this.totalMoney,
					desk_price: _this._config.table_fee,
					couponid: 0,
					foodlist: JSON.stringify(_this.cartList),
					coupon_price: 0,
					bz: "",
					codeNo: "",
					formid: ""
				}, function(ret) {
					if(ret.status==0){
						uni.showModal({
						  title: '系统提示',
						  content: ret.msg,
						  success (res) {
						    if (res.confirm) {
						      _this.getCart()
						    } else if (res.cancel){
								_this.getCart()
							}
						  }
						})
					}else{
						let orderNo = ret.data.order_no;
						let orderId = ret.data.order_id;
						_this.orderNo = orderNo;
						_this.orderId = orderId
						//_this.$api.toast('提交成功', 'success');
						_this.$store.commit('_setOrderId', {
							orderId: _this.orderId,
							orderNo: _this.orderNo
						});
						// uni.navigateTo({
						// 	url: '../order-details/order-details?orderId=' + _this.orderId + '&type=1' + '&alreadyOId=' + alreadyOId
						// })
						console.log(ret);
						uni.showModal({
						    title: '立即支付',
						    content:"确认支付吗?",
						    success: function (res) {
						        if (res.confirm) {
						            console.log('用户点击确定');
									// uni.navigateTo({
									// 	url: '../order-details/order-details?orderId=' + _this.orderId + '&type=1' + '&alreadyOId=' + alreadyOId
									// })
									// _this.pay()
									if (_this.payTypeList[_this.pay_current].id == 1) {
										console.log('确定了')
										_this.pay_wx();
									} else {
										_this.$api.toast("支付方式异常");
									}
						        } else if (res.cancel) {
						            console.log('用户点击取消');
									uni.navigateTo({
									    //url: '/pages/cart/cart'
									    // url: 'pages/order-details/order-details'
										url: '../order-details/order-details?orderId=' + _this.orderId + '&type=1' + '&alreadyOId=' + alreadyOId
									});
						        }
						    }
						});
					}
				}, 'POST',true)
			},
			
			// pay() {
			// 	_this = this;
			// 	if (_this.payTypeList[_this.pay_current].id == 1) {
			// 		_this.pay_wx();
			// 	} else {
			// 		_this.$api.toast("支付方式异常");
			// 	}
			// },
			
			pay_wx() {
				let _this = this;
			
				// #ifdef APP-PLUS 
				let url = 'smdc/order/apppay'
				// #endif
			
				// #ifdef MP-WEIXIN
				let url = 'smdc/order/wxpay'
				// #endif
				console.log(url);
				_this.$api.ajax(url, {
					//out_trade_no: _this.data.order_no,
					out_trade_no: _this.orderNo,
					shop_id: _this.$store.state.shopId,
					formid: 'he formId is a mock one',
				}, function(ret) {
					console.log(url);
					_this.$api.wxPay(ret.data, '/pages/my-orders/my-orders')
				}, 'POST')
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
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
	.car-title {
		font-size: 26upx;
		color: #888;
		line-height: 50upx;
		padding: 0 24upx 30upx;
	}
	.needcartBox {
		position: fixed;
		width: 100%;
		height: 100%;
	}
	button.order-right{
		position: fixed;
		width:200upx;
		background-color:#FEB026;
		color: #fff;
		bottom:100upx;
		font-size:28upx;
		right:20upx;
		height:80upx;
		text-align:center;
		line-height:80upx;
		border: none;
	}
	@media screen and (min-height:700px) and (max-height:1200px) {
	   button.order-right{
	   	width:260upx;
	   	bottom:160upx;
	   	font-size:30upx;
	   	right:20upx;
	   	height:100upx;
	   	line-height:100upx;
	   }
	}
	@media only screen and (device-width:375px) and (device-height:812px) and (-webkit-device-pixel-ratio:3) {
	   button.order-right{
	   	width:260upx;
	   	bottom:160upx;
	   	font-size:30upx;
	   	right:20upx;
	   	height:100upx;
	   	line-height:100upx;
	   }
	}
</style>
