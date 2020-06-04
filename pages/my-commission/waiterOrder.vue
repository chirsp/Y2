<template>
	<view>
		<!-- 切换 start -->
		<view class="switch-block">
			<block v-for="(item,i) in tab" :key="i">
				<view class="switch1" :class="{'checked': current==item.status}" @click="changeTab(item.status)">{{item.name}}</view>
			</block>
		</view>
		<!-- 切换 end -->
		<view style="height: 100upx;"></view>

		<view class="content" v-for="(item,index) in orderlist" :key="index">
			<view class="list">
				<view class="top flex-sb flex-row">
					<text>共 <text class="num cred">{{item.smdc_sale_food.length}}</text> 件商品</text>
					<!-- <text class="c66">0:00:32</text> -->
				</view>
				<block v-for="(x,xindex) in item.smdc_sale_food" :key="xindex">
					<view class="detail flex-row" :class="xindex==0?'':'borderT'">
						<view class="flex-row">
							<image :src="x.cover[0]" mode="aspectFill" class="left"></image>
							<view class="right f30 flex-row">
								{{x.name}}
							</view>
						</view>
						<view class="finsh unfinsh-btn" v-if="x.make_status==3 && item.admin_check==1" @click="editstatus(x.id,4)">
							完成配送
						</view>
						<view class="finsh" :class="x.make_status==4?'finsh-bg':'unfinsh-bg'" v-if="x.make_status==4">
							已配送完成
						</view>
					</view>
				</block>

				<view class="tip flex-col">
					<text class="f24 c66">桌号：{{item.deskid}}</text>
				</view>
				<view class="tip flex-col">
					<text class="f24 c66">备注：{{item.bz || '无'}}</text>
				</view>
				<view class="tip flex-col">
					<text class="f24 c66">下单时间：{{item.create_time}}</text>
				</view>

			</view>
			<view class="status " :class="current==3?'status-bg c66':'unstatus-bg cred'" @click="takeorder(item.id)">
				{{current==0?'确认接单':current==1?'全部菜品配送完成':'订单配送完成'}}
			</view>
		</view>
		<view v-if="orderlist.length==0">
			<x-nodata></x-nodata>
		</view>
	</view>
</template>

<script>
	import xNodata from '../../components/nodata.vue'
	export default {
		data() {
			return {
				tab: [
					// {
					// 	name: "待制作",
					// 	status: "0"
					// },
					{
						name: "配送中",
						status: "1"
					},
					{
						name: "已完成",
						status: "3"
					},
				],
				current: "",
				page: 1,
				load: false,
				orderlist: [],

			}
		},
		components: {
			xNodata
		},
		onLoad(e) {

		},
		onShow() {
			this.current = this.tab[0].status
			this.getorder()
		},
		onReachBottom() {
			if (this.load) {
				return
			}
			this.page++
			this.getorder()
		},
		methods: {
			getorder() {
				let _this = this;
				_this.load = true
				_this.$api.ajax('smdc/order/waiterOrder', {
					shop_id: _this.$store.state.shopId,
					admin_check: _this.current,
					page: _this.page,
					status: 1
				}, function(ret) {
					_this.load = false
					if (_this.page == 1) {
						_this.orderlist = ret.data;
					} else {
						_this.orderlist.concat(ret.data)
					}
					for (let i = 0; i < Things.length; i++) {
						Things[i]
					}

				}, 'POST')
			},
			changeTab(i) {
				this.current = i;
				this.page = 1
				this.getorder()
			},
			
			// 服务员修改单个菜品配送状态
			editstatus(id) {
				let _this = this;
				if (_this.current == 3) {
					return
				}
				console.log("菜品ids", id)
				_this.$api.ajax('smdc/food/changeStatus', {
					shop_id: _this.$store.state.shopId,
					status: 4,
					ids: id,
				}, function(ret) {
					uni.showToast({
						title: "操作成功",
						icon: "success"
					})
					_this.getorder()
				}, "POST")

			},

			// 服务员接单/确认订单
			takeorder(id) {
				let _this = this;
				if (_this.current == 0) {
					var admin_check = 1
				}
				if (_this.current == 1) {
					var admin_check = 3
				}
				if (_this.current == 3) {
					return
				}
				console.log("菜品ids", id)
				_this.$api.ajax('smdc/order/changeAdminCheck', {
					shop_id: _this.$store.state.shopId,
					id: id,
					admin_check: admin_check,
				}, function(ret) {
					uni.showToast({
						title: "操作成功",
						icon: "success"
					})
					_this.current = 3;
					_this.getorder()
				}, "POST")
			},
		},
	}
</script>

<style lang="less">
	.flex-row {
		display: flex;
		flex-direction: row;
	}

	.flex-col {
		display: flex;
		flex-direction: column;
	}

	.flex-sb {
		justify-content: space-between;
	}

	.cred {
		color: #FC6840;
	}

	.c66 {
		color: #666666;
	}

	.f30 {
		font-size: 30upx;
	}

	.borderT {
		border-top: 1upx solid #EEEEEE;
	}

	/* 切换 start */
	.switch-block {
		height: 87upx;
		background-color: #FFFFFF;
		font-size: 28upx;
		color: #555555;
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 0 54upx;
		position: fixed;
		z-index: 980;
		left: 0;
		right: 0;
		top: 0;
	}

	.checked {
		color: #F37B1D;
		font-weight: bold;
		border-bottom: 4upx solid #F37B1D;
	}

	.switch1 {
		height: 100%;
		line-height: 87upx;
	}

	/* 切换 end */
	.content {
		background-color: #FFFFFF;
		margin-bottom: 30upx;

		.list {
			margin: 0 32upx;
		}

		.top {
			padding: 28upx 0;
			border-bottom: 1upx solid #EEEEEE;

			.num {
				font-size: 32upx;
				padding: 0 10upx;
			}
		}

		.detail {
			padding: 20upx;
			align-items: center;
			justify-content: space-between;

			.left {
				width: 100upx;
				height: 100upx;
				border-radius: 5upx;
				background-color: #EEEEEE;
				margin-right: 54upx;
			}

			.right {
				align-items: center;
			}

			.finsh {
				font-size: 26upx;
				padding: 12upx 20upx;
				border-radius: 10upx;
			}

			.unfinsh-btn {
				background-color: #F37B1D;
				color: #FFFFFF;
			}

			.unfinsh-bg {
				color: #F37B1D;
			}

			.finsh-bg {
				color: #666;
			}
		}

		.tip {
			padding: 0 30upx 15upx;
		}

		.status {
			text-align: center;
			padding: 30upx 0;
			font-size: 32upx;
			letter-spacing: 12upx;
		}

		.unstatus-bg {
			background-color: rgba(252, 104, 64, 0.1);
		}

		.status-bg {
			background-color: #f7f7f7;
		}
	}
</style>
