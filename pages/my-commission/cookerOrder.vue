<template>
	<view>
		<!-- 切换 start -->
		<view class="switch-block">
			<block v-for="(item,i) in tab" :key="i">
				<view class="switch1" :class="{'checked': current==i}" @click="changeTab(i)">{{item}}</view>
			</block>
		</view>
		<!-- 切换 end -->
		<view style="height: 100upx;"></view>
		
		<view class="content"  v-for="(item,index) in orderlist" :key="index" v-if="orderlist.length">
			<view class="list">
				<view class="top flex-sb flex-row">
					<text>共 <text class="num cred">{{item.length}}</text> 件商品</text>
					<!-- <text class="c66">0:00:32</text> -->
				</view>
				<block  v-for="(x,xindex) in item" :key="xindex" >
					<view class="detail flex-row" :class="xindex==0?'':'borderT'">
						<view class="flex-row">
							<image :src="x.cover[0]" mode="aspectFill" class="left"></image>
							<view class="right f30 flex-row">
								{{x.name}}
							</view>
						</view>
						<view class="finsh" :class="current==2?'finsh-bg':'unfinsh-bg'">
							{{current==0?'待制作':current==1?'制作中...':'已制作完成'}}
						</view>
					</view>
					<!-- <view class="tip flex-col">
						<text class="f24 c66">备注：不要香菜、不辣</text>
					</view> -->
					<view class="tip flex-col">
						<text class="f24 c66">下单时间：{{x.create_time}}</text>
					</view>
				</block>
			</view>
			<view class="status " :class="current==2?'status-bg c66':'unstatus-bg cred'" @click="editstatus(index)">
				{{current==0?'接单制作':current==1?'制作完成':"已完成"}}
			</view>
		</view>
		<view v-if="orderlist.length==0">
			<x-nodata></x-nodata>
		</view>
	</view>
</template>

<script>
	import xNodata from '../../components/nodata.vue'
	export default {
		data() {
			return {
				tab:["待制作","制作中","已完成"],
				current: 0,
				page:1,
				load:false,
				orderlist:[],
				
			}
		},
		components: {
			xNodata
		},
		onLoad(e) {
         
		},
		onShow() {
		  this.getorder()
		},
		onReachBottom() {
           if(this.load){return}
           this.page++
           this.getorder()
		},
		methods: {
			getorder(){
				let _this=this;
				_this.load = true
				_this.$api.ajax('smdc/order/cookererOrder',{
					shop_id:_this.$store.state.shopId,
					make_status:_this.current+1,
					page:_this.page,
				},function(ret){
					_this.load = false
					if(_this.page==1){
						_this.orderlist=ret.data;
					}else{
						_this.orderlist.concat(ret.data)
					}
					
				},'POST')
			},
			changeTab(i) {
				this.current = i;
				this.page =1
				this.getorder()
		   },
		   // 修改菜品制作状态
		   editstatus(index,status){
			   let _this=this;
			   if(_this.current==3){
			     return 
			   }
			   var ids = []
		       _this.orderlist[index].forEach(function(x){
				   ids.push(x.id)
			   })
			   console.log("菜品ids",ids)
			   _this.$api.ajax('smdc/food/changeStatus',{
			   	shop_id:_this.$store.state.shopId,
			   	status:_this.current+2,
				ids:ids.join(','),
			   },function(ret){
				   uni.showToast({
				   	title:"操作成功",
					icon:"success"
				   })
			   	_this.current = _this.current+1;
			   	_this.getorder()
			   },'POST') 
		   },
		},
		}
</script>

<style lang="less">
    .toast-info{
    	text-align: center;
    	padding-top: 30upx;
    	padding-bottom: 30upx;
    	display: flex;
    	flex-direction: column;
    	align-items: center;
    	justify-content: center;
    }
    .nolistimg{
    	width: 370upx;
    	height: 250upx;
    	margin: 50upx auto;
    }
	.flex-row{
		display: flex;
		flex-direction: row;
	}
	.flex-col{
		display: flex;
		flex-direction: column;
	}
	.flex-sb{
		justify-content: space-between;
	}
	.cred{
		color: #FC6840;
	}
	.c66{
		color: #666666;
	}
	.f30{
		font-size: 30upx;
	}
	.borderT{
	   border-top: 1upx solid #EEEEEE;	
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
		color: #F37B1D;
		font-weight: bold;
		border-bottom: 4upx solid #F37B1D;
	}
	
	.switch1 {
		height: 100%;
		line-height: 87upx;
	}
	
	/* 切换 end */
	.content{
		background-color: #FFFFFF;
		margin-bottom: 30upx;
		.list{
			margin: 0 32upx;
		}
		.top{
			padding: 28upx 0;
			border-bottom: 1upx solid #EEEEEE;
			.num{
				font-size: 32upx;
				padding: 0 10upx;
			}
		}
		.detail{
			padding: 20upx;
			align-items: center;
			justify-content: space-between;
			.left{
				width: 100upx;
				height: 100upx;
				border-radius: 5upx;
				background-color: #EEEEEE;
				margin-right: 54upx;
			}
			.right{
				align-items: center;
			}
			.finsh{
				font-size: 26upx;
				padding: 12upx  20upx;
				border-radius: 10upx;
			}
			.unfinsh-bg{
				color: #F37B1D;
			}
			.finsh-bg{
				color: #666;
			}
		}
		.tip{
			padding: 0 30upx 15upx;
		}
		.status{
			text-align: center;
			padding: 32upx 0;
			font-size: 32upx;
			letter-spacing: 12upx;
		}
		.unstatus-bg{
			background-color:rgba(252,104,64,0.1);
		}
		.status-bg{
			background-color: #f7f7f7;
		}
	}
</style>
