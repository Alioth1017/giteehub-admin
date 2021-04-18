<template>
  <div class="login-captcha" @click="refresh">
    <div v-if="svg" class="svg" v-html="svg"></div>
    <img v-else class="base64" :src="base64" alt="" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'Captcha',
    emits: ['update:modelValue', 'change'],

    setup(_, { emit }) {
      const base64 = ref('');
      const svg = ref('');
      const userStore = useUserStore();

      const refresh = () => {
        const htmlRoot = document.getElementById('htmlRoot');

        userStore
          .captcha({
            height: 32,
            width: 150,
            background: htmlRoot?.getAttribute('data-theme') === 'dark' ? '#eee' : '#e0e0e0',
          })
          .then(({ captchaId, data }: any) => {
            if (data.includes(';base64,')) {
              base64.value = data;
            } else {
              svg.value = data;
            }

            emit('update:modelValue', captchaId);
            emit('change', {
              base64,
              svg,
              captchaId,
            });
          })
          .catch((err: string) => {
            message.error(err);
          });
      };

      refresh();

      return {
        base64,
        svg,
        refresh,
      };
    },
  });
</script>

<style lang="less" scoped>
  .login-captcha {
    height: 32px;
    cursor: pointer;

    .svg {
      height: 100%;
    }

    .base64 {
      height: 100%;
    }
  }
</style>
