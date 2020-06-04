<template>
	<view class="page">
		<!-- 切换 start -->
		<view class="switch-block">
			<block v-for="(item,i) in tab" :key="i">
				<view class="switch1" :class="{'checked': current==i}" @click="changeTab(i)">{{item.name}}</view>
			</block>
		</view>
		<!-- 切换 end -->
		<view style="height: 87upx;"></view>

		<!-- 全部订单 start -->
		<view class="">
			<view class="cu-bar search bg-white x-bg">
				<view class="search-form round">
					<input :adjust-position="false" type="text" v-model="times" placeholder="选择日期时间范围" confirm-type="search" @confirm="doSearch()" @click="onShowDatePicker('rangetime')" ></input>
				</view>
				<view class="action test">
					<button class="cu-btn shadow-blur round bg-color" @click="getListSearch()">搜索</button>
				</view>
				<mx-date-picker :show="showPicker" :type="type" :value="value" :show-tips="true" :begin-text="'开始时间'" :end-text="'结束时间'" :show-seconds="true" @confirm="onSelected" @cancel="onSelected" />
			</view>
		</view>
		<view class="list-block" v-for="(item,index) in tab[current].list" :key="index" @click="orderDetail(item.id)">
			<view class="mid">
				<view class="mid-block">
					<view class="mid-block1">
						订单编号:{{item.order_no}}
					</view>
					<view v-if="item.admin_check===1 &&item.status == 0" class="mid-title">待付款</view>
					<view v-if="item.admin_check===2 && item.status==0" class="mid-title">已取消</view>
					<view v-if="item.admin_check===1 && item.status == 1" class="mid-title">已下单</view>
					<view v-if="item.admin_check===3 && item.status == 1" class="mid-title">已完成</view>
				</view>
				<view class="">
					桌号:{{item.desk_no}}
				</view>
				<view class="money">
					<view>
						合计:<text class="bottom-price _f32">￥{{item.total_fee}}元</text>
					</view>
				</view>
			</view>
			<!-- 中2 -->
			<!-- <view class="mid2" v-for="(good,i) in item.food" :key="i" v-if="i<1">
				<view class="mid2-img center">
					<image :src="good.cover ? good.cover : '/static/noImg.png'" mode="aspectFill"></image>
				</view>
				<view class="mid2-block">
					<view class="mid2-block-top">
						<view class="title1">{{good.name}}</view>
						<view class="title2">￥{{good.sale_price=='0.00' ? good.num*parseFloat(good.price) : good.num*parseFloat(good.sale_price)}}</view>
					</view>
					<view class="title3">
						<text>×{{good.num}}</text>
						<text>{{item.admin_check==2?'已取消':item.status == 0?'待付款':(good.is_refund==1 || good.refund_status==2)?'已退菜':good.refund_status==1?'退菜审核中':good.refund_status==3?'退菜审核失败':good.is_delivery==1?'已配送':good.is_finish==1?'配送中':!good.deal_user_id?'等待制作':dishStatus[good.make_status] }}</text>
					</view>
				</view>
			</view> -->
			<!-- 底 -->
			<!-- <view class="bottom">
				<view >
					<text class="_f40 _fw" v-if="item.food.length>1">...</text>
				</view>
				<view class="flex_row flex_ai _f30">
					<view class="mar-20">
						 共{{item.food.length}}件,
					</view>
					<view>
						合计实付:<text class="bottom-price _f32">￥{{item.total_fee}}元</text>
					</view>
				</view>
			</view> -->
		</view>

		<view class="toast-info" v-if="!tab[current].more">
			没有更多数据了
		</view>

	</view>
</template>

<script>
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
	export default {
		data() {
			return {
				tab: [{
					name: '全部订单',
					list: [],
					page: 1,
					init:true,
					more:true,
					type:0
				}, 
				{
					name: '待付款',
					list: [],
					page: 1,
					init:true,
					more:true,
					type:1
				}, 
				{
					name: '已取消',
					list: [],
					page: 1,
					init:true,
					more:true,
					type:4
				}, 
				{
					name: '已下单',
					list: [],
					page: 1,
					init:true,
					more:true,
					type:2
				}, {
					name: '已完成',
					list: [],
					page: 1,
					init:true,
					more:true,
					type:3
				}],
				current: 0,
				dishStatus:'',
				times:'',
				showPicker: false,
				rangetime: ['2020/01/08 00:00','2020/01/16 23:59'],
				type: 'rangetime',
				value: ''
			}
		},
		components: {
			MxDatePicker
		},
		onLoad(e) {
			if(e.type){
				this.current=parseInt(e.type);		
			}
			// this.getdishStatus();
		},
		onShow() {
			let item=this.tab[this.current];
			item.page=1;
			item.init=true;
			item.more=true;
			item.list=[];
			let _this = this;
			setTimeout(function(){
				_this.getList();
			},200)
		},
		onPullDownRefresh() {
			let item=this.tab[this.current];
			item.page=1;
			item.init=true;
			item.more=true;
			item.list=[];
			let _this = this;
			setTimeout(function(){
				_this.getList();
			},200)
		},
		onReachBottom() {
			if(this.tab[this.current].more){
				this.getList();
			}
		},
		methods: {
			// 时间插件
			onShowDatePicker(type){//显示
				this.type = type;
				this.showPicker = true;
				this.value = this[type];
			},
			onSelected(e) {//选择
				this.showPicker = false;
				if(e) {
					this[this.type] = e.value;
					this.times = e.value[0] +' -- '+ e.value[1];
				}
			},
			// 获取菜品状态列表
			// getdishStatus() {
			// 	let _this = this;
			// 	_this.$api.ajax('smdc/food_process/FoodProcessList', {
			// 		shop_id: _this.$store.state.shopId,
			// 	}, function(ret) {
			// 		_this.dishStatus = ret.data
			// 	}, 'POST')
			// },
			
			changeTab(i) {
				// 清空选择时间
				this.times = '';
				this.current = i;
				// if(this.tab[this.current].init){
				// 	this.getList();
				// }
				let item=this.tab[i];
				item.page=1;
				item.init=true;
				item.more=true;
				item.list=[];
				let _this = this;
				setTimeout(function(){
					_this.getList();
				},200)
			},
			getList() {
				let _this = this;
				let item=_this.tab[_this.current];
				_this.$api.ajax('smdc/order/get_shop_order',{
					limit:10,
					shop_id:this.$store.state.shopId,
					page:item.page,
					type:this.tab[this.current].type,
					times:this.times
				},function(ret){
					let data=ret.data;
					if(data.length){
						_this.tab[_this.current].list=item.list.concat(data);
						_this.tab[_this.current].page=item.page+1;
						_this.tab[_this.current].init=false;
					}else{
						_this.tab[_this.current].more=false
					}
				});
			},
			
			getListSearch(){
				let _this = this;
				let item=_this.tab[_this.current];
				_this.$api.ajax('smdc/order/get_shop_order',{
					limit:10,
					shop_id:this.$store.state.shopId,
					page:1,
					type:this.tab[this.current].type,
					times:this.times
				},function(ret){
					let data=ret.data;
					_this.tab[_this.current].list=[];
					if(data.length){
						_this.tab[_this.current].list=item.list.concat(data);
						_this.tab[_this.current].page=item.page+1;
						_this.tab[_this.current].init=false;
					}else{
						_this.tab[_this.current].more=false
					}
				});
			},
			orderDetail(id) {
				this.$api.openWin('shopOrderDetails?orderId='+id);
			}
		}
	}
</script>

<style>
	.mar-20{
		margin: 0 10upx;
	}
	/* 切换 start */
	.switch-block {
		height: 87upx;
		background-color: #FFFFFF;
		font-size: 28upx;
		color: #555555;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 54upx;
		position: fixed;
		z-index: 980;
		left: 0;
		right: 0;
		top: 0;
	}

	.checked {
		color: #222222;
		font-weight: bold;
		border-bottom: 4upx solid #222222;
	}

	.switch1 {
		height: 100%;
		line-height: 87upx;
	}

	/* 切换 end */

	/* 订单列表 start */
	.list-block {
		height: 100%;
		background-color: #FFFFFF;
		margin-top: 34upx;
	}

	.top {
		height: 89upx;
		color: #444444;
		font-size: 40upx;
/* 		font-weight: bold; */
		display: flex;
		justify-content: center;
		align-items: center;
		border-bottom: 1upx solid #EEEEEE;
	}

	.top-img {
		margin-right: 17upx;
		width: 42upx;
		height: 42upx;
		line-height: 42upx;
		font-size: 26upx;
		color: #fff;
		text-align: center;
		border-radius: 50%;
		background: #FD7D3F;
	}

	.top-img image {
		width: 42upx;
		height: 42upx;
	}

	.mid {
		height: 170upx;
		display: flex;
		flex-direction: column;
		padding: 26upx 41upx;
		border-bottom: 1upx solid #EEEEEE;
	}

	.mid-img {
		margin-right: 15upx;
	}

	.mid-img image {
		width: 40upx;
		height: 40upx;
		border-radius: 50%;
	}

	.mid-block {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.mid-block1 {
		color: #444444;
		font-size: 26upx;
		display: flex;
		align-items: center;
	}

	.mid-title {
		color: #111111;
		font-size: 28upx;
	}

	.mid2 {
		height: 138upx;
		display: flex;
		padding: 32upx 38upx;
		border-bottom: 1upx solid #EEEEEE;
	}

	.mid2-img {
		margin-right: 17upx;
	}

	.mid2-img image {
		width: 96upx;
		height: 96upx;
		background-color: #EEEEEE;
		border-radius: 10upx;
	}

	.mid2-block {
		display: flex;
		flex-direction: column;
	}

	.mid2-block-top {
		width: 556upx;
		display: flex;
		justify-content: space-between;
		color: #222222;
		margin-bottom: 6upx;
	}

	.title1 {
		font-size: 24upx;
		font-weight: bold;
	}

	.title2 {
		font-size: 26upx;
	}

	.title3 {
		color: #888888;
		font-size: 26upx;
		font-weight: bold;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.bottom {
		height: 86upx;
		color: #444444;
		font-size: 24upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding:0 38upx;
	}

	.bottom-price {
		color: #FC6840;
		font-size: 32upx;
		display: inline;
	}

	/* 订单列表 end */
	.white-block{
		height: 120upx;
	}
	
	.foot-btn{
		justify-content: flex-end;
		padding-right: 20upx;
		padding-bottom: 20upx;
	}
	.foot-btn-1{
		width: 172upx;
		height: 50upx;
		line-height: 50upx;
		background: #FC6840;
		color: #fff;
		text-align: center;
		font-size: 24upx;
		border-radius: 6upx;
		
	}
	.foot-btn-2{
		width: 172upx;
		height: 52upx;
		line-height: 52upx;
		color: #44;
		text-align: center;
		font-size: 24upx;
		border: 1upx solid #BFBFBF;
		border-radius: 6upx;
		margin-right: 20upx;
	}
	.bg-color{
		background: #FFA500;
	}
	.test{
		text-align: center;
		padding: 10px 0;
	}
	.money{
		float: right;
	}
</style>
