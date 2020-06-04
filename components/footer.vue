<template>
	<view>
		<view :class="isIpx==0 ? 'ipx_h':'other_h'"></view>
		<view class="x-flex footer" :class="isIpx==0 ? 'ipx':'other'" v-if="status">
			<view class="cu-bar tabbar bg-white width ">
				<view class="action item x-flex"  
				      :class="index==2?'add-action':current==item.path?'mCol':''" 
				      v-for="(item,index) in list" :key="index" @click="nav(item.path)">
					<image :src="current==item.path ? item.selectIcon : item.icon" class="item-icon" v-if="index != 2"></image>
			    	
					<!-- #ifdef MP-WEIXIN -->
			    	  <button class="cu-btn cuIcon-scan bg-yellow shadow _cff" v-else></button>
			    	<!-- #endif -->
					
					<!-- #ifndef MP-WEIXIN -->
					   <button class="cu-btn cuIcon-scan bg-yellows shadow _cff" v-else plain="true"></button>
					<!-- #endif -->
					<view class="item-text">
						{{item.text}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	let sys=uni.getSystemInfoSync();
	export default {
		name:"x-footer",
		data() {
			return {
				list:[
					{
						icon:'/static/icon1.png',
						selectIcon:'/static/icon1_s.png',
						text:'首页',
						path:'pages/index/index'
					},
					{
						icon:'/static/icon2.png',
						selectIcon:'/static/icon2_s.png',
						text:'点单',
						path:'pages/menu/menu'
					},
					{
						icon:'/static/icon3.png',
						selectIcon:'/static/icon3_s.png',
						text:'扫码点餐',
						path:'pages/index/scan'
					},
					{
						icon:'/static/icon3.png',
						selectIcon:'/static/icon3_s.png',
						text:'桌单',
						path:'pages/personal-center/tableOrder'
					},
					{
						icon:'/static/icon4.png',
						selectIcon:'/static/icon4_s.png',
						text:'我的',
						path:'pages/personal-center/personal-center'
					}
					],
				current:'pages/order/order',
				status:1,
				isIpx:-1
			}
		},
		created() {
			this.isIpx=sys.model.indexOf('iPhone X');
			let wx_audit=this.$api.getStorage('wx_audit');
			this.status=wx_audit.status||1;
			let page=getCurrentPages();
			this.current=page[page.length-1].route;
		},
		methods:{
			nav(path) {
				if(this.current == path){
					return
				}
				uni.reLaunch({
					url:'/'+path
				})
			}
		}
	}
</script>

<style lang="scss">
	.bg-yellows {
		background-color: #feb026;
		color: #FFFFFF;
		border: none;
	}
	.width{
		width: 100%;
	}
	.ipx_h{
		height: 50upx;
	}
	.other_h{
		height: 0;
	}
	.ipx{
		padding-bottom:50upx;
		height: 150upx;
	}
	.other{
		height: 100upx;
	}
	.footer{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		// height: 100upx;
		background: #fff;
		z-index: 990;
		.item{
			flex:1;
			flex-direction: column;
			justify-content: center;
			color: #222;
		}
		.item-icon{
			width: 40upx;
			height: 40upx;
			margin: 6upx 0;
		}
		.item-text{
			font-size: 22upx;
		}
	}

	
</style>
