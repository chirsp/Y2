<template>
	<view class="page" v-if="load">
		<!-- 菜品图片 start -->
		<view class="goods-img">
			<cover-view class="banner_tip">
				<cover-view class="selectType" v-if="food.video">
					<cover-view class="Type-text" :class="showVideo?'select-bg':''" @click.stop="VideoShow()">视频</cover-view>
					<cover-view class="Type-text" :class="showPic?'select-bg':''" @click.stop="PicShow()">图片</cover-view>
				</cover-view>
				<cover-view class="picNum">
					<cover-view class="Type-text">{{currentpic}}/{{food.img_ids.length}}</cover-view>
				</cover-view>
			</cover-view>
			<view class="goods-img">
				<block v-if="food.video && showVideo" >
					<video id="myVideo"
					  autoplay="true"
					  class="goods-wapper goods-viedo"
					  show-mute-btn="true"
					  objectFit="cover"
					  enable-progress-gesture="false"
					  controls="controls" x5-playsinline="" playsinline="true" webkit-playsinline="true" x-webkit-airplay="true" x5-video-player-type="h5" x5-video-player-fullscreen="" x5-video-orientation="portraint"
					  muted="true"
					  :src="food.video" >
					</video>
				</block>
				<swiper :indicator-dots="false"  :interval="3000" :duration="1000" @change="picChange" class="goods-wapper goods-img" v-if="showPic">
					<block v-for="(item,index) in food.img_ids" :key="index">
						<swiper-item>
							<image :src="item ? item : '/static/noImg.png'" class="goods-wapper" mode="aspectFill" @click="preview(item)"></image>
						</swiper-item>
					</block>
				</swiper>
			</view>
		</view>
		<!-- 菜品图片 end -->

		<!-- 菜品信息 start -->
		<view class="goods-details page-block">
			<view class="goods-name">{{food.name ? food.name : ''}}</view>
			<view class="goods-sale"></view>
			<view class="goods-group">
				<view class="goods-price">
					<view class="price" v-if="food.sale_price">￥{{food.sale_price!='0.00' ? food.sale_price : food.price}}</view>
					<view class="price-through">￥{{food.price ? food.price : ''}}</view>
				</view>
				<view class="btn-add" :class="food.num==0?'opacity':''" @click="addNums(food.id,food.num)">+加入购物车</view>
			</view>
			
		</view>
		
		               
		<!-- 菜品信息 end -->
		
		<view class="taste">
			<!-- <view class="view1">口味:</view> -->
			<view class="taste_tabel taste_1" :class="active[data.food.id]==index?'active':''" @click="taste(data.food.id,index)" v-for="(item,index) in data.labalList" :key="item.id">{{item.name}}</view>
		</view>
		
		<view class="flex_col _f32 intrbox">
			<view class="intr1 flex_col">
				<text class="intr2 _fw">主料:</text>
				<text>{{food.main}}</text>
			</view>
			<view class="intr1 flex_col">
				<text class="intr2 _fw">辅料:</text>
				<text>{{food.ingredients}}</text>
			</view>
		</view>

		<!-- 小tips start -->
<!-- 		<view class="page-block tips-block" v-if="data.sup">
			<view class="tips" v-for="(item,index) in data.sup" :key="index">
				<view class="tips-ico">
					<image :src="item.cover[0]" class="tips-ico1"></image>
				</view>
				<view class="tip-words">{{item.title}}</view>
			</view>
		</view> -->
		<!-- 小tips end -->
		
		<!-- <view v-if="food.cover">
			<block v-for="(item,index) in food.cover" :key="index">
				<image :src="item ? item : '/static/noImg.png'" style="width: 100%;" mode="widthFix" @click="preview(item)"></image>
			</block>
		</view> -->
		
		<!-- <view class="white-block"></view> -->

		<!-- 同店搭配 start -->
		<view class="page-block dapei" v-if="data.top_food">
			<view class="dapei-title">
				<view class="dapei-title1">本店搭配</view>
				<view class="dapei-title2">大家还会买</view>
			</view>
			<view class="dapei-goods">
				<view class="dapei-goods-wapper" v-for="item in data.top_food" :key="item.id" @click="goodsDetail(item.id)">
					<view>
						<image :src="item.cover ? item.cover[0] : '/static/noImg.png'" class="dapei-img" mode="aspectFill"></image>
					</view>
					<view class="dapei-msg">
						<view class="dapei-name">{{item.name}}</view>
						<view class="dapei-price">
							<view>￥{{item.price}}</view>
							<!-- <view><image src="/static/add.png"  @click="addNums(item.id,item.num)" class="btn-num-add"></image></view> -->
						</view>
					</view>
				</view>
			</view>
			<view class="white-block"></view>
		</view>
		<!-- 同店搭配 end -->
		
		<!-- 选好了 start -->
		<view class="total-price-block page-block">
	
		<!-- 	<view class="tips-words">还差20.9元就能使用优惠券 [去领券]</view> -->
		<view style="height: 46upx;"></view>
		
			<view class="total-bk">
				<view class="goods-num">{{totalCount}}</view>
				<image src="/static/car.png" @click="goMenu"  class="total-img"></image>
			</view>
			<view style="width: 180upx;"></view>
			<view class="total-price">￥{{totalMoney}}元</view>
			<!-- <view class="total-price">￥{{totalMoney}}元</view> -->
		<!-- 	<view class="ok">
				选好了
			</view> -->
		</view>
		<!-- 选好了 start -->
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				data:{},
				goodsId:0,
				totalMoney:"0",
				totalCount:"0",
				load:false,
				showPic:false,
				showVideo:true,
				currentpic:1,
				totalCount:"0",
				totalMoney:"0.00",
				food:"",
				active:[]
			}
		},
		computed:mapState(['_buyList']),
		onLoad(e) {
			if(e.goodsId){
				this.goodsId=e.goodsId,this.getData();
			}
			this.getCart();
		},
		methods: {
			// ...mapMutations(['_addBuyList']),
			// 获取购物车列表
			getCart(){
				let _this = this;
				_this.$api.ajax('smdc/cart/cartList',{
					shop_id:_this.$store.state.shopId,
					deskid:_this.$store.state.deskId,
				},function(ret){
					_this.totalCount = ret.data.totalCount
					_this.totalMoney=ret.data.totalMoney
				})
			},
			
			getData() {
				let _this = this;
				_this.$api.ajax('smdc/food/getonefood',{
					id:_this.goodsId,
					shop_id:_this.$store.state.shopId
				},function(ret){
					_this.data=ret.data;
					_this.food = ret.data.food
					_this.load = true
					if(!_this.food.video){
						_this.showPic = true
					}
					
				},"POST",true);
			},
			
			// 点击播放视频
			VideoShow(){
				this.showPic = false
				this.showVideo = true
			},
			// 点击查看图片
			PicShow(){
				this.showPic = true
				this.showVideo = false
			},
			
			// 获取轮播图改变的index
			picChange(e){
				console.log(e)
				// this.currentpic = e.
			},
			
			preview(img) {
				uni.previewImage({
					count:img,
					urls:this.food.cover
				})
				let index=parseInt($(this).data("index"));
			},
			goodsDetail(id) {
				this.$api.openWin('/pages/details/details?goodsId='+id);
			},
		
			
			//增加数量
			addNums(id,num){
				console.log(num)
				if(num==0){
					this.$api.toast('今日已售完')
					return
				}
				let _this = this;
				_this.$api.ajax('smdc/cart/add',{
					shop_id:_this.$store.state.shopId,
					deskid:_this.$store.state.deskId,
					id:id,
				},function(ret){
					_this.$api.toast('已加入购物车','success');
					_this.getCart();
				})
			},
			
			goMenu() {
				uni.reLaunch({
					url:'../menu/menu'
				})
			},
			// 选择口味
						taste(gid,tid){
							let _this = this;
							_this.$api.ajax('smdc/cart/label', {
								shop_id: _this.$store.state.shopId,
								deskid: _this.$store.state.deskId,
								gid: gid,
								tid: tid,
							}, function(ret) {
								_this.active = ret.data;
								console.log(JSON.stringify(ret.data))
							})
						},
		}
	}
</script> 

<style lang="less">
	.intrbox{
		margin: 30upx 0;
		padding: 40upx;
		background-color: #FFFFFF;
	}
	.intr1{
		margin-bottom: 20upx;
	}
	.intr2{
		margin-bottom: 10upx;
	}
	.banner_tip{
		position: absolute;
		margin-top: 400upx;
		width:100%;
		z-index:3;
		.selectType{
			display: flex;
			justify-content: center;
			flex-direction: row;
		}
		.select-bg{
			background-color: #FEB026; 
			color: #FFFFFF;
		}
		.Type-text{
			background: #FFFFFF;
			opacity: 0.5;
			padding: 5upx 15upx;
			text-align: center;
			font-size: 22upx;
			color: #222;
			border-radius: 40upx;
			margin-right: 15upx;
			z-index: 10;
		}
		.picNum{
			float: right;
			margin-right: 30upx;
		}
		.picNum{
			
		}
	}
	
	
	.goods-img{
		position: relative;
	}
	/* 菜品图片 start */
	.goods-wapper,.goods-wapper-img {
		width: 100%;
		height: 526upx;
	}
	/* 菜品图片 end */

	/* 菜品信息 start */
	.goods-details {
/* 		height: 231upx; */
		padding: 35upx 33upx 30upx 31upx;
		background: #fff;
	}

	.goods-name {
		font-size: 32upx;
		font-weight: bold;
		color: #333333;
	}

	.goods-sale {
		font-size: 22upx;
		color: #888888;
		font-weight: bold;
		margin-top: 25upx;
		margin-bottom: 41upx;
	}

	.goods-group {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.goods-price {
		font-size: 48upx;
		color: #FEB026;
		font-weight: bold;
		display: flex;
		align-items: baseline;
	}
	.price-through{
		font-size: 29upx;
		color: #888888;
		text-decoration: line-through;
		margin-left: 21upx;
		font-weight: 500;
	}
	.opacity{
		opacity: 0.5;
	}
	.btn-add {
		width: 156upx;
		height: 49upx;
		border-radius: 20upx;
		background-color: #FEB026;
		font-size: 22upx;
		color: #FFFFFF;
		font-weight: bold;
		text-align: center;
		line-height: 49upx;
	}
	.price{
		margin-left: -10upx;
	}
	/* 菜品信息 end */

	/* 小tips start */
	.tips-block {
		width: 100%;
		height: 78upx;
		display: flex;
		flex-direction: row;
		margin: 30upx 0 24upx 0;
		justify-content: space-around;
		background: #fff;
	}

	.tips {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.tips-ico {
		display: flex;
		align-items: center;
	}

	.tips-ico1 {
		width: 20upx;
		height: 20upx;
	}

	.tip-words {
		font-size: 22upx;
		color: #888888;
		margin-left: 6upx;
		letter-spacing: 4upx;
	}

	/* 小tips end */

	/* 同店搭配 start */
	.dapei {
		padding: 30upx 31upx;
		background: #FAFAFA;
	}

	.dapei-title {
		display: flex;
		align-items: baseline;
	}

	.dapei-title1 {
		font-size: 32upx;
		color: #333333;
		font-weight: bold;
	}

	.dapei-title2 {
		font-size: 24upx;
		font-weight: bold;
		color: #888888;
		margin-left: 22upx;
	}

	.dapei-goods {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.dapei-goods-wapper{
		width: 217upx;
		height: 243upx;
		margin-top: 32upx;
	}
	.dapei-img{
		width: 100%;
		height: 147upx;
		border-radius: 10upx;
	}
	.dapei-msg{
		border-radius: 0 0 10upx 10upx;
		padding: 0 13upx 0 15upx;
	}
	.dapei-name{
		font-size: 22upx;
		color: #333333;
		font-weight: bold;
		line-height: 40upx;
		max-height: 40upx;
		overflow: hidden;
	}
	.dapei-price{
		color: #FEB026;
		font-size: 26upx;
		font-weight: bold;
		display: flex;
		justify-content: space-between;
		margin: 11upx 0 24upx;
	}
	.btn-num-add{
		width: 38upx;
		height: 38upx;
	}
	.white-block{
		height: 150upx;
	}
	/* 同店搭配 end */
	/* 选好了 start */
	.total-price-block{
		width: 100%;
		height: 94upx;
		position: fixed;
		bottom: 0;
		display: flex;
		align-items: center;
		/* justify-content: flex-end; */
		background: #fff;
	}
	.ok{
		width: 198upx;
		background-color: #FEB026;
		font-size: 36upx;
		color: #FFFFFF;
		font-weight: bold;
		text-align: center;
		line-height: 94upx;
	}
	.total-img{
		width: 67upx;
		height: 63upx;
		margin-top: 15upx;
		margin-left: 19upx;
	}
	.total-bk{
		width: 108upx;
		height: 108upx;
		background-color: #FEB026;
		border-radius: 50%;
		z-index: 2000;
		position: absolute;
		bottom: 8upx;
		left: 35upx;
	}
	.total-price{
		color: #FEB026;
		font-size: 34upx;
	/* 	font-weight: bold; */
		margin: 23upx 253upx 35upx 0;
	}
	.goods-num{
		position: absolute;
		top: 0;
		left: 82upx;
		width: 32upx;
		height: 32upx;
		font-size: 22upx;
		color: #FFFFFF;
		text-align: center;
		line-height: 32upx;
		background-color: #FEB026;
		border-radius: 50%;
		border: 1px solid #FFFFFF;
	}
	.tips-words{
		width: 100%;
		height: 46upx;
		font-size: 20upx;
		color: #FEB026;
		text-align: center;
		line-height: 46upx;
		background-color: #FFD28B;
		position: absolute;
		bottom: 94upx;
	}
	/* 选好了 end */
	
	/* 口味选择 */
		.taste {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			width: 100%;
			height: 10%;
			margin-top: 25upx;
			margin: 15upx;
			//justify-content: space-around;
			.taste_tabel{
				width: 68upx;
				height: 40upx;
				border:1px solid #AAAAAA;
				text-align: center;
				background: #f1f1f1;
				color: #333;
		
			}
			.active{
				background: rgba(254,176,38,0.7);
				color: #333;
			}
			.taste_1{
				width: 80upx;
				height: 30upx;
				border-radius: 22upx;
				margin: 6upx;
				font-size: 20upx;
				padding-top: 0upx;
				line-height: 30upx;
				text-align: center;
			}
			.view1{
				padding-top: 3upx;
			}
		}
	
</style>
