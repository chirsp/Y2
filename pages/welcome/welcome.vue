<template>
	<view>
		<!-- 背景 start -->
		<view class="page">
			<!-- <image src="http://192.168.1.11:888/background.jpg" class="bk-img" :style="{'height':sys.windowHeight+'px'}"></image> -->
			<image :src="data.banner_ids[0] ? data.banner_ids[0] : '/static/bg.jpg'" class="bk-img" mode="aspectFill"></image>
			<view class="bk-content">
				<!-- 欢迎模块 start -->
				<view class="welcome-block">
					<view class="welcome-headimg">
						<image :src="data.logo[0] ? data.logo[0] : '/static/head.png'" class="welcome-headimg-ico"></image>
					</view>
					<view class="welcome-title">
						欢迎来到{{data.name ? data.name : '本店'}}
					</view>
				</view>
				<!-- 欢迎模块 end -->

				<!-- 确认顾客人数 start -->
				<view class="order-people">
					<view class="order-title1">客官,您几位?</view>
					<view class="order-title2">桌号:{{deskId}}<text v-if="config.canwei_price" style="padding-left: 30rpx;">餐位费: {{config.canwei_price}}元/人</text></view>
					<!-- <scroll-view scroll-x="true" class="people-num">
						<block v-for="(item,index) in more" :key="index">
							<view class="people-input" :class="{'checked':personNums==(index+1)}" @click="setNums(index+1)">{{index+1}} 人</view>
						</block>
						<view @click="showNum" class="people-input">更多</view>
					</scroll-view> -->
					
					<view class="people-num-all">
						<block v-for="(item,index) in more" :key="index">
							<view class="people-input" :class="{'checked':personNums==(index+1)}" @click="setNums(index+1)">{{index+1}} 人</view>
						</block>
						<view @click="showNum" class="people-input">更多</view>
					</view>

					<view class="saoma-btn-block mBg" @click="goStore()">
						<view>确定</view>
					</view>
				</view>
				<!-- 确认顾客人数 end -->
			</view>
		</view>
		<!-- 背景 end -->
		
		<!-- 顾客人数弹窗 -->
		<view class="cu-modal" :class="num_show?'show':''">
			<view class="cu-dialog" style="width: 70%;">
				<view class="cu-bar bg-white justify-end">
					<view class="content">就餐人数</view>
					<view class="action" @tap="hideNum">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl" style="padding: 40upx 60upx;background: #fff;">
					<input type="number" v-model="personNums" value="" class="person-input mCol" />
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub  solid-left" @tap="hideNum">取消</view>
					<view class="action margin-0 flex-sub text-orange solid-left" @tap="goStore">确定</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	//let sys=uni.getSystemInfoSync();
	import { mapState, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				//sys:sys,
				num_show:false,
				personNums:1,
				more:2,
				data:{},
				config:''
			}
		},
		computed: mapState(['hasShop', 'shopId','hasDesk','deskId','deskNum']),
		onLoad(e) {
			this.setUid()
			if(e.scene){
				let param=decodeURIComponent(e.scene);
				let url='kejia_welecome?'+param;
				console.log(url);
				let uniacid=this.$api.getParam(url,'uniacid');
				let deskId=this.$api.getParam(url,'desk');
				let shopId=this.$api.getParam(url,'shop_id');
				console.log(uniacid,deskId,shopId);
				this.intoShop(shopId); //记录店铺id
				this.$api.setStorage('kejia_order_shopId',shopId);
				this.intoDesk(deskId); //记录桌号
				this.getData(shopId);
				
			}else{
				this.getData(this.shopId);
			};
		},
		onShow() {
			
		},
		methods: {
			...mapMutations(['intoNum','changeNeedScan','intoShop','intoDesk','login']),
			getData(shopId) {
				let _this = this;
				this.$api.ajax('smdc/index/index',{
					shop_id:shopId,
					action:0
				},function(ret){
					_this.data=ret.data.shop;
					_this.config=ret.data.config;
					_this.$store.commit('_setConfig',ret.data.config);
					uni.setNavigationBarTitle({
						title:ret.data.shop.name
					})
				},'POST')
			},
			goStore() {
				if(this.personNums<1){
					this.$api.toast("请重新选择用餐人数")
					return ;
				}
				this.num_show=false;
				//更新vuex
				this.intoNum(this.personNums); //记录人数
				this.changeNeedScan(false);  //不用再扫码
				uni.navigateTo({
					url:'/pages/index/index'
				})
			},
			setUid() {
				let _this = this;
				this.$api.ajax('smdc/user/setuid',{
					openid:this.$api.getStorage('kejia_order_openId'),
					shop_id: this.shopId,
					desk_id:this.deskId
				},function(ret){
					_this.more=ret.data.desk.seating_num;
				});
			},
			showNum(){
				this.num_show=true;
			},
			hideNum(){
				this.num_show=false;
			},
			setNums(nums){
				this.personNums=nums;
			}
		}
	}
</script>

<style>
	.page{
		position: relative;
	}
	/* 背景 start */
	.bk-content {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.bk-img {
		position: fixed;
		width: 100%;
		height: 100%;
	/* 	height: 100%; */
	}
	/* 背景 end */

	/* 欢迎模块 start */
	.welcome-block {
		margin-top: 150upx;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
	}

	.welcome-headimg {
		/* display: flex;
		flex-direction: row;
		justify-content: center; */
	}

	.welcome-headimg-ico {
		width: 172upx;
		height: 172upx;
		border-radius: 50%;
	}

	.welcome-title {
		font-weight: bold;
		font-size: 44upx;
/* 		text-align: center; */
		color: #FFFFFF;
		margin-top: 25upx;
	}
	/* 欢迎模块 end */

	/* 确认顾客人数 start */
	.order-people {
		margin: 146upx 24upx 0;
		border-radius: 30upx;
		background-color: #F8F8F8;
		padding: 46upx 0 50upx 46upx;
	/* 	display: flex;
		flex-direction: column; */
		
	}

	.order-title1 {
		font-size: 44upx;
		color: #222222;
		/* margin-bottom: 37upx;
		margin-left: 46upx;
		margin-top: 40upx; */
	}

	.order-title2 {
		font-size: 30upx;
		color: #222222;
		padding-top: 32upx;
	}

	.people-input {
		display: inline-block;
		width: 134upx;
		height: 73upx;
		color: #FEB026;
		font-size: 34upx;
		border-radius: 37upx;
		text-align: center;
		line-height: 73upx;
		border: 1upx solid #eeee;
		margin: 10upx;

	}

	.checked {
		background-color: #FEB026;
		color: #FFFFFF;
	}

	/* .people-num {
		white-space: nowrap;
		padding-right: 60upx;
		margin-top: 60upx;
	} */
	.people-num-all{
	     margin-top: 60upx;
	}

	.saoma-btn-block {
	/* 	display: flex;
		justify-content: center;
		align-items: center; */
/* 		margin-top: 40upx; */
	/* 	width: 576upx; */
		height: 95upx;
		line-height: 95upx;
		text-align: center;
		margin: 40upx 60upx 0 14upx;
		font-weight: bold;
		font-size: 32upx;
		color: #FFFFFF;
		border-radius: 36upx;
	
	}
	/* 确认顾客人数 end */
	
	.person-input{
		line-height: 68upx;
		border-radius: 10upx;
		height: 68upx;
		font-size: 30upx;
		background: #F3F3F3;
	}
</style>
