<template>
	<view>
		<view class="content flex_col">
			<view class="info bor-bt">
				<text class="_f30">欢迎加入<text class="mCol">智慧厨房</text>，请填写申请信息</text>
			</view>
			<view class="info flex_row _f30 bor-bt">
				<view class="left">
					<text class="mCol">*</text>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名:
				</view>
				<input type="text" class="infoInput" placeholder="请输入姓名" v-model="name" />
			</view>
			<view class="info flex_row _f30 bor-bt">
				<view class="left">
					<text class="mCol">*</text>手&nbsp;机&nbsp;号:
				</view>
				<input type="text" class="infoInput" placeholder="请输入手机号码" maxlength="11" v-model="phone" />
			</view>
			<view class="info flex_row _f30 bor-bt">
				<view class="left">
					<text class="mCol">*</text>经营类别:
				</view>
				<picker range-key="name"  :range="typeList" @change="typeSelect">
					<view :class="typeIndex==null?'_c22':'_c66'">{{type || '请输入经营类别'}}</view>
				</picker>
			</view>
			<view class="info flex_row _f30 bor-bt">
				<view class="left">
					<text class="mCol">*</text>区&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;域:
				</view>
				<pick-regions :defaultRegions='defaultRegions' @getRegions="handleGetRegions" class="flex1"> 
					<view :class="regionsName?'_c22':'_c66'">{{regionsName?regionsName:'选择省市区'}}</view>
				</pick-regions>
			</view>
		</view>
		<view class="sure _flex-center mBg _cff" @click="submitInfo()">
			提交
		</view>
	</view>
</template>

<script>
	import pickRegions from '../pick-regions/pick-regions.vue'
	export default {
		props: {
			typeList: {
				type: Array,
				default: () =>([]),
			},
			defaultRegions: {
				type: Array,
				default: () => ( ['福建省', '福州市', '仓山区']),
				
			},
		},
		data() {
			return {
				flag: false,
				isUse: false, //用户协议弹窗
				name: "",
				phone: "",
				type: "",
				address: '',
				typeIndex: null,
				regions: [],
				area_id: ""
			}
		},
		components: {
			pickRegions
		},
		computed: {
			intro() {
				return this.$store.state.intr
			},
			regionsName() {
				// 转为字符串
				return this.regions.map(item => item.name).join(' ')
			}
		},
		methods: {
			// 获取选择的地区
			handleGetRegions(regions) {
				this.regions = regions
				this.area_id = this.regions[2].code
				console.log(this.area_id)
			},

			// 选择经营类别
			typeSelect(e) {
				console.log(e)
				this.typeIndex = e.detail.value
				this.type = this.typeList[this.typeIndex].name
			},
			
			// 选择阅读合作协议
			selectFlag() {
				this.flag = !this.flag
			},

			// 提交信息
			submitInfo() {
				if (!this.name || !this.phone || !this.type) {
					this.$api.toast('请填写完整信息')
					return
				}
				// if (!this.flag) {
				// 	this.$api.toast('请阅读勾选用户协议')
				// 	return
				// }
				if (!/^1[3456789]{1}\d{9}$/gi.test(this.phone)) {
					this.$api.toast('手机号不正确')
					return
				}
				if (!this.area_id) {
					this.$api.toast('请选择区域')
					return
				}
				let obj = {
					name: this.name,
					phone: this.phone,
					type: this.type,
					area_id: this.area_id
				}
				this.$emit('submit', obj)
			},

		},
	}
</script>

<style lang="less">
	.flex1{
		flex: 1;
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
			width: 21%;
			margin-right: 30upx;
			font-weight: bold;
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
