<template>
  <div class="menu-box">
    <div class="top-group">
      <a-menu 
        v-model:selectedKeys="current" 
        mode="horizontal" 
        @select="onSelectedChange()"
      >
        <a-menu-item key="myInfo">
          <template #icon>
            <user-outlined />
          </template>
          个人信息
        </a-menu-item>
        <a-menu-item key="myArticle" :disabled="false">
          <template #icon>
            <read-outlined />
          </template>
          我的文章
        </a-menu-item>
        <a-sub-menu 
          key="collection"

        >
          <template #icon>
            <tags-outlined />
          </template>
          <template #title>收藏夹</template>
            <a-menu-item 
              v-for="i in collections" 
              :key="i.bookMarkId" 
              @click="onCollection(i.bookMarkId)"
            >
              {{i.bookMarkName}}
            </a-menu-item>
        </a-sub-menu>
        <a-menu-item key="follow">
          <template #icon>
            <team-outlined />
          </template>
          关注
        </a-menu-item>
      </a-menu>   
    </div>
    <div class="content-group">   
      <div class="content-group-item" v-if="current == 'myInfo'">

          <a-descriptions title="个人信息">
            <a-descriptions-item label="姓名">{{userInfo.userName}}</a-descriptions-item>
            <a-descriptions-item label="Telephone">1810000000</a-descriptions-item>
            <a-descriptions-item label="Live">Hangzhou, Zhejiang</a-descriptions-item>
            <a-descriptions-item label="Remark">empty</a-descriptions-item>
            <a-descriptions-item label="Address">
              No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
            </a-descriptions-item>
          </a-descriptions>
      </div>

      <div class="content-group-item" v-if="current == 'myArticle'">

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



      <div class="content-group-item" v-if="current == 'follow'">
          <a-descriptions title="关注">
          </a-descriptions>
          
      </div> 

      <div class="content-group-item" v-if="current != 'follow' && current != 'myArticle' && current != 'myInfo' ">
          <div>
            <a-button type="primary" @click="showModal">收藏夹管理</a-button>
          </div>
          <div v-for="i in selectCollection" 
            :key="i.articleId" 
            class="article-box" 
            @click="toArticle(i.articleId)"
          >
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
            
            <div class="button-style">
              <a-button>移除收藏夹</a-button>
            </div>

          </div>


      </div>
    </div>
  </div>

  <div>
    <a-modal v-model:visible="visible" title="收藏夹管理" @ok="handleOk">
      <div style="width: 100%;height:20px;display: flex;justify-content: right;align-items: center;margin-bottom: 10px;margin-right: 15px;">
        <a-popover title="新建收藏夹" trigger="click">
          <template #content>
          <a-input-search
              v-model:value="addCollectionName"
              placeholder="input search text"
              size="large"
              @search="addCollectionFunc"
            >
              <template #enterButton>
                <a-button>确定</a-button>
              </template>
            </a-input-search>
          </template>
          <a href="#">Add</a>
        </a-popover>
      </div>
      <div v-for="i in collections" :key="i" class="visible-group">
        <div class="visible-item">{{i.bookMarkName}}</div>
        <div class="butt">
          <a-popover title="修改收藏夹" trigger="click">
            <template #content>
            <a-input-search
                v-model:value="i.bookMarkName"
                placeholder="input search text"
                size="large"
                @search="onChangeName(i)"
              >
                <template #enterButton>
                  <a-button>确定</a-button>
                </template>
              </a-input-search>
            </template>
            <a href="#">Change</a>
          </a-popover>
        </div>

        <div class="butt">
          <a-popconfirm
            title="你确定想删除这个收藏夹吗？"
            ok-text="Yes"
            cancel-text="No"
            @confirm="confirmDelete(i)"
            @cancel="cancelDelete"
          >
            <a href="#">Delete</a>
          </a-popconfirm>
        </div>
      </div>
     
    </a-modal>
  </div>

</template>
<script>
import { message } from 'ant-design-vue';
import axios from 'axios';
import { useRouter } from "vue-router" 
import store from '../store/index'
import { defineComponent, ref , reactive,onMounted,computed } from 'vue';
export default defineComponent({
  components: {

  },
  
  setup() {

    onMounted(() => {
      console.log(user.value)
      getAllBookmark()
    })
    
    const addCollectionName = ref("")
    const user = computed(() => store.state.user)
    const visible = ref(false);
    const router = useRouter()
    const articleData = ref({})
    const current = ref(['myInfo']);
    const selectCollection = ref([])
    const collections = ref([])
    const userInfo = reactive({
      userName: "周北君",
      userNickname: "孙文宇",
      userAvatar: "",
    })
    const toArticle = (articleId) => {
      console.log(articleId)
      router.push({
        name:"Article",
        query:{
          articleId:articleId
        }
      })
    }
    const onSelectedChange = () => {
      if(current.value == "myArticle"){
        getMyArticle()
      }
      if(current.value != "myArticle" && current.value != "myInfo" && current.value != "follow"){
       selectCollection.value = current.value
      }
    }

    const getMyArticle = () => {
      axios.get("/article/query/" + "125843224081338370").then((res) => {
        console.log(res.data)
        const resp = res.data;
        if(resp.success){
          message.info(resp.message)
          articleData.value = resp.data;
        }
      })
    }

    const onCollection = (bookMarkId) => {
      console.log(bookMarkId)
        axios.get("/favorite/selectFavoriteArticle/" + bookMarkId).then((res) => {
        console.log(res.data)
        const resp = res.data;
        if(resp.success){
          selectCollection.value = resp.data
          // message.info(resp.message)
          // articleData.value = resp.data;
        }
      })
    }

    const showModal = () => {
      visible.value = true;
    };

    const handleOk = e => {
      console.log(e);
      visible.value = false;
    };

    const confirmDelete = (item) => {
      console.log(item);
      axios.delete("/bookmark/deleteBookmark",{
        data:{
          userId:item.userId,
          bookMarkId:item.bookMarkId,
        }
      }).then(res => {
        console.log(res)
      })
    };

    const cancelDelete = e => {
      console.log(e);
    };
    const onChangeName = (item) => {
      const collectionsTem = collections.value;
      console.log(item)
      axios.post("/bookmark/updateBookmark",{
        userId: item.userId,
        bookMarkId: item.bookMarkId,
        bookMarkName: item.bookMarkName
      }).then(res => {
        const resp = res.data;
        console.log(resp)
        if(resp.success) {
          message.success(resp.message)
        }else{
          collections.value = collectionsTem;
          message.error(resp.message)
        }
      })
    }
    const addCollectionFunc = () => {
      axios.post("/bookmark/addBookMark",{
        userId: user.value.userId,
        bookMarkName: addCollectionName.value
      }).then(res => {
        const resp = res.data 
        console.log(resp)
        if(resp.success){
          getAllBookmark()
        }
      })
    } 
    const getAllBookmark = () => {
       axios.get("/bookmark/selectAllBookmark/" + user.value.userId).then((res) => {
        console.log(res.data)
        const resp = res.data;
        if(resp.success){
          message.info("收藏栏" + resp.message) 
          collections.value = resp.data   
        }
      })
    }
    return {
      getAllBookmark,
      addCollectionFunc,
      current,
      userInfo,
      onSelectedChange,
      selectCollection,
      articleData,
      toArticle,
      getMyArticle,
      collections,
      onCollection,
      visible,
      showModal,
      handleOk,
      confirmDelete,
      cancelDelete,
      onChangeName,
      user,
      addCollectionName,
    };
  },

});
</script>

<style scoped>
.menu-box {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  
  flex-direction: column;
}

.top-group {
  display: flex;
  height: auto;
  width: 100%;
}
.content-group{
   margin-top: 20px;
   display: flex;
   width: 100%;
   height: auto;
}

.content-group-item{
  display: flex;
  width: 92%;
  height: auto;
  margin-left: 4%;
  flex-direction: column;
}

/* 我的文章css样式 */

.article-box{
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #c2c2c2;
  width: 100%;
  display: flex;
  flex-direction: row;
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

.button-style{
  width: 20%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  
}

.visible-group{
  display: flex;
  flex-direction: row;
  margin-top: 10px;
}

.visible-item{
  flex-grow: 1;
  display: flex;
  margin-left: 15px;
  margin-right: 15px;
}

.butt {
  margin-left: 10px;
}


</style>