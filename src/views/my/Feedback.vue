<template>
  <div>
    <van-sticky>
      <van-nav-bar title="我要反馈" left-arrow @click-left="onClickLeft" />
    </van-sticky>
    <van-form @submit="onSubmit">
      <van-cell title="反馈类型" value="反馈内容" size="large" />
      <van-field name="checkboxGroup" label="">
        <template #input>
          <van-checkbox-group v-model="checkboxGroup" direction="horizontal">
            <van-checkbox name="1" shape="square">操作复杂</van-checkbox>
            <van-checkbox name="2" shape="square">内容卡顿</van-checkbox>
            <van-checkbox name="3" shape="square">APP体验太差</van-checkbox>
          </van-checkbox-group>
        </template>
      </van-field>
      <div style="border:8px solid #ebedf0"></div>
      <van-cell title="反馈内容" value="" size="large" label="问题描述的越详细，有助于我们更快的解决问题" />
      <van-field name="uploader" label="文件上传">
        <template #input>
          <van-uploader v-model="fileList" multiple :max-count="6" />
        </template>
      </van-field>
      <van-cell title="" value="" label="请上传应用截图，最多上传6张" size="large" />
      <div style="border:8px solid #ebedf0"></div>
      <van-cell title="请留下联系方式" value="" label="" size="large" />
      <van-field v-model="phone" name="phone" label="" placeholder="请输入手机号"
        :rules="[{ required: true, message: '请填写手机号' }]" />
      <van-button round class="btn" type="submit">提交</van-button>
    </van-form>
  </div>
</template>
<script>
export default {
  name: "Feedback",
  setup() {
    const onClickLeft = () => history.back();
    return {
      onClickLeft,
    };
  },
  data() {
    return {
      //反馈意见类型
      checkboxGroup: [],
      //图片文件
      fileList: [],
      //手机号
      phone: "",
      form: {
        checkboxGroup: [],
        //图片文件
        uploader: [],
        //手机号
        phone: "",
      },
    };
  },
  methods: {
    onSubmit(values) {
      this.$notify({ type: 'success', message: '反馈成功' });
    },
  }
}
</script>
<style scoped>
.btn {
  width: 92%;
  color: white;
  font-size: 16px;
  text-align: center;
  background-color: rgb(1, 159, 232);
  border: 0;
}

.van-cell__label {
  margin-top: 4px;
  color: #969799;
  font-size: 12px;
  line-height: 18px;
  width: max-content;
  text-align: left;
}

.van-cell__title {
  font-size: 16px;
  text-align: left;
}

.van-cell {
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 16px 25px;
  overflow: hidden;
  color: #323233;
  font-size: 14px;
  line-height: 24px;
  background-color: #fff;
}
</style>