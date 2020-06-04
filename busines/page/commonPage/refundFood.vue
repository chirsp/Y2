<template>
	<view class="mar-b16">
		
		<view class="bg-white nav">
			<view class="flex text-center flex_ai">
				<view class="cu-item flex-sub" :class="index==TabCur?'text-orange cur':''" v-for="(item,index) in Tab" :key="index" @click="tabSelect(index)">
					{{item}}
				</view>
			</view>
		</view>
		<view style="height: 100upx;"></view>
		
		<view class="top flex_col _f30" v-for="(item,index) in list" :key="index" 
	   @click="readInfo(index,item.id)">
			<view class="notice_box">
				<view class="mar-b16 flex_row flex_ai">
					<text class='_f40 _fw red' v-if="item.is_aduit==0">· </text>
					<text class="_c22">{{item.deskid}}号桌 {{item.name}}</text>
					<text class="_c22" v-if="item.is_aduit ==1">{{item.aduit_status==2?'审核成功':'审核失败'}}</text>
				</view>
				<view  class="_c66 _f26 flex_row flex_sb flex_ai">
					<text>{{$api.format(item.create_time)}}</text>
					<text class="ding_icon mbor mBg _cff" v-if="item.is_aduit ==0">立即审核</text>
				</view>
			</view>
			<image src="../../static/image/dealFinish.png" class="dealFinish"  v-if="item.is_aduit==1"></image>
		</view>
		
		<showmodal 
		 :modal='Modal' 
		 :msg="list[selectindex].deskid + '申请退菜'" 
		 @sure='sure' @hide='hide' 
		 :hidedeal="true"
		 comfirmText='审核通过'
		 cancelText='审核不通过'
		 v-if="Modal"></showmodal>
		<nodata msg="空空如也~" v-if="list.length==0"></nodata>
	</view>
</template>

<script>
	import nodata from '../../../components/nodata.vue'
	import showmodal from '../../../components/showmodal.vue'
	export default{
		components:{nodata,showmodal},
		data(){
			return{
				list:[],
				page:1,
				load:false,
				Tab:['未申核','已审核'],
				typeIndex:0,
				TabCur: 0,
				scrollLeft: 0,
				Modal:false,
				selectindex:0,
				id:'',
				uid:uni.getStorageSync('kejia_order_uid'),
			}
		},
		onShow() {
			this.getlist()
		},
		onPullDownRefresh() {
			if(this.load){
				return
			}this.page =1
			this.getlist()
		},
		onReachBottom() {
			if(this.load){
				return
			}
			this.page ++ 
			this.getlist()
		},
		methods:{
			//选择消息类型
			msgTypeSelect(e){
				this.typeIndex = e.detail.value
				if(this.typeIndex == 3){
					this.receipt_type = 0
				}else{
					this.receipt_type = 1
				}
				this.page=1
				this.getlist()
			},
			
			// 选择导航
			tabSelect(index) {
				this.TabCur = index;
				this.scrollLeft = (index - 1) * 60
				this.page=1
				this.getlist()
			},
			
			// 获取消息列表
			getlist() {
				var that = this
				that.load = true
				this.$api.ajax('smdc/order_Refund/list', {
					shop_id: that.$store.state.shopId,
					page:that.page,
					is_aduit:that.TabCur,
					limit:10
				}, res => {
					that.load = false
					setTimeout(function(){
						uni.stopPullDownRefresh()
					},2000)
					if(that.page==1){
						that.list = res.data
					}else{
						that.list = that.list.concat(res.data)
					}
				},"POST",true)
			},
			
			// 确认处理消息通知弹窗操作
			sure(e) {
				var that = this
				that.Modal = false
				if (e) {
					this.auditMessage(2)
				}
			},
			hide(e) {
				this.Modal = false
				if(!e.hidedeal){
					this.auditMessage(3)
				}
				
			},
			
			auditMessage(status){
				var that = this
				this.$api.ajax('smdc/order_Refund/aduit', {
					shop_id: that.$store.state.shopId,
					id:that.id,
					aduit_status:status,
				}, ret => {
					if(ret.status==0){
						uni.showModal({
						  title: '系统提示',
						  content: ret.msg,
						  success (res) {
						    if (res.confirm) {
						      that.list.splice(that.selectindex,1)
						    } else if (res.cancel){
							  that.list.splice(that.selectindex,1)
							}
						  }
						})
					}else{
						that.list.splice(that.selectindex,1)
					}
					
				})
			},
			
			// 已读消息
			readInfo(index,id) {
				if(this.list[index].is_aduit==1){
					return
				}
				this.selectindex = index
				this.id = id
				this.Modal = true
			},
		},
	}
</script>

<style lang="less">
.type{
	margin: 0 20upx;
	border-right: 1upx solid #EEEEEE;
	.selectIcon {
		width: 24upx;
		height: 27upx;
		margin:0 15upx;
	}
}
.ding_icon{
	padding: 10upx 25upx;
	border-radius: 40upx;
}
.notice_box{
	position: relative;
}
.dealFinish{
	width: 100upx;
	height: 70upx;
	position: absolute;
	z-index: 3;
	right: 0;
	margin-right: 58upx;
}
.top{
	background:rgba(255,255,255,1);
	// box-shadow:0upx 3upx 16upx rgba(0,0,0,0.1);
	padding: 22upx 20upx;
	margin-bottom: 10upx;
}
.mar-b16{
	margin-bottom: 16upx;
}
.red{
	color: red;
}
.nav{
	width: 100%;
	position: fixed;
	top: 0;
	z-index: 4;
}

</style>