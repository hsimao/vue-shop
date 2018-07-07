<template>
  <div>
    <div class="loading center" v-if="isLoading">
      <half-circle-spinner
        :animation-duration="1500"
        :size="80"
        color="#7971ea"
      />
    </div>
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <div style="height: 160px; background-size: cover; background-position: center"
                :style="{backgroundImage: `url(${item.imageUrl})`}">
          </div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{item.title}}</a>
            </h5>
            <p class="card-text">{{item.content}}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h5" v-if="!item.price">{{item.origin_price | currency}}</div>
              <del class="h6" v-if="item.price">{{item.origin_price | currency}}</del>
              <div class="h5" v-if="item.price">{{item.price | currency}}</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button @click="getProduct(item.id)" type="button" class="btn btn-outline-secondary btn-sm">
              <div class="loading inline" v-if="item.id === loadingItem">
                <half-circle-spinner :animation-duration="1500"
                  :size="20" color="#7971ea" />
              </div>
              查看更多
            </button>
            <button @click="addToCart(item.id)" type="button" class="btn btn-outline-danger btn-sm ml-auto">
              <i class="fas fa-spinner fa-spin"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分頁 -->
    <Pagination :pagination="pagination" @update-page="getProducts"/>

    <!-- pop modal -->
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="product.imageUrl" class="img-fluid" alt="">
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{ product.content }}</p>
              <footer class="blockquote-footer text-right">{{ product.description }}</footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!product.price">{{ product.origin_price }} 元</div>
              <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
              <div class="h4" v-if="product.price">現在只要 {{ product.price }} 元</div>
            </div>
            <select name="" class="form-control mt-3" v-model="product.num">
              <option :value="num" v-for="num in 10" :key="num">
                選購 {{num}} {{product.unit}}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計 <strong>{{ product.num * product.price }}</strong> 元
            </div>
            <button type="button" class="btn btn-primary"
              @click="addToCart(product.id, product.num)">
              <i class="fas fa-spinner fa-spin" v-if="product.id === loadingItem"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 購物車明細 -->
    <div v-if="hasOrder" class="row justify-content-center mt-5 mb-5 no-gutters">
      <div class="loading center" v-if="isLoadingOrder">
        <half-circle-spinner
          :animation-duration="1500"
          :size="80"
          color="#7971ea"
        />
      </div>
      <div class="col-8 shadow-sm">
        <table class="table table-striped">
          <thead class="bg-secondary text-white">
            <th></th>
            <th>品名</th>
            <th>數量</th>
            <th>單價</th>
          </thead>
          <tbody>
            <tr v-for="item in cart.carts" :key="item.id">
              <td class="align-middle">
                <button @click="removeCart(item.id)" type="button" class="btn btn-outline-danger btn-sm">
                  <i class="ion ion-ios-trash"></i>
                </button>
              </td>
              <td class="align-middle">
                {{ item.product.title }}
                <!-- <div class="text-success" v-if="item.coupon">
                  已套用優惠券
                </div> -->
              </td>
              <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
              <td class="align-middle text-right">{{ item.final_total }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right">總計</td>
              <td class="text-right">{{ cart.total }}</td>
            </tr>
            <tr class="h4">
              <td colspan="3" class="text-right text-success">折扣價</td>
              <td class="text-right text-success">{{ cart.final_total }}</td>
            </tr>
          </tfoot>
        </table>
        <div class="input-group input-group-sm p-4">
          <input type="text" class="form-control" placeholder="請輸入優惠碼">
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button">
              套用優惠碼
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import $ from 'jquery';

export default {
  data() {
    return {
      products: [],
      product: {},
      cart: {},
      isLoading: false,
      isLoadingOrder: false,
      loadingItem: '',
      pagination: {},
    };
  },
  methods: {
    getProducts(page = 1) {
      this.isLoading = true;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products?page=${page}`;
      this.$http.get(api).then((res) => {
        this.products = res.data.products;
        this.pagination = res.data.pagination;
        this.isLoading = false;
      });
    },
    getProduct(id) {
      this.loadingItem = id;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`;
      this.$http.get(api).then((res) => {
        this.product = res.data.product;
        this.loadingItem = '';
        console.log(this.product)
        $('#productModal').modal('show');
      });
    },
    addToCart(id, qty = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      const cart = { product_id: id, qty};
      this.$http.post(api, {data: cart}).then((res) => {
        this.getCart();
        $('#productModal').modal('hide');
      });
    },
    getCart() {
      this.isLoadingOrder = true;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      this.$http.get(api).then((res) => {
      this.cart = res.data.data;
      this.isLoadingOrder = false;
      console.log(this.cart)
      console.log(this.cart.carts.length)
      });
    },
    removeCart(id) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
      this.$http.delete(api).then((res) => {
        if (res.data.success) {
          this.$bus.$emit('message:push', res.data.message, 'success')
        } else {
          this.$bus.$emit('message:push', res.data.message, 'danger')
        }
        this.getCart();
      });
    },

  },
  computed: {
    hasOrder() {
      if (this.cart.carts) {
        if ([...this.cart.carts].length > 0) return true
      }
      return false
    }
  },
  created() {
    this.getProducts();
    this.getCart();
  }
};
</script>

<style lang="sass" scoped>

</style>