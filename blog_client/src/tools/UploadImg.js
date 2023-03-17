import axios from 'axios'

const uploadImg = (file) => {
    const promise = new Promise((resolve, rejcet) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            rejcet(file)
            // message.error('You can only upload JPG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            rejcet(file)
            // message.error('Image must smaller than 2MB!');
        }

        
        axios.get('/thirdPart/qiniu/policy').then((res)=>{
            const qnToken = res.data.data.token
            //withCredentials 禁止携带cookie，带cookie在七牛上有可能出现跨域问题
            const axiosInstance = axios.create({ withCredentials: false }); 
            let formData = new FormData();
            formData.append('file', file);
            data.append("token", qnToken);
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
            }).then(res =>{
                resolve()
            })
        })
    })
}