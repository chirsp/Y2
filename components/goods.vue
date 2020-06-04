<template>
	<view class="_goods">
		<view class="item-r x-flex" :class="!item.num || item.num =='0'?'opcity':''">
			<image @click="goDetails(item.id)" :src="item.cover ? item.cover[0] : '/static/head.png'" class="media" mode="aspectFill"></image>
			<view  class="flex_center nofood" v-if="item.num==0">
				<text class="_cff _f34">已售罄</text>
			</view>
			<view class="item-content" style="padding-right: 24upx;">
				<view class="name"  @click="goDetails(item.id)">{{ item.name }}</view>
				<view class="nums"  @click="goDetails(item.id)">
					月售{{item.sale_num}}
				   <text class="plusNum">剩余{{item.num}}份</text>
				   <!-- 口味20100513 -->
				   <!-- <view>口味:</view> -->
				    <view class="taste">
				      <view class="view1" :hidden="!item.label || item.label ==''">口味:</view>
				      <view class="view1" :hidden="!item.label || item.label ==''" >{{item.label_name}}</view>
				   	  <view class="taste_tabel taste_1" :class="label[item.id]==index1 ? 'active':''" @click.stop="taste(item.id,index1)" v-for="(item1,index1) in item.labal_name" :key="item1.id">{{item1.name}}</view>
				    </view>
					
					<view class="labels">
					 <!-- <view class="label_flag"  v-if="item.is_rexiao && item.is_new">标签:</view> -->
					  <view class="label_new "  v-if="item.is_new==1">新品</view>
					  <view class="label_new"  v-if="item.is_rexiao==1">热销</view>
					</view>
				</view>
				
				<view class="x-flex-sp">
					<view class="x-flex"  @click="goDetails(item.id)">
						<view class="price">¥{{item.sale_price}}</view>
						<view class="oldPrice">¥{{item.price}}</view>
					</view>
					<view class="x-flex">
						<image @click="removeNums(index,item.num,item.nums)" :hidden="!item.nums || item.num =='0'" src="/static/remove.png" class="btn-icon"></image>
						<view :hidden="!item.nums || item.nums =='0'" class="sale-num">{{ item.nums }}</view>
						<image @click="addNums(index,item.num,item.nums)" src="/static/add.png" class="btn-icon"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'goods',
	props: {
		item: {
			type: Object
		},
		index: {
			type: Number,
			default:0
		},
		totalMoney:{
			type: Number,
			default:0
		},
		totalCount:{
			type: Number,
			default:0
		},
		type:{
			type:String,
			default: "1"
		},
		label:{
			type:Object,
		}
	},
	data() {
		return {
			label1:[]
		};
	},	
	methods:{
		removeNums(index,num,nums) {
			if(num=='0' || !num){
				this.$api.toast('今日已售完')
				return
			}
			if(nums=='0' || !nums){
				this.$api.toast('不能再减啦~')
				return
			}
			this.$emit('removeNums',{index:index,type:this.type});
		},
		addNums(index,num,nums) {
			num = parseFloat(num)
			nums = parseFloat(nums)
			if(!num){
				this.$api.toast('今日已售完')
				return
			}
			if(num==nums || nums>num){
				this.$api.toast('库存不足')
				return
			}
			this.$emit('addNums',{index:index,type:this.type})
		},
		goDetails(id) {
			this.$api.openWin('../details/details?goodsId='+id +'&totalMoney=' +this.totalMoney +'&totalCount=' +this.totalCount);
		},
		taste(gid,tid){
			this.$emit('taste',{gid:gid,tid:tid});
		}
	}
};
</script>

<style lang="scss">
.labels{
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	width: 100%;
	height: 10%;
}
.labels .label_flag{
	padding-top: 3upx;
}
.labels .label_new{
	text-align: center;
	background: #f8f8f8;
	color: #000;
	width: 76upx;
	height: 30upx;
	border-radius: 9upx;
	margin: 6upx;
	font-size: 20upx;
	padding-top: 0upx;
	line-height: 30upx;
	margin-top: 10upx;
}
.nofood{
	background-color: #222222;
	opacity: 0.5;
	position: absolute;
	width: 194upx;
	height: 194upx;
	border-radius: 20upx;
}
.plusNum{
	margin-left: 10upx;
}
.opcity{
	opacity: 0.7;
	background-color: #EEEEEE;
	border-radius: 10upx;
}
._goods {
	.item-r {
		margin-bottom: 20upx;
		padding: 20upx 0;
		.media {
			width: 194upx;
			height: 194upx;
			border-radius: 20upx;
			margin-right: 20upx;
			background:#eee;
			position: relative;
		}
		.item-content {
			flex: 1;
			height: 194upx;
			.name {
				color: #222;
				font-size: 32upx;
				margin-bottom: 15upx;
				line-height: 40upx;
				max-height: 80upx;
				overflow: hidden;
			}
			.nums {
				color: #888888;
				font-size: 24upx;
				padding-bottom: 30upx;
			}
			.price {
				font-size: 30upx;
				color: #FF1801;
				line-height: 34upx;
			}
			.oldPrice {
				font-size: 22upx;
				text-decoration: line-through;
				color: rgba(136, 136, 136, 1);
				line-height: 34upx;
				padding-left: 12upx;
			}
			.btn-icon {
				width: 50upx;
				height: 50upx;
			}
			.sale-num {
				width: 50upx;
				text-align: center;
			}
			/* 口味选择 */
			.taste {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				width: 100%;
				height: 10%;
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
			
		}
	}
}
</style>
