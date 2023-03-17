<template>
  <a-empty :image="simpleImage" />
</template>
<script>
import { defineComponent , onMounted } from 'vue';
import { Empty } from 'ant-design-vue';
import { useRouter } from "vue-router"  // 引入userRouter

export default defineComponent({
  name:"Temp",
  setup() {
    const router = useRouter()
    onMounted(()=>{
        console.log("onMounted temp")
        const likely = router.currentRoute.value.query.likely || ""
        router.push({
            name:"Index",
            query:{ 
                likely:likely
            }
        }) 
    })
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
    };
  },

});
</script>