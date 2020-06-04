<template>
	<view class="vip">
		<view class="bg-re">
			<image src="../../static/bg.png" class="bg-re-img" mode="widthFix"></image>
			<!-- <view class="bg-ab" @click="billDetail">
				账单明细
			</view> -->
		</view>
		<view class="content">
			<view class="text">会员充值 多充多送</view>
			<view class="info x-flex-sp">
				<block v-for="(item,index) in list" :key="index">
					<view v-if="item.type==1" class="info-item" :class="{'active-bg':current==index}" @click="changeItem(index)">
						<view>
							<view class="price" :class="{'active-text':current==index}">¥{{item.price}}</view>
							<view class="fline-H">送<text class="price2">{{item.price_song}}</text>元</view>
						</view>
						<view class="tj-tip" v-if="index==0">
							<text>推荐</text>
						</view>
					</view>
					
				</block>
			</view>
			<view v-if="list.length">
				<form @submit="recharge" report-submit="true">
					<button class="content-btn" formType="submit">立即充值</button>
				</form>
			</view>
		</view>
		<!-- 底部导航 -->
		<view><x-footer></x-footer></view>
	</view>
</template>

<script>
	import xFooter from '../../components/footer.vue';
	export default {
		data() {
			return {
				current:0,
				list:[]
			}
		},
		onLoad() {
			this.getData();
		},
		components: {
			xFooter
		},
		methods: {
			changeItem(index) {
				this.current=index;
			},
			recharge(e) {
				let formId=e.detail.formId;
				let _this = this;
				// #ifdef APP-PLUS
				 let url='smdc/card/apppay'
				// #endif
				
				// #ifdef MP-WEIXIN
				 var url ='smdc/card/wxpay'
				// #endif
				this.$api.ajax(url,{
					cardid:this.list[this.current].id,
					shop_id:this.$store.state.shopId
				},function(ret){
					_this.$api.wxPay(ret.data,'/pages/pay-success2/pay-success2')
				},'POST');
			},
			// pay(orderNo) {
			// 	let _this = this;
			// 	_this.$api.ajax('smdc/order/wxpay',{
			// 		out_trade_no:orderNo,
			// 		shop_id:_this.$store.state.shopId,
			// 	},function(ret){
			// 		uni.requestPayment({
			// 			provider: 'wxpay',
			// 			timeStamp: ret.data.timeStamp,
			// 			nonceStr: ret.data.nonceStr,
			// 			package: ret.data.package,
			// 			signType: 'MD5',
			// 			paySign: ret.data.paySign,
			// 			success: function (res) { 
			// 				console.log('success:' + JSON.stringify(res));
			// 				_this.$api.toast('支付成功','success');
			// 				_this.$api.openWin('../pay-success2/pay-success2');
			// 			},
			// 			fail: function (err) {
			// 				console.log('fail:' + JSON.stringify(err));
			// 				_this.$api.alert('未支付');
			// 			}
			// 		});
			// 	},'POST')
			// },
			billDetail() {
				this.$api.tempToast();
				//this.$api.openWin('../balance/balance');
			},
			getData() {
				let _this = this;
				this.$api.ajax('/smdc/card/getcard',{
					shop_id:this.$store.state.shopId
				},function(ret){
					_this.list=ret.data;
				});
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #fff;
	}
	button::after{
		border: none;
	}
	.fline-H{
		line-height: 40upx;
		display:flex;
		justify-content:center;
	}
	.vip{
		.bg-re{
			position: relative;
			.bg-re-img{
				width: 100%;
			}
			.bg-ab{
				position: absolute;
				top: 35upx;
				right: 65upx;
				padding: 2upx 6upx;
				border-radius: 10upx;
				border:2upx solid #C3A36D;
				color: #C3A36D;
			}
		}
	}
	.content{
		text-align: center;
		.text{
			font-size:41upx;
			font-weight:600;
			color:rgba(87,85,85,1);
			padding-top: 60upx;
		}
		.info{
			padding: 50upx 30upx;
			flex-wrap: wrap;
			.info-item{
				width: 324upx;
				position: relative;
				background: #F8F6F9;
				border-radius: 20upx;
				margin-bottom: 30upx;
				font-size:34upx;
				font-weight:bold;
				color:rgba(68,68,68,1);
				display: flex;
				justify-content: center;
				flex-direction: column;
				height: 164upx;
				.price{
					padding-bottom: 14upx;
				}
				.price2{
					color: #FC5D31;
					font-size: 40upx;
				}
			}
			.tj-tip{
				background-color:#FC5D31;
				color: #FFFFFF;
				font-size: 28upx;
				position: absolute;
				top: 0;
				right: 0;
				padding: 7upx 20upx;
				border-bottom-left-radius:20upx ;
				z-index: 2;
				
			}
			.active-bg{
				background: #FCD6CC;
			}
			.active-text{
				color: #FB6841;
			}
		}
	},
	.content-btn{
		margin:0 80upx 60upx;
		line-height:90upx;
		height:90upx;
		border-radius:50upx;
		font-size:36upx;
		color:#E8D3AA;
		background:#655F61;
		font-weight:bold;
		letter-spacing: 4upx;
	}
</style>
