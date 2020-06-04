<template>
	<view>
		<view class="tab">
			<view v-for="(item,i) in tab" :key="i" :class="{'checked':current==i,'tab1':true}" @click="changeTab(i)">{{item.name}}</view>
		</view>
		<view class="white-block"></view>
		<view class="coupon-list">
			<view class="coupon" v-for="item in tab[current].list" :key="item">
				<view class="line1">
					<view class="coupon-name">{{item.coupon_name}}</view>
					<view :class="{'line1-price':true,'checked2':current==0,'checked3':current==1}">{{item.coupon_price}}元</view>
				</view>
				<view class="line2">
					<view class="line2-time">{{item.expiry_date}}过期</view>
					<view>满{{item.low_cash_price}}元使用</view>
				</view>
				<view class="line3">
					<view class="line3-l">
						<view>仅堂食可用</view>
						<view>不与其他优惠券共享</view>
					<!-- 	<view>订单满60元可用</view>
						<view>限时段：00：00-23：59可用</view> -->
					</view>
				</view>
			</view>
			<view class="toast-info" v-if="!tab[current].list.length">
				<x-nodata :msg="'无'+tab[current].name +'优惠券'"></x-nodata>
			</view>
		</view>
		
		<view class="white-block"></view>
	</view>
</template>

<script>
	import xNodata from '../../components/nodata.vue'
	import {mapState} from 'vuex';
	export default {
		data() {
			return {
				tab: [{
					name: '可使用',
					list: [],
					page: 1,
					init: true,
					more: true,
				}, {
					name: '已失效',
					list: [],
					page: 1,
					init: true,
					more: true
				}],
				current: 0
			}
		},
		computed:mapState(['shopId']),
		components:{xNodata},
		onLoad() {
			this.getCoupon()
		},
		onReachBottom() {
			if(this.tab[this.current].more){
				this.getCoupon();
			}
		},
		methods: {
			changeTab(i) {  // tab切换
				this.current = i;
				if(this.tab[this.current].init){
					this.getCoupon();
				}
			},
			getCoupon(){  // 获取用户优惠券信息
				let _this = this;
				this.$api.ajax('smdc/coupon/usercounpon',{
					shop_id:this.shopId,
					type:this.current,
					limit:10,
					page:this.tab[this.current].page
				},function(ret){
					let data=ret.data.coupon_mine;
					let item=_this.tab[_this.current];
					if(data.length){
						_this.tab[_this.current].list=item.list.concat(data);
						_this.tab[_this.current].page=item.page+1;
						_this.tab[_this.current].init=false;				
					}else{
						_this.tab[_this.current].more=false;
					}
				})
			},
		}
	}
</script>

<style>
	.coupon-name{
		max-width: 80%;
		max-height: 80upx;
		overflow: hidden;
	}
	.tab {
		position: fixed;
		display: flex;
		width: 100%;
	}

	.white-block {
		height: 118upx;
	}

	.tab1 {
		width: 50%;
		height: 88upx;
		background-color: #FFFFFF;
		font-size: 30upx;
		color: #888888;
		text-align: center;
		line-height: 88upx;
	}

	.checked {
		color: #FC6840;
		border-bottom: 2upx solid #FC6840;
	}

	.coupon-list {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.coupon {
		width: 689upx;
		background-color: #FFFFFF;
		/* height: 298upx; */
		/* height: 248upx; */
		border-radius: 4upx;
		margin-top: 30upx;
		display: flex;
		flex-direction: column;
		padding: 22upx;
	}

	.line1 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #222222;
		font-size: 30upx;
	}

	.checked2 {
		color: #FC6840;
	}

	.checked3 {
		color: #666666;
	}

	.line1-price {
		font-size: 44upx;
		font-weight: bold;
	}

	.line2 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #444444;
		font-size: 24upx;
		padding:12upx 0 16upx 0;
		border-bottom:1upx solid #eee
		
	}

	.line2-time {
		color: #888888;
		font-size: 22upx;
	}

	.line3 {
		display: flex;
		justify-content: space-between;
	}

	.line3-l {
		display: flex;
		flex-direction: column;
		color: #666666;
		font-size: 20upx;
	}

	.line3-2 image {
		width: 22upx;
		height: 14upx;
		margin-right: 22upx;
	}

	.line3-l view {
		margin-top: 8upx;
	}
	
	.white-block{
		height: 80upx;
	}
</style>
