<template>
	<view>
		<!-- 需要用户扫码 -->
		<view class="needscanBox" @click.stop="scan()">
			<image src="../../static/saoma.png" mode="widthFix" class="needscanBox"></image>
			<view class="topbox _flex-center">
				<image src="../../static/user_bg2.png" mode="widthFix" class="topImg"> </image>
				<view class="topInfo _flex-center">
					<image :src="userInfo.avatarurl && userInfo.avatarurl !='0'?userInfo.avatarurl:'../../static/head.png'" mode="aspectFill" class="topHead"></image>
					<view class="topTip _f30">亲爱的{{userInfo.nickname && userInfo.nickname !='0' ?userInfo.nickname: '客官'}}，欢迎使用扫码点餐</view>
				</view>
			</view>
		</view>
		<x-footer></x-footer>
	</view>
</template>

<script>
	import xFooter from '../../components/footer.vue';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import showmodal from '../../components/showmodal.vue'
	export default {
		data() {
			return {
				scanModal: false,
			};
		},
		computed: mapState(['hasLogin', 'uid', 'userInfo', 'hasShop', 'shopId', 'needScan']),
		components: {
			showmodal,
			xFooter
		},

		onLoad() {
		},
		methods: {
			...mapMutations(['intoShop', 'intoDesk','intoNum', 'changeNeedScan']),

			//扫码
			scan() {
				let _this = this;
				console.log(this.$store.state.userInfo)
				this.codeScan()
			},

			// 检测同一个桌号是否已经有下单
			checkOrder() {
				let that = this
				that.$api.ajax('smdc/desk/getDetail', {
					shop_id: that.$store.state.shopId,
					no: that.$store.state.deskId,
				}, function(e) {
					if (e.data && e.data.status == 1) {
						that.intoNum(e.data.seating_num); //记录人数
						that.$api.openWin('/pages/index/index');
					} else {
						that.$api.openWin('../welcome/welcome');
					}
				}, "POST")
			},

			// 确认扫码
			codeScan() {
				let _this = this
				uni.scanCode({
					success(res) {
						let path = res.result
						let pathStr = '';
						if (path.indexOf('%') != -1) {
							let ss = _this.$api.getParam(path, 'scene'); //提取参数
							let scenes = decodeURIComponent(ss);
							pathStr = 'pages/xxx?' + scenes;
						} else {
							pathStr = path.replace('scene=', '');
						}
						console.log('【扫码结果：】',pathStr)
						let uniacid = _this.$api.getParam(pathStr, 'uniacid');
						let shop_id = _this.$api.getParam(pathStr, 'shop_id');
						let desk = _this.$api.getParam(pathStr, 'desk');
						if (shop_id && desk) {
							// 清除扫码
							_this.changeNeedScan(false)
         
							// 缓存桌号和店铺id
							_this.intoShop(shop_id);
							_this.intoDesk(desk);
							_this.$api.setStorage('kejia_order_shopId', shop_id);
							_this.$api.setStorage('deskId', desk);

							// 检测桌子是否已有订单
							_this.checkOrder()

						} else {
							_this.$api.alert('无效码');
						}
					}
				});
			},

		}
	};
</script>

<style lang="scss">
	page {
		background: #EEEEEE;
	}
    ._flex-center{
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	.needscanBox {
		position: fixed;
		background-color: #fef8f6;
		width: 100%;
		height: 100%;

		.topbox {
			width: 100%;

			.topImg {
				width: 100%;
				height: 160rpx;
			}
			.topInfo {
				margin-top: 0rpx;
				position: absolute;
				z-index: 2;
				width: 100%;
				height: 220rpx;
				.topHead {
					position: relative;
					width: 110rpx;
					height: 110rpx;
					top: 94rpx;
					border-radius: 50%;
				}
				
			}
			
		}
	}
	.topTip{
		position: relative;
		top:113rpx;
		font-size: 26rpx;
	}
</style>
