<template>
  <div>
    <div class="loading center" v-if="isLoading">
      <looping-rhombuses-spinner
        :animation-duration="2000"
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
                <looping-rhombuses-spinner
                  :animation-duration="2000"
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
                <div class="text-success" v-if="item.coupon">
                  已套用優惠券
                </div>
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
            <tr class="h4" v-if="cart.final_total !== cart.total">
              <td colspan="3" class="text-right text-success">折扣價</td>
              <td class="text-right text-success">{{ cart.final_total }}</td>
            </tr>
          </tfoot>
        </table>
        <div class="input-group input-group-sm p-4">
          <input type="text" class="form-control" v-model="coupon_code" placeholder="請輸入優惠碼">
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" @click="addCoupon">
              套用優惠碼
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="my-5 row justify-content-center">
      <form class="col-md-6 shadow-sm py-4 px-5" @submit.prevent="createOrder">
        <div class="form-group">
          <label for="useremail">Email</label>
          <input type="email" class="form-control" name="email" id="useremail"
            :class="{'is-invalid': errors.has('email')}"
            v-validate="'required|email'"
            v-model="form.user.email" placeholder="請輸入 Email">
          <span class="text-danger">{{errors.first('email')}}</span>
        </div>

        <div class="form-group">
          <label for="username">收件人姓名</label>
          <input type="text" class="form-control" name="name" id="username"
            :class="{'is-invalid': errors.has('name')}"
            v-model="form.user.name" placeholder="輸入姓名"
            v-validate="'required'">
          <span class="text-danger" v-if="errors.has('name')">{{errors.first('name')}}</span>
        </div>

        <div class="form-group">
          <label for="phone">收件人電話</label>
          <input type="tel" class="form-control" id="phone" placeholder="請輸入電話" name="phone"
            v-model="form.user.tel"
            v-validate="'required|numeric'">
          <span class="text-danger" v-if="errors.has('phone')">{{errors.first('phone')}}</span>
        </div>

        <div class="form-group">
          <label for="addr">收件人地址</label>
          <input type="text" class="form-control" name="addr" id="addr" placeholder="請輸入地址"
            v-model="form.user.addr"
            v-validate="'required'">
          <span class="text-danger" v-if="errors.has('addr')">{{errors.first('addr')}}</span>
        </div>

        <div class="form-group">
          <label for="useraddress">留言</label>
          <textarea name="" id="" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
        </div>
        <div class="text-right">
          <button class="btn btn-primary">送出訂單</button>
        </div>
      </form>
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
      coupon_code: '',
      form: {
        user: {
          name: '王小明',
          email: 'test123@gmail.com',
          tel: '0987654321',
          addr: '高雄市鹽埕區99巷10號101F-2'
        },
        message: '',
      }
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
      this.isLoading = true;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      this.$http.get(api).then((res) => {
      this.cart = res.data.data;
      this.isLoading = false;
      });
    },
    removeCart(id) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
      this.$http.delete(api).then((res) => {
        if (res.data.success) {
          this.$bus.$emit('message:push', res.data.message, 'success');
        } else {
          this.$bus.$emit('message:push', res.data.message, 'danger');
        }
        this.getCart();
      });
    },
    addCoupon() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
      const coupon = { code: this.coupon_code };
      this.$http.post(api, {data: coupon}).then((res) => {
        if (res.data.success) {
          this.$bus.$emit('message:push', res.data.message, 'success');
          this.getCart();
        } else {
          this.$bus.$emit('message:push', res.data.message, 'danger');
        }
        this.coupon_code = '';
      });
    },
    createOrder() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`;
      this.$validator.validate().then((result) => {
        if (result) {
          this.isLoading = true;
          this.$http.post(api, {data: this.form}).then((res) => {
            if (res.data.success) {
              this.$bus.$emit('message:push', res.data.message, 'success');
              this.$router.push(`checkout/${res.data.orderId}`);
            } else {
              this.$bus.$emit('message:push', res.data.message, 'danger');
            }
            this.isLoading = false;
            this.form.user.name = ''
            this.form.user.email = ''
            this.form.user.tel = ''
            this.form.user.addr = ''
            this.form.message = ''
          });
        }
      })
    },

  },
  computed: {
    hasOrder() {
      if (this.cart.carts) {
        if ([...this.cart.carts].length > 0) return true;
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