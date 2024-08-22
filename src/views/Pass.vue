<template>
  <div>
    <van-sticky>
      <van-nav-bar title="忘记密码" left-arrow @click-left="onClickLeft" />
    </van-sticky>
    <van-form @submit="onSubmit">
      <van-row>
        <van-col span="24">
          <van-cell-group>
            <van-field v-model="phoneNumber" label="手机号" placeholder="请输入手机号" name="phoneNumber" :rules="[
              {
                pattern:
                  /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
                message: '请输入正确的手机号',
              },]" />
            <van-field v-model="sms" name="sms" center clearable label="获取验证码" placeholder="请输入短信验证码">
              <template #button>
                <van-button v-if="!isCounting" size="small" type="primary" @click="selectMobile">发送验证码</van-button>
                <span v-else>{{ countdown }} 秒后重新发送</span>
              </template>
            </van-field>
            <van-field v-model="password" name="password" label="新密码" placeholder="请输入密码" :rules="[
              {
                pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/,
                message: '长度在 6 到 12个字符，包含字母数字',
                trigger: 'blur',
              },
            ]" />
            <van-field v-model="checkPassword" label="确认密码" name="checkPassword" placeholder="请确认密码" :rules="[
              {
                pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/,
                message: '长度在 6 到 12个字符，包含字母数字',
                trigger: 'blur',
              },
            ]" />
          </van-cell-group>
        </van-col>
      </van-row>
      <div style="text-align: center">
        <van-button round type="info" style="margin-top: 10px; width: 70%">确认修改
        </van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import axios from "axios";
import { Toast } from "vant";

export default {
  name: "Pass",
  setup() {
    const onClickLeft = () => history.back();
    return {
      onClickLeft,
    };
  },
  data() {
    return {
      phoneNumber: "", //手机号
      sms: "", //验证码
      password: "", //密码
      checkPassword: "", //第二次输入的密码
      countdown: 0, // 倒计时剩余秒数
      isCounting: false, // 是否正在进行倒计时
    }
  },
  methods: {
    jump(uri) {
      this.$router.push(uri);
    },
    //查询手机号有没有被注册
    selectMobile() {
      axios.get("http://172.16.7.55:7011/login/FrontUser/selectByPhone?phone=" + this.phoneNumber).then((res => {
        if (res.data.code === 200) {
          Toast({
            message: "手机号未注册",
          });
        } else {
          //发送验证码
          this.sendCode();
        }
      }))
    },
    //表单提交
    onSubmit(values) {
      if (values.password !== values.checkPassword) {
        this.$notify({ type: 'danger', message: "二次密码不正确" });
      }
      //验证验证码是否正确
      axios.get("http://172.16.7.55:7011/login/FrontUser/isSms?phone=" + values.phoneNumber + "&code=" + values.sms + "&type=1").then((res => {
        if (res.data.code === 200) {
          this.updatePass(values);
        } else {
          //验证码错误
          this.$toast(res.data.msg);
        }
      }))
    },
    //更新密码
    updatePass(values) {
      axios.put("http://172.16.7.55:7011/login/FrontUser/updatePass?phoneNumber=" + values.phoneNumber + "&password=" + values.password).then((res => {
        if (res.data.code === 200) {
          this.$notify({ type: 'success', message: res.data.msg });
          this.$router.push("/login");
        } else {
          this.$notify({ type: 'danger', message: res.data.msg });
        }
      }))
    },
    //发送验证码的方法
    sendCode() {
      axios.post("http://172.16.7.55:7011/login/FrontUser/sendSms?phone=" + this.phoneNumber + "&type=1").then((res => {
        if (res.data.code === 200) {
          //发送短信成功
          this.$toast(res.data.data);
        } else {
          //重复发送或发送失败
          this.$toast(res.data.msg);
        }
      }))
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
  }
}
</script>
<style scoped></style>