import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MyInfo from '../views/MyInfo.vue'
import CreatArticle from '../views/CreateArticle.vue'
import Index from '../views/Index.vue'
import Article from '../views/Article.vue'
import Register from '../views/Register.vue'
import HomePage from '../views/HomePage.vue'
import Login from '../views/Login.vue'
import Temp from '../views/Temp.vue'
import Test from '../views/Test.vue'
import store from '../store'
import { message } from 'ant-design-vue';


const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta:{
      Auth:true
    }
  },
  {
    path: '/myInfo',
    name: 'MyInfo',
    component: MyInfo,
    meta:{
      Auth:true
    }
  },
  {
    path: '/createArticle',
    name: 'CreatArticle',
    component: CreatArticle,
    meta:{
      Auth:false
    }
  },
  {
    path: '/index',
    name: 'Index',
    component: Index,
    meta:{
      Auth:false
    }
  },
  {
    path: '/article',
    name: 'Article',
    component: Article,
    meta:{
      Auth:false
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta:{
      Auth:false
    }
  },
  {
    path: '/homePage',
    name: 'HomePage',
    component: HomePage,
    meta:{
      Auth:true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta:{
      Auth:false
    }
  },
  {
    path: '/temp',
    name: 'Temp',
    component: Temp,
    meta:{
      Auth:false
    }
  },
  {
    path: '/test',
    name: 'Test',
    component: Test,
    meta:{
      Auth:false
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  
  // 1. 每个条件执行后都要跟上 next() 或 使用路由跳转 api 否则页面就会停留一动不动
  // 2. 要合理的搭配条件语句，避免出现路由死循环。
  const token = store.state.token

  if (to.meta.Auth) {
  	if (token === "") {
      message.error("请先登录！")
  		return router.replace({
	      name: 'Login'
	    })
  	}
  	next()
  } else {
    next()
  }
  next()
})

export default router
