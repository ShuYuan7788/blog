<template>
	<div class="registerBox">
		<div class="box-top">
			
		</div>
		<div class="box-center">
			<div class="left">
				<div class="left-background">
					<img src="http://cdn.qiniu.shuyuanlab.cn/b.jpg">
				</div>
		    </div>
			<div class="right">
				<div class="form">
					<a-form
						layout="horizontal"
						:model="formState"
						>
						<a-form-item>
						  <a-input v-model:value="formState.userNickname" placeholder="昵称">
							<template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
						  </a-input>
						</a-form-item>
						
						<a-form-item>
						  <a-input v-model:value="formState.user" placeholder="用户名" @blur="Inspection()">
							<template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
						  </a-input>
						</a-form-item>
						
						<a-form-item>
						  <a-input v-model:value="formState.mailbox" placeholder="邮箱">
							<template #prefix><mail-outlined  style="color: rgba(0, 0, 0, 0.25)" /></template>
						  </a-input>
						</a-form-item>
						
						<a-form-item>
						  <a-input-password v-model:value="formState.password" type="password" placeholder="设置密码">
							<template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
						  </a-input-password>
						</a-form-item>
						
						<a-form-item>
						  <a-input-password v-model:value="formState.passwordAgain" type="password" placeholder="确认密码">
							<template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
						  </a-input-password>
						</a-form-item>
						
						<a-form-item>
						  <a-input v-model:value="formState.verification" placeholder="验证码" @blur="InspectionVe()">
							<template #prefix><insurance-outlined style="color: rgba(0, 0, 0, 0.25)" /></template>
						  </a-input>
						</a-form-item>
						<a-form-item>
						<a-button type="primary" :disabled="formState.mailbox === '' || OK" @click='setTime(),Send()'>获取验证码({{count}})</a-button>
						&nbsp;
						  <a-button
							type="primary"
							html-type="submit"
							@click="register()"
							:disabled="formState.user === '' || formState.password === '' || formState.passwordAgain === '' || formState.userNickname === '' || formState.mailbox ==='' || formState.verification ==='' || show1 ||show2"
						  >
							注册
						  </a-button>
						</a-form-item>
					</a-form>
				</div>   
			</div>	
		</div>
		<div class="box-bottom">
			
		</div>
	</div>
</template>

<script>
	import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
	import { defineComponent, reactive, ref} from 'vue';
	import axios from 'axios';
	import { useRouter } from "vue-router";
	import { message } from 'ant-design-vue';
	export default defineComponent({
	  components: {
	    UserOutlined,
	    LockOutlined,
	  },
	
	  setup() {
		const router = useRouter()
		const OK = ref(false)
		var show1 = ref(true)
		var show2 = ref(true)
		const count = ref(60)
		
	    const formState = reactive({
			userNickname: '',
			user: '',
			mailbox: '',
			password: '',
			passwordAgain: '',
			verification: '',
	    });
		
		const setTime = () => {
			if(count.value == 0){
				OK.value = false;
				count.value = 60;
				return;
			}else{
				OK.value = true;
				count.value--;
			}
			setTimeout(function() {setTime()},1000)
		}
		
		const Inspection = () => {
			if(formState.user != ''){
				axios.get('/user/checkUsername/'+formState.user).then(res =>{
					if(!res.data.success){
						message.error('用户名已存在，请重新输入！');
						show1.value = true;
					}else{
						show1.value = false;
					}
				})
			}
		}
		
		const Send = () =>{
			if(formState.mailbox != ''){
				axios.get('/user/sendEmailCode/'+formState.mailbox).then(res =>{
					if(!res.data.success){
						message.error(res.data.message);
						count.value = res.data.message.match(/\d+/g);
					}else{
						console.log('发送成功');
					}
				})
			}
		}
		
		const InspectionVe = () =>{
			if(formState.verification !=''){
				axios.post('/user/checkEmailCode',{
						email:formState.mailbox,
						emailCode:formState.verification
				}).then(res =>{
					if(!res.data.success){
						show2.value = true;
						message.error('验证码错误');
					}else{
						show2.value = false;
					}
				})
			}
			
		}
		
		const register = () => {
			if(formState.password != formState.passwordAgain){
				message.warning("两次密码不一致！");
			}else{
				axios.post("/user/register",{
					userName:formState.user,
					userPassword:formState.password,
					userNickname:formState.userNickname,
					email:formState.mailbox,
					emailCode:formState.verification
				}).then(res =>{
					const mes = res.data.message;
					message.success(mes);
					console.log(res.data);
					if(res.data.success){
					  router.push({
						path:'/'
					  })
					}
				})	
			}
		}
	    return {
	      formState,
	      register,
		  count,
		  OK,
		  setTime,
		  Inspection,
		  InspectionVe,
		  Send,
		  show1,
		  show2,
	    };
	  },
	
	});
</script>

<style scoped>
	.registerBox{
		display: flex;
		width: 100%;
		height: 100%;
		flex-direction: column;
	}
	.box-top{
		width: 100%;
		height: 50px;
		background-color: #05225c;
	}
	.box-center{
		width: 100%;
		height: 570px;
		display: flex;
		flex-direction: row;
	}
	.box-bottom{
		width: 100%;
		height: 50px;
		background-color:#102554;
	}
	.left{
		width: 40%;
		height: 100%;
	}
	.left-background{
		height: 100%;
		width: 100%;
	}
	.right{
		width: 60%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	img{
		width: 100%;
		height: 100%;
	}
	.form{
		width: auto;
		height: auto;
	}
</style>
