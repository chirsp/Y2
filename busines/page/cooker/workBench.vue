<template>
	<view>
		<!-- 菜品角色状态列表 -->
		<!-- <scroll-view scroll-x class="bg-white nav banner" scroll-with-animation :scroll-left="scrollLeft">
			<view class="cu-item" style="padding: 0 40upx;" :class="item.status==TabCur?'text-orange cur':''" v-for="(item,index) in dishStatus"
			 :key="index" @tap="tabSelect" :data-id="item.status">
				{{item.name}}
			</view>
		</scroll-view> -->

		<scroll-view scroll-x class="bg-white nav banner">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="item.status==TabCur?'text-orange cur _f32':'noselect'" v-for="(item,index) in tab"
				 :key="index" @tap="tabSelect" :data-id="item.status">
					{{item.name}}
				</view>
			</view>
		</scroll-view>
		
		<view class="space"></view>

		<block v-if="orderlist.length && TabCur==1 && work_status==1">
			<view class="list flex_row flex_ai flex_sb">
				<view class="title" :style="'width:'+item.width+';text-align:' + item.align" v-for="(item,index) in title" :key="index">
					{{item.name || ' '}}
				</view>
			</view>
			<view v-for="(item,index) in orderlist" :key='index' :hidden="item[0].make_status_type!=1?false:uid==item[0].deal_user_id ? false:true">
			<!-- <view v-for="(item,index) in orderlist" :key='index'> -->
				<view class="list flex_row flex_ai">
					<view class="width1 align_l">{{item[0].name || ''}}</view>
					<view class="title width3 align_l"> X {{item.length|| '' }}</view>
					<view class="title align_l">
						<text class="mCol" v-if="!item[0].make_status_type">等待{{Alldish[item[0].make_status] || ''}}</text>
						<text v-else style="color: #EE0000;">{{Alldish[item[0].make_status] || ''}}中</text>
					</view>
					<view class="title width4 align_r flex_row flex_ai">
						<text></text>
						<view class=" flex_row flex_ai">
							<view class="x-flex flex_row" v-if="item[0].is_num && item[0].make_status_type==1">
								<image @click="removeNums(index)" src="/static/remove.png" class="btn-icon"></image>
								<view class="sale-num align_l">{{numArry[index] || ''}} </view>
								<image @click="addNums(index,item[0].max_num)" src="/static/add.png" class="btn-icon"></image>
							</view>
							<text class="_cff finish mBg" @click="changeStatus(index,numArry[index],item)">
								{{item[0].make_status_type?'完成':Alldish[item[0].make_status]}}
							</text>
						</view>
					</view>
				</view>
			</view>
		</block>

		<block v-if="orderlist.length && TabCur==3">
			<view class="list flex_row flex_ai ">
				<view class="title flex_row flex_ai _flex_sb " :style="'width:'+item.width+';text-align:' + item.align" v-for="(item,index) in finishTitle"
				 :key="index">
					<text v-if="index==2"></text>
					<view class="flex_row flex_ai">
						<text>{{item.name || ''}}</text>
						<picker :range="dishStatus" range-key="name" @change="makeStatusChange">
							<image v-if="index==1" src="/static/typeSelect.png" class="selectIcon" @click="TypeSelect()" :class="typeSelect?'rotate':'rotate1'"></image>
						</picker>
					</view>

				</view>
			</view>
			<view class="" v-for="(item,index) in orderlist" :key='index'>
				<view class="list flex_row flex_ai">
					<view class="title  align_l" style="width: 45%;">{{item.content || ''}}</view>
					<view class="title  align_c mCol" style="width: 35%;">
						{{Alldish[item.make_status] || ''}}
					</view>
					<view class="title  flex_row _flex_sb" style="width: 20%;">
						<text></text>
						<text>{{item.create_time || ''}}</text>
					</view>
				</view>
			</view>
		</block>

		<x-nodata v-if='orderlist.length==0  || (TabCur==1 && work_status==2)' :msg="(TabCur==1 && work_status==2)?'今天已下班':'无订单数据'"></x-nodata>

		<!-- 返回共作台页面 -->
		<drag-button :isDock="true" :existTabBar="true" showImg="/busines/static/image/menu.jpg" @btnClick="backMenu" />

	</view>
</template>

<script>
	import xNodata from '../../../components/nodata.vue';
	import dragButton from "../../../components/drag-button.vue";
	export default {
		components: {
			xNodata,
			dragButton
		},
		data() {
			return {
				uid:uni.getStorageSync('kejia_order_uid'),
				Alldish: {},
				more:true,
				typeSelect: false,
				title: [{
						name: '菜名',
						width: '20%',
						align: 'left'
					},
					{
						name: '',
						width: '5%',
						align: 'left'	
					},				
					{
						name: '制作状态',
						width: '25%',
						align: 'left'
					},
					{
						name: '操作',
						width: '40%',
						align: 'right'
					},
				],
				finishTitle: [{
						name: '菜品',
						width: '45%',
						align: 'left'
					},
					{
						name: '制作环节',
						width: '35%',
						align: 'center'
					},
					{
						name: '完成时间',
						width: '20%',
						align: 'right'
					},
				],
				scrollLeft: 0,
				dishStatus: [],
				numArry: [],
				TabCur: 1,
				page: 1,
				load: false,
				orderlist: [],
				work_status: "",
				tab: [{
						name: "今日待办",
						status: "1"
					},
					{
						name: "今日已办",
						status: "3"
					},
				],
				newdishStatus: [],
				type: "",
			}
		},

		onLoad(e) {
			this.type = e.type;
			let userInfo = this.$store.state.userInfo;
			this.work_status = userInfo.worker.work_status;
			uni.setNavigationBarTitle({
				title: userInfo.worker.type_name + '工作台'
			});
			// this.getUserInfo()
		},
		// onReachBottom() {
		// 	if (this.load && !this.more) {
		// 		return
		// 	}
		// 	this.page++
		// 	this.getorder()
		// },
		onPullDownRefresh() {
			this.page = 1
			this.getorder()
		},
		onShow() {
			this.getdishStatus()
			this.getdishStatus2()
		},
		methods: {
			// getUserInfo() {
			// 	this.load = true
			// 	this.$api.ajax('smdc/user/userinfo', {
			// 		shop_id: this.$store.state.shopId
			// 	}, res => {
			// 		this.load = false
			// 		if (!res.data.id) {
			// 			var _this = this
			// 			this.$api.toast("登录过期，请重新登录")
			// 			setTimeout(function() {
			// 				// #ifdef MP-WEIXIN
			// 				_this.$api.openWin("/pages/login/login")
			// 				// #endif

			// 				// #ifndef MP-WEIXIN
			// 				_this.$api.openWin("/pages/login/login1")
			// 				// #endif

			// 			}, 1000)
			// 			return
			// 		}
			// 		this.work_status = res.data.worker.work_status
			// 		this.orderlist.length = 0
			// 		this.$api.setStorage("kejia_order_userInfo", res.data)
			// 		uni.setNavigationBarTitle({
			// 			title: res.data.worker.type_name + '工作台'
			// 		})
			// 	})

			// },
			// 查看订单详情
			lookDetail(index) {
				this.orderlist[index][0].select = !this.orderlist[index][0].select
			},

			// 返回共作台
			backMenu() {
				this.$api.openWin('/pages/personal-center/personal-center')
			},

			getdishStatus2() {
				let _this = this;
				_this.$api.ajax('smdc/food_process/processLists', {
					shop_id: _this.$store.state.shopId,
				}, function(ret) {
					_this.newdishStatus = ret.data;
				})
			},

			// 获取菜品状态列表
			getdishStatus() {
				let _this = this;
				_this.$api.ajax('smdc/food_process/FoodProcessList', {
					shop_id: _this.$store.state.shopId,
				}, function(ret) {
					_this.Alldish = ret.data
					// 匹配当前员工拥有的角色
					_this.dishStatus = []
					let process = uni.getStorageSync('kejia_order_userInfo').worker?uni.getStorageSync('kejia_order_userInfo').worker.process:'';
					process.forEach(function(item) {
						for (let i in ret.data) {
							let obj = {}
							if (i == item) {
								obj.status = i
								obj.name = ret.data[i]
								_this.dishStatus.push(obj)
							}
						}
					})
					_this.getorder()
				}, 'POST')
			},

			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.page = 1
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
				this.orderlist.length = 0
				this.getorder()
			},

			TypeSelect() {
				this.typeSelect != this.typeSelect
			},

			// 选择处理菜品类型
			makeStatusChange(e) {
				let make_status = this.dishStatus[e.detail.value].status
				this.getorder(make_status)
			},

			// 今日代办/已办订单
			getorder(status) {
				let _this = this;
				if (status) {
					var make_status = status
				} else {
					let process = uni.getStorageSync('kejia_order_userInfo').worker.process
					var make_status = process.join(',')
				}
				var data = {
					shop_id: _this.$store.state.shopId,
					make_status: make_status,
					// page: _this.page, 	
				}
				if (_this.TabCur == 3) {
					var url = 'smdc/Worker/workload'
					data['type'] = _this.type
				} else {
					var url = 'smdc/order/cookererOrder'
				}
				_this.$api.ajax(url, data, function(ret) {
					setTimeout(function() {
						uni.stopPullDownRefresh()
					}, 2000);
					// console.log('orderList',ret.data)
					if(ret.data.length == 0){
						_this.more = false
						_this.page--
						_this.orderlist = ret.data;
						return
					}
					if (_this.page == 1) {
						_this.orderlist = ret.data;
					} else {
						_this.orderlist = _this.orderlist.concat(ret.data);
					}
					_this.numArry = [];
					_this.orderlist.map(item => {
						_this.numArry.push(item.length)
						if (_this.TabCur == 3) {
							let arr = item.create_time.split(' ')
							item.create_time = arr[1]
						}else{
							_this.newdishStatus.map(x => {
								if (x.id == item[0].make_status) {
									item[0].is_num = x.is_num
								}
							})
						}
					})
				}, 'POST',true)
			},

			// 增减菜品份数
			addNums(index,max_num) {
				// console.log(2*max_num)
				if(this.numArry[index] == 2*max_num){
					this.$api.toast('制作份数超出限制')
					return
				}
				this.numArry[index] = this.numArry[index] + 1
				this.$set(this.numArry, index, this.numArry[index])
			},

			removeNums(index) {
				let num = this.numArry[index]
				if (num == 1) {
					return
				} else {
					this.numArry[index]--
					this.$set(this.numArry, index, this.numArry[index])
				}
			},

			// 修改菜品制作状态
			changeStatus(index, makeNum=1,item) {
				let type = this.orderlist[index][0].make_status_type
				this.$api.toast(toString(index), makeNum)
				if (type == 0) {
					this.makeDish(index)
				} else {
					this.editstatus(index, makeNum)
				}
			},

			// 处理菜品
			makeDish(index) {
				let _this = this
				let id = []
				_this.orderlist[index].forEach(function(x) {
					id.push(x.id)
				})
				_this.$api.ajax('smdc/Sale_food/toUpdateMakeStatusType', {
					shop_id: _this.$store.state.shopId,
					id: id.join(','),
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
						_this.$api.toast("操作成功~")
						_this.getorder()
					}
					
				}, 'POST',true)
			},

			// 完成菜品制作
			editstatus(index, makeNum=1) {
				// num:菜品需要制作份数,makeNum:厨师实际制作份数
				let _this = this;
				let num = _this.orderlist[index].length
				var ids = []
				if (num == makeNum) {
					// 全做
					_this.orderlist[index].forEach(function(x) {
						ids.push(x.id)
					})
					var data = {
						shop_id: _this.$store.state.shopId,
						make_status: _this.orderlist[index][0].make_status,
						id: ids.join(','),
					}
				} else if (num > makeNum) {
					// 少做
					var overids = []
					for (let i = 0; i < _this.orderlist[index].length; i++) {
						if (i < makeNum) {
							ids.push(_this.orderlist[index][i].id)
						} else {
							overids.push(_this.orderlist[index][i].id)
						}
					}
					var data = {
						shop_id: _this.$store.state.shopId,
						make_status: _this.orderlist[index][0].make_status,
						id: ids.join(','),
						sale_food_id: overids.join(','),
					}
				} else if (num < makeNum) {
					// 多做
					_this.orderlist[index].forEach(function(x) {
						ids.push(x.id)
					})
					var overnum = makeNum - num
					var data = {
						shop_id: _this.$store.state.shopId,
						make_status: _this.orderlist[index][0].make_status,
						id: ids.join(','),
						food_id: _this.orderlist[index][0].food_id,
						num: overnum
					}
				}
				_this.$api.ajax('smdc/Sale_food/toUpdateMakeStatus', data, function(ret) {
					if(ret.status==0){
						uni.showModal({
						  title: '系统提示',
						  content: ret.msg,
						  success (res) {
						    if (res.confirm) {
						      _this.getorder()
						    }else if (res.cancel){
							  _this.getorder()
							}
						  }
						})
					}else{
						_this.$api.toast('操作成功')
						_this.getorder()
					}
					
				}, 'POST',true)
			},

		}
	}
</script>

<style lang="less">
	.noselect {
		border-bottom: 4upx solid #FFFFFF;
	}

	._flex_sb {
		justify-content: space-between;
	}

	.btn-icon {
		width: 44upx;
		height: 44upx;
	}

	.sale-num {
		width: 50upx;
		text-align: center;
	}

	.banner {
		position: fixed;
		top: 0;
		width: 100%;
	}

	.space {
		height: 100upx;
	}

	.finish {
		border-radius: 10upx;
		padding: 15upx 25upx;
		margin-left: 50upx;
		width: 88upx;
		text-align: center;
	}

	.detail {
		padding: 20upx 30upx;
		border-bottom: 1upx solid #EEEEEE;
	}

	.list {
		background-color: #FFFFFF;
		padding: 20upx 30upx;
		border-bottom: 1upx solid #EEEEEE;
	}

	.title {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.width1 {
		width: 24%;
	}

	.width2 {
		width: 22%;
	}

	.width3 {
		width: 10%;
		// flex: 1;
	}

	.width4 {
		justify-content: space-between;
		flex: 1
	}

	.menu {
		position: fixed;
		bottom: 3%;
		width: 182upx;
		height: 182upx;
		right: 0;
	}

	// 弹窗样式
	.submitBox {
		padding: 30upx 0;
		border-top: 1upx solid #EEEEEE;

		.sure {
			border-right: 1upx solid #EEEEEE;
		}
	}

	.submitBox view {
		width: 50%;
	}

	.flex_row {
		display: flex;
		flex-direction: row;
	}

	._f30 {
		font-size: 30upx;
	}

	._c22 {
		color: #222;
	}

	.flex_sb {
		justify-content: center;
	}

	._f34 {
		font-size: 34upx;
	}

	._flex-center {
		justify-content: center;
	}

	.selectIcon {
		width: 27upx;
		height: 27upx;
		margin-left: 10upx;
		margin-top: 10upx;
	}

	.rotate {

		transform-origin: center center; //旋转中心要是正中间 才行

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

	.rotate1 {

		transform-origin: center center;

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
</style>
