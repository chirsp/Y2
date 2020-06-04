<template>
	<view class="mar-b16">

		<view class="bg-white nav">
			<view class="flex text-center flex_ai">
				<picker :range="msgType" range-key="name" @change="msgTypeSelect">
					<view class="type flex_ai flex_row">
						<text class="f34 _fw">{{msgType[typeIndex].name}}</text>
						<image src="../../../static/typeSelect.png" class="selectIcon"></image>
					</view>
				</picker>
				<view class="cu-item flex-sub" :class="index==TabCur?'text-orange cur':''" v-for="(item,index) in Tab" :key="index"
				 @click="tabSelect(index)">
					{{item}}
				</view>
			</view>
		</view>
		<view style="height: 100upx;"></view>

		<view class="top flex_col _f30" v-for="(item,index) in list" :key="index" @click="readInfo(index,item.id)" :hidden="item.deal_user_id != uid && TabCur==1">
			<view class="notice_box">
				<view class="mar-b16 flex_row flex_ai">
					<text class='_f40 _fw red' v-if="item.status==0">· </text>
					<text class="_c22">{{item.content}}</text>
				</view>
				<view class="_c66 _f26 flex_row flex_sb flex_ai">
					<text>{{item.create_time}}</text>
					<text v-if="item.status==0" class="ding_icon mBg _cff _f26">立即处理</text>
					<!-- <image src="../../static/image/Ding.png" class="ding_icon" ></image> -->
				</view>
			</view>
			<image src="../../static/image/dealFinish.png" class="dealFinish" v-if="item.status==1"></image>
		</view>


		<showmodal :modal='Modal' :msg="'确认处理本条消息：'+ list[selectindex].content" @sure='sure' @hide='hide' v-if="Modal"></showmodal>
		<nodata msg="无消息通知" v-if="list&&list.length==0"></nodata>
	</view>
</template>

<script>
	import nodata from '../../../components/nodata.vue'
	import showmodal from '../../../components/showmodal.vue'
	export default {
		components: {
			nodata,
			showmodal
		},
		data() {
			return {
				list: null,
				page: 1,
				load: false,
				Tab: ['未读', '已读'],
				msgType: [
					// {type:-1,name:"全部"},
					// {type:1,name:"上菜"},
					// {type:2,name:"退菜"},
					// {type:3,name:"库存预警"},
					{
						type: 4,
						name: "呼叫"
					},
				],
				receipt_type: 1,
				typeIndex: 0,
				TabCur: 0,
				scrollLeft: 0,
				Modal: false,
				selectindex: 0,
				id: '',
				more: true,
				uid: uni.getStorageSync('kejia_order_uid'),
			}
		},
		onShow() {
			this.getlist()
		},
		onPullDownRefresh() {
			if (this.load) {
				return
			}
			this.page = 1
			this.getlist()
		},
		onReachBottom() {
			if (this.more == false) {
				this.getlist()
			}
			if (this.load || this.more == false) {
				return
			}
			this.page++
			this.getlist()
		},
		methods: {
			//选择消息类型
			msgTypeSelect(e) {
				this.typeIndex = e.detail.value
				if (this.typeIndex == 3) {
					this.receipt_type = 0
				} else {
					this.receipt_type = 1
				}
				this.page = 1
				this.getlist()
			},

			// 选择导航
			tabSelect(index) {
				this.TabCur = index;
				this.scrollLeft = (index - 1) * 60
				this.page = 1
				this.getlist()
			},

			// 获取消息列表
			getlist() {
				var that = this
				that.load = true
				this.$api.ajax('smdc/message/messageList', {
					shop_id: that.$store.state.shopId,
					page: that.page,
					receipt_type: that.receipt_type,
					status: that.TabCur,
					limit: 10,
					type: that.msgType[that.typeIndex].type
				}, res => {
					that.load = false
					setTimeout(function() {
						uni.stopPullDownRefresh()
					}, 2000)
					if (that.page == 1) {
						that.list = res.data
					} else if (that.more == false) {
						let listArry = that.list
						let a = res.data.length
						let b = (that.page - 1) * 10
						let c = listArry.length - b
						res.data.map(item => {
							listArry.splice(b, c, item)
							b++
							c++
						})
						// console.log('下拉刷新数据:',listArry)
					} else {
						that.list = that.list.concat(res.data)
					}
					if (res.data.length == 0 || res.data.length < 10) {
						console.log(4444)
						that.more = false
					}
				}, "POST", true)
			},

			// 确认处理消息通知弹窗操作
			sure(e) {
				var that = this
				that.Modal = false
				if (e) {
					this.$api.ajax('smdc/message/updateMessageStatus', {
						shop_id: that.$store.state.shopId,
						id: that.id,
						status: 1,
					}, ret => {
						if (ret.status == 0) {
							uni.showModal({
								title: '系统提示',
								content: ret.msg,
								success(res) {
									if (res.confirm) {
										that.list.splice(that.selectindex, 1)
									} else if (res.cancel) {
										that.list.splice(that.selectindex, 1)
									}
								}
							})
						} else {
							that.list.splice(that.selectindex, 1)
						}

					})
				}
			},
			hide(e) {
				this.Modal = false
			},

			// 已读消息
			readInfo(index, id) {
				if (this.list[index].status == 1) {
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
	.type {
		margin: 0 20upx;
		border-right: 1upx solid #EEEEEE;

		.selectIcon {
			width: 24upx;
			height: 27upx;
			margin: 0 15upx;
		}
	}

	.ding_icon {
		padding: 10upx 20upx;
		border-radius: 10upx;
	}

	.notice_box {
		position: relative;
	}

	.dealFinish {
		width: 100upx;
		height: 70upx;
		position: absolute;
		z-index: 3;
		right: 0;
		margin-right: 58upx;
	}

	.top {
		background: rgba(255, 255, 255, 1);
		box-shadow: 0upx 3upx 6upx rgba(0, 0, 0, 0.1);
		opacity: 1;
		border-radius: 20upx;
		margin: 32upx 32upx 0 32upx;
		padding: 32upx;
	}

	.mar-b16 {
		margin-bottom: 16upx;
	}

	.red {
		color: red;
	}

	.nav {
		width: 100%;
		position: fixed;
		top: 0;
		z-index: 4;
	}
</style>
