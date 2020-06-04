<template>
	<view>
		<!-- 顶部搜索 start -->
		<view class="cu-bar search bg-white mBg" @click="doSearch">
			<view class="search-form round">
				<text class="cuIcon-search" ></text>
				<view style="color: #888;font-size: 26upx;">{{placeholder}}</view>
			</view>
		</view>
	
		<!-- 左右联动 -->
		<view class="x-flex">
			<view class="left">
				<view scroll-y :style="{'height': scroll_h+'px'}">
					<block v-for="(item,index) in tab" :key="index">
						<view :class="{'active':current==index}" @click="changeCurrent(index,item)">{{item.type_name}}</view>
					</block>
				</view>
			</view>
			
			<view :style="{'height': scroll_h+'px'}"
				class="right">
				<scroll-view :style="{'height': scroll_h+'px'}" lower-threshold="300" :refresher-triggered="true" :scroll-top="scrollTop" :scroll-y="true" class="scroll-Y" @scrolltolower="lower">
					<view class="title-r"></view>
					<block v-for="(item,index) in foodlist" :key="index">
						<goods :item="item" :index="index" :storeId="storeId" @getList='getList'></goods>
					</block>
					<text v-if="isLoad" class="_flex-center" style="margin-bottom:1rem;">暂无更多数据!</text>
				</scroll-view>
			</view>
		</view>  
		
		<!-- 添加菜品 -->
		<drag-button
			:isDock="true"
			:existTabBar="true"
			showImg="/static/adddish.png"
			@btnClick="adddish()" />
		
	</view>
</template>

<script>
	let sys=uni.getSystemInfoSync();
	import goods from '../../components/dishgood.vue';
	import dragButton from '../../../components/drag-button.vue';
	import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				sys:sys,  //系统信息
				placeholder:'请输入菜品关键词',  
				keyWord:'',
				scroll_h:0, //scrollview高度
				current:0,  //当前选中的分类
				tab:[],  //数据
				mask_show:false,  //显示选中的菜
				scrollTop: 50,
				totalCount:0, //数量
				totalMoney:0,//总价
				originMoney:0,//原价
				status:1,
				isIpx:-1,
				foodlist:[],
				page:1,
				isLoad:false,
				// refresh:false,
				tabname:"",
				storeId:0//当前选择的商店id
			};
		},
		computed:mapState(['_buyList','_orderId','_orderNo']),
		components: {
			goods,dragButton
		},
		onPullDownRefresh() {
			this.page = 1;
			this.getList();
		 },
		onLoad() {
			this.isIpx=sys.model.indexOf('iPhone X');
			let wx_audit=this.$api.getStorage('wx_audit');
			this.status=wx_audit.status;
		}, 
		onShow() {
			this.page = 1;
			this.getScrollHeight();  //获取scrollview高度
			this.getMenuList();  //获取菜单列表
		},
		methods:{
			...mapMutations(['_addBuyList','_removeBuyList','_clearBuyList','_initBuyList']),
			// upper: function(e) {
            // 	console.log('上拉',e)
			// },
			lower: function(e) {
				this.page++;
				this.getList();
			},
			//加载更多
			getMore() {
				this.getList();
			},
			doSearch() {
				this.$api.openWin('/pages/goodsList/goodsList');
			},
			//获取scrollview高度
			getScrollHeight() {
				if(this.tab.length>0){
					this.storeId = this.tab[this.current].id;
				}
				let frmHeight=sys.windowHeight;
				let frmWidth=sys.windowWidth;
				this.scroll_h=frmHeight;
			},
			//改变分类
			changeCurrent(index,item){
				this.isLoad = false;
				this.current=index;
				this.storeId = item.id;
				this.tabname = this.tab[index];
				this.foodlist = [];
				this.page = 1;
				this.getList();
			},
			//获取菜单列表
			getMenuList() {
				let _this=this;
				_this.$api.ajax('smdc/food/get_cat',{
					shop_id:_this.$store.state.shopId,
					deskid:_this.$store.state.deskId,
				},function(ret){
					_this.tab = ret.data;
					_this.getList();	
				})	
			},
			//获取分类底下的数据
			getList() {
				let _this = this;
				_this.$api.ajax('smdc/Food/foodlist',{
					shop_id:_this.$store.state.shopId,
					deskid:_this.$store.state.deskId,
					search:'',
					type:'',
					limit:10,
					page:_this.page,
					cat_id:_this.tab[_this.current].id
				},function(ret){
					setTimeout(function(){
						uni.stopPullDownRefresh();
					},1000)
					let data=ret.data
					if(data.length){
						if(_this.page == 1){
							_this.foodlist = data;
						}else{
							_this.foodlist = _this.foodlist.concat(data);
						};
						_this.storeId = _this.tab[_this.current].id;
					}else {
							_this.isLoad=true; 
						// 清空数据
						// _this.foodlist = [];
					}
				},"POST",true)
			},

		
			//商品总价
			totalPrice() {
				let total=0;
				let count=0;
				let orgintotal=0;
				this._buyList.forEach(list => (
					list.num ? list.sale_price=='0.00' ? total += list.price * parseInt(list.num) : total += list.sale_price * parseInt(list.num)  : '',
					list.num ? orgintotal += list.price * parseInt(list.num): '',
					list.num ? count+=list.num : ''
				))
				this.totalMoney=parseFloat(total).toFixed(2);
				this.originMoney= parseFloat(orgintotal).toFixed(2); 
				this.totalCount=count;
			},
			
			adddish(){
				// 编辑菜品
				this.$api.openWin(`/busines/page/shopOwner/editDish?storeId=${this.storeId}`);
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: #fff;
	}
	::-webkit-scrollbar {
	  width: 0;
	  height: 0;
	  color: transparent;
	}
	.x-mask{
		position:fixed;
		z-index:980;
		top:0;
		right:0;
		bottom:0;
		left:0;
		background-color:rgba(0, 0, 0, 0.3);
	}
	.x-bg{
		background: $skin;
	}
	.left{
		width: 148upx;
		line-height: 84upx;
		text-align: center;
		font-size: 28upx;
		color: #555;
		background: #f8f8f8;
	}
	.right{
		background: #fff;
		flex:1;
		padding: 0 0 0 25upx;
		position: relative;
		overflow:scroll;
		.title-r{
			height: 30upx;	
			font-size:28upx;
			font-weight:500;
			color:rgba(34,34,34,1);
		}
	}
	.active{
		background: #fff;
		color: #FC3600;
		font-size: 28upx;
	}
	.ipx_b{
		bottom: 150upx;		
	}
	.other_b{
		bottom: 100upx;
	}
	.order{
		z-index: 990;
		position: fixed;
		right: 0;
		left: 0;
		background: #72706E;
		height: 100upx;
		.order-left{
			padding-left: 34upx;
			padding-right: 34upx;
			.left-re{
				position:relative;
				.car{
					width: 67upx;
					height: 63upx;
				}
				.dot{
					position: absolute;
					width: 40upx;
					height: 40upx;
					line-height: 40upx;
					text-align: center;
					top:-10upx;
					right: -20upx;
					font-size: 22upx;
					color: #fff;
					border-radius: 50%;
				}
			}
		}
		.center{
			display: flex;
			flex-direction: column;
			flex:1;
			color: #fff;
			font-size: 30upx;
			// padding:6upx 0;
			.mar-t5{
				margin: 5upx 0;
			}
		}
		
		.order-right{
			width:300upx;
			background: #FC6840;
			line-height: 100upx;
			height: 100upx;
			font-size: 32upx;
			text-align: center;
			color: #fff;
			// padding:6upx 0;
		}
		.info{
			text-align: center;
			background: rgba(255,210,139,0.3);
			height: 46upx;
			line-height: 46upx;
			color: $skin;
		}
		.order-ab{
			position: absolute;
			left: 0;
			right: 0;
			bottom: 100upx;
			background: #fff;
			padding-top: 30upx;
		}
		.goods{
			height: 94upx;
			line-height: 94upx;
			font-size:32upx;
			font-family:PingFangSC-Bold;
			// font-weight:bold;
			color:#fff;
			border-bottom: 1upx solid #eee;
			background: #fff;
			display: flex;
			.g-left{
				background: #fff;
				position: relative;
				width: 158upx;
			}
			.g-center{
				color: $skin;
				background: #fff;
				flex:1;
				border:none;
			}
			.right-price{
				text-align: center;
				background: $skin;
				width: 200upx;
			}
		}
		.x-left-ab{
			position: absolute;
			bottom: 8upx;
			left: 35upx;
			height: 108upx;
			width: 108upx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			background: $skin;
			// padding-top: 20upx;
			.img{
				width: 67upx;
				height: 63upx;
			}
		}
	}
	
	.total-price-block{
		width: 100%;
		height: 94upx;
		position: fixed;
		bottom: 100upx;
		display: flex;
		justify-content: flex-end;
		background: #fff;
	}
	.total-bk{
		width: 108upx;
		height: 108upx;
		background-color: #FC6035;
		border-radius: 50%;
		z-index: 2000;
		position: absolute;
		bottom: 8upx;
		left: 35upx;
	}
	.goods-num{
		position: absolute;
		top: 0;
		left: 82upx;
		width: 34upx;
		height: 34upx;
		font-size: 20upx;
		color: #FFFFFF;
		text-align: center;
		line-height: 34upx;
		background-color: #FC6035;
		border-radius: 50%;
		border: 1px solid #FFFFFF;
	}
	.ok{
		width: 198upx;
		background-color: #FC7A40;
		font-size: 36upx;
		color: #FFFFFF;
		font-weight: bold;
		text-align: center;
		line-height: 94upx;
	}
	.total-img{
		width: 72upx;
		height: 63upx;
		margin-top: 15upx;
		margin-left: 19upx;
	}
	.total-price{
		color: #FC5F34;
		font-size: 40upx;
		font-weight: bold;
		margin: 23upx 253upx 35upx 0;
	}
	
	.car-title{
		font-size: 26upx;
		color: #888;
		line-height: 50upx;
		padding: 0 24upx 30upx;
	}
	
</style>
