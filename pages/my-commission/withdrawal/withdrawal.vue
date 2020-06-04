<template>
	<view>
		<view class="card">
			<view class="title border-bb">可提现金额：{{money}}元</view>
			<view class="x-flex title">
				<view class="title-icon">￥</view>
				<input type="digit" v-model="getMoney" placeholder="输入提现金额" />
			</view>
		</view>
		
		<view class="card">
			<view class="type-title">提现方式</view>
			<view class="type">
				<view class="x-flex type-item" :class="{'type-active':current==0}" @click="changeType(0)">
					<view class="cuIcon-card" style="color: #007AFF;margin-right: 6upx;"></view>
					<view >银行卡</view>
				</view>
				<view class="x-flex type-item" :class="{'type-active':current==1}" @click="changeType(1)">
					<view class="cuIcon-weixin" style="color: #39B54A;margin-right: 6upx;"></view>
					<view >微信红包</view>
				</view>
			</view>
		</view>
		
		<view class="card" v-if="current==0">
			<view class="list x-flex border-bb">
				<view class="list-label">姓名</view>
				<input type="text" v-model="bankName" placeholder="请输入卡号对应的姓名" />
			</view>
			<view class="list x-flex">
				<view class="list-label">卡号</view>
				<input type="text" v-model="bank" placeholder="请输入正确的银行卡账号" />
			</view>
		</view>
		
		<form @submit="sure" report-submit="true">
			<button formType="submit" type="primary" class="my-btn">提交申请</button>
		</form>
		
	</view>
</template>

<script>
	import { mapMutations } from 'vuex'
	export default {
		data() {
			return {
				type:['银行卡','微信红包'],
				current:0,
				money:0.00,
				getMoney:'',
				bank:'',
				bankName:''
			};
		},
		onLoad() {
			this.getUserInfo();
		},
		onPullDownRefresh() {
			this.getUserInfo();
		},
		methods:{
			...mapMutations(['_setUserInfo']),
			// 获取用户信息
			getUserInfo(){
				this.$api.ajax('smdc/user/userinfo',{
					shop_id:this.$store.state.shopId
				},res=>{
					//console.log(res.data);
					setTimeout(function(){
						uni.stopPullDownRefresh()
					},2000)
					let money = res.data.worker.money || 0.00;
					this.money=parseFloat(money).toFixed(2);
					
					this._setUserInfo(res.data);
				})
			},
			changeType(type) {
				this.current=type;
			},
			sure(e) {
				let _this = this;
				let formid=e.detail.formId;
				let getMoney=_this.$api.trim(_this.getMoney);
				let bank=_this.$api.trim(_this.bank);
				let bankName=_this.$api.trim(_this.bankName);
				if(getMoney==""){
					_this.$api.alert('请填写提现金额');
					return ;
				}
				getMoney=parseFloat(_this.getMoney).toFixed(2);
				let money=parseFloat(_this.money);
				
				if(getMoney<=0){
					_this.$api.alert('提现金额不能小于0');
					return ;
				}
				
				if(getMoney > money){
					_this.$api.alert('超过了可提现金额');
					return ;
				}
				if(_this.current==0){
					if(bankName==""){
						_this.$api.alert('请填写银行卡对应的姓名');
						return ;
					}else if(bank==""){
						_this.$api.alert('请填写银行卡账号');
						return ;
					}
				}
				_this.$api.ajax("smdc/order/add_cash",{
					price:getMoney,
					work_id:_this.$store.state.userInfo.worker.id,
					work_name:_this.$store.state.userInfo.worker.username,
					bank:bank,
					bank_name: bankName,
					type:_this.type[_this.current],
					shop_id:_this.$store.state.shopId
				},function(ret) {
					_this.$api.toast('提交成功','success');
					setTimeout(function(){
						uni.redirectTo({
							url:'../withdrawalRecode/withdrawalRecode'
						})
					},1000)
				},"POST")
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #f8f8f8;
	}
	.card{
		margin-bottom: 30upx;
		background: #fff;
		padding: 0 20upx;
		color: #222;
	}
	.border-bb{
		border-bottom: 1upx solid #eee;
	}
	.title{
		font-size: 32upx;
		line-height: 88upx;
		.title-icon{
			font-size: 40upx;
			margin-right: 30upx;
			color: #FEB026;
		}
	}
	.type-title{
		line-height: 90upx;
		font-size: 28upx;
	}
	.type{
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		.type-item{
			margin: 0 30upx 30upx 0;
			padding: 0 20upx;
			line-height: 60upx;
			text-align: center;
			border:1upx solid #999;
			border-radius: 8upx;
		}
		.type-active{
			border:1upx solid #FEB026;
		}
	}
	.list{
		line-height: 88upx;
		height: 88upx;
		font-size: 26upx;
		.list-label{
			margin-right: 20upx;
		}
	}
	
	.my-btn{
		margin: 120upx 60upx 0;
		border-radius: 100upx;
		background: #FEB026 !important;
		font-size: 34upx;
	}
	
</style>
