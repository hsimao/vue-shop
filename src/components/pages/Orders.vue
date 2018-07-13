<template>
	<div>
    <div class="loading center" v-if="isLoading">
      <half-circle-spinner
        :animation-duration="1500"
        :size="80"
        color="#7971ea"
      />
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="150">購買時間</th>
          <th>Email</th>
          <th>購買款項</th>
          <th width="200" class="text-right">應付金額</th>
          <th width="160">是否付款</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>2018/06/13</td>
          <td>e087754958@gmail.com</td>
          <td>好看的外套數量：6件<br>酒紅色外套數量：1件</td>
          <td class="text-right">{{'6640' | currency}}</td>
          <td>
            <span class="text-success">已付款</span>
            <!-- <span v-else>尚未付款</span> -->
          </td>
        </tr>
        <tr v-for="(item) in orders" :key="item.id">
          <td>{{item.create_at | timeFormat}}</td>
          <td>{{item.title}}</td>
          <td class="text-right">{{item.origin_price | currency}}</td>
          <td class="text-right">{{item.price | currency}}</td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <button @click="openModal('edit', item)" class="btn btn-outline-primary btn-sm">編輯</button>
            <button @click="openModal('del', item)" class="btn btn-outline-danger btn-sm">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- <Pagination :pagination="pagination" @update-page="getProducts"/> -->

	</div>
</template>

<script>
import $ from 'jquery';

export default {
  data() {
    return {
      orders: [],
      type: null,
      isLoading: false,
      pagination: {},
    };
  },
  methods: {
    getOrders(page = 1) {
      this.isLoading = true;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/orders?page=${page}`;
      this.$http.get(api).then((res) => {
        if (res.data.success) {
          this.orders = res.data.orders;
          this.pagination = res.data.pagination;
          this.isLoading = false;
          if (this.orders.length <= 0) {
            this.$bus.$emit('message:push', '尚無訂單', 'danger')
          }
        } else {
          this.$bus.$emit('message:push', res.data.message, 'danger')
        }
      });
    },

  },
  created() {
    this.getOrders();
  }
};
</script>