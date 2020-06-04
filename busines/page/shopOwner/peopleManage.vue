<template>
	<view>
		<!-- 顶部搜索 start -->
		<view class="cu-bar search bg-white mBg top">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" value=""  @confirm="serachKey" confirm-type="search" placeholder="请输入员工姓名" />
			</view>
		</view>
        <view class="box"> </view>

		<!-- 员工列表 -->
		<view class="x-flex ">
			<view class="left">
				<scroll-view scroll-y :style="{'height': scroll_h+'px'}">
					<block v-for="(item,index) in roleList" :key="index">
						<view :class="{'active':current==index}" class="pad-10" @click="changeCurrent(index)">{{item.type_name}}</view>
					</block>
				</scroll-view>
			</view>
			
			<view class="right">
				<scroll-view scroll-y :style="{'height': scroll_h+'px'}" >
					<view class="list flex_row flex_sb _f28 bor-b flex_ai"
					 v-for="(item,index) in values" :key="index"  @click="addpeople(index)">
						<view class="username">{{item.username}}</view>
						<view class="mCol">{{item.phone}}</view>
						<view class="">{{item.sex=='1'?'男':'女'}}</view>
						<view :class="item.work_status==1?'mCol':'_c99 '" @click.stop="changeStatus(index,'work')">{{item.work_status==1?'上班':item.work_status==2?'下班':item.work_status==3?'调休':'未入职'}}</view>
                        <image src="../../../static/newimg/edit.png" class="editIcon"></image>
					</view>
					<nodata msg='该分类下暂无员工~' v-if="values.length==0"></nodata>
					<view class="space"></view>
				</scroll-view>
			</view>
		</view>


		<!-- 改变员工角色 -->
		<view class="cu-modal bottom-modal" :class="isUse && type=='role'?'show':''" @tap="isUse=false">
			<view class="cu-dialog bg-white">
				<scroll-view scroll-y="true" class="scrollBox bg-white">
					<view class="content">
						<view class="list flex_row flex_sb _f30">
							<view class="">调整 <text class="mCol mar-10">{{selectname}}</text> 的工作安排</view>
						</view>
						<view class="list flex_row flex_sb _f30 bor-t" v-for="(item,index) in roleList" :key="index" @click="changerole(index,'role')">
							<view class="">{{item.type_name}}</view>
						</view>
					</view>
				</scroll-view>
				<!-- <view class="cancel _flex-center">
							取消
						</view> -->
			</view>
		</view>

		<!-- 改变员工工作状态 -->
		<view class="cu-modal bottom-modal" :class="isUse && type=='work'?'show':''" @tap="isUse=false">
			<view class="cu-dialog bg-white">
				<scroll-view scroll-y="true" class="scrollBox bg-white">
					<view class="content">
						<view class="list flex_row flex_sb _f30 ">
							<view class="">调整 <text class="mCol mar-10">{{selectname}}</text> 的工作状态</view>
						</view>
						<view class="list flex_row flex_sb _f30 bor-t" v-for="(item,index) in workStatus" :key="index" @click="changerole(index,'work')">
							<view class="">{{item.name}}</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		
		<drag-button
		        :isDock="true"
		        :existTabBar="true"
				showImg="/static/addpeople.png"
		        @btnClick="addpeople()" />
	</view>
</template>

<script>
	import nodata from '../../../components/nodata.vue';
	import dragButton from '../../../components/drag-button.vue';
	export default {
		data() {
			return {
				page: 1,
				limit: 10,
				load: false,
				roleList: [],
				values: [],
				isUse: false, //唤起改变员工状态弹窗
				index: null, //点击修改的员工index
				type: '', //role--修改员工角色/work--修改员工工作状态
				role_type:"",
				selectname:"",
				key: "",
				workStatus: [{
						name: '工作',
						status: '1'
					},
					{
						name: '下班',
						status: '2'
					},
				],
				scroll_h: 0, //scrollview高度
				current: 0, //当前选中的分类
			}
		},
		components: {
			nodata,dragButton
		},
		onReachBottom() {
			if (this.load) {
				return
			}
			this.page++
			this.getWorker()
		},
		onShow() {
			this.getScrollHeight(); //获取scrollview高度
			this.getRole()
		},
		onLoad(){
			this.getWorker();
			console.log(this.values.length)
		},
		methods: {
			// 添加人员页面跳转
			addpeople(index){
				this.$api.openWin('/busines/page/shopOwner/addpeople?list=' 
				+ JSON.stringify(this.values[index]) +'&roleList=' + JSON.stringify(this.roleList)+ '&WIndex=' +this.current)
			},
			
			getScrollHeight() {
				let sys = uni.getSystemInfoSync();
				let frmHeight = sys.windowHeight;
				let frmWidth = sys.windowWidth;
				let div_h = 100 + 100 + 100;
				let other_h = (div_h / 2) * (frmWidth / 375);
				this.scroll_h = frmHeight;
			},
			//改变分类
			changeCurrent(index) {
				this.current = index;
				this.role_type = this.roleList[index].id
				this.key = ''
				this.getWorker();
			},
			// 搜索员工
			serachKey(e) {
			   let key = this.$api.isEmpty(e.detail.value)
			   if(!key){
				   this.key = e.detail.value
			   }
			   key ? this.$api.toast('无效输入')  : this.getWorker();
			},

			// 修改员工状态
			changeStatus(index, type) {
				let that = this
				if (!that.values[index].work_status) {
					that.$api.toast('该员工暂未入职,无法安排工作')
					return
				}
				that.type = type
				that.$api.ajax('smdc/worker/workType', {
					shop_id: that.$store.state.shopId,
				}, res => {
					that.index = index
					that.selectname = that.values[index].username
					that.isUse = true
				})
			},

			// 角色修改
			changerole(index, param) {
				let that = this
				if (param == 'role') {
					var data = {
						shop_id: that.$store.state.shopId,
						id: that.values[that.index].id,
						type: that.roleList[index].id
					}
					var url = 'smdc/worker/toUpdateType'
				}
				if (param == 'work') {
					var data = {
						shop_id: that.$store.state.shopId,
						id: that.values[that.index].id,
						status: that.workStatus[index].status
					}
					var url = 'smdc/worker/toUpdateStatus'
				}
				that.$api.ajax(url, data, res => {
                     that.getWorker()
				},'POST',true)
			},

			// 获取人员列表
			getWorker() {
				var that = this
				that.load = true
				if(this.current!=0){
					this.role_type=this.current+1
				}
				that.$api.ajax('smdc/worker/list', {
					shop_id: that.$store.state.shopId,
					page: that.page,
					limit: that.limit,
					type: that.role_type,
					username:that.key
				}, res => {
					that.load = true
					if (that.page == 1) {
						that.values = res.data
					} else {
						that.values.concat(res.data)
					}
					that.values.map(item => {
						that.roleList.map(x => {
							if (item.type == x.id) {
								item.type_name = x.type_name
							}
						})
					})
				})
			},

			// 获取职位列表
			getRole() {
				let that = this
				that.$api.ajax('smdc/worker/workType', {
					shop_id: that.$store.state.shopId,
				}, res => {
					that.roleList = res.data
					that.role_type = that.roleList[0].id
					that.getWorker()
				})
			},
		},
	}
</script>

<style lang="less">
	.editIcon{
		width: 30upx;
		height: 30upx;
	}
	.content{
		padding-left: 30upx;
	}
	.top{
		width: 100%;
		position: fixed;
		top: 0;
		z-index: 2;
	}
	.box{
		height: 100upx;
	}
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}
    .pad-10{
		padding: 10upx 0;
	}
	.left {
		width: 170upx;
		line-height: 84upx;
		text-align: center;
		font-size: 28upx;
		color: #555;
		background: #f8f8f8;
	}

	.right {
		background: #fff;
		flex: 1;
		padding: 0 0 0 35upx;
	}
	.active {
		background: #fff;
		color: #FEB026;
		font-size: 28upx;
	}

	.username {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 100upx;
	}

	.type {
		width: 15%;
		text-align: left;
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

	.list {
		padding: 30upx 30upx 30upx 0;
		background-color: #FFFFFF;
	}
	.bor-b{
		border-bottom: 1upx solid #EEEEEE;
	}
	.bor-t{
		border-top: 1upx solid #EEEEEE;
	}

	.mar-10{
		margin: 0 10upx;
	}
</style>
