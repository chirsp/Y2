<template>
	<view>
		<!-- 下拉加载更多 -->
		<view class="cu-load" :class="!isLoad?'loading':'over'" v-if="refresh"></view>
		
		<!-- 需要用户扫码 -->
		
		<!-- <view v-if="needScan " class="needscanBox" @click.stop="scan()">
			<image src="../../static/saoma.png" mode="widthFix" class="needscanBox"></image>
			<view class="topbox _flex-center">
				<image src="../../static/user_bg2.png" mode="widthFix" class="topImg" > </image>
				<view class="topInfo _flex-center">
					<image :src="userInfo.avatarurl?userInfo.avatarurl:'../../static/head.png'" 
					 mode="aspectFill"  class="topHead"></image>
					<view class="topTip _f30">亲爱的{{userInfo.nickname || '客官'}}，欢迎使用扫码点餐</view>
				</view>
			</view>
		</view> -->
		
		<!-- 已经有店铺id -->
		<!-- <block> -->
		<!-- <block> -->
		<view class="page">
			<!-- 店铺信息 start -->
			<view>
				<!-- 背景图片 start -->
				<view>
					<swiper :indicator-dots="true" :duration="500" class="bk-img">
						<block v-for="(item, index) in shop.banner_ids" :key="index">
							<swiper-item><image :src="item ? '/static/noImg.png':item " mode="aspectFill" class="bk-img"></image></swiper-item>
						</block>
					</swiper>
				</view>
				<!-- 背景图片 end -->
				<!-- 店铺介绍 start -->
				<view class="info-re">
					<view class="info-ab">
						<view class="info-ab-top" @click="toggleDetail">
							<view class="x-flex">
								<image :src="logo ? logo : '/static/head.png'" class="logo"></image>
								<view class="flex-sub">
									<view class="shop_name">{{ shop.name }}</view>
									<view class="x-flex-sp">
										<view class="address">{{ shop.address }}</view>
									</view>
								</view>
							</view>
							<view :hidden="!detail_show" class="info-detail" >
								<view class="detail-tag x-flex">
									<view class="tag-item" v-if="shop.business_hours"> 
									  <text class="_fw mar-r10">营业时间:</text> {{ shop.business_hours }}
									</view>
									<view class="tag-item" @click="callPhone" v-if="shop.contact_mobile">
										<text class="_fw mar-r10">电话:</text> {{ shop.contact_mobile }}
									</view>
									<block v-for="(item, index) in data.dev" :key="index">
										<view class="tag-item" v-if="index < 4"> <text class="_fw mar-r10">{{ item.dev_title }}:</text> {{ item.dev_value }}</view>
									</block>
								</view>
								<view class="detail-title _fw mar-r10">门店规模</view>
								<view class="detail-text">{{ shop.store_scale ? shop.store_scale : '暂无描述' }}</view>
								<view class="detail-title _fw mar-r10">公告</view>
								<view class="detail-text">{{ shop.intro ? shop.intro : '暂无公告' }}</view>
							</view>
							<view class="x-flex flex_center mar-t10" style="min-width: 100rpx;" :class="detail_show?'rotate1':'rotate'">
							    <image src="../../static/newimg/shouqi.png" class="shouqi_icon"></image>
							</view>
						</view>
						<!-- 为你优选 -->
						<block v-for="(menu, index) in data.page" :key="index">
							<block v-if="menu.type == 'advert'">
								<view class="list-title">为您优选</view>
								<view class="list-middle">
									<view class="list-middle-1">
										<image  @click="toLink(menu.info[0].link,menu.info[0].type)" :src="menu.info.length>0? menu.info[0].cover[0] : '/static/noImg.png'" mode="aspectFill" class="list-img1"></image>
										<view class="title1" >{{ menu.info.length>0 ? menu.info[0].title : '暂无查看' }}</view>
									</view>
									<view class="list-middle-2">
										<view class="title2" >{{menu.info.length>1 ? menu.info[1].title:'暂无查看'}}</view>
										<view class="title3" >{{menu.info.length>2 ? menu.info[1].title:'暂无查看'}}</view>
										<image @click="toLink(menu.info[1].link,menu.info[1].type)" :src="menu.info.length>1 ? menu.info[1].cover[0] : '/static/noImg.png'" mode="aspectFill" class="list-img2"></image>
										<image @click="toLink(menu.info[2].link,menu.info[2].type)" :src="menu.info.length>2 ? menu.info[2].cover[0] : '/static/noImg.png'" mode="aspectFill" class="list-img3"></image>
									</view>
								</view>
							</block>
							<!-- 本店招牌 end -->
							<block v-if="menu.type == 'top_food'">
								<view class="list-title">本店招牌</view>
								<view class="x-flex-sp goods">
									<block v-for="item in menu.info" :key="item.id">
										<view class="goods-item" @click="goodsDetail(item.id)">
											<image :src="item.cover ? item.cover[0] : '/static/noImg.png'" mode="aspectFill" class="goods-img"></image>
											<view class="goods-msg">
												<view class="goods-name">{{ item.name }}</view>
												<view class="goods-price">
													<view>￥{{ item.sale_price != '0.00' ? item.sale_price : item.price }}</view>
													<view :hidden="item.sale_price == '0.00'" class="goods-price2">￥{{ item.price }}</view>
												</view>
											</view>
										</view>
									</block>
								</view>
							</block>
							<!-- 	优惠券 -->
							<block v-if="menu.type == 'coupon' && menu.info.length && _config.is_open_coupon =='1'">
								<view class="coupon x-flex">
									<view class="coupon-title">优惠券</view>
									<view class="x-flex" @click="nav('../coupon/coupon')">
										<view class="more-text">更多</view>
										<text class="text-gray cuIcon-right"></text>
									</view>
								</view>
								<view class="x-flex coupon-list">
									<block v-for="item in menu.info" :key="item.id">
										<view class="coupon-item x-flex-sp" v-if="index<2"  @click="nav('../coupon/coupon')">
											<image src="/static/coupon_bg1.png" class="coupon-item-img"></image>
											<view class="coupon-item-main">
												<view class="price">￥{{item.coupon_price}}</view>
												<view class="contain">满{{item.low_cash_price}}可用</view>
											</view>
										</view>
									</block>
								</view>
							</block>
							
						</block>			
						<view style="height: 80px;width: 100%;"></view>
					</view>
				</view>
			</view>
		</view> 
		
	
		<showmodal :modal='scanModal' msg='是否呼叫服务员' @sure='sure' @hide='hide' v-if="scanModal"></showmodal>
		<drag-button
		       :isDock="true"
		       :existTabBar="true"
				  		  showImg="/static/newimg/hujiao.png"
		       @btnClick="btnClick" />
					<!-- 底部导航 -->
		<x-footer></x-footer>
	
	</view>
</template>

<script>
import xFooter from '../../components/footer.vue';
import dragButton from '../../components/drag-button.vue';
import { mapState, mapMutations } from 'vuex';
import showmodal from '../../components/showmodal.vue'
// import Voice from '../../busines/components/voice.js';

export default {
	data() {
		return {
			show: false,
			iconName: 'unfold',
			iconText: '展开',
			detail_show: false,
			data: {},
			homeInit: true,
			title:"",
			text:"",
			isLoad:false,
			refresh:false,
			scanModal:false,
			token:"",
			shop:"",
			logo:"",
			type:'',
			weixinBrowser: false, // 是否是微信浏览器
			thirdPartyLogins: ['weixin'], // 第三方登录列表	
		};
	},
	computed: mapState(['hasLogin', 'uid', 'userInfo', 'hasShop', 'shopId', 'needScan', '_config','hasDesk', 'deskId', 'deskNum']),
	components: {
		xFooter,showmodal,dragButton
	},
	onPullDownRefresh() {
		this.refresh = true
		this.isLoad = false
		this.getData()
	},
	onLoad() {
		let wx_audit=this.$api.getStorage('wx_audit');
		let _this = this;
		this.$api.ajax('smdc/version',{},function(ret){
			uni.setStorageSync("wx_audit",ret.data);
			_this.title=ret.data.title;
			_this.text=ret.data.text;
			uni.setNavigationBarTitle({
				title:ret.data.title
			})
		});
		    
		this.title=this.$store.state.wx_audit.title;
		this.text=this.$store.state.wx_audit.text;
		this.shopId && this.getData(); //获取首页数据
		
	},
	onShow() {
		// #ifdef APP-PLUS
			this.token = uni.getStorageSync('kejia_order_token')
			if(!this.token){
				uni.redirectTo({
					url:'../login/login1'
				})
				return
			}
		// #endif
		
		
		if(this.needScan&&this.type=='weixin'){
			uni.redirectTo({
				url:'./scan'
			})
			return
		}
		if(!this.$store.state.deskNum){
			uni.navigateTo({
				url:'/pages/welcome/welcome'
			})
			return
		}
	},
	
	methods: {
		...mapMutations(['intoShop', 'intoDesk', '_setPhone','setIntr','intoCancleTime','changeNeedScan','_setConfig']),
		 
		 // 语音播报功能
		 openVoice() {
		       // setInterval(function(){
		       //     Voice('你好，113号桌有新的退菜订单,请尽快处理');
		       // }, 3000)
			  // console.log('【开始语音播报6666】')
			  // Voice('你好，113号桌有新的退菜订单,请尽快处理');
			  
				  // var timesRun = 0;
				  // var interval = setInterval(function(){
				  //     timesRun += 1;
					 //  console.log('【开始语音播报6666循】',timesRun)
				  //     if(timesRun === 60){    
				  //         clearInterval(interval);    
				  //     }
				  // }, 2000);
			     
		    },
		
		
		// 呼叫服务员
		btnClick(){
			let lasttime = uni.getStorageSync('serviveTiem')
			let nowtime = new Date().getTime()
			let stime = this.$store.state.serviveTiem *60 *1000
			if(nowtime >(lasttime+stime)){
				this.scanModal =true
			}else{
				this.$api.toast('您的呼叫服务我们已经收到,当前服务员正在忙，请稍等片刻哦~')
			}
			
		},
		
		//获取首页数据
		getData() {
			let _this = this;
			this.$api.ajax(
				'smdc/index/index',
				{
					shop_id: this.shopId,
					action: 0
				},
				function(ret) {
					console.log(ret)
					// _this.openVoice();
					_this.data = ret.data;
					_this.shop = ret.data.shop==[]?[a]: ret.data.shop
					_this.logo = ret.data.shop.logo[0]
					_this.isLoad = true
					setTimeout(function(){
						_this.refresh = false
						uni.stopPullDownRefresh()
					},1000)
					_this.setIntr(ret.data.config1.intro)
					_this._setConfig(ret.data.config)
					_this.intoCancleTime(ret.data.shop.cancle_time)
					if (ret.data.shop.contact_mobile) {
						_this._setPhone(ret.data.shop.contact_mobile);
					}
				},
				'POST',true
			);
		},
		
		// 确认呼叫服务员弹窗操作
		sure(e){
			if(e){
				let _this = this;
				_this.$api.ajax(
					'smdc/message/toAddWaitMessage',
					{
						shop_id: this.shopId,
						no:_this.$store.state.deskId,
					},
					function(ret) {
						_this.scanModal = false
						_this.$api.toast('稍等片刻,服务员马上就来!')
						let serviveTiem = new Date().getTime()
				        uni.setStorageSync('serviveTiem',serviveTiem)
					},"POST")
			}
		},
		hide(e){
			this.scanModal = false
		},
		
		goMenu() {
			this.$api.openWin('../menu/menu');
		},
		toggleDetail() {
			if (this.detail_show) {
				this.detail_show = false;
				(this.iconName = 'unfold'), (this.iconText = '展开');
			} else {
				this.detail_show = true;
				(this.iconName = 'fold'), (this.iconText = '收起');
			}
		},
		goodsDetail(id) {
			this.$api.openWin('../details/details?goodsId=' + id);
		},
		preview(current) {
			uni.previewImage({
				count: current,
				urls: data.shop.banner_ids
			});
		},
		callPhone() {
			uni.makePhoneCall({
				phoneNumber: this.data.shop.contact_mobile
			});
		},
		nav(url) {
			this.$api.openWin(url);
		},
		toLink(link,type) {
			if(!link) {
				return ;
			}
			if(type==1) {
				this.$api.openWin('/pages/details/details?goodsId='+link);
			}else{
				if(link=='/pages/menu/menu' || '/pages/my-orders/my-orders' || '/pages/personal-center/personal-center' || '/pages/index/index'){
					uni.reLaunch({
						url:link
					})
				}else{
					this.$api.openWin(link);
				}	
			}
		}
	},
	onShareAppMessage(res) {
	   if (res.from === 'button') {// 来自页面内分享按钮
	   }
	   return {
	     title: '智慧餐厅',
	     path: '/pages/index/index'
	   }
	 },
	
};
</script>

<style lang="scss">
	.mar-r10{
		margin-right: 12rpx;
	}
	.mar-t10{
		margin-top: 12rpx;
	}
	page{
		background: #EEEEEE;
	}
	.shouqi_icon{
		width: 20rpx;
		height: 20rpx;
	}
.needscanBox{
	position: fixed;
	background-color: #fef8f6;
	width: 100%;
	height: 100%;
	.topbox{
		width: 100%;
		.topImg{
			width: 100%;
			height: 160rpx;
		}
		.topInfo{
			margin-top: 120rpx;
			position: absolute;
			z-index: 2;
			.topHead{
				width: 140rpx;
				height: 140rpx;
				margin-bottom: 25rpx;
				border-radius: 50%;
			}
		}
	}
}

.index_bg{
	width: 100%;
	height: 100%;
	margin-top: 180rpx;
}


.goods {
	flex-wrap: wrap;
	// padding: 0 24rpx;
	.goods-item {
		width: 340rpx;
		margin-bottom: 30rpx;
		.goods-img {
			border-radius: 30rpx 30rpx 0 0;
			width: 100%;
			height: 337rpx;
			display: block;
		}
		.goods-msg {
			background: #fff;
			border-radius: 0 0 30rpx 30rpx;
			padding: 20rpx;
			.goods-name {
				font-size: 24rpx;
				font-weight: bold;
				color: rgba(34, 34, 34, 1);
				line-height: 40rpx;
				overflow: hidden;
			}
			.goods-price {
				font-size: 29rpx;
				font-weight: bold;
				color: rgba(34, 34, 34, 1);
				// line-height:38px;
				display: flex;
				align-items: center;
			}
			.goods-price2 {
				font-size: 23rpx;
				text-decoration: line-through;
				color: rgba(136, 136, 136, 1);
				margin-left: 20rpx;
				// line-height:38px;
			}
		}
	}
}
.info-re {
	position: relative;
	height: 100rpx;
	.info-ab {
		position: absolute;
		top: -103rpx;
		left: 26rpx;
		right: 26rpx;
		.info-ab-top {
			padding: 24rpx 30rpx 24rpx;
			background: #fff;
			border-radius: 30rpx;
			.logo {
				width: 111rpx;
				height: 111rpx;
				margin-right: 15rpx;
				border-radius: 50%;
			}
			.address {
				font-size: 26rpx;
				color: #666666;
				line-height: 40rpx;
				min-height: 40rpx;
				max-height: 80rpx;
				overflow: hidden;
			}
			.address2 {
				font-size: 26rpx;
				color: #666666;
			}
			.info-detail {
				.detail-tag {
					padding-top: 40rpx;
					flex-wrap: wrap;
				}
				.tag-item {
					font-size: 28rpx;
					color: #555;
					width: 50%;
					margin-bottom: 20rpx;
				}
				.detail-title {
					font-size: 26rpx;
					color: #222;
					padding: 24rpx 0 6rpx;
				}
				.detail-text {
					font-size: 24rpx;
					color: #555;
					line-height: 40rpx;
				}
			}
		}
	}
}
.coupon {
	align-self: flex-start;
	padding: 30rpx 6rpx 30rpx;
	justify-content: space-between;
	.coupon-title {
		font-size: 34rpx;
		font-weight: bold;
		color: #fc6840;
		letter-spacing: 4rpx;
	}
	.more-text {
		font-size: 24rpx;
		color: #444;
	}
}
.coupon-list {
	// padding: 0 0 30rpx;
	justify-content: space-between;
	.coupon-item {
		width: 350rpx;
		height: 112rpx;
		color: #fff;
		font-size: 26rpx;
		position: relative;
		.coupon-item-img {
			width: 350rpx;
			height: 112rpx;
		}
		.coupon-item-main {
			position: absolute;
			top: 14rpx;
			right: 0;
			left: 20rpx;
			bottom: 0;
			.price {
				font-size: 32rpx;
				color: #fda227;
			}
			.contain {
				font-size: 28rpx;
				color: #222;
			}
		}
	}
}
.saoma-block-user {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin-top: 100rpx;
}

.saoma-headimg-ico {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	position: relative;
}
.head-ab{
	position: absolute;
	top: -20rpx;
	right: -20rpx;
	left: -20rpx;
	bottom: -20rpx;
	border-radius: 50%;
	border:20rpx solid #eee;
	box-sizing: content-box;
}

.saoma-username {
	color: #666666;
	font-size: 28rpx;
	margin-left: 20rpx;
}

.saoma-tip {
	color: #222222;
	font-size: 30rpx;
	text-align: center;
	margin-top: 20rpx;
}

.saoma-img-block {
	text-align: center;
	margin: 40rpx;
}

.saoma-img {
	width: 415rpx;
	height: 431rpx;
}

.saoma-btn-block {
	display: flex;
	flex-direction: row;
	justify-content: center;
	margin-top: 100rpx;
}

.saoma-btn {
	width: 587rpx;
	height: 88rpx;
	line-height: 88rpx;
	font-weight: bold;
	font-size: 32rpx;
	color: #ffffff;
	background-color: #fc6840;
	text-align: center;
	border-radius: 50rpx;
}

.list-block {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.list-title {
	font-size: 34rpx;
	font-weight: bold;
	color: #fc6840;
	letter-spacing: 4rpx;
	margin: 41rpx 6rpx 30rpx;
	align-self: flex-start;
}

/* 店铺信息 start */
.bk-img {
	width: 750rpx;
	height: 408rpx;
}

.nav {
	width: 702rpx;
	height: 165rpx;
	border-radius: 30rpx;
	background-color: #ffffff;
	position: relative;
	top: -103rpx;
	display: flex;
	margin: 0 auto -83rpx;
	flex-direction: row;
	align-items: center;
}

.shop-img-block {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.shop_img {
	width: 143rpx;
	height: 143rpx;
	margin: 0 14rpx 0 14rpx;
}

.shop_name {
	padding: 12rpx 0 16rpx;
	font-size: 30rpx;
	color: #222222;
	font-weight: bold;
}

.shop_address {
	font-size: 24rpx;
	color: #666666;
	margin-top: 23rpx;
	display: flex;
	align-items: center;
}

.shop_more {
	font-size: 22rpx;
	color: #666666;
	align-self: flex-end;
	display: flex;
	align-items: center;
	margin-left: 78rpx;
}

.shop_more image {
	width: 17rpx;
	height: 11rpx;
	margin-left: 8rpx;
}

/* 店铺信息 end */

/* 为你优选 start */
.list-middle {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	// padding: 0 24rpx;
}

.list-middle-1 {
	display: flex;
	position: relative;
	width: 340rpx;
}

.list-img1 {
	width: 341rpx;
	height: 354rpx;
	border-radius: 20rpx;
}

.list-middle-2 {
	display: flex;
	flex-direction: column;
	// margin-left: 40rpx;
	width: 340rpx;
	justify-content: space-between;
	position: relative;
}

.list-img2,
.list-img3 {
	width: 339rpx;
	height: 165rpx;
	border-radius: 20rpx;
}

.title1,
.title2,
.title3 {
	width: 139rpx;
	height: 46rpx;
	font-size: 28rpx;
	color: #ffffff;
	background-color: #ff7901;
	text-align: center;
	line-height: 46rpx;
	border-radius: 20rpx 0 20rpx 0;
	z-index: 970;
	position: absolute;
	top: 0;
	left: 0;
	overflow: hidden;
}

.title2 {
	background-color: #feb026;
	top: 0;
}

.title3 {
	background-color: #ff4f01;
	top: 190rpx;
}

/* 为你优选 end */
/* 本店招牌 start */
.list-bottom {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-around;
}

.list-pop {
	display: flex;
	flex-direction: column;
	margin-bottom: 20rpx;
}

.list-pop-img {
	width: 341rpx;
	height: 337rpx;
}

.pop-name {
	font-size: 24rpx;
	font-weight: bold;
	margin-left: 22rpx;
	margin-top: 21rpx;
}

.pop-price {
	font-size: 29rpx;
	font-weight: bold;
	margin: 21rpx 0 26rpx 22rpx;
	display: flex;
	align-items: center;
}

.pop-msg {
	background-color: #ffffff;
	border-bottom-left-radius: 30rpx;
	border-bottom-right-radius: 30rpx;
	margin-top: -9rpx;
}

.price-through {
	font-size: 23rpx;
	color: #888888;
	text-decoration: line-through;
	font-weight: 500;
	margin-left: 14rpx;
}
/* 本店招牌 end */
</style>
