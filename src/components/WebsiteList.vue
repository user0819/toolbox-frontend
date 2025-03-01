<template>
  <div>
    <h1>Toolbox</h1>
    <b-tabs content-class="mt-3">
      <b-tab v-for="category in categories" :key="category.id" :title="category.name">
        <div class="website-row">
          <div v-for="detail in detailsByCategory[category.id]" :key="detail.id" class="website-card">
            <h3>{{ detail.name }}</h3>
            <a :href="detail.url" target="_blank">{{ detail.url }}</a>
            <p>{{ detail.description }}</p>
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import axios from 'axios';
import { BTabs, BTab } from 'bootstrap-vue';
import config from '@/config'; // 引入配置文件

export default {
  components: {
    BTabs,
    BTab
  },
  data() {
    return {
      categories: [],
      detailsByCategory: {},
      apiBaseUrl: ''
    };
  },
  async created() {
    this.apiBaseUrl = config.API_BASE_URL;
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      const response = await axios.get(`${this.apiBaseUrl}/api/categories`); // 使用配置中的基础 URL
      this.categories = response.data;
      this.categories.forEach(category => this.fetchDetails(category.id));
    },
    async fetchDetails(categoryId) {
      const response = await axios.get(`${this.apiBaseUrl}/api/details/category/${categoryId}`); // 使用配置中的基础 URL
      this.$set(this.detailsByCategory, categoryId, response.data);
    }
  }
};
</script>

<style scoped>
/* 基础字体和背景 */
body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background-color: #f7fbff; /* 极淡蓝色背景 */
  color: #495057; /* 深灰色主文本 */
  margin: 0;
  padding: 0;
}

/* 主标题 */
h1 {
  background-color: #a7c5eb; /* 淡蓝色背景 */
  color: white; /* 白色字体 */
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 30px;
  padding: 20px 0;
  position: relative;
}

h1::after {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  background: #ffffff; /* 白色下划线 */
  margin: 10px auto;
  border-radius: 2px;
}

h2 {
  color: #3e4c59; /* 深灰色标题 */
  font-size: 1.8rem;
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 4px solid #80e27e; /* 淡绿色条纹 */
}

/* 卡片布局 */
.website-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 10px 0;
}

.website-card {
  background-color: #f1f8ff; /* 非常淡蓝色背景 */
  border-radius: 12px;
  padding: 5px; /* 减小上下内边距，使卡片高度更小 */
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.05);
  border: 1px solid #e1eff9; /* 浅蓝色边框 */
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  height: auto; /* 使卡片高度自动调整 */
  max-height: 150px; /* 设置最大高度，防止过长 */
}

.website-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1);
  background-color: #e3f2fd; /* 轻微更深的蓝色背景 */
}

h3 {
  color: #3e4c59; /* 深灰色标题 */
  font-size: 1.3rem;
  margin-bottom: 12px;
  font-weight: 500;
}

a {
  color: #80e27e; /* 淡绿色 */
  text-decoration: none;
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  background: #e8f7f1; /* 淡绿色背景 */
  transition: all 0.2s;
  margin-bottom: 15px;
}

a:hover {
  color: #66bb6a; /* 更深的绿色 */
  background: #c8e6c9; /* 轻微深绿色背景 */
  text-decoration: none;
  transform: scale(1.02);
}

p {
  color: #6c757d; /* 中灰色文本 */
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 10px 0;
}
</style>