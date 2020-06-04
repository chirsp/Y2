<template>
	<view class="page">
		<view v-if="loading">
			<loading></loading>
		</view>
		<block v-else>
			<!-- 门店/外带 start -->
				<!-- <viwe class="taketype">
					<text class="ordertype" :class="eatType==0?'takeselect':'untakeselect'" @click="changeType(0)">门店</text>
					<text class="ordertype" :class="eatType==1?'takeselect':'untakeselect'" @click="changeType(1)">外带</text>
				</viwe> -->
				<!-- 门店/外带 end -->
				<!-- 餐桌号 start -->
				<view class="page-block table-block">
					<view class="table-one underline padding-b">
						<view class="table-one-a">餐桌号:{{deskId}}</view>
						<view class="table-one-b">{{deskNum}}人用餐</view>
					</view>
				</view>
				<block v-if="eatType==0">
					<view class="page-block table-block">
						<view class="table-one underline padding-b">
							<view class="table-one-a">餐位费</view>
							<view class="table-one-b">{{ _config.table_fee || '0'}} /人</view>
						</view>
					</view>
					<view class="page-block table-block">
						<view class="table-one underline padding-b">
							<view class="table-one-a">调味费</view>
							<view class="table-one-b">{{ _config.season_fee  || '0'}} /人</view>
						</view>
					</view>
				</block>
				<!-- 餐桌号 end -->
					
				<!-- 商品信息 start -->
				<view class="page-block goods-msg">
					<view class="goods-num">
						<view>共{{data.length}}件商品</view>
					</view>
					<block v-for="item in data" :key="item.id" v-if="item.nums">
						<view class="order">
							<view>
								<image :src="item.cover ? item.cover[0] : '/static/noImg.png'" class="goods-img"></image>
							</view>
							<view class="order-details">
								<view class="details">
									<view class="title1">{{item.name}}</view>
									<view class="price">￥{{item.sale_price != '0.00' ? item.sale_price : item.price}}</view>
								</view>
								<view class="x1">×{{item.nums}}</view>
							</view>		
						</view>
					</block>
			
					<view class="quan-block" @click="showCoupon" v-if="!orderId">
						<view class="quan-a">
							<view class="quan-img">
								<image src="/static/coupon_icon.png" class="quan"></image>
							</view>
							<view class="quan-words">可用优惠券</view>
						</view>
			
						<view class="quan-b">
							<view v-if="couponInfo" class="quan-price">{{couponInfo.coupon_name}}</view>
							<view v-else class="quan-price">{{couponList.length ? couponList.length+'张优惠券' : '暂无优惠券'}}</view>
							<view class="quan-img">
								<text class="lg text-gray cuIcon-right"></text>
							</view>
						</view>
					</view>
					
					<view class="flex_row flex_sb flex_ai canwei-words"  v-if="!orderId">
						<view >餐位费</view>
						<view class="total-price">￥{{parseFloat(_config.table_fee) * deskNum}}</view>
					</view>
					<view class="flex_row flex_sb flex_ai canwei-words"  v-if="!orderId">
						<view >调味费</view>
						<view class="total-price">￥{{parseFloat(_config.season_fee) * deskNum}}</view>
					</view>
					
					<view class="quan-bottom">
						<view class="youhui">
							{{couponInfo?'共优惠￥'+couponInfo.coupon_price : ''}}
						</view>
						<view class="xiaoji">
							<view class="xiaoji-a">小计:</view>
							<view class="total-price">￥{{couponInfo ? totalMoney2 : totalMoney}}</view>
						</view>
					</view>
				</view>
				<!-- 商品信息 end -->
			
				<view style="height: 150upx;"></view>
				<!-- 提交支付 start -->
			<!-- 	<view class="table-one margin-t pay-put-order">
					<view class="table-one-a">备注</view>
					<view class="table-one-b"><input type="text" v-model="bz" value="" placeholder="口味/偏好等您的要求" /></view>
				</view> -->
				<view class="pay-put">
					<view class="word1 word1-1">{{couponInfo?'共优惠￥'+couponInfo.coupon_price : ''}}</view>
					<view class="word1">合计:</view>
					<view class="pay-price">￥{{couponInfo ? totalMoney2 : totalMoney}}</view>
					<form @submit="showCode" report-submit="true">
						<button class="btn-pay" formType="submit">提交订单</button>
					</form>
				</view>
				<!-- 提交支付 end -->
				
				<!-- 优惠券窗口 -->
				<view class="cu-modal bottom-modal" :class="show_coupon?'show':''">
					<view class="cu-dialog">
						<view class="cu-bar bg-white">
							<view class="action text-blue" @tap="useCoupon(false)">不使用用优惠券</view>
							<view class="action text-green" @tap="useCoupon(true)">确定</view>
						</view>
						<view class="">
							<scroll-view scroll-y style="height: 800upx;">
								<block v-for="(item,i) in couponList" :key="i">
									<coupon :list="item" :index="i" :current="current" @selectCoupon="selectCoupon"></coupon>
								</block>
							</scroll-view>
						</view>
					</view>
				</view>
				
				<!-- 顾客人数弹窗 -->
				<view class="cu-modal" :class="code_show?'show':''">
					<view class="cu-dialog" style="margin-bottom: 200upx;">
						<view class="cu-bar bg-white justify-end">
							<view class="content">订餐验证码</view>
							<view class="action" @tap="hideCode">
								<text class="cuIcon-close text-red"></text>
							</view>
						</view>
						<view class="padding-xl" style="padding: 60upx 100upx;background: #fff;">
							<input type="number" placeholder="请联系服务员获取" v-model="codeNo" value="" class="person-input" />
						</view>
						<view class="cu-bar bg-white">
							<view style="height: 80upx;" class="action margin-0 flex-sub  solid-left" @tap="hideCode">取消</view>
							<view style="height: 80upx;" class="action margin-0 flex-sub text-green solid-left" @tap="submitOrder">确定</view>
						</view>
					</view>
				</view>
		</block>
	</view>
</template>

<script>
	import {
	    mapMutations,
		mapState
	} from 'vuex'
	import coupon from '../../components/coupon.vue';
	export default {
		data() {
			return {
				eatType:0,
				data:[],
				orderId:0,
				orderNo:0,
				totalMoney:0, //总价格
				totalMoney2:0,
				bz:'' ,//备注
				show_coupon:false, //优惠券弹窗 
				current:0,
				couponList:[],
				couponInfo:'',
				codeNo:'',
				formId:0,
				code_show:false,
				payTypeList:[{id:1,name:"微信支付"}],  //{id:2,name:"余额支付"},
				pay_current:0,
				canwei_price:0,
				loading: true,
				
			}
		},
		computed:mapState(['deskId','_buyList','_orderId','_orderNo','_config','hasLogin']),
		components: {
			coupon
		},
		onLoad() {
			this.getCart()
		},
		onShow() {
			// #ifdef MP-WEIXIN
			this.hasLogin ? this.getUserInfo() : this.$api.openWin('/pages/login/login') ;  // 获取用户信息
			// #endif
			
			// #ifndef MP-WEIXIN
			this.hasLogin ? this.getUserInfo() : this.$api.openWin('/pages/login/login1') ;  // 获取用户信息
			// #endif
			console.log('[餐位费]',this._config)
			this.eatType==0 && this.checkOrder()
		},
		methods: {
			...mapMutations(['_clearBuyList']),
	         
	        // 获取购物车列表
	        getCart(){
	        	let _this = this;
	        	_this.$api.ajax('smdc/cart/cartList',{
	        		shop_id:_this.$store.state.shopId,
	        		deskid:_this.$store.state.deskId,
	        	},function(ret){
					_this.loading = false;
	        		_this.data = ret.data.foodlist
					_this.totalMoney=parseFloat(ret.data.totalMoney)
					_this.canwei_price = (parseFloat(_this._config.table_fee)+ parseFloat(_this._config.season_fee))* _this.deskNum
	        	})
	        },
			
			// 检测同一个桌号是否已经有下单
			checkOrder(){
				let that = this
				that.$api.ajax('smdc/desk/getDetail',{
					shop_id:that.$store.state.shopId,
					no:that.$store.state.deskId,
				},function(e){
					if(e.data.order_id){
						that.orderId = e.data.order_id
						that.orderNo = e.data.order_no
					}else{
						that.totalMoney = parseFloat(that.totalMoney )+ parseFloat(that.canwei_price)
					}
				},"POST")
			},
			
			// 重新下单
			addfunction(){
				let _this = this;
				let money = this.couponInfo ? this.totalMoney2 : this.totalMoney
				// let total= !this.orderNo ? this.canwei_price + parseFloat(money) : parseFloat(money);
				// console.log(total)
				_this.$api.ajax('smdc/order/addorder',{
					shop_id:_this.$store.state.shopId,
					deskid:_this.$store.state.deskId,
					custom:_this.$store.state.deskNum,
					sale_type:_this.eatType,
					total_price:money.toFixed(2),
					desk_price:_this._config.table_fee,
					couponid:_this.couponInfo ? _this.couponInfo.id : 0,
					foodlist:JSON.stringify(_this.data),
					coupon_price:_this.couponInfo ? _this.couponInfo.coupon_price : 0,
					bz:_this.bz,
					codeNo:_this.codeNo,
					formid:_this.formId
				},function(ret){
					console.log(ret.data.order_no);
					let orderNo=ret.data.order_no;
					let orderId=ret.data.order_id;
					_this.orderNo=orderNo;
					_this.orderId=orderId
					_this.clearBuyCar();
					_this.$api.toast('提交成功','success');
					_this.$store.commit('_setOrderId',{
						orderId:_this.orderId,
						orderNo:_this.orderNo
					});
					uni.redirectTo({
						url:'../order-details/order-details?orderId='+_this.orderId+'&type=1'
					})
				} ,'POST')
			},
			
			getCoupon(){  // 获取用户优惠券信息
				let _this = this;
				this.$api.ajax('smdc/coupon/usercounpon',{
					shop_id:this.$store.state.shopId,
					type:0,
					limit:1000,
					page:1
				},function(ret){
					let data=ret.data.coupon_mine;
					if(data.length){
						for(let i=0,len=data.length;i<len;i++){
							if(data[i].status && parseFloat(_this.totalMoney) >= parseFloat(data[i].low_cash_price)){
								_this.couponList.push(data[i]);
							}
						}		
					}
				})
			},
			// 获取服务员点餐码之后进行点餐
			submitOrder() {
				this.hideCode();
				this.addOrder();
				// if(!this.orderNo){
				// 	this.addOrder();
				// }else{
				// 	this.pay();
				// }
			},
			addOrder() {
				let _this = this;
				if(this.$api.trim(_this.codeNo).length<3){
					this.$api.alert("请先联系服务员取订餐验证码~","亲爱的客官");
					return ;
				}
				_this.addfunction()
			},
			
			
			
			
			//继续点单
			addOrder2() {
				let _this = this;
				// if(this.$api.trim(_this.codeNo).length<3){
				// 	this.$api.alert("请先联系服务员获取订餐验证码~","亲爱的客官");
				// 	return ;
				// }
				_this.$api.ajax('smdc/order/addOrderFood',{
					shop_id:_this.$store.state.shopId,
					order_no:_this.orderNo,
					sale_type:_this.eatType,
					total_price:_this.totalMoney,
					foodlist:JSON.stringify(_this.data),
					formid:_this.formId
				},function(ret){
					_this.clearBuyCar();
					// _this.$api.toast('加菜成功','success');
					// setTimeout(function(){
					// 	uni.redirectTo({
					// 		url:'../pay-success/pay-success?orderId='+_this._orderId+'&orderNo='+_this._orderNo
					// 	})
					// },1000)
					uni.redirectTo({
						url:'../order-details/order-details?orderId='+_this.orderId+'&type=1'
					})
					return ;
				},'POST')
			},
			pay(){
				if(this.payTypeList[this.pay_current].id==1){
					this.pay_wx();
				}else if(this.payTypeList[this.pay_current].id==2){
					this.pay_balance();
				}else{
					this.$api.toast("支付方式异常");
				}
			},
			
			// 余额支付
			pay_balance() {
				let _this = this;
				_this.$api.ajax('smdc/order/yuprice',{
					order_no:_this.orderNo,
					shop_id:_this.$store.state.shopId,
					formid:_this.formId
				},function(ret){
					_this.$api.toast('支付成功','success');
					_this.$api.openWin('../pay-success/pay-success?orderId='+_this.orderId+'&orderNo='+_this.orderNo);
				},'POST');
			},
			
			// 微信支付
			pay_wx() {
				let _this = this;
				_this.$api.ajax('smdc/order/wxpay',{
					out_trade_no:_this.orderNo,
					shop_id:_this.$store.state.shopId,
					formid:_this.formId
				},function(ret){
					uni.requestPayment({
						provider: 'wxpay',
						timeStamp: ret.data.timeStamp,
						nonceStr: ret.data.nonceStr,
						package: ret.data.package,
						signType: 'MD5',
						paySign: ret.data.paySign,
						success: function (res) { 
							console.log('success:' + JSON.stringify(res));
							_this.$api.toast('支付成功','success');
							_this.$api.openWin('../pay-success/pay-success?orderId='+_this.orderId);
						},
						fail: function (err) {
							console.log('fail:' + JSON.stringify(err));
							_this.$api.alert('未支付','友情提示');
							// _this.$api.alert('未支付','友情提示',function(){
							// 	uni.redirectTo({
							// 		url:'../order-details/order-details?orderId='+_this.orderId
							// 	})
							// });
						}
					});
				},'POST')
			},
			//是否外带
			changeType(index) {
				this.eatType=index;
			},
			showCoupon() {
				if(this.couponList.length){
					this.show_coupon=true;
				}
			},
			hideCoupon() {
				this.show_coupon=false;
			},
			selectCoupon(e) {
				this.current=e;
			},
			useCoupon(isUse) {
				if(isUse){
					this.couponInfo=this.couponList[this.current];
					let totalMoney2=parseFloat(this.totalMoney)-parseFloat(this.couponList[this.current].coupon_price);
					this.totalMoney2=parseFloat(totalMoney2).toFixed(2);
					//支付方式变为微信
					if(this.payTypeList[this.pay_current].id==2){
						this.pay_current=0;
						this.$api.toast('优惠券不能和余额支付同时使用','none','2000');
					}
				}else{
					this.couponInfo='';
				}
				this.hideCoupon();
			},
			showCode(e) {
				let formId=e.detail.formId;
				this.formId=formId;
				console.log('[this._orderId]',this.orderId,this.orderNo)
				// this.orderId ? this.isPay() : this.code_show=true;
				// this.isPay()
				this.addfunction()
			},
			isPay() {
				let _this = this;
				_this.$api.ajax('smdc/order/ordernoStatus',{
					shop_id:_this.$store.state.shopId,
					deskid:_this.$store.state.deskId,
				},
					function(ret) {
						let status=ret.data.status;
						if(status==1){
							// _this.code_show=true;
							_this.orderId = ret.data.order_id
							_this.orderNo = ret.data.order_no
							_this.addOrder2();
						}
						else{
							_this.addfunction()
						}
					},"POST"
				);
			},
			
			//清空购物车数据
			clearBuyCar() {
				let _this = this;
				_this.$api.ajax('smdc/cart/clearAll',{
					shop_id:_this.$store.state.shopId,
					deskid:_this.$store.state.deskId,
				},function(ret){
					
				})
			},
			
			hideCode() {
				this.code_show=false;
			},
			selectPayType(e) {
				console.log(e);
				this.pay_current=e.detail.value;
				if(this.payTypeList[e.detail.value].id==2){
					if(this.couponInfo){
						this.couponInfo='';				
						this.$api.toast('优惠券不能和余额支付同时使用','none','2000');
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.canwei-words{
		padding: 20upx;
		font-size: 28upx;
	}
	.taketype{
		background-color: $skin;
		padding:0 25upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		.ordertype{
			border-radius:10upx 10upx 0upx 0upx;
			width: 336upx;
			text-align: center;
			padding: 16upx 0;
		}
		.takeselect{
			background-color: #FFFFFF;
			color: $skin;
		}
		.untakeselect{
			background-color: #EBEBEB;
			color: #313131;
		}
	}
	.person-input{
		border:2upx solid $skin;
		border-radius: 50upx;
		line-height: 80upx;
		height: 80upx;
		text-align: center;
	}
	.page-block{
		background: #fff;
	}
	/* 餐桌号 start */
	.table-block {
		display: flex;
		flex-direction: column;
		padding: 43upx 43upx 0 38upx;
	}

	.table-one {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.underline {
		border-bottom: 1px solid #EEEEEE;
	}

	.table-one-a {
		color: #222222;
		font-size: 30upx;
	}

	.table-one-b {
		font-size: 24upx;
		color: #888888;
		flex:1;
		padding-left: 20upx;
		text-align: right;
	}

	.padding-b {
		padding-bottom: 25upx;
	}

	.margin-t {
		margin-top: 31upx;
	}

	/* 餐桌号 end */
	/* 商品信息 start */
	.goods-msg {
	/* 	height: 408upx; */
		margin-top: 30upx;
		padding: 30upx 39upx 0 39upx;
	}

	.goods-num {
		color: #222222;
		font-size: 30upx;
		padding-bottom: 30upx;
		border-bottom: 1px solid #EEEEEE;
	}

	.goods-img {
		width: 96upx;
		height: 96upx;
		border-radius: 10upx;
	}

	.order-details {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: space-between;
	}

	.details {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		color: #222222;
		margin: 0 0upx 8upx 17upx;
	}

	.order {
		display: flex;
		flex-direction: row;
		margin: 19upx 0 32upx 0;
	}

	.title1 {
		font-size: 24upx;
		font-weight: bold;
	}

	.price {
		font-size: 26upx;
	}

	.x1 {
		font-size: 22upx;
		color: #888888;
		font-weight: bold;
		margin-left: 17upx;
	}

	.quan {
		width: 29upx;
		height: 29upx;
	}

	.more {
		width: 28upx;
		height: 17upx;
		transform: rotate(-90deg);
	}

	.quan-words {
		font-size: 28upx;
		margin-left: 11upx;
	}

	.quan-price {
		font-size: 26upx;
		color: #444444;
		margin-right: 15upx;
		max-width:300rpx;
		max-height:40rpx;
		overflow:hidden;
	}

	.quan-a {
		display: flex;
	}

	.quan-img {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.quan-b {
		display: flex;
		// margin-right: 30upx;
		align-items: center;
	}

	.quan-block {
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid #EEEEEE;
		padding-bottom: 17upx;
	}

	.quan-bottom {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		font-size: 24upx;
		padding: 30upx 0upx 30upx 0;
		// border-top: 1px solid #EEEEEE;
	}

	.xiaoji {
		display: flex;
	}

	.total-price {
		font-size: 32upx;
		color: #FC5F34;
	}

	.youhui {
		color: #666666;
		margin-right: 17upx;
	}

	.xiaoji-a {
		color: #222222;
		display: flex;
		align-items: center;
	}

	/* 商品信息 end */
	/* 支付方式 start */
	.pay {
		height: 82upx;
		display: flex;
		justify-content: space-between;
		margin-top: 30upx;
		padding: 28upx 45upx 25upx 42upx;
	}

	.pay-way {
		font-size: 28upx;
		color: #222222;
		line-height: 28upx;
	}

	/* 支付方式 end */
	/* 提交支付 start */
	.pay-put-order{
		position: fixed;
		bottom: 98upx;
		width: 100%;
		left: 0;
		right: 0;
		background-color: #fff;
		padding: 20upx;
		align-items: center;
	}
	.pay-put {
		height: 98upx;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #343333;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		color: #FFFFFF;
	}

	.btn-pay {
		width: 234upx;
		background-color: $skin;
		text-align: center;
		line-height: 98upx;
		font-size: 32upx;
		color: #fff;
		border-radius: 0;
	}
	button::after{
		border: none
	}

	.word1 {
		font-size: 24upx;

	}

	.pay-price {
		font-size: 32upx;
		margin-right: 39upx;
	}

	.word1-1 {
		margin-right: 30upx;
	}

	/* 提交支付 end */
	
	/* 门店/外带 start */
	.type1 image,.type2 image{
		width: 32upx;
		height: 32upx;
		margin-right: 18upx;
	}
	.gou-img{
		width: 32upx;
		height: 32upx;
		margin-right: 10upx;
	}
	.type{
		display: flex;
		font-size: 28upx;
		background-color: #FFFFFF;
		height: 80upx;
		margin-top: 30upx;
	}
	.way1,.way2{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 50%;
	}
	/* 门店/外带 end */
	.order-no{
		line-height: 80upx;
		padding: 0 30upx;
		height: 80upx;
		background: #fff;
		align-items: center;
		border-top: 1upx solid #eee;
	}

</style>
