<template>
  <div>
    <h1>ToolBox</h1>
    <b-tabs content-class="mt-3">
      <b-tab v-for="category in categories" :key="category.id" :title="category.name">
        <div class="website-row">
          <div v-for="detail in detailsByCategory[category.id]" :key="detail.id" :data-id="detail.id" class="website-card" @click.self="openWebsite(detail.url)" style="cursor: pointer;" :title="detail.name">
            <div class="menu" @mouseenter="showMenu(detail.id)" @mouseleave="hideMenu(detail.id)">
              <div v-if="activeMenu === detail.id" class="menu-icons">
                <span @click.stop="editWebsite(detail)" >✏️</span>
                <span @click.stop="deleteWebsite(detail.id, category.id)">🗑️</span>
              </div>

              <span v-else class="menu-hide">...</span>
            </div>
            <div v-if="editingId === detail.id" @click.stop>
              <input v-model="editingItem.name" placeholder="Name" />
              <input v-model="editingItem.url" placeholder="URL" />
              <input v-model="editingItem.description" placeholder="Description" />
            </div>
            <div v-else>
              <h3 class="text-truncate" :title="detail.name">{{ detail.name }}</h3>
              <a :href="detail.url" target="_blank" class="text-truncate" :title="detail.url">{{ detail.url }}</a>
              <p class="text-truncate" :title="detail.description">{{ detail.description }}</p>
            </div>
          </div>
          <div class="website-card add-card" @click="addWebsite(category.id)" data-id="add">
            <div v-if="editingId === 'add'" @click.stop>
              <input v-model="editingItem.name" placeholder="Name" />
              <input v-model="editingItem.url" placeholder="URL" />
              <input v-model="editingItem.description" placeholder="Description" />
            </div>
            <div v-else class="add-icon">+</div>
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import axios from 'axios';
import { BTabs, BTab } from 'bootstrap-vue';

export default {
  components: { BTabs, BTab },
  data() {
    return {
      categories: [],
      detailsByCategory: {},
      activeMenu: null,
      editingId: null,
      editingItem: {}
    };
  },
  async created() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      const response = await axios.get(`${process.env.VUE_APP_BASE_API}/api/categories`);
      this.categories = response.data;
      this.categories.forEach(category => this.fetchDetails(category.id));
    },
    async fetchDetails(categoryId) {
      const response = await axios.get(`${process.env.VUE_APP_BASE_API}/api/details/category/${categoryId}`);
      this.$set(this.detailsByCategory, categoryId, response.data);
    },
    openWebsite(url) {
      window.open(url, '_blank');
    },
    showMenu(id) {
      this.activeMenu = id;
    },
    hideMenu() {
      this.activeMenu = null;
    },
    // 新增处理外部点击的方法
    handleClickOutside(event) {
      // 获取当前编辑的卡片元素
      const card = this.$el.querySelector('.website-card.editing');
      if (card && !card.contains(event.target)) {
        this.saveWebsite();
      }
    },
    // 修改进入编辑模式的方法，添加标记类
    editWebsite(detail) {
      this.editingId = detail.id;
      this.editingItem = { ...detail };
      this.$nextTick(() => {
        const card = this.$el.querySelector(`[data-id="${detail.id}"]`);
        if (card) card.classList.add('editing');
      });
    },
    async deleteWebsite(id, categoryId) {
      await axios.delete(`${process.env.VUE_APP_BASE_API}/api/details/${id}`);
      this.fetchDetails(categoryId);
    },
    async addWebsite(categoryId) {
      this.editingId = 'add';
      this.editingItem = { name: '请输入名称', url: '请输入链接', description: '请输入描述', categoryId, sort:100 };
      this.$nextTick(() => {
        const card = this.$el.querySelector(`[data-id="add"]`);
        if (card) card.classList.add('editing');
      });
    },
    async saveWebsite() {
      if (this.editingId === 'add') {
        if (!this.editingItem.name || !this.editingItem.url) {
          alert('请填写名称和URL');
          return;
        }
        await axios.post(`${process.env.VUE_APP_BASE_API}/api/details/`, this.editingItem);
      } else {
        await axios.put(`${process.env.VUE_APP_BASE_API}/api/details/${this.editingId}`, this.editingItem);
      }
      this.fetchDetails(this.editingItem.categoryId);
      this.editingId = null;
      this.editingItem = {};
      // ...保存逻辑不变
      const card = this.$el.querySelector('.editing');
      if (card) card.classList.remove('editing');
    }
  },
  watch: {
    editingId(val) {
      if (val !== null) {
        // 使用setTimeout确保DOM更新后绑定事件
        this.$nextTick(() => {
          window.addEventListener('click', this.handleClickOutside);
        });
      } else {
        window.removeEventListener('click', this.handleClickOutside);
      }
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

.website-card [title]:hover {
  font-style: italic;
  font-weight: bold;
  color: #3e4c59;
  text-decoration: underline;
}

h3 {
  color: #3e4c59;
  font-size: 1.3rem;
  margin-bottom: 8px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

a {
  color: #80e27e;
  text-decoration: none;
  display: inline-block;
  margin: 0px 1em;
  border-radius: 6px;
  background: #e8f7f1;
  transition: all 0.2s;
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
  margin: 0px 1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.add-card {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: dashed 1px #80e27e;
  cursor: pointer;
}

.add-icon {
  font-size: 2rem;
  color: #80e27e;
}

.menu {
  position: relative;
  float: right;
  cursor: pointer;
}

.menu-icons {
  position: absolute;
  right: 0;
  padding: 5px;
}

.menu-icons span {
  margin-left: 10px;
  cursor: pointer;
}
input {
  border: none;      /* 隐藏边框 */
  background-color: transparent; /* 设置背景为透明 */
  outline: none;     /* 移除聚焦时的轮廓 */
}

</style>
