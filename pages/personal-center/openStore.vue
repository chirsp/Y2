<template>
	<view>
		<submitInfo  :typeList='typeList'  @submit='submit' v-if="info==null"></submitInfo>
		<statusCheck :status="status" :secondStatus="secondStatus" v-if="(status==0 || status==2 || secondStatus==2 || secondStatus==0) && upstatus" @clickUpdataInfo ='clickUpdataInfo' :second="secondInfo?true:false"></statusCheck>
		<updataInfo v-if='status==1 && !secondInfo' :agreement="agreement" :updataInfo="updataInfo" ></updataInfo>

		<success v-if='secondStatus==1'></success>
		
	</view>
</template>

<script>
	import submitInfo from '../../components/openStore/submitInfo.vue';
	import statusCheck from '../../components/openStore/statusCheck.vue';
	import updataInfo from '../../components/openStore/updataInfo.vue';
	import success from '../../components/openStore/successopen.vue';
	export default {
		components: {
			submitInfo,
			statusCheck,
			updataInfo,success
		},
		data() {
			return {
				status: null,
				info:null,
				updata:null,
				typeList:[],
				secondInfo:null,
				id:'',
				secondStatus:null,
				agreement:[],
				updataInfo:{},
				upstatus:true,
				// accomplish:false,
			}
		},
		onShow() {
            this.checkStatus()
			this.getType()
		},
		methods: {
			// 判断是否是审核失败重新提交
			clickUpdataInfo(e){
				console.log(e)
			  if(!e){
				  this.info = null
				  this.status = null
			  }else{
				  this.status = 1
				  this.secondStatus = null
			  }
				this.upstatus = false;
			},
			
			// 获取经营类别
			getType(){
				let _this = this;
				_this.load = true
				_this.$api.ajax('smdc/Business/index', {
					shop_id: _this.$store.state.shopId
				}, function(ret) {

					_this. typeList = ret.data
				}, 'POST')
			},
			
			// 获取用户协议
			getAgreement(){
				let _this = this
				_this.$api.ajax('smdc/version/intro',{
					  shop_id:_this.$store.state.shopId,
				},function(ret){
					ret.data.splice(0,1)
					_this.agreement = ret.data
				})
				
			},
			
			// 判断开店审核状态
			checkStatus() {
				var that = this
				this.$api.ajax('smdc/join_us/detail', {
					shop_id: that.$store.state.shopId
				}, res => {
					console.log(res)
					that.info = res.data
					if(res.data){
						that.id = that.info.id
						that.status = that.info.status
						if(that.info.status==1){
							that.checkInfoStatus()
							that.getAgreement()
						}
					}
					
				})
			},
			
			// 判断二次资料审核状态
			checkInfoStatus(){
				var that = this
				this.$api.ajax('smdc/Merchant/index', {
					shop_id: that.$store.state.shopId
				}, res => {
					console.log(res)
					if(res.data){
						that.secondInfo = res.data
						that.updataInfo = res.data;
						that.secondStatus = that.secondInfo.status
						// if(that.secondInfo.status == 1){
						// 	this.accomplish = true;
						// }
					}
				})
			},
			
			// 提交用户开店信息
			submit(e) {
				console.log(e)
				var that = this
				this.$api.ajax('smdc/join_us/toAdd', {
					shop_id: that.$store.state.shopId,
					name:e.name,
					phone:e.phone,
					type:e.type,
					area_id:e.area_id,
					id:that.id
				}, res => {
					console.log(res)
					that.$api.toast('提交成功')
					that.checkStatus()
				})
			},
			
			
		},
	}
</script>

<style lang="less">
	// 审核弹窗css
	.modalInfo {
		padding-bottom: 50upx;

		.tableNum {
			width: 120upx;
			height: 120upx;
			background: rgba(254, 176, 38, 1);
			border-radius: 50%;
			opacity: 1;
			font-size: 60upx;
		}

		.clearbtn {
			width: 376upx;
			opacity: 1;
			text-align: center;
			padding: 20upx 0;
			border-radius: 10upx;
			margin-bottom: 24upx;
		}

		.edit {
			margin: 48upx 0 34upx 0;
		}
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
		margin: 30upx 0;
		background-color: #FFFFFF;
		padding: 0 30upx;

		.bor-bt {
			border-bottom: 1upx solid #EEEEEE;
		}

		.info {
			padding: 30upx 0;
		}

		.left {
			width: 20%;
			margin-right: 30upx;
		}

		.left text {
			text-align-last: justify;
		}

		.infoInput {
			border: none;
			font-size: 28upx;
			flex: 1;
		}

		.agreement {
			margin: 20upx 0;

			.tip {
				margin-left: 20upx;
			}

			.cblue {
				color: #014C8C;
			}
		}

	}

	.sure {
		padding: 26upx 0;
		border-radius: 6upx;
		margin: 40upx 30upx;
	}
</style>
