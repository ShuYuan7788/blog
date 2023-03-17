<template>
  <!-- 文章区  -->
  <div class="components-page-header-demo-content">
    <a-page-header
      :title="article.articleTitle"
      class="site-page-header"
      :sub-title="'author:' + article.authorName"
      :avatar="{ src: userAvatar }"
    >
      <template #tags>
        <a-tag color="blue">{{article.articleLabel}}</a-tag>
      </template>
      <div><a href="#" @click="collect">收藏</a></div>
     

      <a-divider />
    </a-page-header>

    <div class="content-style">
      <div class="text-area">
        <div v-html="article.content"></div>
      </div>
    </div>
  </div>


  <!-- 评论区 -->
  <div class="comment-group">
     <a-divider orientation="left">评论区:</a-divider>

    
    <div v-for="(i,index) in comments" :key="i" class="comment-area">

      <a-comment>
        <template #actions>
            <!-- <span key="comment-nested-reply-to">回复</span> -->
            
            <a-collapse v-model:activeKey="i.commentsId" ghost>
              <a-collapse-panel key="1" :header="'查看评论' + '('+i.replyResps.length+')'" :collapsible="i.replyResps.length < 1 ? 'disabled' : ''">

                <!-- 评论回复区（评论的评论） -->
                <div v-for="j in i.replyResps" :key="j" class="comment-reply-item">
                  <a-comment>
                   
                    <template #author>
                      <a>{{j.userNickName}} 回复 {{j.replyUserNickName}} 的 "{{j.replyContent}}"</a>
                    </template>
                    <template #avatar>
                      <a-avatar
                          :src="j.userAvatar|| hodAvatar"
                          :alt="j.userNickName"
                      />
                    </template>
                    <template #content>

                    <p>
                      {{j.content}}
                    </p>

                    

                    <p style="float:right;margin-right: 20px;color:#c2c2c2;font-size: smaller;">
                        -----{{j.replyTime}}
                      <a href="#reply" @click="toReply(j,index)">
                        回复
                      </a>
                    </p>
                    </template>
                  </a-comment>
                </div>

                
              </a-collapse-panel>
            </a-collapse>
         


        </template>
        <template #author>
            <a>{{i.userNickName}}</a>
        </template>
        <template #avatar>
            <a-avatar
            :src="i.userAvatar|| hodAvatar"
            alt="Han Solo"
            />
        </template>
        <template #content>
            <p>{{i.content}}</p>
            <p style="float:right;margin-right: 40%;color:#c2c2c2;font-size: smaller;">
              ------{{i.replyTime}}
              <a href="#reply" @click="toReply(i,index)">回复</a>
            </p>
        </template>
  
        

    </a-comment>
    <a-divider />
    </div>

  </div>
  
  <!-- 回复区  -->
  <div id="reply" class="reply-group">
    <a-comment>
        <template #avatar>
        <a-avatar
            :src="user.userAvatar"
            alt="Han Solo"
        />
        </template>
        <template #content>
        <a-form-item>
            <a-textarea :placeholder="placeholderValue" v-model:value="replyValue" :rows="4" />
        </a-form-item>
        <a-form-item>
            <a-button html-type="submit" :loading="submitting" type="primary" @click="handleSubmit">
            评论
            </a-button> 
        </a-form-item>
        </template>
    </a-comment>
  </div>
</template>
<script>
import { message } from 'ant-design-vue';
import { defineComponent, ref,onMounted,computed} from 'vue';
import axios from 'axios'
import store from '../store/index'
import { useRouter } from "vue-router" 

export default defineComponent({
  name:"article",
  components: {

  },

  methods: {
    

  },
  // password: null
  // roles: [{…}]
  // status: 1
  // userAvatar: "http://cdn.qiniu.shuyuanlab.cn/avatar.png"
  // userId: 125843224081338369
  // userNickname: "管理员"
  // userPassword: null
  // userName: "admin"
  setup() {
    const user = computed(() => store.state.user)
    const likely = ref("vue");
    const article = ref({})
    const route = useRouter()
    const userAvatar = ref("")
    const activeKey = ref([]);
    const submitting = ref(true);
    const replyValue = ref('');
    const comments = ref()
    comments.value = []
    const placeholderValue = ref("")
    const articleId = ref("")
    const selectReplyItem = ref({})
    const selectReplyIndex = ref()
    const hodAvatar = "http://cdn.qiniu.shuyuanlab.cn/avatar.png"
    onMounted(() =>{
      articleId.value = route.currentRoute.value.query.articleId
      console.log(articleId.value)
      getArticleById()
      getArticleComments()
    })
    const getArticleById = () => {
      axios.get("/article/readArticle/" + articleId.value).then(res => {
        // console.log(res.data.data)
        article.value = res.data.data.article
        userAvatar.value = res.data.data.userAvatar || hodAvatar
      })
    }
    const getArticleList = () => {
      axios.get("/article/searchArticle/" + likely.value).then(res => {
        // console.log(res.data)
      })
    }
    const getArticleComments = () => {
      // articleId.value
      console.log(articleId.value)
      axios.get("/comments/getComments/" + articleId.value).then(res => {
        console.log(res.data.data)
        const resp =  res.data;
        if(resp.success){
          message.success("评论获取成功")
          submitting.value = false;
          comments.value = resp.data || []
        }else{
          message.error("评论获取失败")
        }
      })
    }
     const handleSubmit = () => {
        if (!replyValue.value) {
          placeholderValue.value = ""
          selectReplyItem.value = {}
          return;
        }
        if(!user.value.userId){
          placeholderValue.value = ""
          selectReplyItem.value = {}
          message.error("请先登录！")
          return;
        }
        submitting.value = true;
        const placeholderValueTem = placeholderValue.value
        placeholderValue.value = ""
        if(placeholderValueTem.trim() === ""){
          commentsFunc()
        }else{
          replyFunc()
        }
    };

    // commentsId: "125843224081338370"
    // content: "牛逼啊woc"
    // replyContent: null
    // replyResps: []
    // replyTime: "2021-12-19 19:43:13"
    // replyUserAvatar: null
    // replyUserNickName: null
    // userAvatar: "http://cdn.qiniu.shuyuanlab.cn/avatar.png"
    // userNickName: "Tom"
    // userId;

    const toReply = (item,index) => {
      placeholderValue.value = "回复: @"+ item.userNickName + " 的 " + item.content
      selectReplyItem.value = item
      selectReplyIndex.value = index
    }
    const replyFunc = () => {
      const selectReplyItemTem = selectReplyItem.value 
      selectReplyItem.value = {}
      // console.log(
      //   selectReplyItemTem.commentsId,
      //   replyValue.value,
      //   selectReplyItemTem.content,
      //   user.value.userId,
      //   selectReplyItemTem.userId
      // )
      axios.post("/reply/addReply",{
        commentId: selectReplyItemTem.commentsId,
        content: replyValue.value,
        replyContent: selectReplyItemTem.content,
        fuserId: user.value.userId,    //user.value.userId
        suserId: selectReplyItemTem.userId,    //userId
      }).then( (res) => {
        // console.log(res)
        const resp = res.data;
        if(resp.success){
          message.success(resp.message)
          let commentFormData = {
            commentsId: selectReplyItemTem.commentsId,
            content: replyValue.value,
            replyContent: selectReplyItemTem.content,
            replyResps: null,
            replyTime: resp.data,
            replyUserAvatar: selectReplyItemTem.userAvatar,
            replyUserNickName: selectReplyItemTem.userNickName,
            userAvatar: user.value.userAvatar,
            userNickName: user.value.userName,
            userId: user.value.userId,
          }
          //渲染数据
          comments.value[selectReplyIndex.value].replyResps.push(commentFormData)
          message.success(resp.message)
          submitting.value = false;
        }else{
          submitting.value = false;
          message.error(resp.message) 
        }
        replyValue.value = "";
      })
    }

    //收藏
    const collect = () => {
      
    }

    //评论方法
    const commentsFunc = () => {
      axios.post("/comments/addComments",{
        userId: user.value.userId,
        // articleId: articleId.value,
        articleId: articleId.value,
        content: replyValue.value 
      }).then(res => {
        // console.log("=====================",res);
        const resp = res.data;
        console.log("commentsFunc",resp.data.commentTime)
        if(resp.success){
          let commentFormData = {
            commentsId: resp.data.commentId,
            content: replyValue.value,
            replyContent: null,
            replyResps: [],
            replyTime: resp.data.time,
            replyUserAvatar: null,
            replyUserNickName: null,
            userAvatar: user.value.userAvatar,
            userNickName: user.value.userName,
            userId: user.value.userId,
          }
          comments.value.push(commentFormData)
          message.success(resp.message)
          submitting.value = false;      
        }else{
          submitting.value = false;
          message.error(resp.message) 
        }
        replyValue.value = "";
      })
    }

    
    return {
      collect,
      article,
      getArticleComments,
      getArticleList,
      getArticleById,
      user,
      userAvatar,
      activeKey,
      submitting,
      replyValue,
      handleSubmit,
      comments,
      hodAvatar,
      toReply,
      placeholderValue
    };
  },

});
</script>
<style scoped>
#components-page-header-demo-content .image {
  margin: 0 0 0 60px;
  display: flex;
  align-items: center;
}

#components-page-header-demo-content .ant-page-header-rtl .image {
  margin: 0 60px 0 0;
}

#components-page-header-demo-content .example-link {
  line-height: 24px;
  margin-right: 16px;
}
[data-theme='compact'] #components-page-header-demo-content .example-link {
  line-height: 20px;
}
#components-page-header-demo-content .example-link-icon {
  margin-right: 8px;
}

[data-theme='compact'] #components-page-header-demo-content .example-link-icon {
  width: 20px;
  height: 20px;
}

#components-page-header-demo-content .ant-page-header-rtl .example-link {
  float: right;
  margin-right: 0;
  margin-left: 16px;
}
#components-page-header-demo-content .ant-page-header-rtl .example-link-icon {
  margin-right: 0;
  margin-left: 8px;
}
#components-page-header-demo-content .content p {
  margin-bottom: 1em;
  color: rgba(0, 0, 0, 0.85);
  overflow-wrap: break-word;
}

@media (max-width: 768px) {
  #components-page-header-demo-content .image {
    flex: 100%;
    margin: 24px 0 0;
  }
}

.comment-group{
  display: flex;
  margin-top: 100px;
  flex-direction: column;
}

.reply-group{
  
}

</style>