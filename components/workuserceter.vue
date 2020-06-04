<template>
	<view>
		<view :class="userInfo.type_name =='店长'?'top1':'top0'" class="top" v-if="userInfo.type_name">
			<view class="bg-col"></view>
			<view class="topinfo _flex-center" :class="userInfo.type_name =='店长'?'topinfo1':'topinfo0'">
				<image :src="userInfo.avatarurl ? userInfo.avatarurl : '/static/head.png'" class="headicon"></image>
				<view class="workbox flex_col mCol">
					<text class=" _flex-center">
						<text>{{userInfo.type_name || '店长'}}</text> <text class="_fw _f40">·</text>
						<text>{{work_status==1?'上班中':'已下班'}}</text>
					</text>
					<text class="_cff _f26 workbtn" :class="work_status==1?'mred':'mBg'" @click="selectWork">{{work_status==1?'打卡下班':'打卡上班'}}</text>
				</view>
				<!-- <view class="flex_row yemoney _f32 " v-if="userInfo.worker.type_name =='店长'">
					<view class="_flex-center">
						<text>订单数</text>
						<text class="mar-t10">0.00</text>
					</view>
					<view class="_flex-center border-l">
						<text>营业额</text>
						<text class="mar-t10">1000.00</text>
					</view>
				</view> -->
			</view>
		</view>
		
		<view class="menu flex_row" v-if="userInfo&&userInfo.group.length">
			<view class="item flex_col _flex-center" v-for="(item,index) in userInfo.group" :key="index" @click="golink(item.url)">
				<view class="point"
					v-if="item&&!item.is_show?false
				   :item&&item.url=='/busines/page/commonPage/waiterOrder?type=2' && flag.sendNum>0?true
				   :item&&item.url=='/busines/page/commonPage/refundFood' && flag.refundNum>0?true
				   :item&&item.url=='/busines/page/commonPage/notice'  && flag.noticeNum>0 ?true
				   :item&&item.url=='/busines/page/cooker/workBench?type=1' && flag.makeNum>0 ?true
				   :item&&item.url=='/busines/page/commonPage/table?userType=4' && flag.clearNum>0 ?true
				   :false">
				   {{ item.url === '/busines/page/commonPage/waiterOrder?type=2' ? flag.sendNum
				   :item.url === '/busines/page/commonPage/refundFood' ? flag.refundNum
				   :item.url === '/busines/page/commonPage/notice' ? flag.noticeNum 
				   :item.url === '/busines/page/cooker/workBench?type=1' ? flag.makeNum
				   :item.url === '/busines/page/commonPage/table?userType=4' ? flag.clearNum 
				   :'0' }}
			   </view>
				<view class="flex_col flex_ai">
					<view class="icon _flex-center">
						<image :src="item.icon"></image>
					</view>
					<text>{{item.name}}</text>
				</view>
			</view>
		</view>
		
		
	
		<view class="listmenu flex_col">
			<view class="item flex_row flex_ai" @click="isHelp=true">
				<image src="/static/ddc.png" class="icon"></image>
				<text class="_f30">代点餐</text>
			</view>
			<!-- <view class="item flex_row flex_ai" v-if="userInfo.type==9" @click="$api.openWin('/busines/page/shopOwner/paymentCode')">
				<image src="/static/skcode.png" class="icon" ></image>
				<text class="_f30">收款码</text>
			</view> -->
			<view class="item flex_row flex_ai" @click='centerChange()'>
				<image src="/static/wddc.png" class="icon"></image>
				<text class="_f30">个人中心</text>
			</view>
			<view class="item flex_row flex_ai" @click="$api.openWin('/pages/personal-center/setting')">
				<image src="/static/setting.png" class="icon"></image>
				<text class="_f30">设置</text>
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
						<picker :range="tablist" @change="selectTable" range-key="no">
							<input type="text" v-model="deskId"  disabled="disabled" value="" placeholder="请输入桌号" />
						</picker>
					</view>
				</view>
				<view class="_flex-center" >
					<view class="btn mBg" @click="helpOrder()">
						开始点餐
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	export default{
		props:{
			flagNum:{
				type:Object,
				default:()=>({})
			},
			userInfo:{
				type:Object,
				default:()=>({})
			},
			work_status:{
				type:Number,
				default:1,
			},
			flagNum:{
				type:Object,
				default:()=>({})
			},
			tablist:{
				type:Array,
				default:()=>([])
			}
		},
		data(){
			return{
				workStatus:[
					{name:'工作',status:'1'},
					{name:'休息',status:'2'},
					// {name:'请假',status:'3'},
				],
				flag:{
					noticeNum:0,
					sendNum:0,
					refundNum:0,
					makeNum:0,
					clearNum:0
				},
				Wstatus:false,
				isHelp:false,
				deskId:null,
				noticeNum:0
			}
		},
		computed:{
			WIndex(){
				let that = this
				for (let i = 0; i <that.workStatus.length; i++) {
					if(that.workStatus[i].status == that.work_status){
						return i
					}
				}
			}
		},
		created() {
			this.getnotice();
			if(uni.getStorageSync('kejia_order_userInfo')){
				this.getrefundmake(); //获取制作数
				this.getrefundSend(); //获取退菜数目
				this.getwaitSend(); //获取代配送数目
				this.getnotice(); //获取消息通知数目
				this.getclearNum(); //获取需要清洁餐桌的数目
			}
		},
		watch: {
			'$route': 'getPath'
		},
		methods:{
			...mapMutations(['intoDesk']),
			// 选择工作状态
			chooseStatus(){
				this.Wstatus =! this.Wstatus
			},
			getPath(){
				this.getnotice();
				if(uni.getStorageSync('kejia_order_userInfo')){
					this.getrefundmake(); //获取制作数
					this.getrefundSend(); //获取退菜数目
					this.getwaitSend(); //获取代配送数目
					this.getnotice(); //获取消息通知数目
					this.getclearNum(); //获取需要清洁餐桌的数目
				}
			},
			selectWork(){
				var that = this
				let work = uni.getStorageSync('kejia_order_userInfo').worker;
				let param =that.work_status==1?2:1;
				that.$api.ajax('smdc/worker/toUpdateStatus', {
					shop_id: that.$store.state.shopId,
					id: work.id,
					status: param
				}, res => {
					that.Wstatus = false
					that.$emit('getUserInfo')
				})
			},
			
			golink(url){
				this.$api.openWin(url)
			},
			
			centerChange(){
				this.$emit('centerChange',0)
			},
			
			// 获取消息列表
			getnotice() {
				var that = this
				this.$api.ajax('smdc/message/messageCount', {
					shop_id: that.$store.state.shopId
				}, res => {
					that.noticeNum = res.data
				})
			},
			
			
			selectTable(e){
				this.deskId = this.tablist[e.detail.value].no
			},
			
			helpOrder(){
				if(!this.deskId){
					this.$api.toast('请输入桌号')
					return
				}
				// this.intoDesk(this.deskId);
				this.isHelp =false
				uni.reLaunch({
					url:'/pages/menuHelp/menuHelp?deskId=' +this.deskId
				})
			},
			
			// 获取消息列表
			getnotice() {
				var that = this
				this.$api.ajax('smdc/message/messageCount', {
					shop_id: that.$store.state.shopId
				}, res => {
					that.flag.noticeNum = res.data;
					that.noticeNum = res.data
				})
			},
			
			// 获取带配送数据角标值
			getwaitSend() {
				var that = this
				this.$api.ajax('smdc/Sale_Food/saleFoodCount', {
					shop_id: that.$store.state.shopId
				}, res => {
					that.flag.sendNum = res.data
				})
			},
			
			// 获取退菜角标数目
			getrefundSend() {
				var that = this
				this.$api.ajax('smdc/order_refund/count', {
					shop_id: that.$store.state.shopId
				}, res => {
					that.flag.refundNum = res.data
				})
			},
			
			// 获取需要清理桌子的数目
			getclearNum(){
				  var that = this
				  this.$api.ajax('smdc/desk/deskCount', {
					shop_id: that.$store.state.shopId,
					status: 2
				  }, res => {
					that.flag.clearNum = res.data
				  })
			},
			
			// 获取制作菜品数量数目
			getrefundmake(){
				 var that = this;
				 let process = uni.getStorageSync('kejia_order_userInfo')?uni.getStorageSync('kejia_order_userInfo').worker.process:[];
				 var make_status = process.join(',');
				 this.$api.ajax('smdc/order/cookerCount', {
					shop_id: that.$store.state.shopId,
					make_status:make_status
				 }, res => {
					that.flag.makeNum = res.data;
				 },"POST") 
			},
		}
	}
</script>

<style lang="less">
.mred{
	background-color: #FC6840;
}
.workbtn{
	padding: 13upx 20upx;
	border-radius: 60upx;
	text-align: center;
	margin-top: 25upx;
}	
.mar-r15{
	margin-right: 15upx;
}
.mar-t10{
	margin-top: 10upx;
}
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
	min-height: 200upx;
	.item{
		width: 33%;
		margin-bottom: 52upx;
		position: relative;
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
		.point{
			font-size:17upx;
			background-color:red;
			width:30upx;
			height:30upx;
			margin-left:18upx;
			color:#FFFFFF;
			text-align:center;
			border-radius:50%;
			line-height: 30upx;
			position: absolute;
			top: 0;
			z-index: 999;

		}
		
	}
}
.top0{
	height: 330upx;
}
.top1{
	height: 330upx
}
.top{
	position: relative;
	.yemoney{
		justify-content: space-around;
		margin: 48upx 0 10upx 0;
	}
	.yemoney view{
		width: 350upx;
	}
	.border-l{
		border-left: 1upx solid #EEEEEE;
	}
	.workStatus{
		position: absolute;
		width: 200upx;
		background-color: #FFFFFF;
		color: #666666;
		font-size: 28upx;
		box-shadow:0upx 3upx 6upx rgba(0,0,0,0.1);
		opacity:1;
		border-radius:20upx;
		z-index:3;
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
	.topinfo1{
		top:4%;
	}
	.topinfo0{
		top:8%;
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
		
		.headicon{
			width:100upx;
			height: 100upx;
			margin-bottom: 18upx;
			background-color: #EEEEEE;
			border-radius: 50%;
			border: 1upx solid #EEEEEE;
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

 