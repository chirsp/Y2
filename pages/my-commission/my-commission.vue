<template>
	<view>
		<view class="top">
			<view class="top-1">
				<view class="top-img center">
					<image :src="userInfo.avatarurl" mode=""></image>
				</view>
				<view class="top-des">
					<view class="top-des-1">{{userInfo.worker.username}}</view>
					<view class="">{{userInfo.worker.type}} ({{userInfo.worker.code}})</view>
				</view>
			</view>
		</view>
		<view class="top-2" >
			<view class="top-2-title" @click="toOrder()">
				<view class="top-2-1">{{type=="厨师"?'待制作菜品':'待配送菜品'}}</view>
				<view class="top-2-2">还有  <text style="color: #FC6840;padding: 0 10upx;">{{num}}</text>  项订单未完成</view>
			</view>
			<!-- @click="$api.openWin('/pages/commission/commission') -->
			<view class="top-2-title border-left" >
				<view class="top-2-1">可提现佣金(元)</view>
				<view class="top-2-2">共<text style="color: #FC6840;font-size: 30upx;padding: 0 10upx">{{userInfo.worker.money}}</text>元</view>
			</view>
		</view>
<!-- 
		<view class="block">
			<view class="block-1 border-right">
				<view>可提现佣金(元)</view>
				<view class="block-1-1 price">0.00</view>
			</view>
			<view class="block-1">
				<view>餐桌数</view>
				<view class="block-1-1">0</view>
			</view>
		</view>

		<view class="block">
			<view class="block-1 border-right">
				<view>成功提现佣金(元)</view>
				<view class="block-1-1 price">0.00</view>
			</view>
			<view class="block-1">
				<view>提现订单数</view>
				<view class="block-1-1">0</view>
			</view>
		</view> -->
		<view class="recode-list">			
			<view class="x-flex-sp recode-list-item" @click="nav('./withdrawal/withdrawal')">
				<view class="">提现</view>
				<view class="cuIcon-right"></view>
			</view>
			<view class="x-flex-sp recode-list-item" @click="nav('./commissionRecode/commissionRecode')">
				<view class="">佣金记录</view>
				<view class="cuIcon-right"></view>
			</view>
			<view class="x-flex-sp recode-list-item" @click="nav('./withdrawalRecode/withdrawalRecode')">
				<view class="">提现记录</view>
				<view class="cuIcon-right"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState,mapMutations } from 'vuex'
	export default {
		data() {
			return {
				typeName:'',
				list:[],
				page:1,
				more:true,
				current:0,
				type:"",
				num:0,
				tab:[{
					name:'服务佣金',
					list:[],
					page:1,
					type:0,
					more:true,
					init:true
				},{
					name:'菜品佣金',
					list:[],
					page:1,
					type:1,
					more:true,
					init:true
				}]
			}
		},
		computed: mapState(['userInfo']),
		onLoad(e) {
			if(e.typeName){
				this.typeName=e.typeName;
				this.type=e.type;
			}
			this.getData();
		},
		onShow() {
			this.getUserInfo();
			this.getnum()
		},
		onReachBottom() {
			if(this.tab[this.current].more){
				this.current==0 ? this.getData() : this.getData2();
			}
		},
		methods: {
			...mapMutations(['_setUserInfo']),
			
			// 获取用户信息
			getUserInfo(){
				this.$api.ajax('smdc/user/userinfo',{
					shop_id:this.$store.state.shopId
				},res=>{
					this._setUserInfo(res.data);
				})
				
			},
			// 厨师端待制作品
			getnum(){
				let _this = this
				if(this.type=="厨师"){
					var url = 'smdc/food/saleFoodCount'
				}else{
					var url = 'smdc/order/waiterOrderCount'
				}
				this.$api.ajax(url,{
					shop_id:this.$store.state.shopId
				},res=>{
				   _this.num = res.data
				},"POST")
			},
			
			tabSelect(index) {
				this.current=index;
				if(this.tab[this.current].init){
					this.current == 0 ? this.getData() : this.getData2();
				}
			},
			nav(link) {
				this.$api.openWin(link);
			},
			getData() {
				let _this = this;
				this.$api.ajax('smdc/Part/yongji',{
					shop_id:this.$store.state.shopId,
					page:this.tab[0].page,
					code:this.userInfo.worker.code,
					limit:10,
				},function(ret){
					let data=ret.data;
					if(data.length){
						_this.tab[0].init=false;
						_this.tab[0].page=_this.tab[0].page+1;
						_this.tab[0].list=_this.tab[0].list.concat(data);
					}else{
						_this.tab[0].more=false;
					}
				});
			},
			getData2() {
				let _this = this;
				this.$api.ajax('smdc/food/get_food_yj',{
					shop_id:this.$store.state.shopId,
					page:this.tab[1].page,
					workid:this.userInfo.worker.id,
					limit:10,
				},function(ret){
					let data=ret.data;
					if(data.length){
						_this.tab[1].init=false;
						_this.tab[1].page=_this.tab[1].page+1;
						_this.tab[1].list=_this.tab[1].list.concat(data);
					}else{
						_this.tab[1].more=false;
					}
				});
			},
			toOrder(){
				if(this.type=="厨师"){
					uni.navigateTo({
						url:"/pages/my-commission/cookerOrder"
					})
				}else{
					console.log("3333")
					uni.navigateTo({
						url:"/pages/my-commission/waiterOrder"
					})
				}
			},
			
		}
	}
</script>

<style lang="scss">
	.noData{
		line-height: 80upx;
		text-align: center;
		color: #888;
	}
	.x-sticky{
		position: sticky;
		top: 0;
		z-index: 980;
	}
	.top {
		height: 290upx;
		padding-top: 20upx;
		background-color: #FC6840;
	}
	.add-cash{
		font-size: 26upx;
		padding: 2upx 14upx;
		color: #fff;
		border:1upx solid #fff;
		border-radius: 10upx;
	}

	.top-img image {
		width: 85upx;
		height: 85upx;
		border-radius: 50%;
	}

	.top-1 {
		color: #FFFFFF;
	    flex-direction: column;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.top-des {
		display: flex;
		flex-direction: column;
		font-size: 26upx;
	}

	.top-des-1 {
		font-size: 34upx;
		font-weight: bold;
		margin: 14upx 0 10upx 0;
		
	}

	.top-2 {
		display: flex;
		flex-direction: row;
		background-color: #FFFFFF;
		color: #313131;
		font-size: 80upx;
		padding: 28upx 0;
		margin-bottom: 30upx;
	}
    .top-2-title{
		width: 50%;
		padding: 19upx 0;
		text-align: center;
	}
	.border-left{
		border-left: 1upx solid #EEEEEE;
	}
	.top-2-1 {
	/* 	font-weight: bold; */
		font-size: 30upx;
		margin-bottom: 6upx;
	}
    .top-2-2{
		font-size: 28upx;
		color: #999999;
	}
	.block {
		display: flex;
		background-color: #FFFFFF;
		margin-bottom: 30upx;
		padding: 47upx 0;
	}

	.block-1 {
		width: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 28upx;
	}

	.block-1-1 {
		margin-top: 22upx;
		font-size: 50upx;
		font-weight: bold;
	}

	.border-right {
		border-right: 1upx solid #EEEEEE;
	}

	.price {
		color: #FC6840;
	}
	
	.billing-details {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.billing {
		width: 100%;
		background-color: #FFFFFF;
		margin-bottom: 28upx;
		display: flex;
		flex-direction: column;
		color: #222222;
	}

	.time {
		font-size: 34upx;
		margin: 28upx 0 23upx 40upx;
	}
	
	.redpacket{
		font-size: 50upx;
		color: $skin;
		padding: 0 30upx;
	}

	.list {
		display: flex;
		flex:1;
		flex-direction: column;
		border-top: 1upx solid #EEEEEE;
		padding: 27upx 41upx 30upx 0;
	}

	.list-1,
	.list2 {
		display: flex;
		justify-content: space-between;
	}

	.list-1 {
		font-size: 34upx;
		color: #222222;
	}

	.list-1-price {
		color: #FC6840;
	}

	.list2 {
		color: #666666;
		font-size: 28upx;
		margin-top: 19upx;
	}

	.list-2-price {
		color: #FF9000;
	}
	/* 账单明细 end */
	.white-block{
		height: 80upx;
	}
	
	.recode-list{
		// margin-top: 30upx;
		font-size: 26upx;
		color: #222222;
		background: #fff;
		padding: 0 30upx;
		.recode-list-item{
			line-height: 110upx;
			height: 110upx;
			border-bottom: 1upx solid #eee;
		}
	}
</style>
