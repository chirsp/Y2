<template>
	<view class="" @click="phoneShow=false">
		<view class="contentBox">
			<view class="flex_col">
				<text class="_f30">姓名</text>
				<view class="bor-bt info">
					<input type="text" value="" v-model="username" placeholder="请输入员工真实姓名" />
				</view>
			</view>
			<view class="flex_col">
				<text class="_f30">联系电话</text>
				<view class="bor-bt info">
					<input type="number" value="" v-model="phone" @input="getPhone" maxlength="11" placeholder="请输入员工联系电话" />
					<block v-if="phoneShow">
						<scroll-view scroll-y="true" class="phonebox">
							<view class="phonelist bg-e _c99 _f26" :class="index?'bor-t':''" v-for="(item,index) in phoneList" :key='index'
							 @click.stop="selectPhone(item.mobile,item.id)">
								{{item.mobile}}
							</view>
						</scroll-view>

					</block>
				</view>
			</view>

			<view class="flex_col">
				<text class="_f30">性别</text>
				<view class="info flex_row">
					<view v-for="(x,index) in sexList" :key="index" @click="selectSex(index)" class="sex pad-50 _flex-center" :class="sexIndex==index?'mBg _cff':'_c66 bor-e'">{{x}}</view>
				</view>
			</view>
			<view class="flex_col">
				<text class="_f30">职位</text>
				<view class="info flex_col ">
					<view class="flex_row">
						<view class="sex pad-20 flex_row bor-e flex_ai" @click="selectStatus()">
							<view :class="type_name?'_c22':'_c99'">{{type_name || '请选择'}}</view>
							<image src="../../static/image/selectdown.png" class="selectIcon" :class="Wstatus?'rotate':'rotate1'"></image>
						</view>
					</view>
					<view class="workStatus flex_col" v-if="Wstatus">
						<text v-for="(item,index) in roleList" class="name" :class="index?'border-top':''"
						 :key="index" @click="selectWork(index)">{{item.type_name}}</text>
					</view>
				</view>
			</view>
		</view>

		<view v-if="id" class="editbox flex_sa flex_row flex_ai">
			<text class="mbor mCol" @click="delman()">删除</text>
			<text class="_cff mBg" @click="saveinfo()">编辑保存</text>
		</view>
		<view class="save flex_center _cff mBg _f30" v-else @click="saveinfo()">
			保存
		</view>


		<showmodal :modal='delModal' msg='是否删除该员工' @sure='sure' @hide='hide' v-if="delModal"></showmodal>

	</view>
</template>

<script>
	import showmodal from '../../../components/showmodal.vue'
	export default {
		data() {
			return {
				id: '',
				sexList: ['女', '男'],
				sexIndex: 0,
				Wstatus: false, //选择职位弹窗
				roleList: [],
				WIndex: null,
				type_name: '',
				username: "",
				phone: '',
				phoneList: [],
				phoneShow: false,
				delModal: false,
				uid: "",

			}
		},
		components: {
			showmodal
		},
		onLoad(e) {
			this.getPhoneList()
			this.roleList = JSON.parse(e.roleList);
			this.WIndex = e.WIndex
			if (JSON.parse(e.list).id) {
				let list = JSON.parse(e.list)
				this.id = list.id
				this.phone = list.phone
				this.type_name = list.type_name
				this.username = list.username
				this.sexIndex = parseInt(list.sex)
			}
			
		},
		methods: {
			// 选择性别
			selectSex(index) {
				this.sexIndex = index
			},

			// 验证员工手机号
			getPhone(e) {
				let that = this
				that.uid = ''
				let phone = that.$api.isEmpty(e.detail.value)
				if (!phone) {
					that.phone = e.detail.value
					that.phoneShow = true
					that.getPhoneList()
				} else {
					this.phoneShow = false
				}
			},
			
			getPhoneList(){
				var that = this
				that.$api.ajax('smdc/user/userList', {
					phone: that.phone,
					shop_id: that.$store.state.shopId,
				}, res => {
					that.phoneList = res.data
				})
			},
			selectPhone(phone, id) {
				this.phone = phone
				this.uid = id
				this.phoneShow = false
			},

			// 选择职位
			selectStatus() {
				this.Wstatus = !this.Wstatus
			},
			selectWork(index) {
				this.type_name = this.roleList[index].type_name
				this.WIndex = index
				this.Wstatus = false
			},

			// 删除员工
			delman() {
				this.delModal = true
			},
			// 取消删除弹窗
			hide(e) {
				this.delModal = false
			},
			// 确认删除员工
			sure() {
				let that = this
				that.$api.ajax('smdc/worker/toDeleteWorker', {
					shop_id: that.$store.state.shopId,
					id: that.id
				}, res => {
					that.$api.toast('删除成功~')
					that.delModal = false
					let pages = getCurrentPages(); //获取所有页面栈实例列表
					let prevPage = pages[pages.length - 2]; //上一页页面实例
					// prevPage.$vm.role_type = that.roleList[that.WIndex].id; //修改上一页data里面的searchVal参数值为1211
					prevPage.$vm.current = that.WIndex
					setTimeout(function() {
						uni.navigateBack(-1)
					}, 2000)
				}, "POST", true)
			},

			// 添加新员工
			saveinfo() {
				let that = this
				if (!that.username) {
					that.$api.toast("请输入员工真实姓名")
					return
				}
				if (that.sexIndex<0) {
					that.$api.toast("请选择员工性别")
					return
				}
				if (!that.phone) {
					that.$api.toast("请输入选择员工联系电话")
					return
				}else if(!that.uid){
					that.phoneList.map(item=>{
						if(item.mobile == that.phone){
							that.uid = item.id
						}
					})
				}
				
				if (that.WIndex==null) {
					that.$api.toast("请选择员工角色")
					return
				}
				if (that.id) {
					var url = 'smdc/worker/toUpdateWorker'
				} else {
					var url = 'smdc/worker/toAddWorker'
				}
				
				that.$api.ajax(url, {
					shop_id: that.$store.state.shopId,
					phone: that.phone,
					type: that.roleList[that.WIndex].id,
					username: that.username,
					sex: that.sexIndex,
					id: that.id,
					uid: that.uid
				}, res => {
					setTimeout(function(){
						that.$api.toast('操作成功~')
							},300)
					setTimeout(function() {
						uni.navigateBack()
					}, 2000)
				}, "POST", true, true)
			},

		},
	}
</script>

<style lang="less">
	.save {
		opacity: 1;
		border-radius: 20upx;
		width: 80%;
		margin: 60upx auto;
		padding: 20upx 0;
		text-align: center;
		white-space: 22upx;
	}

	.editbox {
		margin: 60upx auto;
	}

	.editbox text {
		opacity: 1;
		border-radius: 20upx;
		width: 45%;
		padding: 20upx 0;
		text-align: center;
		white-space: 22upx;
	}

	.phonebox {
		max-height: 500upx;
	}

	.phonelist {
		padding: 20upx 0;
	}

	.contentBox {
		margin: 24upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0upx 3upx 6upx rgba(0, 0, 0, 0.1);
		opacity: 1;
		border-radius: 20upx;
		padding: 60upx 42upx;

		.info {
			margin-bottom: 40upx;
			padding: 23upx 0;

			.pad-20 {
				padding: 0 20upx;
			}

			.pad-50 {
				padding: 0 50upx;
			}

			.sex {
				opacity: 1;
				border-radius: 178upx;
				height: 72upx;
				margin-right: 20upx;
				justify-content: center;

				.selectIcon {
					width: 30upx;
					height: 16upx;
					margin-left: 18upx;
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
			}

			.bor-e {
				border: 1upx solid #EEEEEE;
			}

			.workStatus {
				background-color: #FFFFFF;
				color: #666666;
				font-size: 28upx;
				box-shadow: 0upx 3upx 6upx rgba(0, 0, 0, 0.1);
				opacity: 1;
				border-radius: 20upx;
				margin-top: 20upx;
				padding: 0 30upx;
				width: 40%;
				.name {
					padding: 14upx 0;
					text-align: center;
				}

				.border-top {
					border-top: 1upx solid #EEEEEE;
				}
			}
		}

		.bor-bt {
			border-bottom: 1upx solid #EEEEEE;
		}

		.bor-t {
			border-top: 1upx solid #FFFFFF;
		}

		.bg-e {
			background-color: #EEEEEE;
		}

		.info input {
			flex: 1;
			border: none;
			font-size: 28upx;
		}
	}
</style>
