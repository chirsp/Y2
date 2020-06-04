<template>
	<view class="couponList">
		<block v-for="(item,index) in coupon" :key="index">
			<view class="coupon" v-if="!item.is_delete && item.status">
				<view class="coupon-list">
					<image v-if="!item.isGet" src="/static/coupon_bg.png" mode="widthFix" style="width: 100%;"></image>
					<image v-if="item.isGet" src="/static/coupon_bg_grey.png" mode="widthFix" style="width: 100%;"></image>
					<view class="content x-flex">
						<view class="content-left">
							<view class="price">￥<text class="price2">{{item.coupon_price}}</text></view>
							<view class="conditon">满{{item.low_cash_price}}元可用</view>
						</view>
						<view class="content-c">
							<view class="name">{{item.coupon_name ? item.coupon_name : ''}}</view>
						<!-- 	<view class="conditon2">{{item.coupon_desc ? item.coupon_desc : '仅堂食可用'}}</view> -->
							<view class="time">领取后{{item.expiry_day}}天内有效</view>
						</view>
						<view v-if="!item.isGet" class="x-flex coupon-btn-view">
							<form @submit="getCoupon(item.id,index)" report-submit="true">
								<button class="coupon-btn get" formType="submit">领券</button>
							</form>
						</view>
						<view v-if="item.isGet" class="x-flex coupon-btn-view">
							<form >
								<button class="coupon-btn">已领取</button>
							</form>
						</view>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isGet:false,
				coupon:[],
				userCoupon:[]
			};
		},
		onLoad() {
			this.init();
		},
		methods: {
			//商家优惠券
			getData(cb) {
				let _this = this;
				_this.$api.ajax('smdc/coupon/couponlist',{
					shop_id: _this.$store.state.shopId
				},function(ret){
					cb(ret.data);
				})
			},
			//处理商家优惠券
			init() {
				let _this = this;
				this.getData(function(data){
					let coupon=data.coupon;
					let userCoupon=data.user_coupon;
					console.log(data);
					coupon.map(item => (
						item.isGet=false
					));
					if(userCoupon.length){
						coupon.forEach(item => (
							userCoupon.forEach(list => (
								item.id == list.pid ? item.isGet=true : ''
							))
						))
					}
					_this.coupon=coupon;
					_this.userCoupon=userCoupon;
				});
			},
			//领取优惠券
			getCoupon(couponId,index) {
				let _this = this;
				_this.$api.ajax('smdc/coupon/addusercoupon',{
					couponid:couponId,
					shop_id:this.$store.state.shopId
				},function(ret){
					_this.coupon[index].isGet=true;
					_this.$api.toast("领取成功","success");		
					_this.init();
				},'POST');
			}
		},
	}
</script>

<style lang="scss">
	page{
		background: #fff;
	}
	.couponList{
		padding: 20upx 0;
	}
	.coupon{
		background: #fff;
		.coupon-list{
			margin-bottom: 30upx;
			position: relative;
			.content{
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				//justify-content: center;
				color: #fff;
				.content-left{
					width: 270upx;
					padding-right: 50upx;
					text-align: right;
					.price{
						font-weight: bold;
						font-size: 40upx
					}
					.price2{
						font-weight: bold;
						font-size: 52upx;
					}
					.conditon{
						padding-top: 10upx;
						font-size: 30upx;
						font-weight: bold;
						line-height: 50upx;
						max-height: 50upx;
						overflow: hidden;
					}
				}
				.content-c{
					flex:1;
					text-align: left;
					.name{
						font-size: 30upx;
						font-weight: bold;
						line-height: 40upx;
						max-height: 80upx;
						min-height: 80upx;
						overflow: hidden;
					}
					.conditon2{
						font-size: 26upx;
						line-height: 40upx;
						max-height: 40upx;
						min-height: 40upx;
						overflow: hidden;
					}
					.time{
						font-size: 22upx;
						line-height: 40upx;
						max-height: 40upx;
						min-height: 40upx;
						overflow: hidden;
					}
				}
				.content-r{
					width: 190upx;
					min-width: 190upx;
					.icon-r{
						width: 57upx;
						height: 57upx;
					}
				}
			}
		}
	}
	.coupon-btn-view{
		justify-content: flex-start;width: 200upx;
	}
	.coupon-btn{
		width: 120upx;
		height: 46upx;
		line-height: 46upx;
		text-align: center;
		color: #444;
		border-radius: 30upx;
		background: #eee;
		font-size: 24upx;
		padding: 0;
		margin: 0;
	}
	.get{
		color: #FEB026;
	}
</style>
