<template>
	<div class="AllBox">
		<div class="router">
			<div class="router-item" style="width: auto;height: auto;margin-left: 80%;">
				<router-link to="/Register" >没有账号？去注册-></router-link>
			</div>
		</div>
	<div class="logoOuter">
		<div class="logo">
			<img src="http://cdn.qiniu.shuyuanlab.cn/boke.jpg" >
		</div>
		<div class="loginForm">
			<a-form
					layout="vertical"
					:model="userFormState"
				>
			<a-form-item>
			  <a-input v-model:value="userFormState.userName" placeholder="Username">
				<template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
			  </a-input>
			</a-form-item>
			<a-form-item>
			  <a-input v-model:value="userFormState.userPassword" type="password" placeholder="Password">
				<template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
			  </a-input>
			</a-form-item>
			<a-form-item>
			  <a-button
				type="primary"
				html-type="submit"
				:disabled="userFormState.userName === ''||userFormState.userPassword=== ''"
				@click="login()"
				:loading="loadingState"
			  >
				登 录
			  </a-button>
			</a-form-item>
			</a-form>
		</div>
	</div>
  </div>
</template>

<script>
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { defineComponent, reactive, ref ,onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from "vue-router"  // 引入userRouter
import { message } from 'ant-design-vue';
import store from '../store/index'



export default defineComponent({
  name:"Login",
  components: {
    UserOutlined,
    LockOutlined,
  },


  setup() {
	const loadingState = ref(false) 
	const router = useRouter()
    const userFormState = reactive({
      userName: '',
      userPassword: '',
    });
	onMounted(() => {
		judgLogin();
	});
	const judgLogin = () =>{
		const user = store.state.user;
		console.log("judgLogin",user.userId)
		if(user.userId){
			router.push({
				path:'/homePage',
			})
		}
	}
	const login = () => {
		loadingState.value = true
		axios.post("/login",userFormState)
		.then(res =>{
			const mes = res.data.message;
			message.success(mes);
			console.log(res); 
			if(res.data.success){	
                console.log(res)  
				loadingState.value = false
                store.commit("setUser",res.data.data)
				store.commit("setToken",res.headers.authentication)
				
			    router.push({
				    name:'HomePage',
			    })
			}
		})
	} 

    return {
      userFormState,
	  login,
	  loadingState,
	  judgLogin,
    };
  },

});

</script>

<style scoped>	
.ant-input-affix-wrapper{
    width: 500px;
}
.AllBox{
	width: 100;
	height: 100%;
	display: flex;
	flex-direction: column;
}
.router{
	display: flex;
	width: 100%;
	height: auto;
	
}
.logoOuter{
	display: flex;
	width: 100%;
	height: auto;
	flex-direction: column;
	margin-top: 100px;
}
.logo{
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.loginForm{
	width: 100%;
	height: auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
</style>
