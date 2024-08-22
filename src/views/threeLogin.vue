<template>
  <div class="centered-content">
    <transition name="fade-in">
      <div class="custom-cell">
        <span class="text">研发中，暂不支持使用</span>
        <van-icon :name="isHovering ? 'arrow' : 'info-o'" class="van-icon van-icon-arrow van-cell__right-icon"
          @click="goToLogin" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave" />
      </div>
    </transition>
  </div>
</template>

<script>
import { Icon } from 'vant';

export default {
  components: {
    [Icon.name]: Icon,
  },
  data() {
    return {
      isHovering: false,
    };
  },
  methods: {
    onMouseEnter() {
      this.isHovering = true;
    },
    onMouseLeave() {
      this.isHovering = false;
    },
    goToLogin() {
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.centered-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2, #f5f7fa);
  /* 复杂渐变背景 */
  background-size: 200% 200%;
  /* 背景大小 */
  animation: gradient 10s ease infinite;
  /* 渐变动画 */
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.custom-cell {
  display: flex;
  align-items: center;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  /* 更优雅的字体 */
  font-size: 22px;
  /* 进一步减小字号 */
  color: #333;
  padding: 60px;
  border-radius: 30px;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
  /* 更柔和的阴影 */
  background-color: white;
  max-width: 80%;
  transition: transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out;
  /* 添加过渡效果 */
  border: 2px solid transparent;
  /* 添加透明边框 */
  background-clip: padding-box;
  /* 背景剪裁 */
  position: relative;
  overflow: hidden;
  /* 隐藏溢出部分 */
}

.fade-in-enter-active,
.fade-in-leave-active {
  transition: opacity 0.6s;
}

.fade-in-enter-from,
.fade-in-leave-to {
  opacity: 0;
}

/* 鼠标悬停效果 */
.custom-cell:hover {
  transform: scale(1.05);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  /* 更大的阴影 */
  border-color: #007bff;
  /* 边框高亮 */
}

/* 文字样式 */
.text {
  margin-right: 20px;
  /* 减小与图标之间的空隙 */
  letter-spacing: 1.2px;
  /* 减小字母间距 */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  /* 文字阴影 */
  background: linear-gradient(90deg, #ff00cc, #333, #ff00cc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: background 0.4s ease-in-out, -webkit-background-clip 0.4s ease-in-out, -webkit-text-fill-color 0.4s ease-in-out;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .custom-cell {
    font-size: 18px;
    padding: 40px;
  }
}

/* 自定义图标样式 */
.van-icon-arrow {
  cursor: pointer;
  transition: transform 0.4s ease-in-out, color 0.4s ease-in-out;
  font-size: 32px;
  /* 减小图标大小 */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  /* 图标阴影 */
}

.van-icon-arrow:hover {
  transform: translateX(5px);
  color: #007bff;
  /* 高亮颜色 */
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

/* 添加动态背景效果 */
.custom-cell::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 50% 50%, rgba(0, 123, 255, 0.15), transparent 70%);
  border-radius: 50%;
  transform: scale(0);
  transition: transform 0.6s ease-in-out;
  z-index: -1;
}

.custom-cell:hover::before {
  transform: scale(1);
}

/* 添加光晕效果 */
.custom-cell::after {
  content: "";
  position: absolute;
  top: -15px;
  left: -15px;
  width: calc(100% + 30px);
  height: calc(100% + 30px);
  border-radius: 50%;
  background: radial-gradient(circle at 50% 50%, rgba(0, 123, 255, 0.15), transparent 70%);
  opacity: 0;
  transition: opacity 0.6s ease-in-out, transform 0.6s ease-in-out;
  z-index: -2;
}

.custom-cell:hover::after {
  opacity: 1;
  transform: scale(1.1);
}

/* 添加旋转动画 */
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.van-icon-arrow {
  animation: rotate 5s linear infinite;
  /* 添加旋转动画 */
}

/* 悬停时暂停旋转 */
.custom-cell:hover .van-icon-arrow {
  animation-play-state: paused;
}

/* 增强背景效果 */
.centered-content {
  background-image: linear-gradient(135deg, #f5f7fa, #c3cfe2, #f5f7fa),
    radial-gradient(circle at 50% 50%, #f5f7fa, #c3cfe2, #f5f7fa);
  background-blend-mode: multiply;
  background-size: 200% 200%, 400% 400%;
  animation: gradient 10s ease infinite, gradient-radial 20s ease infinite;
}

@keyframes gradient-radial {
  0% {
    background-position: 0% 50%, 0% 50%;
  }

  50% {
    background-position: 100% 50%, 100% 50%;
  }

  100% {
    background-position: 0% 50%, 0% 50%;
  }
}

/* 增强文字样式 */
.text {
  font-weight: bold;
  /* 加粗文字 */
  font-size: 22px;
  /* 进一步减小字号 */
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2);
  /* 加大文字阴影 */
  background: linear-gradient(90deg, #ff00cc, #333, #ff00cc, #ff00cc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: background 0.4s ease-in-out, -webkit-background-clip 0.4s ease-in-out, -webkit-text-fill-color 0.4s ease-in-out;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .custom-cell {
    font-size: 20px;
    padding: 40px;
  }
}

/* 自定义图标样式 */
.van-icon-arrow {
  cursor: pointer;
  transition: transform 0.4s ease-in-out, color 0.4s ease-in-out;
  font-size: 32px;
  /* 减小图标大小 */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  /* 图标阴影 */
}

.van-icon-arrow:hover {
  transform: translateX(5px);
  color: #007bff;
  /* 高亮颜色 */
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

/* 添加动态背景效果 */
.custom-cell::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 50% 50%, rgba(0, 123, 255, 0.15), transparent 70%);
  border-radius: 50%;
  transform: scale(0);
  transition: transform 0.6s ease-in-out;
  z-index: -1;
}

.custom-cell:hover::before {
  transform: scale(1);
}

/* 添加光晕效果 */
.custom-cell::after {
  content: "";
  position: absolute;
  top: -15px;
  left: -15px;
  width: calc(100% + 30px);
  height: calc(100% + 30px);
  border-radius: 50%;
  background: radial-gradient(circle at 50% 50%, rgba(0, 123, 255, 0.15), transparent 70%);
  opacity: 0;
  transition: opacity 0.6s ease-in-out, transform 0.6s ease-in-out;
  z-index: -2;
}

.custom-cell:hover::after {
  opacity: 1;
  transform: scale(1.1);
}

/* 添加旋转动画 */
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.van-icon-arrow {
  animation: rotate 5s linear infinite;
  /* 添加旋转动画 */
}

/* 悬停时暂停旋转 */
.custom-cell:hover .van-icon-arrow {
  animation-play-state: paused;
}
</style>