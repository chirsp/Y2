<template>
	<view class="coupon">
		<view class="coupon-list" @click="selectCoupon">
			<image src="/static/coupon_bg.png" mode="widthFix" style="width: 100%;"></image>
			<view class="content x-flex">
				<view class="content-left">
					<view class="price">￥<text class="price2" style="color: #fff;">{{list.coupon_price}}</text></view>
					<view class="conditon">满{{list.low_cash_price}}元可用</view>
				</view>
				<view class="content-c">
					<view class="name">{{list.coupon_name}}</view>
					<view class="conditon2"></view>
					<view class="time">{{list.expiry_date}}过期</view>
				</view>
				<view class="x-flex-center content-r">
					<!-- <image :hidden="current!=index" src="/static/gou_white.png" class="icon-r"></image> -->
					<image :src="current==index?'/static/gou_white.png':'/static/yhq0.png'" class="icon-r"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			list:{
				type:Object,
				default:{}
			},
			index:{
				type:Number,
				default:0
			},
			current:{
				type:Number,
				default:0
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			selectCoupon() {
				this.$emit('selectCoupon',this.index)
			}
		}
	}
</script>

<style lang="scss" scoped>
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
						max-height: 40upx;
						min-height: 40upx;
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
</style>
