<template>
	<view>
		<!-- <view class="typebox flex_row flex_ai" @click="typeSelect =! typeSelect">
			<picker  :range="tab" range-key="name" @change="selectType">
				<text class="_f30">{{tab[typeIndex].name}}</text>
				<image src="../../static/image/selectdown.png" class="selectIcon" :class="typeSelect?'rotate1':'rotate'"></image>
			</picker>
		</view> -->

		<scroll-view scroll-x class="bg-white nav banner">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="item.status==TabCur?'text-orange cur _f32':''" v-for="(item,index) in tab"
				 :key="index" @tap="tabSelect" :data-id="item.status">
					<text>{{item.name}}</text>
				</view>
			</view>
		</scroll-view>
		<view class="space"></view>
		<block v-if="orderlist.length && TabCur==1 && work_status==1">
			<view class="list flex_row flex_ai">
				<view class="title" :style="'width:'+item.width+';text-align:' + item.align" v-for="(item,index) in title" :key="index">
					{{item.name || ''}}
				</view>
			</view>
			<view class="" v-for="(item,index1) in orderlist" :key='index1'>
				<view class="list flex_row flex_ai">
					<view class="title width1 align_l">{{item.deskid || ''}}桌</view>
					<view class="title width2 align_l">{{item.name}}</view>
					<view class="title width3 align_c mCol" @click="lookDetail(index1)">
						<text> X {{item.num}}</text>
					</view>
					<view class="title width4 align_r _cff finish mBg" @click="editstatus(item.id,index1)">配送</view>
				</view>
			</view>
		</block>
		<block v-if="orderlist.length && TabCur==3">
			<view class="list flex_row flex_ai flex_sb">
				<view class="title" :style="'width:'+item.width+';text-align:center' + item.align" v-for="(item,index) in finishTitle"
				 :key="index">
					{{item.name}}
				</view>
			</view>
			<view class="" v-for="(item,index) in orderlist" :key='index'>
				<view class="list flex_row flex_ai flex_sb">
					<view class="title  align_l" style="width: 20%;">{{item.no}}</view>
					<view class="title  align_l" style="width: 40%;">{{item.content || ''}}</view>
					<view class="title  flex_row _flex_sb" style="width: 40%;">
						<text>{{item.create_time || ''}}</text>
					</view>
				</view>
			</view>
		</block>

		<x-nodata v-if='orderlist.length==0 || TabCur==1 && work_status==2' :msg="(TabCur==1 && work_status==2)?'今天已下班':'无订单数据'"></x-nodata>

		<drag-button :isDock="true" :existTabBar="true" showImg="/busines/static/image/menu.jpg" @btnClick="$api.openWin('/pages/personal-center/personal-center')" />
	</view>
</template>

<script>
	import xNodata from '../../../components/nodata.vue'
	import dragButton from "../../../components/drag-button.vue";
	export default {
		components: {
			xNodata,
			dragButton
		},
		data() {
			return {
				modalName: null,
				work_status: "",
				page: 1,
				load: false,
				orderlist: [],
				TabCur: 1,
				scrollLeft: 0,
				title: [{
						name: '桌号',
						width: '30%',
						align: 'left'
					},
					{
						name: '菜品名称',
						width: '40%',
						align: 'left'
					},
					{
						name: '',
						width: '16%',
						align: 'center'
					},
					{
						name: '操作',
						width: '14%',
						align: 'right'
					},
				],
				finishTitle: [
					{
						name: '桌号',
						width: '20%',
						align: 'left'
					},
					{
						name: '菜品',
						width: '40%',
						align: 'left'
					},
					{
						name: '完成时间',
						width: '40%',
						align: 'right'
					},
				],
				type: '',
				typeSelect: false,
				dishStatus: {},
				typeIndex: 0,
				tab: [{
						name: "今日待办",
						status: "1"
					},
					{
						name: "今日已办",
						status: "3"
					},
				],
			}
		},
		onLoad(e) {
			this.type = e.type

		},
		onShow() {
			this.getUserInfo()
			this.getdishStatus()
			this.getorder()
		},
		onReachBottom() {
			if (this.load) {
				return
			}
			this.page++
			this.getorder()
		},
		onPullDownRefresh() {
			this.getorder()
		},
		methods: {
			getUserInfo() {
				this.$api.ajax('smdc/user/userinfo', {
					shop_id: this.$store.state.shopId
				}, res => {
					if (!res.data.id) {
						var _this = this
						this.$api.toast("登录过期，请重新登录")
						setTimeout(function() {
							// #ifdef MP-WEIXIN
							_this.$api.openWin("/pages/login/login")
							// #endif

							// #ifndef MP-WEIXIN
							_this.$api.openWin("/pages/login/login1")
							// #endif

						}, 1000)
						return
					}
					this.work_status = res.data.worker.work_status
					this.$api.setStorage("kejia_order_userInfo", res.data)
				})

			},
			// 选择导航
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
				this.page = 1
				this.orderlist.length=0
				this.getorder()
			},
			// 选择订单状态
			selectType(e) {
				console.log(e)
				this.page = 1
				this.typeIndex = e.detail.value
				this.typeSelect = false
				this.getorder()
			},

			// 查看订单详情
			lookDetail(index) {
				this.orderlist[index].select = !this.orderlist[index].select
			},

			// 获取菜品状态列表
			getdishStatus() {
				let _this = this;
				_this.load = true
				_this.$api.ajax('smdc/food_process/FoodProcessList', {
					shop_id: _this.$store.state.shopId,
				}, function(ret) {
					_this.dishStatus = ret.data
				}, 'POST')
			},

			// 获取订单列表
			getorder() {
				let _this = this;
				var data = {
					shop_id: _this.$store.state.shopId,
					admin_check: _this.tab[_this.typeIndex].status,
					page: _this.page,
					status: _this.TabCur
				}
				if (_this.TabCur == 3) {
					var url = 'smdc/Worker/workload'
					data['type'] = _this.type
				} else {
					var url = 'smdc/Sale_Food/foodDelivery'
				}
				_this.load = true
				_this.$api.ajax(url, data, function(ret) {
					_this.load = false
					ret.data.forEach(function(item) {
						item.select = false
					})
					if (_this.page == 1) {
						_this.orderlist = ret.data;
					} else {
						_this.orderlist = _this.orderlist.concat(ret.data)
					}
					uni.stopPullDownRefresh()
				}, 'POST',true)
			},
			changeTab(i) {
				this.current = i;
				this.page = 1
				this.getorder()
			},

			// 服务员修改单个菜品配送状态
			editstatus(id,index) {
				let _this = this;
				console.log("菜品ids", id)
				_this.$api.ajax('smdc/Sale_food/toUpdateDelivery', {
					shop_id: _this.$store.state.shopId,
					id: id,
				}, function(ret) {
					if(ret.status==0){
						uni.showModal({
						  title: '系统提示',
						  content: ret.msg,
						  success (res) {
						    if (res.confirm) {
						      _this.orderlist.splice(index,1)
						    } else if (res.cancel){
								_this.orderlist.splice(index,1)
							}
						  }
						})
					}else{
						_this.orderlist.splice(index,1)
						// _this.getorder()
					}
				}, "POST",true)

			},

			// 修改菜品制作状态
			// editstatus(index, type, index1) {
			// 	let _this = this;
			// 	var ids = []
			// 	if (type == 1) {
			// 		_this.orderlist[index].smdc_sale_food.forEach(function(x) {
			// 			ids.push(x.id)
			// 		})
			// 	} else {
			// 		ids.push(_this.orderlist[index].smdc_sale_food[index1].id)
			// 	}
			// 	_this.$api.ajax('smdc/Sale_food/toUpdateDelivery', {
			// 		shop_id: _this.$store.state.shopId,
			// 		id: ids,
			// 	}, function(ret) {
			// 		uni.showToast({
			// 			title: "操作成功",
			// 			icon: "success"
			// 		})
			// 		_this.getorder()
			// 	}, 'POST')
			// },

			// 服务员接单/确认订单
			takeorder(id) {
				let _this = this;
				if (_this.current == 0) {
					var admin_check = 1
				}
				if (_this.current == 1) {
					var admin_check = 3
				}
				if (_this.current == 3) {
					return
				}
				console.log("菜品ids", id)
				_this.$api.ajax('smdc/order/changeAdminCheck', {
					shop_id: _this.$store.state.shopId,
					id: id,
					admin_check: admin_check,
				}, function(ret) {
					if(ret.status==0){
						uni.showModal({
						  title: '系统提示',
						  content: ret.msg,
						  success (res) {
						    if (res.confirm) {
						      _this.getorder()
						    } else if (res.cancel){
								_this.getorder()
							}
						  }
						})
					}else{
						uni.showToast({
							title: "操作成功",
							icon: "success"
						})
						_this.current = 3;
						_this.getorder()
					}
					
					
				}, "POST",true)
			},
		},

	}
</script>

<style lang="less">
	.banner {
		position: fixed;
		top: 0;
		width: 100%;
	}

	.space {
		height: 100upx;
	}

	.mar-bt20 {
		margin-bottom: 20upx;
	}

	.bt-b {
		border-bottom: 1upx solid #EEEEEE;
	}

	.selectIcon {
		width: 30upx;
		height: 16upx;
		margin-left: 18upx;
		margin-left: 10upx;
	}

	.detail {
		padding: 20upx 30upx;
		border-bottom: 1upx solid #EEEEEE;
	}

	.finish {
		border-radius: 10upx;
		padding: 10upx 20upx;
	}

	.typebox {
		margin: 20upx;
		background-color: #FFFFFF;
		padding: 20upx 20upx;
		border-radius: 40upx;
		width: 23%;
	}

	.tabtext {
		background-color: #FFFFFF;
		padding: 20upx 0;
		justify-content: center;
		// width: 100upx;
		// border-radius: 20upx;
	}

	.list {
		background-color: #FFFFFF;
		padding: 20upx 30upx;

		.finsh {
			font-size: 26upx;
			padding: 12upx 0upx;
			border-radius: 10upx;
			width: 100upx;
		}
	}

	.title {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.width1 {
		width: 30%;
	}

	.width2 {
		width: 32%;
	}

	.width3 {
		width: 24%;
	}

	.align_c {
		text-align: center;
	}

	.align_r {
		text-align: right;
	}

	.align_c {
		text-align: center;
	}

	.align_l {
		text-align: left;
	}

	.menu {
		position: fixed;
		bottom: 3%;
		width: 182upx;
		height: 182upx;
		right: 0;
	}
</style>
