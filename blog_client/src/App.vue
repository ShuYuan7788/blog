<template>
  <a-layout class="layout" >
    <the-header/>
    <a-layout-content style="padding: 0 50px;background-color:#f5f6f7" >
      <div :style="{'margin': '16px 0', background: '#fff', padding: '24px', minHeight: '500px' ,display:flex}">
        <router-view/>
      </div>
    </a-layout-content>
    <the-footer/>
  </a-layout>
</template>

<script>
  import { defineComponent } from 'vue';
  import TheHeader from '@/components/the-header.vue';
  import TheFooter from '@/components/the-footer.vue';
  export default defineComponent({
    name: 'app',
    
    components:{
      TheHeader,
      TheFooter
    }
  })
</script>

<style>


</style>