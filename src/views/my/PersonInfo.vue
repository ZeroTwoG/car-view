<template>
  <div>
    <van-sticky>
      <van-nav-bar title="个人信息" left-arrow @click-left="onClickLeft" />
    </van-sticky>
    <!-- 头像 -->
    <van-cell is-link @click="showSexFn">
      <van-row type="flex" justify="space-between">
        <van-col span="6">头像</van-col>
        <van-col span="3">
          <van-image round width="25px" @click="handleFileChange" height="25px" :src="info.avatar" />
        </van-col>
      </van-row>
    </van-cell>
    <!-- 选择头像的弹出框 -->
    <van-popup v-model:show="picShow" round>
      <van-uploader :after-read="afterRead" :before-read="beforeRead" />
    </van-popup>
    <!-- 性别 -->
    <van-cell is-link @click="showSexFn">
      <van-row type="flex" justify="space-between">
        <van-col span="6">性别</van-col>
        <van-col span="18" style="text-align: right">{{ displaySex }}</van-col>
      </van-row>
    </van-cell>
    <!-- 姓名 -->
    <van-cell-group>
      <van-field v-model="info.userName" label="姓名" input-align="right" @blur="updateUserName(info.userName)" />
    </van-cell-group>
    <!-- 生日 -->
    <van-cell is-link @click="showPopFn">
      <van-row type="flex" justify="space-between">
        <van-col span="3">生日</van-col>
        <van-col span="8">{{ info.birthday }}</van-col>
      </van-row>
    </van-cell>
    <!-- 选择年月日 -->
    <van-popup v-model="show" position="bottom" :style="{ height: '40%' }">
      <van-datetime-picker v-model="currentDate" type="date" @change="changeFn" @confirm="confirmFn" @cancel="cancelFn"
        :min-date="minDate" :max-date="maxDate" />
    </van-popup>
    <!-- 性别选择器 -->
    <van-popup v-model="showSex" position="bottom" :style="{ height: '30%' }">
      <van-picker show-toolbar :columns="sexOptions" @cancel="showSex = false" @confirm="onSexConfirm" />
    </van-popup>
    <van-button type="info" style="width: 90%; border-radius: 20px; position: absolute; bottom: 20px; left: 5%;"
      @click="updateInfo">保存</van-button>
  </div>
</template>

<script>
import axios from "axios";
import { Toast } from "vant";
import { Picker, Popup, Image, Field, Row, Col, NavBar, Uploader, DatetimePicker } from "vant";

export default {
  components: {
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    [Image.name]: Image,
    [Field.name]: Field,
    [Row.name]: Row,
    [Col.name]: Col,
    [NavBar.name]: NavBar,
    [Uploader.name]: Uploader,
    [DatetimePicker.name]: DatetimePicker,
  },
  setup() {
    const onClickLeft = () => history.back();
    return {
      onClickLeft,
      minDate: new Date(1970, 1, 1),
      maxDate: new Date(),
    };
  },
  data() {
    return {
      picShow: false, // 选择图片的弹框默认不显示
      // 用户信息
      info: {
        avatar: "", // 头像路径
        userId: "", // 用户id
        userName: "", // 用户名
        sex: "2", // 性别
        birthday: "", // 生日
      },
      displaySex: "未知", // 显示的性别文本
      msg: "",
      currentDate: new Date(),
      changeDate: new Date(),
      show: false, // 用来显示弹出层
      showSex: false, // 显示性别选择器
      timeValue: "",
      previewImage: "", // 预览图片
      uploadResult: "", // 用于存储上传结果
      sexOptions: ["男", "女", "保密"], // 性别选项
      nameJudeg: true, // 判断昵称是否违规
      updateJudeg: true, // 判断是否审核中
    };
  },
  created() {
    const userDataStr = sessionStorage.getItem("user");
    const userData = JSON.parse(userDataStr);
    this.info.userId = userData.userId;
    this.init();
  },
  methods: {
    /**
     * ai审核用户名
     * @param name
     */
    updateUserName(name) {
      this.updateJudeg = false
      this.$axios.get(`/chat/chatAiFixationJudeg/${name}/${3}`).then(resp => {
        console.log(resp.data.data)
        if (resp.data.data.judge === 0) {
          this.nameJudeg = true;
          Toast("昵称审核成功");
        } else {
          this.nameJudeg = false;
          Toast("昵称违规" + resp.data.data.msg);
        }
        this.updateJudeg = true;
      }).catch(function (error) {
        console.log(error);
      });
    },
    init() {
      axios.get("/my/frontUser/getUserInfo?userId=" + this.info.userId).then((res) => {
        if (res.data.code === 200) {
          this.info.userName = res.data.data.userName;
          this.info.avatar = res.data.data.avatar;
          this.info.userId = res.data.data.userId;
          this.info.birthday = res.data.data.birthday;

          // 性别数字转文字
          switch (res.data.data.sex) {
            case '0':
              this.displaySex = '男';
              break;
            case '1':
              this.displaySex = '女';
              break;
            default:
              this.displaySex = '保密';
              break;
          }

          console.log(this.info);
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    timeFormat(time) {
      // 时间格式化 2019-09-08
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      return `${year}-${month}-${day}`;
    },
    onSexConfirm(value) {
      // 更新显示的性别
      this.displaySex = value;
      // 更新 info 中的性别值
      this.info.sex = value;
      // 关闭弹出框
      this.showSex = false;
    },
    showPopFn() {
      this.show = true;
    },
    showSexFn() {
      this.showSex = true;
    },
    changeFn() {
      this.changeDate = this.currentDate; // Tue Sep 08 2020 00:00:00 GMT+0800 (中国标准时间)
    },
    confirmFn() {
      // 确定按钮
      this.info.birthday = this.timeFormat(this.currentDate);
      this.show = false;
    },
    cancelFn() {
      this.show = false;
    },
    handleFileChange() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.click();

      input.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // 创建一个读取文件的 FileReader 对象
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewImage = e.target.result; // 将读取的结果赋值给预览图片
          this.uploadFile(file);
        };
        reader.readAsDataURL(file); // 读取文件为 Data URL 格式
      };
    },
    uploadFile(file) {
      // 创建 FormData 对象
      const formData = new FormData();
      formData.append('file', file);

      // 发送文件到后端
      axios.post('/common/menu/img', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          console.log('上传成功:', response.data);
          this.info.avatar = response.data; // 假设后端返回的图片URL在 data.url 中
          this.picShow = false;
          Toast('图片上传成功');
        })
        .catch(error => {
          console.error('上传失败:', error);
          Toast('图片上传失败');
        });
    },
    // 上传图片之前判断图片是否符合条件
    beforeRead(file) {
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        Toast("请上传 jpg/png 格式图片");
        return false;
      }
      let isLt1M = file.size / 1024 / 1024 <= 5;
      if (!isLt1M) {
        Toast("图片大小5M以内");
        return false;
      }
      return true;
    },
    afterRead(file) {
      console.log(file);
      // 将文件上传至服务器
      const forms = new FormData();
      forms.append("file", file.file); // 获取上传图片信息
      this.$http.post("/user/people/api/upload", forms, {
        headers: {
          "content-type": "multipart/form-data",
          token: this.token,
        },
      }).then((res) => {
        // 如果传入的响应状态码为200，则成功将文件发送给后台
        if (res.data.code === 200) {
          this.info.avatar = res.data.data;
          this.picShow = false;
          Toast('图片上传成功');
        } else {
          Toast('图片上传失败');
        }
      });
    },
    //更新客户信息
    updateInfo() {
      if (!this.updateJudeg) {
        Toast("审核中..");
        return;
      }
      if (!this.nameJudeg) {
        Toast("昵称违规");
        return;
      }
      // 文字性别转数字
      let sexForSubmit;
      switch (this.info.sex) {
        case '男':
          sexForSubmit = '0';
          break;
        case '女':
          sexForSubmit = '1';
          break;
        default:
          sexForSubmit = '2';
          break;
      }

      // 更新info中的sex为转换后的数字
      this.info.sex = sexForSubmit;

      axios.post("/my/frontUser/updateInfo", this.info).then((res) => {
        if (res.data.code === 200) {
          Toast(res.data.msg);
          // 性别数字转文字
          switch (res.data.data.sex) {
            case '0':
              this.info.sex = '男';
              break;
            case '1':
              this.info.sex = '女';
              break;
            default:
              this.info.sex = '未知';
              break;
          }
        } else {
          Toast(res.data.msg);
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    //选择器
    onConfirm() { },
    onCancel() { },
    onChange() { },
  },
};
</script>

<style scoped>
/* 样式可以根据需要自定义 */
</style>