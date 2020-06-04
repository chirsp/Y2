<template>
	<view>
		<!-- 顶部搜索 start -->
		<view class="cu-bar search bg-white mBg" @click="doSearch">
			<view class="search-form round">
				<text class="cuIcon-search" ></text>
				<view style="color: #888;font-size: 26upx;">{{placeholder}}</view>
			</view>
		</view>
	
	
	    <scroll-view scroll-x class="bg-white nav">
	    	<view class="flex text-center">
	    		<view class="cu-item flex-sub" :class="index==TabCur?'text-orange cur':''" v-for="(item,index) in Tab" :key="index" @tap="tabSelect" :data-id="index">
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
					<scroll-view scroll-y :style="{'height': scroll_h+'px'}" @scrolltolower="getMore"  >
						<view class="title-r">{{tab[current].name}}</view>
						<block v-for="(item,index) in foodlist" :key="index" v-if="item.status==1">
							<goods :item="item" :index="index" @addNums="addNums" 
							@removeNums="removeNums" :label='label' :totalCount='totalCount' :totalMoney='totalMoney'></goods>
						</block>
					</scroll-view>
				</view>
			</view>  
			<view class="order x-flex" :class="isIpx!=-1 ? 'ipx_b' : 'other_b'">
				<view class="order-ab" v-if="mask_show && totalCount">
					<view class="x-flex-sp car-title">
						<view >已选菜品（共{{totalCount}}道）</view>
						<view style="padding: 0 10upx;" @click="clearBuyCar">清空</view>
					</view>
					<scroll-view scroll-y style="max-height: 600rpx;">
						<view v-for="(item,index) in cartList" :key="index">
							<view v-if="item.nums && item.nums != '0'" style="padding: 0 30upx;">
								<goods :item="item" :label='label' :index="index" @addNums="addNums"
								 @removeNums="removeNums"  :totalCount='totalCount' :totalMoney='totalMoney'></goods>
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
				<view class="center">
					<text class="mar-t5">会员价:¥{{totalMoney}}</text>
					<text class="mar-t5">原价:¥{{originMoney}}</text>
				</view>
				<!-- <view class="order-right" @click="getOrder" :style="{'background':totalCount ? '' : '#ddd'}">去下单</view> -->
			</view>
		</block>
		
	    <evaluate v-if="TabCur==1" :listeva='listeva'></evaluate>
		
		<view v-if="status">
			<x-footer></x-footer>
		</view>
		
		<view v-if="mask_show && totalCount" class="x-mask"  @click="hideMask"></view>
		
		<!-- 桌子订单 -->
		<!-- <image src="../../static/newimg/order.png" class="table_order" @click="lookTableOrder()"></image> -->
	</view>
</template>

<script>
	let sys=uni.getSystemInfoSync();
	import xFooter from '../../components/footer.vue';
	import goods from '../../components/goods.vue';
	import evaluate from '../../components/evaluate.vue';
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
				totalCount:0, //数量
				totalMoney:0,//总价
				originMoney:0,//原价
				status:1,
				isIpx:-1,
				foodlist:[],
				page:1,
				isLoad:false,
				refresh:false,
				Tab:['点餐','评价'],
				TabCur: 0,
				scrollLeft: 0,
				listeva:"",
				order_id:'',
				evaCount:0 ,//评价总数
				deskId:"",
				label:[],
				cartList:''
			};
		},
		computed:mapState(['_buyList','_orderId','_orderNo']),
		components: {
			xFooter,
			goods,
			evaluate
		},
		onPullDownRefresh() {
			this.getList()
		},
		onReachBottom() {
			if(this.isLoad){
				return
			}
			if(this.TabCur==1){
				this.page++
				this.init()
			}
		},
		onLoad(e) {
			this.deskId = e.deskId
			this.isIpx=sys.model.indexOf('iPhone X');
			let wx_audit=this.$api.getStorage('wx_audit');
			this.status=wx_audit.status;
			this.init()
		}, 
		onShow() {
			this.getScrollHeight();  //获取scrollview高度
			this.getMenuList();  //获取菜单列表
		},
		
		methods:{
			...mapMutations(['_addBuyList','_removeBuyList','_clearBuyList','_initBuyList']),
			
			// 获取评价列表
			init() {
				let _this=this;
				_this.isLoad=true
				_this.$api.ajax('smdc/Comment/index',{
					shop_id:_this.$store.state.shopId,
					order_id:_this.order_id,
					page:_this.page,
					limit:10,
				},function(ret){
					_this.isLoad=false
					_this.evaCount = ret.count
					
					if(_this.page==1){
						_this.listeva = ret.data;
					}else{
						_this.listeva.concat(ret.data)
					}
					
				})		
			},
			
			// 选择导航
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
				this.page=1
			},
			
			//加载更多
			getMore() {
				this.getList();
			},
			doSearch() {
				this.$api.openWin('../goodsList/goodsList');
			},
			//获取scrollview高度
			getScrollHeight() {
				let frmHeight=sys.windowHeight;
				let frmWidth=sys.windowWidth;
				let div_h=100+100+100;
				let other_h=(div_h/2)*(frmWidth/375);
				this.scroll_h=frmHeight-other_h;
			},
			//改变分类
			changeCurrent(index){
				this.current=index;
				this.getList();
			},
			//获取菜单列表
			getMenuList() {
				let _this=this;
				_this.$api.ajax('smdc/food/get_cat',{
					shop_id:_this.$store.state.shopId,
					deskid:_this.deskId,
				},function(ret){
					_this.tab = ret.data;
					_this.getList();	
				})	
			},
			//获取分类底下的数据
			getList() {
				let _this = this;
				_this.$api.ajax('smdc/cart/food',{
					shop_id:_this.$store.state.shopId,
					deskid:_this.deskId,
					search:'',
					type:'',
					limit:10,
					page:_this.page,
					cat_id:_this.tab[_this.current].id
				},function(ret){
					console.log(ret)
					let data=ret.data.foodlist;
					setTimeout(function(){
						uni.stopPullDownRefresh()
					},1000)
					if(data.length){
						_this.totalCount = parseFloat(ret.data.totalCount)
						_this.totalMoney = parseFloat(ret.data.totalMoney)
						_this.originMoney = ret.data.originMoney
						_this.label = ret.data.label
						if(_this.page == 1){
							_this.foodlist = data
						}else{
							_this.foodlist = _this.foodlist.concat(data)
						}
					}else {
						_this.more=false;  
					}
				})
			},

			//增加数量
			addNums(e){
				let _this = this;
				_this.$api.ajax('smdc/cart/add',{
					shop_id:_this.$store.state.shopId,
					deskid:_this.deskId,
					id:_this.foodlist[e.index].id
				},function(ret){
					_this.getList()
				})
			},
			//增加数量
			syncNums(list){
				this.tab.map(item => (
					item.list.map(val => (
						list.id == val.id ? val.num=list.num : ''
					))
				))
			},
			//减少数量
			removeNums(e){
				console.log("减少数量");
				let _this = this;
				_this.$api.ajax('smdc/cart/sub',{
					shop_id:_this.$store.state.shopId,
					deskid:_this.deskId,
					id:_this.foodlist[e.index].id
				},function(ret){
					_this.getList()
				})
			},

			//清空购物车
			clearBuyCar() {
				let _this = this;
				_this.$api.ajax('smdc/cart/clearAll',{
					shop_id:_this.$store.state.shopId,
					deskid:_this.deskId,
				},function(ret){
					_this.mask_show = false
					_this.getList()
				})
			},
			//展示选中的商品
			showMask() {
				this.mask_show=true;
			},
			//隐藏选中的商品
			hideMask() {
				this.mask_show=false;
			},
			//反转选中的商品
			toggleMask() {
				if(!this.totalMoney){
					console.log("未点单");
					return ;
				}
				this.mask_show=!this.mask_show;
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
			//获取选中的商品集合
			getOrder() {
				if(this.totalCount==0 || this.totalCount=='0'){
					return ;
				}
				 let s=[];
				this.foodlist.forEach(item => (
					item.nums ? s.push(item) : ''
				))
				// console.log(JSON.stringify(s));
				let data = encodeURIComponent(JSON.stringify(s));
				this.$api.openWin("../order/order?data="+data+'&totalMoney='+this.totalMoney);
			},
			
			// 查看桌子订单
			lookTableOrder(){
				uni.navigateTo({
					url:'/pages/personal-center/tableOrder'
				})
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: #fff;
	}
	.boxcontent{
		margin-bottom: 180upx;
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
	.table_order{
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		position: fixed;
		bottom: 290upx;
		right: 0;
		z-index: 2;
		background-color: #FFFFFF;
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
		.title-r{
			height: 30upx;	
			font-size:28upx;
			font-weight:500;
			color:rgba(34,34,34,1);
		}
	}
	.active{
		background: #fff;
		color: #FEB026;
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
			background: #FEB026;
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
		background-color: #FEB026;
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
		background-color: #FEB026;
		border-radius: 50%;
		border: 1px solid #FFFFFF;
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
		width: 72upx;
		height: 63upx;
		margin-top: 15upx;
		margin-left: 19upx;
	}
	.total-price{
		color: #FEB026;
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
