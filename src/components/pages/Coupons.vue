<template>
	<div>
    <div class="loading center" v-if="isLoading">
      <half-circle-spinner
        :animation-duration="1500"
        :size="80"
        color="#7971ea"
      />
    </div>
    <div class="text-right mt-4">
      <button class="btn btn-primary" @click="openModal('add')">建立新的優惠券</button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th width="120">折扣百分比</th>
          <th width="200">到期日</th>
          <th width="120">是否啟用</th>
          <th width="150">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in coupons" :key="item.id">
          <td>{{item.title}}</td>
          <td>{{item.percent}}</td>
          <td>{{dateFormat(item.due_date)}}</td>
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

    <Pagination :pagination="pagination" @update-page="getCoupons"/>

    <!-- 優惠券新增、編輯modal -->
    <div class="modal fade" id="couponModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增優惠券</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-12">
                <div class="form-group">
                  <label for="title">優惠券名稱</label>
                  <input v-model="tempCoupons.title" type="text" class="form-control" id="title"
                    placeholder="請輸入優惠券名稱">
                </div>
                <div class="form-group">
                  <label for="title">折扣百分比</label>
                  <input v-model="tempCoupons.percent" type="text" class="form-control" id="percent"
                    placeholder="請輸入折扣百分比">
                </div>
                <div class="form-group">
                  <label for="datetime">優惠到期日</label>
                  <datepicker class="datepicker"
                    :bootstrap-styling="true"
                    :language="zh"
                    :format="dateFormat"
                    v-model="tempCoupons.due_date">
                  </datepicker>
                </div>
                <div class="form-group">
                  <label for="title">優惠券代碼</label>
                  <input v-model="tempCoupons.code" type="text" class="form-control" id="code"
                    placeholder="請輸入優惠券代碼">
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input v-model="tempCoupons.is_enabled"
                            :true-value="1"
                            :false-value="0"
                            class="form-check-input" type="checkbox" id="is_enabled">
                    <label class="form-check-label" for="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button @click="updateCoupons" type="button" class="btn btn-primary">確認</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 產品刪除modal -->
    <div class="modal fade" id="delCouponModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除 <strong class="text-danger">{{ tempCoupons.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button @click="updateCoupons" type="button" class="btn btn-danger"
              >確認刪除</button>
          </div>
        </div>
      </div>
    </div>

	</div>
</template>

<script>
import $ from 'jquery';
import { zh } from 'vuejs-datepicker/dist/locale';

export default {
  data() {
    return {
      coupons: [],
      tempCoupons: {},
      type: null,
      isLoading: false,
      isLoadingFile: false,
      pagination: {},
      zh: zh // datepicker 語言包
    };
  },
  methods: {
    getCoupons(page = 1) {
      this.isLoading = true;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`;
      this.$http.get(api).then((res) => {
        if (res.data.success) {
          this.coupons = res.data.coupons;
          this.pagination = res.data.pagination;
          this.isLoading = false;
          if (this.coupons.length <= 0) {
            this.$bus.$emit('message:push', '尚無優惠券', 'danger')
          }
        } else {
          this.$bus.$emit('message:push', res.data.message, 'danger')
        }
      });
    },
    openModal(type, item) {
      this.type = type
      if (this.type === 'add') {
        this.tempCoupons = {};
        $('#couponModal').modal('show')
      }
      if (this.type === 'edit') {
        this.tempCoupons = Object.assign({}, item);
        $('#couponModal').modal('show')
      }
      if (this.type === 'del') {
        this.tempCoupons = Object.assign({}, item);
        $('#delCouponModal').modal('show')
      }
    },
    updateCoupons() {
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
      let httpMathod = 'post';
      // 時間格式化
      this.tempCoupons.due_date = this.datetemp(this.tempCoupons.due_date)
      if (this.type === 'edit') {
        api = `${api}/${this.tempCoupons.id}`
        httpMathod = 'put';
      }
      if (this.type === 'del') {
        api = `${api}/${this.tempCoupons.id}`
        httpMathod = 'delete';
      }
      this.$http[httpMathod](api, { data: this.tempCoupons }).then((res) => {
        if (res.data.success) {
          this.$bus.$emit('message:push', res.data.message, 'success')
          this.getCoupons();
        } else {
          this.$bus.$emit('message:push', res.data.message, 'danger')
        }
        $('#couponModal').modal('hide');
        $('#delCouponModal').modal('hide');
      });
      this.type === '';
    },
    datetemp(date) {
      return new Date([date]).getTime()
    },
    dateFormat(value) {
      console.log("yo",value)
      let time  = new Date(value)
      let year  = time.getFullYear()
      let month = ('0'+(time.getMonth()+1)).substr(-2)
      let date  = ('0'+time.getDate()).substr(-2)
      return `${year}/${month}/${date}`
    },
  },
  created() {
    this.getCoupons();
  }
};
</script>

<style lang="sass" scoped>

</style>