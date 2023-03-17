<template>
    <a-comment>
        <template #avatar>
        <a-avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            alt="Han Solo"
        />
        </template>
        <template #content>
        <a-form-item>
            <a-textarea v-model:value="value" :rows="4" />
        </a-form-item>
        <a-form-item>
            <a-button html-type="submit" :loading="submitting" type="primary" @click="handleSubmit">
            Add Comment
            </a-button>
        </a-form-item>
        </template>
    </a-comment>

 
</template>
<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const submitting = ref(false);
    const value = ref('');

    const handleSubmit = () => {
        if (!value.value) {
        return;
        }
        submitting.value = true;
        // axios
    };

    return {
      submitting,
      value,
      handleSubmit,
    };
  },

});
</script>