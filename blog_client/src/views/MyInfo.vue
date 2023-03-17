<template>
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
 


  <div v-for=" i in []" :key="i">
    <p>{{i}}</p>
  </div>



</template>
<script>

import { UploadOutlined, LoadingOutlined, PlusOutlined} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';
import axios from 'axios'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = error => reject(error);
  });
}

export default defineComponent({
  components: {
    UploadOutlined,
    LoadingOutlined,
    PlusOutlined
  },

  setup() {
    let imgFlie;
    const fileList = ref([]);
    const uploading = ref(false);
    const imageUrl = ref('');
    const previewVisible = ref(false);
    const previewImage = ref('');

    const getImgList = () => {
      console.log(fileList)
    }
    const handleRemove = file => {
      const index = fileList.value.indexOf(file);
      const newFileList = fileList.value.slice();
      newFileList.splice(index, 1);
      fileList.value = newFileList;
    };

    const beforeUpload = file => {
      imgFlie = file
      fileList.value = [...fileList.value, file];
      return false;
    };

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
            userId:"125843224081338369",
            userAvatar:"http://cdn.qiniu.shuyuanlab.cn/"+key,
          }).then(res => {
            const resp = res.data
            console.log(resp)
            if(resp.success){
              message.success(resp.message)
              uploading.value = false;
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

    return {
      fileList,
      uploading,
      previewVisible,
      previewImage,
      imageUrl,
      handleRemove,
      beforeUpload,
      handleUpload,
      getImgList,
      handleCancel,
      handlePreview,
    };
  },

});
</script>
<style s>
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
</style>