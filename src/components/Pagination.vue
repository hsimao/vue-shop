<template>
  <div>
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{'disabled' : !pagination.has_pre}">
          <a class="page-link" href="#" aria-label="Previous"
              @click.prevent="updatePage(pagination.current_page - 1)">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>
        <li class="page-item"
            v-for="page in pagination.total_pages" :key="page"
            :class="{'active' : pagination.current_page === page}"
            >
          <a class="page-link" href="#" @click.prevent="updatePage(page)">{{page}}</a>
        </li>
        <li class="page-item" :class="{'disabled' : !pagination.has_next}">
          <a class="page-link" href="#" aria-label="Next"
              @click.prevent="updatePage(pagination.current_page + 1)">
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
  props: ['pagination'],
  methods: {
    updatePage(page) {
      this.$emit('update-page', Number(page))
    },
  },
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