<template>   
    <a-layout-header class="header-style">
        <div class="box"> 
            <div class="left-group">
                <div style="justify-content: center;align-items: center;display: flex;font-size:18px;">综合博客论坛</div>
                <!-- <router-link to="/home">home</router-link> |
                <router-link to="/">about</router-link> |
                <router-link to="/index">Index</router-link> |
                <router-link to="/myInfo">MyInfo</router-link> | -->
            </div> 
            <div class="search-group">
                <a-input-search
                v-model:value="likely"
                placeholder="input search"
                :loading="loading"
                enter-button
                @search="searchArticle(likely)"
                
                />
            </div> 
            <div class="right-group">
                <div v-if="!user.userId">
                    <a-button class="right-item" type="primary" shape="round" @click="toLogin">登录</a-button>
                </div>
                <div v-else right-group style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                    <!-- <p style="color: dodgerblue;padding-top:12px;">
                        欢迎:{{user.username}}
                    </p>
                    <a-button class="right-item" type="primary" shape="round" @click="toMyHome">我的</a-button>
                    <a-button class="right-item" shape="round" danger>创作</a-button> -->
                    <a-popover :title="'欢迎：' + user.userName">
                    <template #content>
                        <div class="popover-group">
                            <a-button class="popover-item" shape="round" @click="toMyHome">我的信息</a-button>
                            <a-button class="popover-item" shape="round" danger @click="toCreateArticle">创作</a-button>
                            <a-button class="popover-item" shape="round" type="primary" @click="logout">退出登录</a-button>
                        </div>
                        </template>
                        <a-avatar :size="45" :src="user.userAvatar">
                            <template #icon><UserOutlined /></template>
                        </a-avatar>
                    </a-popover>
                </div>
            </div>
        </div>
    </a-layout-header>
</template>

<script>
import { defineComponent, onMounted, computed, reactive, UnwrapRef ,ref ,toRaw} from 'vue';
import axios from "axios";
import { useRouter } from "vue-router"  // 引入userRouter
import store from '../store/index'
import { message } from 'ant-design-vue';
    export default defineComponent({
        name: "the-header", 
        methods:{
        },
        
        setup(props,context) {
            onMounted(() => {
                console.log("user",user.value)
            })
            const likely = ref("");
            const router = useRouter()
            const pushMethod = ref(true)
            const user = computed(() => store.state.user)
            const toLogin = () => {
                router.push({
                    path:'/login'
                }) 
            }
            const logout = () =>{
                message.info("退出成功！")
                store.commit("removeUser")
                store.commit("removeToken")
            }
            const searchArticle = () => {
                router.push({
                    path:"temp",
                    query:{
                       likely:likely.value
                    }
                })
                // pushMethod.value = !pushMethod.value
            }
            const toMyHome = () => {
                router.push({
                    path:"/homePage",
    
                })
            }
            const toCreateArticle = () => {
                 router.push({
                    path:"/createArticle",
    
                })
            }
            return {
                user,
                toLogin,
                logout,
                likely,
                searchArticle,
                toMyHome,
                toCreateArticle,
            };
        },
        components: {

        },
    });
</script>

<style scoped>
    .header-style{
        background-color: #7fb8b3;
    }
    .box {
        display: flex;
        width: 100%;
        height: 100%;
        /* justify-content: space-evenly; */
        text-align: center;  
        border-bottom: 2px solid #c2c2c2;  
    }
    .left-group {
        flex-grow: 1;
        height: auto;
        display: flex;
        flex-direction: row;
        justify-content: left;
        align-items: center;
        margin-left: 64px;
    }
    .right-group{
        flex-grow: 1;
        height: auto;
        display: flex;
        flex-direction: row;
        justify-content: right;
        align-items: center;
        margin-right: 64px;
    }
    .search-group{
        
        flex-grow: 2;
        /* background-color: coral; */
        justify-content: center;
        align-items: center;
        display: flex;
        padding-left: 10%;
        padding-right: 10%;
        box-sizing: border-box;
    }
    /* .search{
        display: flex;
    } */
    .right-item{
        margin-left: 10px;
    }
    .login-group{
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .login-submit{
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        padding: 0;
    }
    .ant-avatar > img{
        border: 2px solid black !important;
        border-radius: 50%;
    }
    
    .popover-group{
        display: flex;
        flex-direction: column;
    }
    .popover-item {
        margin-top: 10px;
    }
</style>