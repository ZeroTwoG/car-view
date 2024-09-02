<template>
  <div class="music-page">
    <van-nav-bar title="音乐主页" left-arrow @click-left="onClickLeft" />

    <!-- 添加轮播图 -->
    <van-swipe class="my-swipe" :autoplay="3000">
      <van-swipe-item v-for="(item, index) in banners" :key="index">
        <img :src="item.imageUrl" alt="Banner" class="banner-image" />
      </van-swipe-item>
    </van-swipe>

    <!-- 添加搜索框 -->
    <van-search v-model="searchQuery" show-action placeholder="搜索歌曲" @search="onSearch" @cancel="onCancel" />

    <!-- 添加歌曲卡片展示 -->
    <div class="song-list">
      <h2 class="section-title">热门歌曲</h2>
      <van-card v-for="(song, index) in filteredSongs" :key="index" :num="1" :price="song.price"
        :desc="song.artists[0].name" :title="song.name" :thumb="song.album.images[0].url" @click="playSong(song)" />
    </div>

    <!-- 音乐播放器 -->
    <audio-player v-if="currentSong" :src="currentSong.preview_url" :auto-play="false" :show-playlist="false"
      :show-download="false" :show-volume="true" :show-time="true" :show-progress="true" :show-cover="true"
      :cover-src="currentSong.album.images[0].url" :show-mute="true" :show-play-pause="true" :show-repeat="true"
      :show-shuffle="true" :show-seek="true" />

    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o" @click="jump('/home')">主页</van-tabbar-item>
      <van-tabbar-item icon="play" @click="jump('/kmusic')">K歌</van-tabbar-item>
      <van-tabbar-item icon="more-o" info="5" @click="jump('/moremsg')">动态</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import axios from 'axios';
import { Toast } from 'vant';
import { Swipe, SwipeItem, Search, Card } from 'vant';
import AudioPlayer from 'vue-audio-player';

export default {
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Search.name]: Search,
    [Card.name]: Card,
    AudioPlayer,
  },
  data() {
    return {
      active: 0,
      songs: [],
      searchQuery: '', isLoading: true,
      hoverIndex: -1,
      banners: [
        { imageUrl: 'https://gd-hbimg.huaban.com/8279a45048d0c6c7926c23f222efdb600277c4f21d535-817Jmu_fw1200webp' },
        { imageUrl: 'https://gd-hbimg.huaban.com/c8705d7cff49af824d832b72f3611da61a8b370c18b5d-UJXLO2_fw1200webp' },
      ],
      currentSong: null,
    };
  },
  computed: {
    filteredSongs() {
      if (!this.searchQuery) return this.songs;
      return this.songs.filter(song =>
        song.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  }, mounted() {
    this.fetchSongs().finally(() => {
      this.isLoading = false; // 数据加载完成后关闭加载指示器
    });
  },
  created() {
    this.fetchSongs();
  },
  methods: {
    onMouseOver(index) {
      this.hoverIndex = index;
    },
    onMouseOut(index) {
      this.hoverIndex = -1;
    },
    onClickLeft() {
      history.back();
    },
    jump(url) {
      this.$router.push({
        path: url,
      });
    },
    onSearch(query) {
      this.searchQuery = query;
    },
    onCancel() {
      this.searchQuery = '';
    },
    async fetchSongs() {
      try {
        const response = await axios.get('https://api.spotify.com/v1/recommendations', {
          headers: {
            Authorization: `Bearer YOUR_SPOTIFY_ACCESS_TOKEN`,
          },
          params: {
            seed_genres: 'pop', // 可以根据需要调整
            limit: 10,
          },
        }).catch(function (error) {
          console.log(error);
        });;
        const data = response.data;
        console.log('Response:', response);
        console.log('Data:', data);
        this.songs = data.tracks.map(song => ({
          ...song,
          price: '免费',
        }));
      } catch (error) {
        Toast('获取热门歌曲列表失败');
        console.error('Error:', error);
        console.error('Request URL:', error.config.url);
        console.error('Request Headers:', error.config.headers);
        console.error('Response Data:', error.response ? error.response.data : null);
      }
    },
    playSong(song) {
      this.currentSong = song;
    },
  },
};
</script>

<style scoped>
.music-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
  font-family: 'Roboto', sans-serif;
  color: #333;
}

.my-swipe {
  height: 250px;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.banner-image {
  width: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.song-list {
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 20px;
}

.section-title {
  margin-bottom: 10px;
  color: #333;
  font-size: 20px;
  font-weight: bold;
}

.van-card {
  margin-bottom: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.van-card:hover {
  transform: translateY(-2px);
  /* 提升悬停时的卡片位置 */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19);
  /* 更深的阴影 */
}

audio-player {
  margin-top: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
}

.van-nav-bar__title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.van-nav-bar__content {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.van-tabbar {
  background-color: #fff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.van-tabbar-item__icon {
  font-size: 20px;
  color: #333;
}

.van-tabbar-item__text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.van-tabbar-item--active .van-tabbar-item__icon,
.van-tabbar-item--active .van-tabbar-item__text {
  color: #007aff;
}

.van-tabbar-item__badge {
  background-color: #ff4000;
  color: #fff;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 12px;
}
</style>