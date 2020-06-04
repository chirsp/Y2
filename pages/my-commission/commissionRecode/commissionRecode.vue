<template>
	<view>
	<!-- 	<scroll-view scroll-x class="bg-white nav x-sticky">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="index==current?'text-orange cur':''" v-for="(item,index) in tab" :key="index" @click="tabSelect(index)">
					{{item.name}}
				</view>
			</view>
		</scroll-view> -->
		<view class="billing" v-if="current==0">
			<block v-for="item in tab[0].list" :key="item.id">
				<view class="x-flex">
					<view class="cuIcon-moneybag redpacket"></view>
								<view class="list" >
						<view class="list-1">
							<view>完成总工作量<text class="list-1-price">{{item.total}}</text>项</view>
							<view class="list-1-price">+￥{{item.money}}</view>
						</view>
						<view class="list2">
							<view>{{$api.format(item.create_time)}}</view>
						</view>
					</view>
				</view>
			</block>
		</view>
	
		<view  v-if="current==0 && !tab[0].list.length">
			<x-nodata msg="空空如也~"></x-nodata>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import xNodata from '../../../components/nodata.vue'
	export default {
		data() {
			return {
				typeName:'',
				list:[],
				page:1,
				more:true,
				current:0,
				tab:[{
					name:'结算佣金',
					list:[],
					page:1,
					type:0,
					more:true,
					init:true
				},
				{
					name:'菜品佣金',
					list:[],
					page:1,
					type:1,
					more:true,
					init:true
				},
				]
			}
		},
		computed: mapState(['userInfo']),
		components:{xNodata},
		onLoad(e) {
			if(e.typeName){
				this.typeName=e.typeName;
			}
			this.getData();
		},
		onReachBottom() {
			if(this.tab[this.current].more){
				this.current==0 ? this.getData() : this.getData2();
			}
		},
		methods: {
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
				this.$api.ajax('smdc/Worker/workerMoney',{
					shop_id:this.$store.state.shopId,
					page:this.tab[0].page,
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
			}
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
		height: 320upx;
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
	/* 	font-weight: bold; */
		display: flex;
		align-items: center;
		margin-left: 40upx;
	}

	.top-des {
		display: flex;
		flex-direction: column;
		font-size: 26upx;
		margin-left: 12upx;
	}

	.top-des-1 {
		font-size: 26upx;
	}

	.top-2 {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #FFFFFF;
		font-size: 80upx;
		// margin-top: 30upx;
	}

	.top-2-1 {
	/* 	font-weight: bold; */
		font-size: 30upx;
		margin-bottom: 6upx;
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
		font-size: 30upx;
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
</style>
