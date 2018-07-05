<template>
  <div>
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{'disabled' : !pagination.has_pre}">
          <a class="page-link" href="#" aria-label="Previous"
              @click.prevent="getProducts(pagination.current_page - 1)">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>
        <li class="page-item"
            v-for="page in pagination.total_pages" :key="page"
            :class="{'active' : pagination.current_page === page}"
            >
          <a class="page-link" href="#" @click.prevent="getProducts(page)">{{page}}</a>
        </li>
        <li class="page-item" :class="{'disabled' : !pagination.has_next}">
          <a class="page-link" href="#" aria-label="Next"
              @click.prevent="getProducts(pagination.current_page + 1)">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>

export default {
  data() {
    return {
      pagination: {},
    };
  },

  methods: {
    getPagination() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/products`;
      this.$http.get(api).then((res) => {
        this.pagination = res.data.pagination;
      });
    },
    updateMessage(page = 1) {
      this.messages.push({
        message,
        status,
        timestamp,
      });
      this.removeMessageWithTiming(timestamp);
    },

    removeMessage(num) {
      this.messages.splice(num, 1);
    },

    removeMessageWithTiming(timestamp) {
      setTimeout(() => {
        this.messages.forEach((item, i) => {
          if (item.timestamp === timestamp) {
            this.messages.splice(i, 1);
          }
        });
      }, 5000);
    },

  },

  created() {
    this.getPagination();
    this.$bus.$on('page:push', (page) => {
      this.updatePage(page);
    });
  }

};
</script>

<style lang="sass" scope>
.message-alert
  position: fixed
  max-width: 50%
  top: 56px
  right: 20px
  z-index: 1100
</style>