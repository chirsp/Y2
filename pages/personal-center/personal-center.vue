<template>
	<view class="page">
		<usercenter :userInfo='userInfo' :is_open_coupon="_config.is_open_coupon" v-if="worker==0" @centerChange='centerChange' @getUserInfo='getUserInfo'></usercenter>
		<woker v-if="worker==1" :userInfo='userWorker' :tablist='tablist' :work_status='work_status' @centerChange='centerChange'  @getUserInfo='getUserInfo'></woker>
		<view style="height: 110rpx;"></view>
		<x-footer></x-footer>
	</view>
</template>

<script>
	import xFooter from '../../components/footer.vue';
	import usercenter from '../../components/usercenter.vue';
	import woker from '../../components/workuserceter.vue';
	import {mapState, mapMutations} from 'vuex';
	export default {
		components: {
			xFooter,usercenter,woker
		},
		data() {
			return {
				userInfo:"",
				worker:null,
				flagNum:{
					noticeNum:0,
					sendNum:0,
					refundNum:0,
					makeNum:0,
					clearNum:0
				},
				tablist:[],
				work_status:"",
				userWorker:{}
				
			}
		},
		computed:mapState(['uid','hasLogin','_phone','needScan','_config']),
		onLoad(option) {
			if(option.worker){
				this.worker= option.worker
			}
			
		},
		onPullDownRefresh() {
			this.worker = null;
			this.getUserInfo() ;
			// this.getnotice() 
			// this.getwaitSend() 
			// this.getrefundSend()
			this.getTable();
			// this.getrefundmake()
			// this.getclearNum()
		},
		created() {
			if(this.needScan){
				uni.redirectTo({
					url:'../index/scan'
				})
				return
			}else{
				this.getUserInfo()
				this.getTable()
				// this.getnotice() //获取消息通知数目
				// this.getwaitSend() //获取代配送数目
				// this.getrefundSend() //获取退菜数目
				// this.getrefundmake() //获取制作数目
				// this.getclearNum() //获取需要清洁餐桌的数目
			}
		},
		methods: {
          ...mapMutations(['_setUserInfo','changeNeedScan']),
		  
		  centerChange(e){
			  this.worker = e
		  },  
		  
		  // 获取消息列表
		  getnotice() {
		  	var that = this
		  	this.$api.ajax('smdc/message/messageCount', {
		  		shop_id: that.$store.state.shopId
		  	}, res => {
		  		that.flagNum.noticeNum = res.data
		  	})
		  },
		  
		  // 获取带配送数据角标值
		  getwaitSend() {
		  	var that = this
		  	this.$api.ajax('smdc/Sale_Food/saleFoodCount', {
		  		shop_id: that.$store.state.shopId
		  	}, res => {
		  		that.flagNum.sendNum = res.data
		  	})
		  },
		  
		  // 获取退菜角标数目
		  getrefundSend() {
		  	var that = this
		  	this.$api.ajax('smdc/order_refund/count', {
		  		shop_id: that.$store.state.shopId
		  	}, res => {
		  		that.flagNum.refundNum = res.data
		  	})
		  },
		  
		  // 获取需要清理桌子的数目
		  getclearNum(){
			  var that = this
			  this.$api.ajax('smdc/desk/deskCount', {
			  	shop_id: that.$store.state.shopId,
				status: 2
			  }, res => {
			  	that.flagNum.clearNum = res.data
			  })
		  },
		  
		  // 获取制作菜品数量数目
		  getrefundmake(){
			 var that = this;
			 let process = uni.getStorageSync('kejia_order_userInfo').worker?uni.getStorageSync('kejia_order_userInfo').worker.process:[];
			 var make_status = process.join(',');
			 this.$api.ajax('smdc/order/cookerCount', {
			 	shop_id: that.$store.state.shopId,
				make_status:make_status
			 }, res => {
			 	that.flagNum.makeNum = res.data;
			 },"POST") 
		  },
		  
		  getTable() {
		  	var that = this
		  	this.$api.ajax('smdc/desk/getDeskList', {
		  		status: -1,
		  		shop_id: that.$store.state.shopId
		  	}, res => {
		  		that.tablist = res.data
		  	})
		  },
		  
			// 获取用户信息
			getUserInfo(){
				console.log(this.$store.state.shopId)
				this.$api.ajax('smdc/user/userinfo',{
					shop_id:this.$store.state.shopId
				},res=>{
					console.log(res)
					setTimeout(function(){
						uni.stopPullDownRefresh()
					},1500);
					if(!res.data.id){
						var _this = this
						this.$api.toast("登录过期，请重新登录")
						setTimeout(function(){
							// #ifdef MP-WEIXIN
                            _this.$api.openWin("/pages/login/login")							
							// #endif
							// #ifndef MP-WEIXIN
							_this.$api.openWin("/pages/login/login1")
							// #endif
							
						},1000)
						return
					};
					this.userInfo = res.data;
					this.worker = res.data.type;
					console.log(res)
					this.userWorker = res.data.worker;
					this.work_status = res.data.worker.work_status;
					this._setUserInfo(res.data);
					this.$api.setStorage("kejia_order_userInfo",res.data);
				})
			},
		}
		
	}
</script>

<style lang="scss">
page{
	background-color: #f7f7f7;
}
</style>
