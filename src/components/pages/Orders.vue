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
          <th width="180">購買時間</th>
          <th>Email</th>
          <th>購買款項</th>
          <th width="120" class="text-right">應付金額</th>
          <th width="100">是否付款</th>
        </tr>
      </thead>
      <tbody>

        <tr v-for="(item) in orders" :key="item.id">
          <td>{{item.create_at | timeFormat}}</td>
          <td>{{item.user.email}}</td>
          <td>
            <span v-if="item.products" v-for="product in item.products" :key="product.id">{{product.product.title}} x {{product.qty}}</span>
          </td>
          <td>{{item.total}}</td>
          <td>
            <span v-if="item.is_paid" class="text-success">已付款</span>
            <span v-else>未付款</span>
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
          res.data.orders.forEach((item,id) => {
            console.log(id,item.products)
            console.log(item.products.qty)
            // console.log(id)
          })
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