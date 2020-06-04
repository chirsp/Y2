<template>
	<view>
		<!-- <view class="content">
			<view class="list flex_row flex_sb _f30" v-for="(item,index) in values" :key="index" :class="index?'bor-t':''">
				<view class="username">{{item.username}}</view>
				<view class="mCol" >{{item.work_status==1?'上班':item.work_status==2?'下班':item.work_status==3?'调休':'未入职'}}</view>
				<view class=""  @click="changeStatus(index,'role')">{{item.type_name}}</view>
			</view>
		</view> -->
		<!-- 左右联动 -->
		<view class="x-flex boxcontent">
			<view class="left">
				<scroll-view scroll-y :style="{'height': scroll_h+'px'}">
					<block v-for="(item,index) in roleList" :key="index">
						<view :class="{'active':current==index}" @click="changeCurrent(index)">{{item.name}}</view>
					</block>
				</scroll-view>
			</view>
			<view class="right">
				<scroll-view scroll-y :style="{'height': scroll_h+'px'}" @scrolltolower="getMore"  >
					<view class="title-r">{{tab[current].name}}</view>
					<block v-for="(item,index) in foodlist" :key="index" v-if="foodlist.length">
					   <view class="list flex_row flex_sb _f30" v-for="(item,index) in values" :key="index" :class="index?'bor-t':''">
					   	<view class="username">{{item.username}}</view>
					   	<view class="mCol" >{{item.work_status==1?'上班':item.work_status==2?'下班':item.work_status==3?'调休':'未入职'}}</view>
					   	<view class=""  @click="changeStatus(index,'role')">{{item.type_name}}</view>
					   </view>
					</block>
					<nodata msg='该分类下暂无菜品~' v-if="foodlist.length==0"></nodata>
					<view class="space"></view>
				</scroll-view>
			</view>
		</view>  
		
		
		
		
		
		<!-- 改变员工角色 -->
		<view class="cu-modal bottom-modal" :class="isUse && type=='role'?'show':''" @tap="isUse=false">
			<view class="cu-dialog bg-white">
				<scroll-view scroll-y="true" class="scrollBox bg-white">
					<view class="content">
						<view class="list flex_row flex_sb _f30" >
							<view class="">调整  <text class="mCol mar-10">{{values[index].username}}</text> 的工作安排</view>
						</view> 
						<view class="list flex_row flex_sb _f30 bor-t" v-for="(item,index) in roleList" :key="index" 
						 @click="changerole(index,'role')">
							<view class="">{{item.type_name}}</view>
						</view>
					</view>
				</scroll-view>
				<!-- <view class="cancel _flex-center">
					取消
				</view> -->
			</view>
		</view>
       
	   <!-- 改变员工工作状态 -->
	   <view class="cu-modal bottom-modal" :class="isUse && type=='work'?'show':''" @tap="isUse=false" >
	   	<view class="cu-dialog bg-white">
	   		<scroll-view scroll-y="true" class="scrollBox bg-white">
	   			<view class="content">
	   				<view class="list flex_row flex_sb _f30 " >
	   					<view class="">调整  <text class="mCol mar-10">{{values[index].username}}</text> 的工作状态</view>
	   				</view> 
	   				<view class="list flex_row flex_sb _f30 bor-t" v-for="(item,index) in workStatus" :key="index" 
	   				 @click="changerole(index,'work')">
	   					<view class="">{{item.name}}</view>
	   				</view>
	   			</view>
	   		</scroll-view>
	   	</view>
	   </view>
	   
	</view>
</template>

<script>
	export default {
		props: {
			values: {
				type: Array,
				default: null,
			},
			roleList:{
				type: Array,
				default: null,
			}
		},
		
		data() {
			return {
				isUse: false, //唤起改变员工状态弹窗
				index:null, //点击修改的员工index
				type:'', //role--修改员工角色/work--修改员工工作状态
				workStatus:[
					{name:'工作',status:'1'},
					{name:'休息',status:'2'},
					{name:'请假',status:'3'},
				],
				scroll_h:0, //scrollview高度
				current:0,  //当前选中的分类
			}
		},
		onShow() {
           
		},
		onLoad() {
			this.getScrollHeight();  //获取scrollview高度
		},
		methods: {
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
				// this.getList();
			},
			
			// 修改员工状态
			changeStatus(index,type) {
				let that = this
				if(!that.values[index].work_status){
					that.$api.toast('该员工暂未入职,无法安排工作')
					return
				}
				that.type = type
				that.$api.ajax('smdc/worker/workType', {
					shop_id: that.$store.state.shopId,
				}, res => {
					that.index = index
					that.isUse = true
				})
			},
			
			// 角色修改
			changerole(index,type){
				console.log(index,type)
				let that = this
				if(type=='role'){
					var data = {
					shop_id: that.$store.state.shopId,
					id:that.values[that.index].id,
					type:that.roleList[index].id } 
				   var url = 'smdc/worker/toUpdateType'
				}
				if (type=='work'){
					var data = {
						shop_id: that.$store.state.shopId,
						id:that.values[that.index].id,
						status:that.workStatus[index].status } 
					var url = 'smdc/worker/toUpdateStatus'
				}
				that.$api.ajax(url, data, res => {
					that.$emit('getWorker')
				})
			},
		},
	}
</script>

<style lang="less">
	.boxcontent{
		margin-bottom: 180upx;
	} 
	::-webkit-scrollbar {
	  width: 0;
	  height: 0;
	  color: transparent;
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
	.username{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 50%;
	}
	.type{
		width: 15%;
		text-align: left;
	}
	.scrollBox {
		max-height: 500upx;
	}

	.cancel {
		padding: 30upx 0;
		font-size: 30upx;
		border-top: 1upx solid #EEEEEE;
		box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
	}

	.content {
		padding: 0 30upx;
		background-color: #FFFFFF;
		margin: 20upx 0;

		.list {
			padding: 24upx 0;
		}

		.bor-t {
			border-top: 1upx solid #EEEEEE;
		}
		.mar-10{
			margin: 0 10upx;
		}
	}
</style>
