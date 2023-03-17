<template>
  <div class="article-group">
    <!-- <div v-if="!articleData">
      <a-empty :image="simpleImage" />
    </div> -->
    <div v-for="i in articleData" :key="i.articleId" class="article-box" @click="toArticle(i.articleId)">
      <div class="article-item">
        <div class="img-group">
          <img :src="i.cover" alt="#">
        </div>
        <div class="article-content-group">
          <div class="article-title">
            <div class="title">
              {{i.articleTitle}}
            </div>
            <div class="author">
              &nbsp;&nbsp;作者：{{i.authorName}}
            </div>
            <div class="creat-time">
              &nbsp;&nbsp;&nbsp;&nbsp;{{i.commitTime}}
            </div>
          </div>
          <div class="article-content">
           {{i.articleDescription}}
          </div>
        </div>
      </div>
    </div>
    
  </div>


 
</template>
<script>

import { message } from 'ant-design-vue';
import { defineComponent, ref, onMounted ,computed} from 'vue';
import axios from 'axios'
import { useRouter } from "vue-router" 
import { Empty } from 'ant-design-vue';
import store from '../store/index'
export default defineComponent({
  name:"Index",
  components: {

  },

  methods: {
    

  },
  mounted () {
    
  },
  setup() {
    const user = computed(() => store.state.user)
    const route = useRouter()
    const articleData = ref({})
    onMounted(() => {
      console.log("onMounted")
      
      let likely = route.currentRoute.value.query.likely || ""
      console.log("query",route.currentRoute.value.query)
      console.log("params",route.currentRoute.value.params)
      
      console.log("likely",likely)
      getArticleList(likely) 
    })
    
    const getArticleById = (id) => {
      axios.get("/article/readArticle/" + "127672819269111808").then(res => {
        console.log(res.data.data)
        content.value = res.data.data.content
      })
    }
    const getArticleList = (likely) => {
      axios.get("/article/searchArticle/" + likely).then(res => {
        const resp = res.data 
        console.log("getArticleList",likely,resp)
        if(resp.success){
          articleData.value = resp.data
        }
      })
    }
    const getArticleComments = () => {
      axios.get("/comments/getComments/" + "127672819269111808").then(res => {
        console.log(res.data)
      })
    } 
    const toArticle = (articleId) => {
      console.log(articleId)
      route.push({
        name:"Article",
        query:{
          articleId:articleId
        }
      })
    }

    return {
      user,
      getArticleComments,
      getArticleList,
      getArticleById,
      articleData,
      toArticle,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
    };
  },
 

});
</script>
<style scoped>
.search-group {
  
}
.article-group {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.article-box{
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #c2c2c2;
  width: 100%;
}

.article-item {
  display: flex;
  flex-direction: row;
  width: 80%;
}
.article-item:hover {
  background-color: #c2c2c240;
}
.img-group{
  border: 1px solid #c2c2c2;
  margin: 5px;
  box-sizing: border-box;
  border-radius: 5%;
}
.img-group img{
  margin: 5px;
  box-sizing: border-box;
  height: 100px;
  width: 100px;
}

.article-content-group{
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-left: 15px;
  width: 100%;
}
.article-title{
  display: flex;
  flex-direction: row;
  width: 100%;
 
}

.title{  
  font-size: 24px;
  font-weight: 550;
}

.author{
  text-align: justify;
  display:flex;
  align-items:flex-end
}

.creat-time{
  font-style: italic;
  display:flex;
  align-items:flex-end
}


.article-content {
  margin-top: 10px;
  font-size: 20px;
  max-width: 80% - 100px;
  /*设置文本框大小*/
  /* white-space: nowrap; */
  /*设置内容不换行*/
  text-overflow: ellipsis;
  /*设置文字超出文本框的内容显示成...*/
  overflow: hidden;
  padding-right: 20%;
  word-break:break-all;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

</style>