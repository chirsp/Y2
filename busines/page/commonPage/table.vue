<template>
	<view>
		<view class="banner flex_row">
			<view class="left" :class="status==0 || status==2 ?'mBg _cff':'mCol'" @click="changeStatus(0,2)">{{userType==4?'可清洁':'可使用'}}</view>
			<view class="right" :class="status==-1?'mBg _cff':'mCol'" @click="changeStatus(-1)">全部餐桌</view>
		</view>


		<view class="tip flex_row ">
			<view class="tipname flex_ai flex_row" v-for="(item,index) in tipList" :key="index" @click="changeStatus(item.status)">
				<text class="point" :class="item.status==2?'mBg':item.status==0?'bcol1':item.status==1?'bcol2':'bcol3'"></text>
				<text class="_f26 _c66">{{item.name}}</text>
			</view>
		</view>

		<!-- 服务员和店长查看的可使用餐桌列表 -->
		<!-- <view class="tablist bg-white flex_row" v-if="status === 0 && userType !=4">
			<view class="box1 _flex-center  bor-bt" :class="(index+1)%2?'bor-r':''" v-for="(item,index) in tablist" :key="index"
			 @click="lookTable(index)">
				<view class="name">
					<text class="_f32 _c33">{{item.no}}号桌</text>
				</view>
				<view class="status _c66">
					{{item.seating_num}}人桌
				</view>
			</view>
		</view> -->

		<!-- 清洁员工查看全部/可使用餐桌列表,服务员和店长查看的全部餐桌列表-->
		<view class="tablist flex_row mar30">
			<view class="box _flex-center _cff" v-for="(item,index) in tablist" :key="index" @click="lookTable(index)"
			 :class="item.status==2?'mBg':item.status==0?'bcol1':item.status==1?'bcol2':'bcol3'">
				<view class="name">
					<text class="_f32">{{item.no}}号桌</text>
					<text class="_f28">({{item.seating_num}}人桌)</text>
				</view>
				<view class="status">
					{{item.status==0?'空闲':item.status==1?'使用中':item.status==2?'待清洁':item.status==3?'清洁中':''}}
				</view>
			</view>
		</view>

		<nodata v-if="tablist.length==0" msg="暂无数据"></nodata>

		<!-- 空闲/清洁中的餐桌操作弹窗 -->
		<view class="cu-modal " :class="isclear?'show':''">
			<view class="cu-dialog" style="width: 70%;">
				<view class="cu-bar bg-white justify-end">
					<view class="content"></view>
					<view class="action" @tap="isclear=false">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>

				<view class=" _flex-center modalInfo bg-white">
					<view class="tableNum _flex-center mBg _cff">
						{{tableno}}
					</view>
					<view class="edit">
						请选择操作?
					</view>
					<view class="clearbtn mBg _cff _f32" @click="updataTable(selectStatus)">
						{{selectStatus==1?'离桌':selectStatus==2?'立即清洁':selectStatus==3?'已清洁':'入桌'}}
					</view>
					<view class="clearbtn mbor mCol _f32" @click="isclear=false">
						取消
					</view>
				</view>
			</view>
		</view>

		<!-- 使用中的餐桌详情 -->
	<!-- 	<view class="cu-modal bottom-modal" :class="isUse?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action mCol">退菜</view>
					<view class="action _c66" @tap="isUse=false">取消</view>
				</view>
				<scroll-view scroll-y="true" class="scrollBox">
					<view class="padding-food">
						<view class="foodlist flex_row flex_sb" v-for="(item,x) in foodlist" :key="x">
							<view class="left">
								<label class="radio">
									<radio :checked="item.check" style="transform:scale(0.7);" @click="selectFood(x)" /><text></text>
								</label>
								<text>红烧牛肉面</text>
							</view>
							<view class="right flex_row flex_ai">
								<text class="_f22 mar-left10 _c22">已上菜</text>
								<view class="">
									<text class="_f24">￥</text>
									<text class="money">22.9</text>
								</view>
								<view class="x-flex">
									<image @click="removeNums(index)"  src="/static/remove.png" class="btn-icon"></image>
									<view  class="sale-num">{{ item.num|| '10' }}</view>
									<image @click="addNums(index)" src="/static/add.png" class="btn-icon"></image>
									
								</view>
							</view>
						</view>
					</view>
					<view class="space"></view>
					<view class="leave bg-white flex_row">
						<view class="left flex_row flex_ai flex_sb _flex-1">
							<label class="radio">
								<radio value="" style="transform: scale(0.7);" /><text>全选</text>
							</label>
							<text class="_fw _f36 mCol">￥20</text>
						</view>
						<view class="right _flex-center mBg _cff f34 _fw ">
							客人已离桌
						</view>
					</view>

				</scroll-view>
			</view>
		</view> -->

	</view>
</template>

<script>
	import nodata from '../../../components/nodata.vue'
	export default {
		components: {
			nodata
		},
		data() {
			return {
				status: 0, //餐桌选择 0空闲 1使用中 2待清洁 3清洁中 -1:全部餐桌
				tableno:'',
				tipList: [{
						name: '待清洁',
						status: 2
					},
					{
						name: '空闲',
						status: 0
					},
					{
						name: '使用中',
						status: 1
					},
					{
						name: '清洁中',
						status: 3
					},
				],
				tablist: [],
				isclear: false,
				isUse: false, //唤起使用中的餐桌详情
				id:'',//桌子id
				selectIndex:null,// 选中的桌子索引
				selectStatus:null,
				foodlist: [{
					check: false
				}, {
					check: false
				}, {
					check: false
				}, ],
				userType:''

			}
		},
		onShow() {
			this.getTable()
		},
		onLoad(e) {
			// 1厨师 2员工  0普通  3店长 4清洁员 
			if(e.userType ){
				this.userType = parseInt(e.userType)
				console.log(this.userType)
				if(this.userType ==4){
					this.status=2
				} else{
					this.status=0
				}
				
			}
			
			
			
		},
		methods: {
			changeStatus(status,type) {
				if(type==2 && this.userType==4){
					this.status = 2
				}else{
					this.status = status
				}
				this.getTable()
			},

			getTable() {
				var that = this
				this.$api.ajax('smdc/desk/getDeskList', {
					status: that.status,
					shop_id: that.$store.state.shopId
				}, res => {
					that.isclear = false
					that.tablist = res.data
				})
			},

			// 操作餐桌状态
			lookTable(index){
				this.id = this.tablist[index].id
				this.selectIndex = index
				this.tableno = this.tablist[this.selectIndex].no
				this.selectStatus = this.tablist[index].status
				if(this.userType == 3 &&  this.selectStatus !=0){
					this.isclear = true
				}else if (this.selectStatus >1 && this.userType==4) {
					this.isclear = true
				}else if (this.selectStatus ==1 && this.userType==2) {
					this.isclear = true
				} else{
					// this.$api.toast('无操作权限~')
					return 
				}
				

			},
			//选中菜品退菜
			selectFood(index) {
				this.foodlist[index].check = !this.foodlist[index].check
			},
			
			//修改桌子状态
			updataTable(status) {
				if(status==3){
					var status = 0
				}else{
					var status = status+1
				}
				this.changeTable(status)
			},
			
			changeTable(status){
				var that = this
				this.$api.ajax('smdc/desk/toUpdateDesk', {
					status: status,
					shop_id: that.$store.state.shopId,
					id:that.id
				}, res => {
					that.getTable()
				})
			},
		}
	}
</script>

<style lang="less">
	.mar-left10{
		margin-left: 10upx;
	}
	.scrollBox {
		max-height: 500upx;

		.padding-food {
			padding: 30upx;
		}

		.space {
			height: 80upx;
		}

		.leave {
			position: fixed;
			bottom: 0;
			width: 100%;
			height: 80upx;
			text-align: center;

			.left {
				margin: 0 20upx;
			}

			.right {
				width: 40%;
			}
		}

		.foodlist {
			margin-bottom: 20upx;

			.left {
				flex: 1;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				margin-left: 20upx;
				text-align: left;
			}

			.right {
				color: #FC6840;

				.money {
					margin-right: 20upx;
				}
			}
		}
	}

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

	.mar30 {
		margin: 0upx 30upx 30upx 30upx;
	}

	.tablist {
		flex-wrap: wrap;
		justify-content: space-between;

		.bor-bt {
			border-bottom: 1upx solid #EEEEEE;
		}

		.bor-r {
			border-right: 1upx solid #EEEEEE;
		}

		.box1 {
			width: 50%;
		}

		.box {
			width: 340upx;
			opacity: 1;
			border-radius: 10upx;
			margin-bottom: 10upx;
		}

		.name {
			margin: 41upx 0 20upx 0;
		}

		.status {
			margin-bottom: 25upx;
		}
	}

	.tip {
		justify-content: center;
		margin-bottom: 30upx;

		.tipname {
			margin-right: 34upx;

			.point {
				width: 22upx;
				height: 22upx;
				border-radius: 50%;
				opacity: 1;
				margin-right: 15upx;
			}
		}
	}

	.banner {
		justify-content: center;
		margin: 30upx 0;

		.left {
			border-radius: 10upx 0upx 0upx 10upx;
		}

		.right {
			border-radius: 0upx 10upx 10upx 0upx;
		}
	}

	.banner view {
		width: 200upx;
		border: 1upx solid rgba(254, 176, 38, 1);
		opacity: 1;
		text-align: center;
		padding: 16upx 0;
	}

	.bcol1 {
		background-color: #6CAA9F;
	}

	.bcol2 {
		background-color: #FF7654;
	}

	.bcol3 {
		background-color: #606DCC;
	}

	.btn-icon {
		width: 44upx;
		height: 44upx;
	}

	.sale-num {
		width: 50upx;
		text-align: center;
	}
</style>
