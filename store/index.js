import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        hasLogin: false,  //是否登陆
        uid:"",   //用户id表示
		userInfo:{},   //用户信息 
		shopId: "44",   //店铺标识
		hasShop: false,  //是否进入了店铺
		deskId: "A5",  //桌号
		deskNum:"2",  //用餐人数
		needScan:false,  //是否需要扫码
		userType: 0,    //1厨师 2员工  0普通  3店长 4清洁员 
		_phone:0,    //店长电话
		_buyList:[],   //购物车
		wx_audit:{},	
		_config:{},  //餐位费
		_orderNo:0,   //当前订单编号
		_orderId:0,   //当前订单id
		shop_logo:"/static/head.png",
		intr:'',//用户协议
		cancle_time:15 ,//订单取消时间
		serviveTiem:3 ,//呼叫服务间隔时间
		
    }, 
    mutations: {
		//登陆
        login(state, info) {
            state.userInfo = info.userInfo || {};
            state.uid = info.uid || "" ;
			state.hasLogin = true ;
        },
		//退出登录
		logout(state) {
		    state.userInfo = {};
			state.uid = "";
		    state.hasLogin = false;
			uni.clearStorageSync(); 
		},
		//进入店铺
		intoShop(state, shopId) {
			state.shopId = shopId || 0;
			state.hasShop = true ;
			uni.setStorageSync('kejia_order_shopId',shopId)
		},
		
		// 订单取消时间
		intoCancleTime(state, cancle_time){
			state.cancle_time = cancle_time || 15 ;
		},
		
		//桌子信息
		intoDesk(state, deskId) {
			state.deskId = deskId || "" ;
			uni.setStorageSync('deskId',deskId)
		},
		//用餐人数
		intoNum(state, deskNum) {
			state.deskNum = deskNum || ""
			uni.setStorageSync('deskNum',deskNum)
		},
		//改变是否需要扫码
		changeNeedScan(state, needScan) {
			state.needScan = needScan
			uni.setStorageSync('needScan',needScan)
		},
		//客服电话
		_setPhone(state, phone) {
			state._phone = phone
		},
		// 存储用户协议
		setIntr(state,intr){
			state.intr = intr
		},
		//更新用户信息
		_setUserInfo(state, userInfo) {
			state.userInfo = userInfo || {};
		},
		//添加购物车
		_addBuyList(state, list) {
			let s=state._buyList;
			let isExist=false;
			for(let i=0,len=s.length;i<len;i++){
				if(s[i].id==list.id){
					s[i]=list;
					isExist=true;
				}
			};
			if(!isExist){
				s.push(list);
			}
			state._buyList=s;
		},
		//删除购物车
		_removeBuyList(state, list) {
			let s=state._buyList;
			for(let i=0,len=s.length;i<len;i++){
				if(s[i].id==list.id){
					s[i]=list;
				}
			};
			state._buyList=s;
		},
		//清空购物车
		_clearBuyList(state) {
			state._buyList=[];
		},
		//audit
		_setAudit(state,info) {
			state.wx_audit=info
		},
		//当前订单
		_setOrderId(state,info) {
			state._orderId=info.orderId;
			state._orderNo=info.orderNo;
		},
		_clearOrderId(state) {
			state._orderId=0;
			state._orderNo=0;
		},
		//餐位费
		_setConfig(state,info) {
			state._config=info || {};
		}
    }
})

export default store