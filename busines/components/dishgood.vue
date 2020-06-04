<template>
	<view class="_goods">
		<view class="item-r x-flex">
			<image @click="goDetails(item.id)" :src="item.cover ? item.cover[0] : '/static/head.png'" class="media" mode="aspectFill"></image>
			<view  class="flex_center nofood" v-if="item.status==0">
				<text class="_cff _f30">已下架</text>
			</view>
			<view class="item-content" style="padding-right: 24upx;">
				<view class="name"  @click="goDetails(item.id)">{{ item.name }}</view>
				<view class="nums flex_row flex_sb"  @click="goDetails(item.id)">
					<view>
						月售{{item.sale_num}}
					</view>
				   <view class="editBtn _flex-center mCol" @click.stop="toeditDish(item.id)">编辑</view>
				</view>
				
				<view class="x-flex-sp">
					<view class="x-flex"  @click="goDetails(item.id)">
						<view class="price">¥{{item.sale_price!='0.00' ? item.sale_price : item.price}}</view>
						<view :hidden="item.sale_price=='0.00'" class="oldPrice">¥{{item.price}}</view>
					</view>
					<view class="x-flex">
						<view class="editBtn _flex-center" :class="item.status?'mCol':' _cff mBg'" @click="editDish(item.id,item.status)">{{item.status?'下架':'上架'}}</view>
					</view>
				</view>
			</view>
		</view>
		<showmodal :modal="dishModal" :msg="'是否'+(item.status?'下架':'上架')+'【' +item.name+'】'" @hide='hide' @sure='sure' v-if="dishModal"></showmodal>
	</view>
</template>

<script>

import showmodal from '../../components/showmodal.vue';
export default {
	name: 'goods',
	props: {
		item: {
			type: Object
		},
		index: {
			type: Number,
			default: 0
		},
		storeId: {
			type: Number
		}
	},
	components:{showmodal},
	data() {
		return {
			id:'',
			editStatus:"",
			dishModal:false,
			store_id:this.storeId
		};
	},
	methods:{
		removeNums(index) {
			this.$emit('removeNums',index);
		},
		addNums(index) {
			this.$emit('addNums',index)
		},
		// 菜品详情
		goDetails(id) {
			this.$api.openWin('/pages/details/details?goodsId='+id);
		},
		// 编辑菜品
		toeditDish(id){
			this.$api.openWin(`/busines/page/shopOwner/editDish?goodsId=${id}&storeId=${this.store_id}`);
		},
		
		// 菜品管理上下架
		hide(){
			this.dishModal = false
		},
		
		// 确认菜品下架
		sure(){
			let _this=this;
			_this.$api.ajax('smdc/food/toUpdateFoodStatus',{
				shop_id:_this.$store.state.shopId,
				status:_this.editStatus,
				id:_this.id
			},function(ret){
				_this.dishModal = false
				_this.$emit('getList')
				
			})	
		},
		
		// 点击菜品上下架按钮
		editDish(id,status){
			let editStatus = ''
			status==1?editStatus=0:editStatus=1
			this.id = id;
			this.editStatus = editStatus
			this.dishModal = true
		},
	}
};
</script>

<style lang="scss">
	.nofood{
		background-color: #333;
		opacity: 0.5;
		position: absolute;
		width: 404upx;
		height: 194upx;
		right: 180upx;
		border-radius: 20upx;
	}
.editBtn{
	width:100upx;
	height:60upx;
	border:1upx solid rgba(254,176,38,1);
	opacity:1;
	border-radius:20upx;
}
._goods {
	.item-r {
		margin-bottom: 40upx;
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
				width: 44upx;
				height: 44upx;
			}
			.sale-num {
				width: 50upx;
				text-align: center;
			}
		}
	}
}
</style>
