<template>
	<view>
		<view class="card">
			<view class="title border-bb">可提现金额：{{cashinfo.balance_money || '0.00'}}元</view>
			<view class="x-flex title">
				<view class="title-icon">￥</view>
				<input type="digit" v-model="getMoney" placeholder="输入提现金额" />
			</view>
		</view>
		
		<view class="card">
			<view class="type-title">提现方式</view>
			<view class="type">
				<view class="x-flex type-item" :class="{'type-active':current==item.type}" @click="changeType(item.type)" v-for="(item,index) in cashtype" :key='index'>
					<view class="mg-right" :class="index==0?'cuIcon-card':index==1?'cuIcon-weixin':'cuIcon-pay'" :style="index==0?'color: #007AFF;':index==1?'color: #39B54A':'color: #007AFF'"></view>
					<view >{{item.name}}</view>
				</view>
				<!-- <view class="x-flex type-item" :class="{'type-active':current==1}" @click="changeType(1)">
					<view class="cuIcon-weixin" style="color: #39B54A;margin-right: 6upx;"></view>
					<view >微信红包</view>
				</view> --> 
			</view>
		</view>
		<!-- 银行卡提现 -->
		<view class="card" v-if="current==3">
			<view class="list x-flex border-bb">
				<view class="list-label">持卡人姓名</view>
				<input type="text" v-model="cardholder" placeholder="请输入卡号对应的姓名" disabled="true"/>
			</view>
			<view class="list x-flex">
				<view class="list-label">卡号</view>
				<input type="text" v-model="card_number" placeholder="请输入正确的银行卡账号" disabled="true" />
			</view>
			<view class="list x-flex">
				<view class="list-label">开户行</view>
				<input type="text" v-model="bank_name" placeholder="请输入正确的银行开户行" disabled="true" />
			</view>
		</view>
		
		<!-- 微信号提现 -->
		<view class="card" v-if="current==1">
			<view class="list x-flex border-bb">
				<view class="list-label">收款人</view>
				<input type="text" v-model="wechat_name" placeholder="请输入提现微信名称" disabled="true" />
			</view>
			<view class="list x-flex border-bb">
				<view class="list-label">微信号</view>
				<input type="text" v-model="wechat_number" placeholder="请输入提现微信号" disabled="true"/>
			</view>
		</view>
		
		<!-- 支付宝提现 -->
		<view class="card" v-if="current==2">
			<view class="list x-flex border-bb">
				<view class="list-label">收款人</view>
				<input type="text" v-model="alipay_name" placeholder="请输入提现支付宝名称" disabled="true"/>
			</view>
			<view class="list x-flex border-bb">
				<view class="list-label">支付宝号</view>
				<input type="text" v-model="alipay_account" placeholder="请输入提现支付宝号" disabled="true"/>
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
				cashtype:[
					{name:'银行卡',type:3},
					{name:'微信',type:1},
					{name:'支付宝',type:2}],
				current:3,
				money:0.00,
				getMoney:'',
				card_number:'',
				cardholder:'',
				cashinfo:"",
				bank_name:"",
				alipay_account:"",
				alipay_name:"",
				wechat_name:"",
				wechat_number:"",
				
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
			// 获取用户信息
			getUserInfo(){
				this.$api.ajax('smdc/Withdrawal/index',{
					shop_id:this.$store.state.shopId
				},res=>{
					setTimeout(function(){
						uni.stopPullDownRefresh()
					},2000)
					this.cashinfo = res.data
					this.card_number = this.cashinfo.card_number,
					this.cardholder = this.cashinfo.cardholder,
					this.bank_name = this.cashinfo.bank_name,
					this.alipay_name = this.cashinfo.cardholder
					this.alipay_account = this.cashinfo.alipay
					this.wechat_name = this.cashinfo.cardholder
					this.wechat_number = this.cashinfo.wechatpay
				})
			},
			changeType(type) {
				this.current=type;
			},
			sure(e) {
				let _this = this;
				let formid=e.detail.formId;
				let getMoney=parseFloat(_this.getMoney);
				let Allmoney = parseFloat(_this.cashinfo.balance_money)
				if(getMoney==""){
					_this.$api.alert('请填写提现金额');
					return ;
				}
				
				if(getMoney<=0){
					_this.$api.alert('提现金额不能小于0');
					return ;
				}
				console.log(getMoney,Allmoney)
				if(getMoney > Allmoney){
					_this.$api.alert('超过了可提现金额');
					return ;
				}
				if((!_this.card_number || !_this.bank_name || !_this.cardholder) && _this.current==3){
					_this.$api.alert('银行卡提现信息不全无法申请提现,请先在商户后台完善');
					return ;
				}
				if((!_this.wechat_number|| !_this.wechat_name) && _this.current==1){
					_this.$api.alert('微信提现信息不全无法申请提现,请先在商户后台完善');
					return ;
				}
				if((!_this.alipay_account || !_this.alipay_name) && _this.current==2){
					_this.$api.alert('支付宝提现信息不全无法申请提现,请先在商户后台完善');
					return ;
				}
				_this.$api.ajax("smdc/Withdrawal/add",{
					shop_id:_this.$store.state.shopId,
					with_money:getMoney,
					pay_type:_this.current,
					card_number:_this.card_number,
					cardholder:_this.cardholder,
					bank_name:_this.bank_name,
					alipay_name: _this.cardholder,
					alipay_account:_this.alipay_account,
					wechat_name:_this.cardholder,
					wechat_number:_this.wechat_number,
					
				},function(ret) {
					_this.$api.toast('提交成功','success');
					setTimeout(function(){
						uni.redirectTo({
							url:'withdrawalRecode'
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
	.mg-right{
		margin-right: 6upx;
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
			margin-right: 40upx;
			width: 20%;
			text-align-last: justify;
		}
	}
	
	.my-btn{
		margin: 120upx 60upx 0;
		border-radius: 100upx;
		background: #FEB026 !important;
		font-size: 34upx;
	}
	
</style>
