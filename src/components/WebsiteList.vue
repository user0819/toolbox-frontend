<template>
  <div>
    <h1>Toolbox</h1>
    <b-tabs content-class="mt-3">
      <b-tab v-for="category in categories" :key="category.id" :title="category.name">
        <div class="website-row">
          <div v-for="detail in detailsByCategory[category.id]" :key="detail.id" class="website-card">
            <h3 class="text-truncate" :title="detail.name">{{ detail.name }}</h3>
            <a :href="detail.url" target="_blank" class="text-truncate" :title="detail.url">{{ detail.url }}</a>
            <p class="text-truncate" :title="detail.description">{{ detail.description }}</p>
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import axios from 'axios';
import {BTabs, BTab} from 'bootstrap-vue';
import config from '@/config';

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
      const response = await axios.get(`${this.apiBaseUrl}/api/categories`);
      this.categories = response.data;
      this.categories.forEach(category => this.fetchDetails(category.id));
    },
    async fetchDetails(categoryId) {
      const response = await axios.get(`${this.apiBaseUrl}/api/details/category/${categoryId}`);
      this.$set(this.detailsByCategory, categoryId, response.data);
    }
  }
};
</script>

<style scoped>
body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background-color: #f7fbff;
  color: #495057;
  margin: 0;
  padding: 0;
}

h1 {
  background-color: #a7c5eb;
  color: white;
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
  background: #ffffff;
  margin: 10px auto;
  border-radius: 2px;
}

.website-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 0 20px;
}

.website-card {
  background-color: #f1f8ff;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.05);
  border: 1px solid #e1eff9;
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  height: auto;
  max-height: 150px;
  overflow: hidden;
}

.website-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1);
  background-color: #e3f2fd;
}

h3, a, p {
  color: #3e4c59;
  font-size: 1.3rem;
  margin-bottom: 12px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

a {
  color: #80e27e;
  text-decoration: none;
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  background: #e8f7f1;
  transition: all 0.2s;
  margin-bottom: 15px;
}

a:hover {
  color: #66bb6a;
  background: #c8e6c9;
  transform: scale(1.02);
}

p {
  color: #6c757d;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 10px 0;
}
</style>
