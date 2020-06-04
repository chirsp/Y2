<template>
	<view class="page">
		<!-- 信息卡片 start -->
		<view class="bg-block">
			<view class="center bg2">
				<image src="/static/user_bg.png"></image>
			</view>
			<view class="center bg1">
				<image src="/static/user_bg2.png"></image>
			</view>
			<view class="id_number">
				{{userInfo.uid ? userInfo.uid : ''}}
			</view>
			<view class="erweima">
				<image src="/static/code.png" mode=""></image>
			</view>
			<view class="head-img">
				<image :src="userInfo.avatarurl && userInfo.avatarurl != '0'  ? userInfo.avatarurl : '/static/head.png'" mode=""></image>
			</view>
			<view class="username">
				{{userInfo.username ? userInfo.nickname:'客官'}}
			</view>
			<view class="">
				<block>
					<view v-if="userInfo.mobile" class="vip" style="top: 175upx;">
						{{userInfo.mobile}}
					</view>
					<button v-else @getphonenumber="getPhoneNumber" open-type="getPhoneNumber" class="vip my-phone-btn">
						授权手机号
					</button>
				</block>

			</view>
			<!-- <view v-if="userInfo.worker.type" class="vip">
				{{userInfo.worker.type}}
			</view>
			<view v-else class="vip" >
				普通用户
			</view> -->
		</view>
		<!-- <view class="x-flex info-div">
			<view class="info-content x-flex-sp">
				<view class="info-content-item" @click="goBalance">
					<image src="/static/user_icon2.png" class="info-icon"></image>
					<view style="flex:1">
						<view class="card-1">
							账户余额
						</view>
						<view class="card-2">¥{{userInfo.money ? userInfo.money : 0 }}</view>
						<view class="card-3">
							<view>查看余额</view>
							<view class="card-img-2 center">
								<text class="lg text-gray cuIcon-right"></text>
							</view>
						</view>
					</view>
				</view>
				<view class="info-content-item" @click="goCoupon2">
					<image src="/static/user_icon1.png" class="info-icon"></image>
					<view style="flex:1">
						<view class="card-1">
							优惠券
						</view>
						<view class="card-2">{{userInfo.coupon ? userInfo.coupon : 0}}张</view>
						<view class="card-3">
							<view>查看更多</view>
							<text class="lg text-gray cuIcon-right"></text>
						</view>
					</view>
				</view>
			</view>
		</view> -->
		<!-- 信息卡片 end -->
		<!-- 我的订单... start -->
		<view class="my-order-block">
			<view class="my-order">
				<view class="my-order-n" @click="goMyOrders">
					<view class="add-block">
						<view class="ico center">
							<image src="/static/user_icon6.png" mode=""></image>
						</view>
						<view>
							我的订单
						</view>
					</view>
					<view class="btn-group">
						<view>查看所有订单</view>
						<view class="center ico-ico">
							<text class="lg text-gray cuIcon-right"></text>
						</view>
					</view>
				</view>


				<view v-if="userInfo.type" class="my-order-n" @click="centerChange()">
					<view class="add-block">
						<view class="ico center">
							<image src="/static/user_icon3.png" mode=""></image>
						</view>
						<view>
							我的工作台
						</view>
					</view>
					<view class="btn-group">
						<view class="center ico-ico">
							<text class="lg text-gray cuIcon-right"></text>
						</view>
					</view>
				</view>

				<view v-if="is_open_coupon==1" class="my-order-n" @click="goCoupon2()">
					<view class="add-block">
						<view class="ico center">
							<image src="/static/user_icon1.png" mode=""></image>
						</view>
						<view>
							优惠券
						</view>
					</view>
					<view class="btn-group">
						<view class="center ico-ico">
							<text class="mCol">{{userInfo.coupon ? userInfo.coupon : 0}}张</text>
							<text class="lg text-gray cuIcon-right"></text>
						</view>
					</view>
				</view>

				<view class="my-order-n" @click="callPhon(item.url)" v-for="(item,index) in tarbar" :key="index">
					<view class="add-block">
						<view class="ico center">
							<image :src="item.img" mode=""></image>
						</view>
						<view>
							{{item.name}}
						</view>
					</view>
					<view class="btn-group">
						<view class="center ico-ico">
							<text class="lg text-gray cuIcon-right"></text>
						</view>
					</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	import showmodal from './showmodal.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		props: {
			userInfo: {
				type: Object,
				default: null
			},
			is_open_coupon: {
				type: Number,
				default: 0
			}
		},
		components: {
			showmodal
		},
		data() {
			return {
				code: '',
				scanModal: false,
				tarbar: [{
						name: '扫一扫',
						img: "/static/user_icon7.png",
						url: "/pages/index/scan"
					},
					{
						name: '我要开店',
						img: "/static/openStroe.png",
						'url': '/pages/personal-center/openStore'
					},
					{
						name: '联系我们',
						img: "/static/user_icon5.png",
						'url': ''
					},
					{
						name: '设置',
						img: "/static/cjwt.png",
						'url': '/pages/personal-center/setting'
					},
				]
			}
		},
		computed: mapState(['uid', 'hasLogin', '_phone', '_config']),
		onLoad() {
			console.log(111111)
		},
		methods: {
			...mapMutations(['_setUserInfo']),

			// 跳转方法
			goBalance() {
				this.$api.openWin('../balance/balance?money=' + this.userInfo.money);
			},
			goCoupon2() {
				this.$api.openWin('../coupon2/coupon2');
			},
			goMyOrders() {
				this.$api.openWin('../my-orders/my-orders');
			},
			nav(link) {
				this.$api.openWin(link);
			},

			centerChange() {
				this.$emit('centerChange', 1)
			},

			callPhon(url) {
				if (url) {
					this.$api.openWin(url);
					return
				}
				if (!this._phone) {
					this.$api.toast('暂无客服信息~');
					return;
				}
				uni.makePhoneCall({
					phoneNumber: this._phone
				})
			},

			// getPhoneNumber(e){
			// 	uni.navigateTo({
			// 		url:'/pages/login/bingphone'
			// 	})
			// },
			getPhoneNumber(e) {
				// console.log(e);
				let _this = this;
				let ret = e.detail;
				if (e.detail.errMsg !== "getPhoneNumber:ok") {
					return;
				}
				uni.checkSession({
					success(res) {
						console.log("检查授权是否过期", res)
						// session_key 未过期，并且在本生命周期一直有效
						uni.login({
							success(res) {
								_this.code = res.code
								let data = {
									code: _this.code,
									iv: ret.iv,
									encryptedData: ret.encryptedData,
									shop_id: _this.$store.state.shopId,
									uid: _this.$store.state.userInfo.id
								};
								_this.$api.ajax("smdc/user/buld_phone", data, function(ret) {
									_this.$emit('getUserInfo')
								}, "POST")
							},
						})
					},
					fail(err) {
						// session_key 已经失效，需要重新执行登录流程
						uni.login({
							success: res => {
								_this.code = res.code
							}
						})
					}
				})

			},
			userPhone(e) {
				let _this = this;
				uni.login({
					success(res) {
						_this.code = res.code
						let data = {
							code: _this.code,
							iv: e.iv,
							encryptedData: e.encryptedData,
							shop_id: _this.$store.state.shopId,
							uid: _this.$store.state.userInfo.id
						};
						//return ;
						_this.$api.ajax("smdc/user/buld_phone", data, function(ret) {
							_this.$emit('getUserInfo')
						}, "POST")
					},
				})

			},



		},

	}
</script>

<style lang="scss">
	.info-div {
		width: 100%;
		justify-content: center;

		.info-content {
			width: 670upx;
			margin-top: 30upx;

			.info-content-item {
				background: #fff;
				border-radius: 30upx;
				width: 320upx;
				display: flex;
				align-items: flex-start;
				padding: 40upx 24upx;

				.info-icon {
					width: 36upx;
					height: 41upx;
					margin-right: 24upx;
					margin-top: 4upx;
				}
			}
		}
	}

	/* 卡片 start */
	.bg-block {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.bg1 image {
		width: 100%;
		height: 414upx;
	}

	.bg2 image {
		width: 717upx;
		height: 346upx;
	}

	.bg1 {
		position: absolute;
		top: -128upx;
		left: 0;
		width: 100%;
	}

	.bg2 {
		width: 717upx;
		height: 346upx;
		position: relative;
		top: 23upx;
		left: 0;
		z-index: 960;
	}

	.id_number {
		position: absolute;
		top: 258upx;
		left: 80upx;
		z-index: 970;
		color: #FFFFFF;
		font-size: 25upx;
	}

	.erweima image {
		width: 61upx;
		height: 61upx;
		position: absolute;
		top: 223upx;
		left: 602upx;
		z-index: 980;
	}

	.head-img image {
		width: 99upx;
		height: 99upx;
		position: absolute;
		top: 104upx;
		left: 70upx;
		z-index: 970;
		border-radius: 50%;
	}

	.username {
		color: #FFFFFF;
		font-size: 38upx;
		position: absolute;
		top: 114upx;
		left: 184upx;
		z-index: 970;
	}

	.vip {
		color: #FFFFFF;
		font-size: 29upx;
		position: absolute;
		top: 165upx;
		left: 184upx;
		z-index: 970;
	}

	.title-bottom-block {
		width: 100%;
		font-size: 28upx;
		color: #999999;
		display: flex;
		justify-content: center;
		margin-top: 59upx;
	}

	/* 卡片 end */

	/* 账户余额/优惠券 start */
	.msg-block {
		margin-top: 37upx;
		display: flex;
		justify-content: space-around;
	}

	.card {
		width: 307upx;
		height: 199upx;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: column;
		border-radius: 36upx;
		padding: 24upx 0 0 18upx;
	}

	.card-img-1 image {
		width: 36upx;
		height: 41upx;
		margin-right: 17upx;
	}

	.card-1 {
		font-size: 35upx;
		color: #444444;
		// font-weight: bold;
		// display: flex;
		// align-items: center;
	}

	.card-2 {
		font-size: 36upx;
		color: #333333;
		margin: 20upx 0 34upx
	}

	.card-3 {
		font-size: 26upx;
		color: #666666;
		display: flex;
		align-items: center;
		//margin-left: 53upx;
	}

	.card-img-2 image {
		width: 13upx;
		height: 21upx;
		margin-left: 12upx;
	}

	/* 账户余额/优惠券 end */

	/* 我的订单... start */
	.my-order-block {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.my-order {
		width: 673upx;
		font-size: 32upx;
		color: #333333;
		background-color: #FFFFFF;
		border-radius: 30upx;
		margin-top: 37upx;
	}

	.ico {
		margin-right: 25upx;
	}

	.ico image {
		width: 31upx;
		height: 33upx;
	}

	.my-order-n {
		padding-top: 30upx;
		padding-bottom: 30upx;
		display: flex;
		align-items: center;
		margin-left: 24upx;
		margin-right: 24upx;
		border-bottom: 1px solid #EEEEEE;
		justify-content: space-between;
	}

	.border-bottom {
		border: none;
	}

	.btn-group {
		font-size: 24upx;
		color: #888888;
		font-weight: bold;
		display: flex;
		align-items: center;

	}

	.ico-ico image {
		width: 17upx;
		height: 28upx;
	}

	.ico-ico {
		margin-left: 14upx;
	}

	.add-block {
		display: flex;
		align-items: center;
	}

	/* 我的订单... end */
	.white-block {
		height: 80upx;
	}

	//font图标
	.lg {
		font-size: 28upx;
	}

	.my-phone-btn {
		background: none;
		margin: 0;
		padding: 0 10upx;
		font-size: 24upx;
		color: #fff;
		line-height: 40upx;
		border: 1upx solid #fff;
		border-radius: 30upx;
	}
</style>
