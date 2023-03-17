<template>
	<div class="box">
		<div class="left-screen">
			<div class="left-screen-top">
				<div class="left-screen-top-portrait" >
					<img :src="user.userAvatar" style="height: 100%;width: 100%;border-radius: 50%;">
				</div>
				<div class="left-screen-top-name">
					<p>{{user.userName}}</p>
					<p><i>海纳百川，有容乃大</i></p>
					<!-- <span style="padding: 5%;"><h2>用户名</h2></span> -->
				</div>
                <a-divider />
				<div class="tools-group">
					<div class="tools-group-item">
						<a-button type="link" @click="showImgModal"><p>更换头像</p></a-button>
					</div>
					<!-- <div class="tools-group-item">
						<a-button type="link" @click="showChangeInfo"><p>修改个人信息</p></a-button>
					</div>
					<div class="tools-group-item">
						<a-button type="link"><p>修改密码</p></a-button>
					</div> -->
				</div>
				
				
				<!-- <div class="left-screen-top-follow">
					<div class="left-screen-top-follow-item">
						<p style="font-size: large;">关注：56</p>
					</div>
					<div class="left-screen-top-follow-item">
						<p style="font-size: large;">收藏：123</p>
					</div>
				</div> -->
				
			</div> 
			<!-- 日期组件 -->
            <!-- <div :style="{border: '1px solid #d9d9d9', borderRadius: '4px' }">
				<a-calendar v-model:value="value" :fullscreen="false" @panelChange="onPanelChange" />
			</div> -->
            <a-divider />
		</div>

		<!-- 右边栏  -->
		<div class="right-screen">
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
					<!-- <a-menu-item key="follow">
					<template #icon>
						<team-outlined />
					</template>
					关注
					</a-menu-item> -->
				</a-menu>   
				</div>
				<div class="content-group">   
				<div class="content-group-item" v-if="current == 'myInfo'">

					<a-descriptions title="个人信息">
						<a-descriptions-item label="用户ID">{{user.userId}}</a-descriptions-item>
						<a-descriptions-item label="用户名">{{user.userName}}</a-descriptions-item>
						<a-descriptions-item label="昵称">{{user.userNickname}}</a-descriptions-item>
						<a-descriptions-item v-for="(value,key) in userInfo" :key="key" :label="key">{{value}}</a-descriptions-item>
					</a-descriptions>
					
				</div>

				<div class="content-group-item" v-if="current == 'myArticle'">

					<div v-for="i in articleData" :key="i.articleId" class="article-box" >
						<div class="article-item" @click="toArticle(i.articleId)">
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
						<div style="margin-left: 10px;display: flex;justify-content: center;align-items: center;">
							<a-popconfirm
								title="你确定想删除这个文章吗？"
								ok-text="Yes"
								cancel-text="No"
								@confirm="DeleteArticle(i)"
							>
								<a href="#">Delete</a>
							</a-popconfirm>
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

		</div>
	</div>
    
	<!-- 修改个人信息弹窗 -->
	<a-drawer
		v-model:visible="changeInfoVisible"
		class="custom-class"
		style=""
		title="修改个人信息"
		placement="right"
		size="large"
		:footer-style="{ textAlign: 'right' }"
	>
		<!--  -->
	
		<a-form
			:model="userInfoTem"
			name="basic"
			:label-col="{ span: 8 }"
			:wrapper-col="{ span: 16 }"
			autocomplete="off"
			@finish="onFinish"
			@finishFailed="onFinishFailed"
			layout="vertical"
		>
			<a-form-item
			v-for="(value,key) in userInfo" :key="key"
			:label="key"
			:rules="[{ required: true, message: 'Please input your username!' }]"
			
			>
				<a-input :disabled="key==='userId' || key==='userTime' || key==='userName'" :v-model="value" :defaultValue="value" />
			</a-form-item>

			
		</a-form>
		<!--  -->
		<template #footer>
			<a-button style="margin-right: 8px" @click="closeChangeInfo">Cancel</a-button>
			<a-button  type="primary" @click="closeChangeInfo">Submit</a-button>
		</template>
	</a-drawer>

	<a-modal v-model:visible="changeImgVisible" title="修改头像" @ok="changeImgOk">
		<a-upload
			v-model:file-list="fileList" 
			:remove="handleRemove" 
			:before-upload="beforeUpload"
			list-type="picture-card"
			@preview="handlePreview"
		>
			<div v-if="fileList.length < 1 ">
			<plus-outlined />
			<div class="ant-upload-text">Upload</div>
			</div>
		</a-upload>
		<a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
			<img alt="example" style="width: 100%" :src="previewImage" />
		</a-modal>

		<a-button
			type="primary"
			:disabled="fileList.length === 0"
			:loading="uploading"
			style="margin-top: 16px"
			@click="handleUpload"
			>
			{{ uploading ? '确定' : '上传图片' }}
		</a-button>
    </a-modal>

</template>

<script>
import { defineComponent, ref,reactive,onMounted ,computed} from 'vue';
import { useRouter } from "vue-router" 
import store from '../store/index'
import axios from 'axios';
import { message } from 'ant-design-vue';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = error => reject(error);
  });
}

export default defineComponent({
  name:"homepage",
  setup() {
    onMounted(() => {
    	console.log(user.value)
		getUserInfo()
        getAllBookmark()
    })
	const changeImgVisible = ref(false)
	const changeInfoVisible = ref(false)
	const addCollectionName = ref("")
    const user = computed(() => store.state.user)
    const visible = ref(false);
    const router = useRouter()
    const articleData = ref({})
    const current = ref(['myInfo']);
    const selectCollection = ref([])
    const collections = ref([])
	let imgFlie;
    const fileList = ref([]);
    const uploading = ref(false);
    const imageUrl = ref('');
    const previewVisible = ref(false);
    const previewImage = ref('');
	const userInfo = ref({})

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
      axios.get("/article/query/" + user.value.userId).then((res) => {
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
      axios.delete("/bookmark/deleteBookmark/"+item.userId+"/"+item.bookMarkId)
	  	.then(res => {
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
	   console.log("bookmark/selectAllBookmark",user.value.userId)	
       axios.get("/bookmark/selectAllBookmark/" + user.value.userId).then((res) => {
        console.log(res.data)
        const resp = res.data;
        if(resp.success){
          message.info("收藏栏" + resp.message) 
          collections.value = resp.data   
        }
      })
    }
	const showChangeInfo = () => {
		changeInfoVisible.value = true
	}
	
	const closeChangeInfo = () => {
		changeInfoVisible.value = false
	}

	const handleRemove = file => {
      const index = fileList.value.indexOf(file);
      const newFileList = fileList.value.slice();
      newFileList.splice(index, 1);
      fileList.value = newFileList;
    };

	//上传头像前的钩子函数
    const beforeUpload = file => {
      imgFlie = file
      fileList.value = [...fileList.value, file];
      return false;
    };

	//上传修改头像方法
    const handleUpload = () => {
      console.log("handleUpload")
      const formData = new FormData();
      fileList.value.forEach(file => {
        formData.append('files[]', file);
      });
      uploading.value = true; 

      axios.get('/thirdPart/qiniu/policy').then((res) =>{
        const qnToken = res.data.data.token
        console.log(qnToken)
        const axiosInstance = axios.create({ withCredentials: false }); //withCredentials 禁止携带cookie，带cookie在七牛上有可能出现跨域问题
        let data = new FormData();
        console.log(fileList.value[0])
        data.append("token", qnToken); //七牛需要的token，后台获取
        data.append("file",imgFlie);
        axiosInstance({
          method: "POST",
          url: 'https://upload.qiniup.com', //上传地址，视情况更换
          data: data,
          timeout: 30000, //超时时间，因为图片上传有可能需要很久
          onUploadProgress: progressEvent => {
            //imgLoadPercent 是上传进度，可以用来添加进度条
            let imgLoadPercent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
          }
        }).then(res => {
          console.log("qiniu:",res.data.key)
          const key =  res.data.key
          // fileList.value = [];
          axios.post("/user/updateAvatar",{
            userId: user.value.userId,
            userAvatar:"http://cdn.qiniu.shuyuanlab.cn/"+key,
          }).then(res => {
            const resp = res.data
            console.log(resp)
            if(resp.success){
              message.success(resp.message)
			  let userTem = user.value
			  userTem.userAvatar = "http://cdn.qiniu.shuyuanlab.cn/"+key
			  store.commit("setUser",userTem)
              uploading.value = false;
			  fileList.value = []
            }else{
              message.error("上传失败！")
              uploading.value = false;
            }
          })
          
        }).catch(function (err) {
            console.log(err);
            //上传失败
        });
      })
    };

    const handleCancel = () => {
      previewVisible.value = false;
    };

    const handlePreview = async file => {
      console.log("handlePreview",file.originFileObj)
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }

      previewImage.value = file.url || file.preview;
      previewVisible.value = true;
    };
	//
	const DeleteArticle = (item) => {
		console.log(item);
		axios.delete("/article/deleteArticle/"+item.userId+"/"+item.articleId)
		.then(res => {
			console.log(res)
		})
	}
	const getUserInfo = () => {
		axios.get("/userDetail/selectUserDetail/" + user.value.userId).then(res => {
			const resp = res.data
			console.log(resp)
			if(resp.success) {
				userInfo.value = resp.data
			}
		})
	}
	const changeImgOk = () => {
		changeImgVisible.value = false
	}
	const showImgModal = () => {
      changeImgVisible.value = true;
    };
    return { 
		showImgModal,
		changeImgOk,
		userInfo,
		getUserInfo,
		DeleteArticle,
		changeInfoVisible,
		changeImgVisible,
		showChangeInfo,
		closeChangeInfo,
        getAllBookmark,
		addCollectionFunc,
		current,
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
		fileList,
		uploading,
		previewVisible,
		previewImage,
		imageUrl,
		handleRemove,
		beforeUpload,
		handleUpload,
		handleCancel,
		handlePreview,
    };
  },

});
</script>

<style scoped>
	.box{
		display: flex;
		width: 100%;
		height: 100%;
        flex-direction: row;
	}
   
	.left-screen{
		width: 25%;
		height: 100%;
        /* border-right: 1px solid #c2c2c2; */
        padding-right: 20px;
		display: flex;
		flex-direction: column;
	}
    .left-screen-top{
		width: 100%;
		height: 30%;
		/* background-color: #aaff00; */
	}
    .left-screen-top-portrait{
		width: 40%;
		height: 50%;
		/* background-color: #08979C; */
		margin-left: 30%; 
		/* border-radius: 50%; */
	}
	
	.left-screen-lower{
		width: 100%;
		height: 70%;
		/* background-color: #ffffff; */
	}
	.left-screen-lower-item{
		width: 100%;
		height: 12%;
		/* border: 1px solid red; */
	}
	.left-screen-lower-item1{
		width: 100%;
		height: 64%;
		/* border: 1px solid #00AA00; */
	}
    .left-screen-top-name{
        width: 100%;
        height: 25%;
        /* background-color: #ffaa00; */
    }
    .left-screen-top-name p{
        font-size: 24px;
        align-items: center;
        text-align: center;
        width: 100%;
        height: 25%;
        margin: 0;
       
    }
	.left-screen-top-name p i{
		width: 80%;
		margin-left: 10%;
		text-overflow: ellipsis;
		/*设置文字超出文本框的内容显示成...*/
		overflow: hidden;
		word-break:break-all;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.left-screen-top-follow{
		width: 100%;
		height: 25%;
		/* background-color: #00aa00; */
		display: flex;
		justify-content: space-evenly;
	}

    .left-screen-top-follow-item{
        flex-wrap: nowrap;
        text-align: center;
        flex-grow: 1;
        justify-content: center;
        align-items: center;
    }
	
	.right-screen{
		width: 75%;
		height: auto;
		/* background-color: #c2c2c2; */
        display: flex;
        flex-direction: column;
		border-left: 1px solid #c2c2c2;
	}

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

	.tools-group{
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.tools-group-item{
		margin-top: 10px;
	}

	.tools-group p{
		font-size: 18px;
	}

</style>
