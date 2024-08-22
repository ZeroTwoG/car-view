<template>
  <div>
    <van-sticky>
      <van-nav-bar title="注册" left-arrow @click-left="onClickLeft" />
    </van-sticky>
    <h2 style="text-align: center;">ETCC洗车用户注册</h2>
    <van-form @submit="onSubmit">
      <van-field v-model="phoneNumber" name="phoneNumber" label="手机号" placeholder="请输入手机号" :rules="[
        {
          pattern:
            /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
          message: '请输入正确的手机号',
        },]" />
      <van-field v-model="sms" label="验证码" name="sms" placeholder="请输入短信验证码">
        <template #button>
          <van-button v-if="!isCounting" size="small" type="primary" @click="selectMobile">
            发送验证码
          </van-button>
          <span v-else>{{ countdown }} 秒后重新发送</span>
        </template>
      </van-field>
      <van-field type="password" v-model="password" name="password" label="密码" placeholder="请输入密码" :rules="[
        {
          pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/,
          message: '长度在 6 到 12个字符，包含字母数字',
          trigger: 'blur',
        },
      ]" />
      <van-field v-model="checkPassword" name="checkPassword" type="password" label="确认密码" placeholder="请再次输入密码" :rules="[
        {
          pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/,
          message: '长度在 6 到 12个字符，包含字母数字',
          trigger: 'blur',
        },]" />
      <div style="text-align: center">
        <van-button round type="info" style="margin-top: 15px; width: 70%">注册
        </van-button>
      </div>
    </van-form>
    <!-- 登录按钮 -->
    <div style="text-align: center">
      <van-button style="margin-top: 15px; width: 70%" @click="goLogin">去登录</van-button>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { Toast } from 'vant';

export default {
  name: "Register",
  setup() {
    const onClickLeft = () => history.back();
    return {
      onClickLeft,
    };
  },
  data() {
    return {
      phoneNumber: "", // 手机号
      sms: "", // 验证码
      password: "", // 密码
      checkPassword: "", // 第二次输入的密码
      countdown: 0, // 倒计时剩余秒数
      isCounting: false, // 是否正在进行倒计时
    }
  },
  methods: {
    // 查询手机号有没有被注册
    selectMobile() {
      axios.get(`http://172.16.7.55:7011/login/FrontUser/selectByPhone?phone=${this.phoneNumber}`).then((res) => {
        if (res.data.code === 200) {
          // 未注册，发送验证码
          this.sendCode();
        } else {
          console.log(res.data);

          Toast({
            message: res.data.msg,
            position: 'top',
          });
        }
      })
    },
    // 发送验证码的方法
    sendCode() {
      axios.post(`http://172.16.7.55:7011/login/FrontUser/sendSms?phone=${this.phoneNumber}&type=0`).then((res) => {
        if (res.data.code === 200) {
          // 发送短信成功
          this.$toast(res.data.data);
          this.startCountdown(); // 开始倒计时
        } else {
          // 重复发送或发送失败
          this.$toast(res.data.msg);
        }
      })
    },
    // 开始倒计时
    startCountdown() {
      this.countdown = 60; // 设置初始倒计时为 60 秒
      this.isCounting = true; // 设置为正在倒计时状态
      const intervalId = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(intervalId); // 清除定时器
          this.isCounting = false; // 结束倒计时
        }
      }, 1000);
    },
    // 注册提交
    onSubmit(values) {
      if (values.password !== values.checkPassword) {
        this.$notify({ type: 'danger', message: '二次密码不正确' });
        return;
      }
      // 验证验证码是否正确
      axios.get(`http://172.16.7.55:7011/login/FrontUser/isSms?phone=${values.phoneNumber}&code=${values.sms}&type=0`).then((res) => {
        if (res.data.code === 200) {
          this.add(values);
        } else {
          // 验证码错误
          this.$toast(res.data.msg);
        }
      })
    },
    // 去登录
    goLogin() {
      this.$router.push('/login');
    },
    // 添加注册用户操作
    add(values) {
      axios.post('http://172.16.7.55:7011/login/FrontUser/registerFrontUser?phoneNumber=' + values.phoneNumber + "&password=" + values.password).then((res) => {
        if (res.data.code === 200) {
          this.$notify({ type: 'success', message: res.data.data });
          this.goLogin();
        } else {
          this.$notify({ type: 'danger', message: res.data.msg });
        }
      })
    },
  }
}
</script>

<style scoped>
.nav_spj {
  height: 350px;
  background-color: aqua;
}
</style>