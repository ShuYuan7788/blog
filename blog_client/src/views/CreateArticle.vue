<template>
  <div class="box">
    <h1>Write your essay here</h1>
    {{ editor }}
    <tinymce-editor 
      :value="contents"
      :disabled="false"
      @onClick="onClick"
      @release="getTinymce"
      >
    </tinymce-editor>
  </div> 
  
  <!-- 抽屉提交菜单 -->
  <div>
    <a-drawer
      :width="550" 
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      :footer-style="{ textAlign: 'right' }"
      @close="onClose"
    >
      <div>

      </div>
      <div>
        <a-page-header
          style="border: 1px solid rgb(235, 237, 240)"
          title="发布文章"
          sub-title="在这设置您的文章"
        />
        <div style="margin-top:10px;margin-bottom:10px;">
          <a-form
          ref="formRef"
          :model="formState"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          >
  
            <a-form-item style="margin-bottom:10px;" label="文章图片">
              <div class="upload-box">
                <a-upload
                  v-model:file-list="fileList" 
                  :remove="handleRemove" 
                  :before-upload="beforeUpload"
                  list-type="picture-card"
                  @preview="handlePreview"
                >
                  <div v-if="fileList.length < 1">
                    <plus-outlined />
                    <div class="ant-upload-text">upload</div>
                  </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </div>
            </a-form-item>

            <a-form-item ref="articleTitle" label="文章标题" name="articleTitle">
                <a-input v-model:value="formState.articleTitle" />
            </a-form-item>

            <a-form-item label="标签" name="articleLabel">
                <a-select 
                v-model:value="formState.articleLabel" 
                >
                    <a-select-option  v-for="c in articleLabels"  :value="c.value" :key="c.value">
                        {{c.value}}
                    </a-select-option>  
                </a-select>
            </a-form-item>

            <a-form-item label="文章类型" name="articleType">
            <a-radio-group v-model:value="formState.articleType">
                <a-radio value="1">转载</a-radio>
                <a-radio value="2">原创</a-radio>
            </a-radio-group>
            </a-form-item>

            <a-form-item label="发布形式" name="releaseForm">
            <a-radio-group v-model:value="formState.releaseForm">
                <a-radio value="1">公开</a-radio>
                <a-radio value="2">私密</a-radio>
            </a-radio-group>
            </a-form-item>

            <a-form-item label="文章描述" name="articleDescription">
            <a-textarea v-model:value="formState.articleDescription" />
            </a-form-item>

          </a-form>
        </div>  
      </div>
      
      <template #footer>
        <a-button style="margin-right: 8px" @click="onclose">取消</a-button>
        <a-button type="primary" 
          @click="onSubmit" >确定</a-button>
      </template>
    </a-drawer>
  </div>
</template>

<script>
  import { defineComponent,getCurrentInstance ,onMounted, UnwrapRef ,ref ,toRaw, reactive, computed} from 'vue';
  import TinymceEditor from '@/components/tinymce-editor.vue'
  import { PlusOutlined ,LoadingOutlined ,UploadOutlined} from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import axios from 'axios'
  import store from '../store/index'
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);

      reader.onerror = error => reject(error);
    });
  }
  export default defineComponent({
      name: "CreatArticle",
       components: {
        TinymceEditor,
        LoadingOutlined,
        PlusOutlined,
        UploadOutlined,
      },
      methods:{

      },
      data() {
        
        return {

        }
      },
      mounted () {
        
      },
      setup(props,context) {
        const hasImg = ref(false)
        const user = computed(() => store.state.user)
        const fileList = ref([]);
        let firstFile;
        const uploading = ref(false);
        const imageUrl = ref('');
        const previewVisible = ref(false);
        const previewImage = ref('');
        const contents = ref("")
        const formRef = ref();
        const formState = reactive({
          articleTitle: '',
          articleLabel: [],
          articleType: 0,
          releaseForm: 0,
          articleDescription: '',
        });
        let articleLabels = ref([
        {
              value: '科技',
              lable: '科技',
          },
          {
              value: '学习',
              lable: '学习',
          },
          {
              value: 'JAVA',
              lable: 'JAVA',
          },
          {
              value: 'Python',
              lable: 'Python',
          },
        ])
        const rules = {
          articleTitle: [{
            required: true,
            message: '文章标题不能为空！',
            trigger: 'blur',
          }, {
            min: 1,
            max: 30,
            message: '标题过长',
            trigger: 'blur',
          }],
          articleLabel: [{
            required: true,
            message: '请选择一个标签',
            trigger: 'change',
          }],
          releaseForm: [{
            required: true,
            message: '请选择文发布形式',
            trigger: 'change',
          }],
          articleType: [{
            required: true,
            message: '请选择文章类型',
            trigger: 'change',
          }],
          articleDescription: [{
            required: true,
            message: '请输入文章描述',
            trigger: 'blur',
          }],
        };

        const visible = ref(false);
        const showDrawer = () => {
          visible.value = true;
        };

        const onClose = () => {
          visible.value = false;
        };
 
        const onSubmit = () => {
          formRef.value.validate().then(() => {  
            let formData = new FormData();
            fileList.value.forEach(file => {
               formData.append('files[]', file);
            });

            uploading.value = true; 
            message.info("图片上传中！")
            axios.get('/thirdPart/qiniu/policy').then((res) =>{
              const qnToken = res.data.data.token
              const axiosInstance = axios.create({ withCredentials: false }); //withCredentials 禁止携带cookie，带cookie在七牛上有可能出现跨域问题
              let data = new FormData();
              data.append("token", qnToken); //七牛需要的token，后台获取
              data.append("file",firstFile);
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
                const key = res.data.key
                let imgUrl =""
                if(hasImg.value){
                  imgUrl = `http://cdn.qiniu.shuyuanlab.cn/${key}`
                }
                // fileList.value = [];
                message.info("图片上传成功！")
                uploading.value = false;
                axios.post("/article/commitArticle",{
                  userId: user.value.userId, //userId
                  content: contents.value,  //文章内容
                  cover:imgUrl, //文章封面URL
                  articleTitle: formState.articleTitle.trim(), //文章标题
                  articleLabel: formState.articleLabel.trim(), //文章标签
                  articleType:formState.articleType, //文章类型
                  releaseForm:formState.releaseForm, //发布形式
                  articleDescription: formState.articleDescription.trim() //文章描述
                }).then(res => {
                  
                  if(res.data.success){
                    message.info("文章提交成功！")
                    visible.value = false;
                  }
                }).catch(err => {
                  message.info("文章提交失败！")
                })

              }).catch(function (err) {
                  message.info("图片上传失败！")
                  //上传失败
              });
            })    
 
          }).catch(error => {
            message.info("error!")
          });
        };
        const getTinymce = (content) => {
          // let content = tinymce.activeEditor.getContent()
          contents.value = content;
          if("" === contents.value.trim()){
            message.info("文章内容不能为空！")
          }else{
            showDrawer()
          }
        }

          const getImgList = () => {
            console.log(fileList)
          }
          const handleRemove = file => {
            hasImg.value = false
            const index = fileList.value.indexOf(file);
            const newFileList = fileList.value.slice();
            newFileList.splice(index, 1);
            fileList.value = newFileList;
          };

          const beforeUpload = file => {
            hasImg.value = true
            firstFile = file;
            fileList.value = [...fileList.value, file];
            return false;
          };

          // const handleUpload = () => {
          //   const formData = new FormData();
          //   fileList.value.forEach(file => {
          //     formData.append('files[]', file);
          //   });
          //   uploading.value = true; 

          //   axios.get('/thirdPart/qiniu/policy').then((res) =>{
          //     const qnToken = res.data.data.token
          //     const axiosInstance = axios.create({ withCredentials: false }); //withCredentials 禁止携带cookie，带cookie在七牛上有可能出现跨域问题
          //     let data = new FormData();
          //     data.append("token", qnToken); //七牛需要的token，后台获取
          //     data.append("file",firstFile);
          //     axiosInstance({
          //       method: "POST",
          //       url: 'https://upload.qiniup.com', //上传地址，视情况更换
          //       data: data,
          //       timeout: 30000, //超时时间，因为图片上传有可能需要很久
          //       onUploadProgress: progressEvent => {
          //         //imgLoadPercent 是上传进度，可以用来添加进度条
          //         let imgLoadPercent = Math.round(
          //           (progressEvent.loaded * 100) / progressEvent.total
          //         );
          //       }
          //     }).then(res => {
          //       // fileList.value = [];
          //       message.info("上传成功！")
          //       uploading.value = false;
          //     }).catch(function (err) {
          //         //上传失败
          //     });
          //   })
          // };

          const handleCancel = () => {
            previewVisible.value = false;
          };

          const handlePreview = async file => {
            if (!file.url && !file.preview) {
              file.preview = await getBase64(file.originFileObj);
            }

            previewImage.value = file.url || file.preview;
            previewVisible.value = true;
          };
          
        return {
          visible,
          fileList,
          uploading,
          previewVisible,
          previewImage,
          imageUrl,

          formRef,
          labelCol: {
            span: 4,
          },
          wrapperCol: {
            span: 14,
          },
          other: '',
          formState,
          rules,
          articleLabels,
          contents,
          onSubmit,
          getTinymce,
          handleRemove,
          beforeUpload,
          getImgList,
          handleCancel,
          handlePreview,
          showDrawer,
          onClose,
        };
      },
     
      watch: {

      }
  });
 
</script>
<style scoped>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.upload-box{
  display: flex;
  flex-direction: row;
  width: 100%;
}
</style>