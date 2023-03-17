<template>
  <div class="top-group">
      <button class="btn" @click="release">发布文章</button>
    </div>
  <div class="tinymce-editor">
    <editor v-model="myValue"
      :init="init"
      :disabled="disabled"
      @click="onClick">
    </editor>
  </div>
</template>
<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
// 编辑器插件plugins
import 'tinymce/plugins/image'// 插入上传图片插件
// import 'tinymce/plugins/media'// 插入视频插件
import 'tinymce/plugins/table'// 插入表格插件
import 'tinymce/plugins/lists'// 列表插件
import 'tinymce/plugins/wordcount'// 字数统计插件hr
import 'tinymce/plugins/textpattern'
import 'tinymce/plugins/hr'
import 'tinymce/icons/default/icons.js'
import 'tinymce/plugins/codesample'
import axios from 'axios'
// import { Options } from 'vue-class-compent' 
import { defineComponent, ref } from 'vue';
export default {
  components: {
    Editor
  },
  props: {
    titleName: {
      type: String,
      default: 'cs'
    },
    value: {
      type: String,
      default: ''
    },
    baseUrl: {
      type: String,
      default: './'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: { 
      type: [String, Array],
      default: 'lists image table wordcount textpattern emoticons hr codesample'
    },
    toolbar: {
      type: [String, Array],
      default: 'undo redo |  formatselect | hr bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table  | codesample removeformat'
    },
    
  },
  data () {

    return {
      init: {
        language_url: `${this.baseUrl}/tinymce/langs/zh_CN.js`,
        language: 'zh_CN',
        skin_url: `${this.baseUrl}/tinymce/skins/ui/oxide`,
        content_css: `${this.baseUrl}/tinymce/skins/content/default/content.css`,
        // skin_url: `${this.baseUrl}/tinymce/skins/ui/oxide-dark`, // 暗色系
        // content_css: `${this.baseUrl}/tinymce/skins/content/dark/content.css`, // 暗色系
        height: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: false,
        content_style: "img {max-width:100%;}",
        textpattern_patterns:[
          {start: '*', end: '*', format: 'italic'},
          {start: '**', end: '**', format: 'bold'},
          {start: '#', format: 'h1'},
          {start: '##', format: 'h2'},
          {start: '###', format: 'h3'},
          {start: '####', format: 'h4'},
          {start: '#####', format: 'h5'},
          {start: '######', format: 'h6'},
          {start: '1. ', cmd: 'InsertOrderedList'},
          {start: '* ', cmd: 'InsertUnorderedList'},
          {start: '- ', cmd: 'InsertUnorderedList' }
        ],
        codesample_languages: [
          {text: 'HTML/XML', value: 'markup'},
          {text: 'JavaScript', value: 'javascript'},
          {text: 'CSS', value: 'css'},
          {text: 'PHP', value: 'php'},
          {text: 'VUE', value: 'vue'},
        ],
        // 图片上传处理函数
        images_upload_handler: (blobInfo, success, failure) => {
           this.imgUpload(blobInfo, success, failure);
        }
      },
      myValue: this.value,
    }
  },
  
  mounted () {
    tinymce.init({})
    this.getUploadToken()
    // console.log(tinymce)
  },
  methods: {
    onSubmit(){
      this.$emit('onSubmit',tinymce)
    },
    onClick (e) {
      this.$emit('onClick', e)
    },
    release(){
        //content 是文本内容
        const content = tinymce.activeEditor.getContent()
        this.$emit('release',content)
    },

    clear () {
      this.myValue = ''
    },
    async getUploadToken() {
        let res = await axios.get('http://localhost:8080/thirdPart/qiniu/policy') //更换自己的请求方法和路径
        this.qnToken = res.data.data.token
    },
   imgUpload(blobInfo, success, failure) {
      const axiosInstance = axios.create({ withCredentials: false }); //withCredentials 禁止携带cookie，带cookie在七牛上有可能出现跨域问题
      let data = new FormData();
      console.log("file",blobInfo.blob())
      data.append("token", this.qnToken); //七牛需要的token，后台获取
      data.append("file", blobInfo.blob());
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
        })
        .then(res => {
          // console.log(res)
            // 调用成功回调，返回用七牛外链地址和返回的key拼接的图片路径
            success(`http://cdn.qiniu.shuyuanlab.cn/${res.data.key}`);
        })
        .catch(function (err) {
            console.log(err);
            //上传失败
        });
      },

  },
  watch: {
    value (newValue) {
      this.myValue = newValue      
    },
    myValue (newValue) {
      this.$emit('input', newValue)
    }
  }
}
</script>

<style scoped>
  .top-group {
    display: flex;
    justify-content: center;
    flex-direction: row;
    margin-bottom: 10px;
  }
</style>