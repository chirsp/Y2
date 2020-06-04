<template>
	<view>
		<!-- <view v-if="!list.length">
			<x-nodata></x-nodata>
		</view> -->
		<view class="dataselect">
			<picker mode="date" :value="date" @change="bindDateChange" fields="month">
				<view class="flex-row">
					<image src="../../static/dataselect.png" class="dataicon"></image>
					<view class="uni-input datatime">{{time}}</view>
				</view>
			</picker>
		</view> 
		<view style="height: 100upx;"></view>
		<view class="list-block" v-for="(item,index) in 3" :key="index">
			<view class="top">
				<view class="top-1">5月</view>
				<view class="top-2">总收入:￥100</view>
			</view>
			<view class="bottom">
				<view class="list" v-for="(x,xindex) in 4">
					<view class="list-t">
						<view class="list-t-1">
							<view class="mar-r15">桌号:1</view>
							<view class="mar-r15">人数:6</view>
							<view class="mar-r15">几道菜:4</view>
						</view>
						<view class="list-t-2">6月1日 12:00</view>
					</view>
					<view class="list-b">
						<view class="list-b-1">
							<view v-for="(y,yindex) in 5" :key="yindex" v-if="yindex<4">
								<image src="../../static/head.png" mode=""></image>
							</view>
						</view>

						<view class="list-b-2">
							<text class="f24">获得佣金:</text>
							<text class="f34">￥100</text>
						</view>
					</view>
				</view>
			</view>

		</view>
		<!-- 	<view class="billing">
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
		</view> -->
	</view>
</template>

<script>
	import xNodata from '../../components/nodata.vue'
	export default {
		data() {
			return {
				list: [],
				page: 1,
				more: true,
				time: ''
			}
		},
		components: {
			xNodata,
		},
		onLoad() {
			this.getData();
		},
		methods: {
			getData() {
				let _this = this;
				this.$api.ajax('smdc/Part/yongji', {
					shop_id: this.$store.state.shopId,
					page: this.page,
					limit: 10,
				}, function(ret) {
					let data = ret.data;
					if (data.length) {
						_this.page = _this.page + 1;
						_this.list = _this.list.concat(data);
					} else {
						_this.more = false;
					}
				}, "POST");
			},
			bindDateChange(e) {
				console.log(e)
			   this.time = e.detail.value
			}
		}
	}
</script>

<style>
	page {
		/* background: #fff; */
	}

	.mar-r15 {
		margin-right: 25upx;
	}

	.f24 {
		font-size: 24upx;
	}

	.f34 {
		font-size: 34upx;
	}
	.flex-row{
		display: flex;
		flex-direction: row;
	}

	.dataselect {
		background-color: #FC6840;
		padding: 20rpx;
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 2;
		display: flex;
		flex-direction: row;
	}

	.dataicon {
		width: 35upx;
		height: 32upx;
		margin-right: 20upx;
	}
	.datatime{
		color: #FFFFFF;
		font-size: 26upx;
	}

	.list-block {
		display: flex;
		flex-direction: column;
		align-items: space-between;
		margin-bottom: 37upx;
	}

	.list {
		width: 628upx;
		border-radius: 30upx;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		margin-top: 20upx;
	}

	.list-t {
		display: flex;
		color: #555555;
		font-size: 26upx;
		font-weight: bold;
		justify-content: space-between;
	}

	.list-b {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 20upx;
	}

	.list-b-1 {
		display: flex;
	}

	.list-b-1 image {
		width: 80upx;
		height: 80upx;
		margin-right: 10upx;
		border-radius: 10upx;
	}

	.list-t-2 {
		color: #444444;
		font-size: 24upx;
		font-weight: 500;
	}

	.list-t-1 {
		font-size: 26upx;
		color: #555555;
		font-weight: bold;
		display: flex;
	}

	.list-b-2 {
		color: #FC6840;
		/* font-weight: bold; */
	}

	.top {
		color: #555555;
		font-weight: bold;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0upx 66upx 0 43upx;
	}

	.top-1 {
		font-size: 30upx;
	}

	.top-2 {
		font-size: 26upx;
	}

	.bottom {
		display: flex;
		flex-direction: column;
		align-items: center;
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

	/* .list {
		display: flex;
		flex-direction: column;
		border-top: 1upx solid #EEEEEE;
		padding: 27upx 41upx 30upx 88upx;
	} */

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
	.white-block {
		height: 80upx;
	}
</style>
