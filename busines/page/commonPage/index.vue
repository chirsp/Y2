<template>
	<view>
		<view class="top">
			<view class="bg-col"></view>
			<view class="topinfo _flex-center">
				<image src="../../../static/head.png" class="headicon"></image>
				<view class="workbox">
					<view class="flex_row flex_ai" @click="chooseStatus()">
						<text class="_c66 _f28">{{workStatus[WIndex].name || '工作状态'}}</text>
						<image src="../../static/image/selectdown.png" class="selectIcon" :class="Wstatus?'rotate':'rotate1'"></image>
					</view>
					<view class="workStatus" v-if="Wstatus">
						<view v-for="(item,index) in workStatus" class="name" :class="index?'border-top':''" :key="index" @click="selectWork(index)">{{item.name}}</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="menu flex_row">
			<view class="item flex_col _flex-center" v-for="(item,index) in menu" :key="index">
				<view class="icon _flex-center">
					<image :src="item.icon"></image>
				</view>
				<text>{{item.text}}</text>
			</view>
		</view>
	
		<view class="listmenu flex_col">
			<view class="item flex_row flex_ai" @click="isHelp=true">
				<image src="../../static/image/ddc.png" class="icon"></image>
				<text class="_f30">代点餐</text>
			</view>
			<view class="item flex_row flex_ai">
				<image src="../../static/image/skcode.png" class="icon"></image>
				<text class="_f30">收款码</text>
			</view>
		</view>
		
		<!-- 代点餐弹窗 -->
		<view class="cu-modal" :class="isHelp?'show':''">
			<view class="cu-dialog" style="width: 70%;">
				<view class="cu-bar bg-white justify-end">
					<view class="content">请输入桌号</view>
					<view class="action" @tap="isHelp=false">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<view class="tabaleInput">
						<input type="number" value="" placeholder="请输入桌号" />
					</view>
				</view>
				<view class="_flex-center">
					<view class="btn mBg">
						开始点餐
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default{
		data(){
			return{
				menu:[
					{text:'通知管理',icon:'../../static/image/menuIcon3.png'},
					{text:'佣金管理',icon:'../../static/image/menuIcon1.png'},
					{text:'餐桌状态',icon:'../../static/image/menuIcon2.png'},
					{text:'配送订单',icon:'../../static/image/menuIcon4.png'} ,
					{text:'餐桌状态',icon:'../../static/image/menuIcon2.png'},
					{text:'配送订单',icon:'../../static/image/menuIcon4.png'} ,
				],
				workStatus:[
					{name:'休息',status:1},
					{name:'工作',status:2},
					{name:'请假',status:3}
				],
				Wstatus:false,
				WIndex:null,
				isHelp:false,
				
			}
		},
		onLoad() {
			
		},
		onShow() {
			
		},
		methods:{
			// 选择工作状态
			chooseStatus(){
				this.Wstatus =! this.Wstatus
			},
			selectWork(param){
				this.WIndex = param
				this.Wstatus = false
			
			},
		}
	}
</script>

<style lang="less">
.tabaleInput{
	background: #EEEEEE;
	border-radius: 10upx;
	padding: 10upx;
	flex: 1;
}
.btn{
	width: 200upx;
	opacity:1;
	border-radius:10upx;
	color: #FFFFFF;
	padding: 13upx 0upx;
	text-align: ceneter;
	margin-bottom: 30upx;
}
.listmenu{
	background:rgba(255,255,255,1);
	box-shadow:0upx 3upx 6upx rgba(0,0,0,0.1);
	opacity:1;
	border-radius:20upx;
	padding-bottom: 30upx;
	margin: 0 30upx;
	.item{
		margin: 40upx 57upx 0upx 57upx;
		.icon{
			box-shadow:0upx 3upx 6upx rgba(0,0,0,0.1);
			opacity:1;
			border-radius:20upx;
			width: 46upx;
			height: 46upx;
			margin-right: 25upx;
		}
	}
}
.menu{
	border-radius: 20upx;
	margin: 30upx;
	padding: 46upx 0 0 0;
	flex-wrap: wrap;
	background-color: #FFFFFF;
	.item{
		width: 33%;
		margin-bottom: 52upx;
		.icon{
			width:80upx;
			height:80upx;
			background:rgba(248,248,248,1);
			border-radius:50%;
			opacity:1;
			margin-bottom: 25upx;
		}
		.icon image{
			width: 50upx;
			height: 50upx;
		}
	}
}
.top{
	position: relative;
	height: 260upx;
	.workStatus{
		position: absolute;
		width: 200upx;
		background-color: #FFFFFF;
		color: #666666;
		font-size: 28upx;
		box-shadow:0upx 3upx 6upx rgba(0,0,0,0.1);
		opacity:1;
		border-radius:20upx;
		z-index:2;
		margin-top:10upx;
		.name{
			padding: 14upx 0;
			text-align: center;
		}
		.border-top{
			border-top: 1upx solid #EEEEEE;
		}
	}
	.workbox{
		position: relative;
	}
	.bg-col{
		background-color: #FEB026;
		height: 100upx;
		width: 100%;
	}
	.topinfo{
		width: 92%;
		background:rgba(255,255,255,1);
		box-shadow:0upx 3upx 6upx rgba(0,0,0,0.1);
		opacity:1;
		border-radius:20upx;
		margin: 0 30upx;
		padding: 28upx 0;
		position: absolute;
		top:20%;
		.headicon{
			width:100upx;
			height: 100upx;
			margin-bottom: 18upx;
			background-color: #EEEEEE;
			border-radius: 50%;
		}
		.selectIcon{
			width:30upx;
			height: 16upx;
			margin-left: 18upx;
		}
	}
	.rotate{
	
	    transform-origin:center center; //旋转中心要是正中间 才行
	
	    transform: rotate(180deg);
	
	    -webkit-transform: rotate(180deg);
	
	    -moz-transform: rotate(180deg);
	
	    -ms-transform: rotate(180deg);
	
	    -o-transform: rotate(180deg);
	
	    transition: transform 0.2s; //过度时间 可调
	
	    -moz-transition: -moz-transform 0.2s; 
	
	    -moz-transition: -moz-transform 0.2s; 
	
	    -o-transition: -o-transform 0.2s; 
	
	    -ms-transition: -ms-transform 0.2s; 
	
	}
	
	.rotate1{
	
	    transform-origin:center center;
	
	    transform: rotate(0deg); //返回原点
	
	    -webkit-transform: rotate(0deg);
	
	    -moz-transform: rotate(deg);
	
	    -ms-transform: rotate(0deg);
	
	    -o-transform: rotate(0deg);
	
	    transition: transform 0.2s; 
	
	    -moz-transition: -moz-transform 0.2s; 
	
	    -moz-transition: -moz-transform 0.2s; 
	
	    -o-transition: -o-transform 0.2s; 
	
	    -ms-transition: -ms-transform 0.2s; 
	
	}
}
</style>

 