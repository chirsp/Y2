<template>
	<view>
		<!-- 顶部搜索 start -->
		<view class="cu-bar search bg-white mBg" @click="doSearch">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<view style="color: #888;font-size: 26rpx;">请输入菜品关键词</view>
			</view>
		</view>

		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="index==TabCur?'text-orange cur':''" v-for="(item,index) in Tab" :key="index"
				 @tap="tabSelect" :data-id="index">
					{{index==1?item+'(' +evaCount +')':item}}
				</view>
			</view>
		</scroll-view>

		<block v-if="TabCur==0">
			<!-- 左右联动 -->
			<view class="x-flex boxcontent">
				<view class="left">
					<scroll-view scroll-y :style="{'height': scroll_h+'px'}">
						<block v-for="(item,index) in tab" :key="index">
							<view :class="{'active':current==index}" @click="changeCurrent(index)">{{item.type_name}}</view>
						</block>
					</scroll-view>
				</view>
				<view class="right">
					<scroll-view scroll-y :style="{'height': scroll_h+'px'}" lower-threshold="300" @scrolltolower="getMore">
						<view class="title-r"></view>
						<block v-for="(item,index) in foodlist" :key="index" v-if="foodlist.length">
							<goods :item="item" :index="index" type="1" @addNums="addNums" @removeNums="removeNums" :totalCount='totalCount'
							 :totalMoney='totalMoney' :label='label' @taste="taste"></goods>
						</block>
						<nodata msg='该分类下暂无菜品~' v-else></nodata>
						<view class="space"></view>
						<text v-if="more" class="_flex-center" style="margin-bottom:1rem;">暂无更多数据!</text>
					</scroll-view>
				</view>
			</view>
			<view class="order x-flex" :class="isIpx!=-1 ? 'ipx_b' : 'other_b'">
				<view class="order-ab" v-if="mask_show && totalCount">
					<view class="x-flex-sp car-title">
						<view>已选菜品（共{{cartList.length}}道）</view>
						<view class="clearCart" @click="clearBuyCar">清空</view>
					</view>
					<scroll-view scroll-y style="max-height: 600rpx;">
						<view v-for="(item,index) in cartList" :key="index">
							<view v-if="item.nums && item.nums != '0'" style="padding: 0 30rpx;">
								<goods :item="item" :index="index" type='2' @addNums="addNums" @removeNums="removeNums" :totalCount='totalCount'
								 :totalMoney='totalMoney'></goods>
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="order-left" @click="showMask()">
					<view class="left-re">
						<image src="/static/car.png" @click="toggleMask" class="car"></image>
						<view class="dot mBg">{{totalCount}}</view>
					</view>
				</view>
				<view class="center" @click="showMask()">
					<text class="mar-t5">优惠价:¥{{totalMoney || '0.00'}}</text>
					<text class="mar-t5">原价:¥{{originMoney || '0.00'}}</text>
				</view>
				<!-- <view class="order-right" @click="getOrder" :style="{'background':totalCount ? '' : '#ddd'}">支付下单 -->
					<!-- <view class="order-right" @click="gotoMyCart" :style="{'background':totalCount ? '' : '#ddd'}">确认下单 -->
					<view class="order-right" @click="gotoMyCart" >查看购物车
				</view>
			</view>
		</block>

		<evaluate v-if="TabCur==1" :listeva='listeva'></evaluate>

		<view v-if="status">
			<x-footer></x-footer>
		</view>

		<view v-if="mask_show && totalCount" class="x-mask" @click="hideMask"></view>
		<showmodal :modal='scanModal' msg='是否呼叫服务员' @sure='sure' @hide='hide' v-if="scanModal"></showmodal>
		<drag-button :isDock="true" :existTabBar="true" showImg="/static/newimg/hujiao.png" @btnClick="btnClick" />
		<!-- 桌子订单 -->
		<!-- <image src="../../static/newimg/order.png" class="table_order" @click="lookTableOrder()"></image> -->
		<!-- <goods :active="active"></goods> -->
	</view>
</template>

<script>
	let sys = uni.getSystemInfoSync();
	import xFooter from '../../components/footer.vue';
	import goods from '../../components/goods.vue';
	import evaluate from '../../components/evaluate.vue';
	import dragButton from "../../components/drag-button.vue";
	import nodata from '../../components/nodata.vue';
	import showmodal from '../../components/showmodal.vue';
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				sys: sys, //系统信息
				keyWord: '',
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
				Tab: ['点餐', '评价'],
				TabCur: 0,
				scrollLeft: 0,
				listeva: "",
				order_id: '',
				evaCount: 0, //评价总数
				cartList: '',
				orderId: "",
				orderNo: "",
				canwei_price: 0,
				scanModal: false,
				token:"",
				label:[],
				more:false,//下拉列表无数据提示
			};
		},
		computed: mapState(['_buyList', '_orderId', '_orderNo', '_config', 'deskNum', 'needScan']),
		components: {
			xFooter,
			goods,
			evaluate,
			dragButton,
			nodata,
			showmodal,
		},
		onPullDownRefresh() {
			this.page =1;
			this.getList();
		},
		onReachBottom() {
			if (this.isLoad) {
				return
			}
			if (this.TabCur == 1) {
				this.page++
				this.init()
			}
		},
		onLoad() {
			this.isIpx = sys.model.indexOf('iPhone X');
			let wx_audit = this.$api.getStorage('wx_audit');
			this.status = wx_audit.status || 1;
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
			this.getScrollHeight(); //获取scrollview高度
			this.getMenuList(); //获取菜单列表
			this.init()
			this.token = uni.getStorageSync('kejia_order_token')
			this.token && this.getCart()
		},

		methods: {
			...mapMutations(['_addBuyList', '_removeBuyList', '_clearBuyList', '_initBuyList']),
			// 确认呼叫服务员弹窗操作
			sure(e) {
				if (e) {
					let _this = this;
					_this.$api.ajax(
						'smdc/message/toAddWaitMessage', {
							shop_id: _this.$store.state.shopId,
							no: _this.$store.state.deskId,
						},
						function(ret) {
							_this.scanModal = false
							setTimeout(function(){
								_this.$api.toast('稍等片刻,服务员马上就来!')
							},300)
						})
				}
				
			},
			hide(e) {
				this.scanModal = false
			},
			
			// 呼叫服务员
			btnClick() {
				let lasttime = uni.getStorageSync('serviveTiem')
				let nowtime = new Date().getTime()
				let stime = this.$store.state.serviveTiem *60 *1000
				if(nowtime>(lasttime+stime)){
					this.scanModal =true
				}else{
					this.$api.toast('您的呼叫服务我们已经收到,当前服务员正在忙，请稍等片刻哦~')
				}
			},
			// 获取评价列表
			init() {
				let _this = this;
				_this.isLoad = true
				_this.$api.ajax('smdc/Comment/index', {
					shop_id: _this.$store.state.shopId,
					order_id: _this.order_id,
					page: _this.page,
					limit: 10,
				}, function(ret) {
					_this.isLoad = false
					_this.evaCount = ret.count
					if (_this.page == 1) {
						_this.listeva = ret.data;
					} else {
						_this.listeva.concat(ret.data)
					}

				})
			},

			// 选择导航
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
				this.page = 1;
			},

			//加载更多
			getMore() {
				this.page++;
				this.getList();
			},
			doSearch() {
				this.$api.openWin('../goodsList/goodsList');
			},
			//获取scrollview高度
			getScrollHeight() {
				let frmHeight = sys.windowHeight;
				let frmWidth = sys.windowWidth;
				let div_h = 100 + 100 + 100;
				let other_h = (div_h / 2) * (frmWidth / 375);
				// this.scroll_h = frmHeight - other_h;
				let cart_h = parseInt(sys.windowHeight * 0.056); // iphone显示不完整
				this.scroll_h = frmHeight - other_h - cart_h;
			},
			//改变分类
			changeCurrent(index) {
				this.more = false;
				this.current = index;
				// 直接显示全部数据
				this.page = 1;	// 切换类型，重新分页
				this.foodlist = [];  // 清空之前数据
				this.getList();
			},
			//获取菜单列表
			getMenuList() {
				let _this = this;
				_this.$api.ajax('smdc/food/get_cat', {
					shop_id: _this.$store.state.shopId,
					deskid: _this.$store.state.deskId,
				}, function(ret) {
					_this.tab = ret.data;
					_this.getList();
				})
			},
			//获取分类底下的数据
			getList() {
				let _this = this;
				_this.$api.ajax('smdc/cart/food', {
					shop_id: _this.$store.state.shopId,
					deskid: _this.$store.state.deskId,
					search: '',
					type: '',
					limit: 10,
					page: _this.page,
					cat_id: _this.tab[_this.current].id
				}, function(ret) {
					let data = ret.data.foodlist;
					setTimeout(function() {
						uni.stopPullDownRefresh()
					}, 1000);
					_this.totalCount = parseFloat(ret.data.totalCount);
					_this.totalMoney = parseFloat(ret.data.totalMoney);
					_this.originMoney = ret.data.originMoney;
				        _this.label = ret.data.label
					if (data.length) {
						if (_this.page == 1) {
							_this.foodlist = data
						} else {
							_this.foodlist = _this.foodlist.concat(data)
						}
					} else {
						// _this.foodlist = []
						_this.more = true;
					}
				},"POST",true)
			},

			// 获取购物车列表
			getCart() {
				let _this = this;
				_this.$api.ajax('smdc/cart/cartList', {
					shop_id: _this.$store.state.shopId,
					deskid: _this.$store.state.deskId,
				}, function(ret) {
					_this.cartList = ret.data.foodlist
				})
			},

			// 检测同一个桌号是否已经有下单
			checkOrder() {
				let that = this
				that.$api.ajax('smdc/desk/getDetail', {
					shop_id: that.$store.state.shopId,
					no: that.$store.state.deskId,
				}, function(e) {
					if (e.data && e.data.order_id) {
						let alreadyOId = e.data.order_id
						that.addfunction(alreadyOId)
					} else {
						let alreadyOId = ""
						that.totalMoney = parseFloat(that.totalMoney) + parseFloat(that.canwei_price)
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
						_this.$api.toast('提交成功', 'success');
						_this.$store.commit('_setOrderId', {
							orderId: _this.orderId,
							orderNo: _this.orderNo
						});
						uni.navigateTo({
							url: '../order-details/order-details?orderId=' + _this.orderId + '&type=1' + '&alreadyOId=' + alreadyOId
						})
					}
				}, 'POST',true)
			},
			
			// 选择口味
			taste(data){
				let _this = this;
				_this.$api.ajax('smdc/cart/label', {
					shop_id: _this.$store.state.shopId,
					deskid: _this.$store.state.deskId,
					gid: data.gid,
					tid: data.tid,
				}, function(ret) {
					_this.label = ret.data;
				})
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
					id: id
				}, function(ret) {
					_this.getList()
					_this.getCart()
				})
			},

			//减少数量
			removeNums(e) {
				let _this = this;
				let type = e.type
				if (type == 1) {
					var id = _this.foodlist[e.index].id;
				} else {
					var id = _this.cartList[e.index].id;
				}
				_this.$api.ajax('smdc/cart/sub', {
					shop_id: _this.$store.state.shopId,
					deskid: _this.$store.state.deskId,
					id: id
				}, function(ret) {
					_this.getList();
					_this.getCart();
				})
			},

			//清空购物车
			clearBuyCar() {
				let _this = this;
				_this.$api.ajax('smdc/cart/clearAll', {
					shop_id: _this.$store.state.shopId,
					deskid: _this.$store.state.deskId,
				}, function(ret) {
					_this.mask_show = false;
					_this.getList();
				})
			},
			//展示选中的商品
			showMask() {
				if (this.totalCount == 0 || this.totalCount == '0') {
					return;
				}
				this.mask_show = true;
			},
			//隐藏选中的商品
			hideMask() {
				this.mask_show = false;
			},
			//反转选中的商品
			toggleMask() {
				if (!this.totalMoney) {
					return;
				}
				this.getCart()
				this.mask_show = !this.mask_show;
			},
			//商品总价
			totalPrice() {
				let total = 0;
				let count = 0;
				let orgintotal = 0;
				this._buyList.forEach(list => (
					list.num ? list.sale_price == '0.00' ? total += list.price * parseInt(list.num) : total += list.sale_price *
					parseInt(list.num) : '',
					list.num ? orgintotal += list.price * parseInt(list.num) : '',
					list.num ? count += list.num : ''
				))
				this.totalMoney = parseFloat(total).toFixed(2);
				this.originMoney = parseFloat(orgintotal).toFixed(2);
				this.totalCount = count;
			},
			//获取选中的商品集合
			getOrder() {
				if (this.totalCount == 0 || this.totalCount == '0') {
					return;
				}
				this.checkOrder()
				// this.$api.openWin("../order/order")
			},
			
			gotoMyCart(){
				uni.navigateTo({
				    url: '/pages/cart/cart'
				});
			}

			
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}

	.clearCart {
		padding: 0 20rpx;
		background-color: $skin;
		color: #FFFFFF;
		border-radius: 10rpx;

	}

	.space {
		height: 100rpx;
	}

	.boxcontent {
		margin-bottom: 180rpx;
	}

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	.x-mask {
		position: fixed;
		z-index: 980;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.table_order {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		position: fixed;
		bottom: 290rpx;
		right: 0;
		z-index: 2;
		background-color: #FFFFFF;
	}

	.x-bg {
		background: $skin;
	}

	.left {
		width: 148rpx;
		line-height: 84rpx;
		text-align: center;
		font-size: 28rpx;
		color: #555;
		background: #f8f8f8;
	}

	.right {
		background: #fff;
		flex: 1;
		padding: 0 0 0 25rpx;
        overflow:scroll;
		.title-r {
			height: 30rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: rgba(34, 34, 34, 1);
		}
	}

	.active {
		background: #fff;
		color: #FEB026;
		font-size: 28rpx;
	}

	.ipx_b {
		bottom: 150rpx;
	}

	.other_b {
		bottom: 100rpx;
	}

	.order {
		z-index: 990;
		position: fixed;
		right: 0;
		left: 0;
		background: #72706E;
		height: 100rpx;

		.order-left {
			padding-left: 34rpx;
			padding-right: 34rpx;

			.left-re {
				position: relative;

				.car {
					width: 67rpx;
					height: 63rpx;
				}

				.dot {
					position: absolute;
					width: 40rpx;
					height: 40rpx;
					line-height: 40rpx;
					text-align: center;
					top: -10rpx;
					right: -20rpx;
					font-size: 22rpx;
					color: #fff;
					border-radius: 50%;
				}
			}
		}

		.center {
			display: flex;
			flex-direction: column;
			flex: 1;
			color: #fff;
			font-size: 30rpx;

			// padding:6rpx 0;
			.mar-t5 {
				margin: 5rpx 0;
			}
		}

		.order-right {
			width: 300rpx;
			background: #FEB026;
			line-height: 100rpx;
			height: 100rpx;
			font-size: 32rpx;
			text-align: center;
			color: #fff;
			// padding:6rpx 0;
		}

		.info {
			text-align: center;
			background: rgba(255, 210, 139, 0.3);
			height: 46rpx;
			line-height: 46rpx;
			color: $skin;
		}

		.order-ab {
			position: absolute;
			left: 0;
			right: 0;
			bottom: 100rpx;
			background: #fff;
			padding-top: 30rpx;
		}

		.goods {
			height: 94rpx;
			line-height: 94rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Bold;
			// font-weight:bold;
			color: #fff;
			border-bottom: 1rpx solid #eee;
			background: #fff;
			display: flex;

			.g-left {
				background: #fff;
				position: relative;
				width: 158rpx;
			}

			.g-center {
				color: $skin;
				background: #fff;
				flex: 1;
				border: none;
			}

			.right-price {
				text-align: center;
				background: $skin;
				width: 200rpx;
			}
		}

		.x-left-ab {
			position: absolute;
			bottom: 8rpx;
			left: 35rpx;
			height: 108rpx;
			width: 108rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			background: $skin;

			// padding-top: 20rpx;
			.img {
				width: 67rpx;
				height: 63rpx;
			}
		}
	}

	.total-price-block {
		width: 100%;
		height: 94rpx;
		position: fixed;
		bottom: 100rpx;
		display: flex;
		justify-content: flex-end;
		background: #fff;
	}

	.total-bk {
		width: 108rpx;
		height: 108rpx;
		background-color: #FEB026;
		border-radius: 50%;
		z-index: 2000;
		position: absolute;
		bottom: 8rpx;
		left: 35rpx;
	}

	.goods-num {
		position: absolute;
		top: 0;
		left: 82rpx;
		width: 34rpx;
		height: 34rpx;
		font-size: 20rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 34rpx;
		background-color: #FEB026;
		border-radius: 50%;
		border: 1px solid #FFFFFF;
	}

	.ok {
		width: 198rpx;
		background-color: #FEB026;
		font-size: 36rpx;
		color: #FFFFFF;
		font-weight: bold;
		text-align: center;
		line-height: 94rpx;
	}

	.total-img {
		width: 72rpx;
		height: 63rpx;
		margin-top: 15rpx;
		margin-left: 19rpx;
	}

	.total-price {
		color: #FEB026;
		font-size: 40rpx;
		font-weight: bold;
		margin: 23rpx 253rpx 35rpx 0;
	}

	.car-title {
		font-size: 26rpx;
		color: #888;
		line-height: 50rpx;
		padding: 0 24rpx 30rpx;
	}
</style>
