<template>
  <div>
    <van-sticky>
      <van-nav-bar
          title="系统设置"
          left-arrow
          @click-left="onClickLeft"/>
    </van-sticky>
    <van-cell-group>
      <van-cell title="意见反馈" is-link @click="opinion('/feedback')"/>
      <van-cell title="关于我们" is-link @click="about('/AboutUs')"/>
    </van-cell-group>
    <div style="border: 8px solid #ebedf0"></div>
    <van-cell-group>
      <van-cell title="清除缓存" is-link @click="clearCache"/>
      <van-cell title="检查更新" is-link @click="checkUpdate"/>
    </van-cell-group>
    <!-- 底部 -->
    <van-tabbar>
      <van-col span="24" style="margin-bottom: 0;text-align: center">
        <van-button hairline class="btn" @click="logout" style="color: #39a9ed">退出登录</van-button>
      </van-col>
    </van-tabbar>
  </div>
</template>
<script>
import {Dialog} from "vant";
import {Toast} from "vant";

export default {
  name: "SystemSetting",
  setup() {
    const onClickLeft = () => history.back();
    return {
      onClickLeft,
    };
  },
  methods: {
    //退出登录
    logout() {
      //清除token
      sessionStorage.removeItem("token");
      //跳转到首页
      this.$router.push("/home");
    },
    //意见反馈跳转
    opinion(uri) {
      this.$router.push(
          uri,
          () => {
          },
          () => {
          }
      );
    },
    //关于我们跳转
    about(uri) {
      this.$router.push(
          uri,
          () => {
          },
          () => {
          }
      );
    },
    //清除缓存
    clearCache() {
      Dialog.confirm({
        title: "提示",
        message: "确定要清除本地缓存？",
      })
          .then(() => {
            // on confirm
          })
          .catch(() => {
            // on cancel
          });
    },
    //检查更新
    checkUpdate() {
      Toast("已经是最新版本了");
    },
  },
}
</script>
<style scoped>

</style>