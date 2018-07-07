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
      <button class="btn btn-primary" @click="openModal('add')">建立新的產品</button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120">原價</th>
          <th width="100">售價</th>
          <th width="100">是否啟用</th>
          <th width="140">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in products" :key="item.id">
          <td>{{item.category}}</td>
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

    <Pagination :pagination="pagination" @update-page="getProducts"/>

    <!-- 產品新增、編輯modal -->
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input v-model="tempProduct.imageUrl" type="text" class="form-control" id="image"
                    placeholder="請輸入圖片連結">
                </div>
                <div class="form-group">
                  <label for="customFile">或 上傳圖片
                    <div class="loading inline" v-if="isLoadingFile">
                      <half-circle-spinner :animation-duration="1500"
                        :size="28" color="#7971ea" />
                    </div>
                  </label>
                  <input @change="uploadFile" type="file" id="customFile" class="form-control"
                    ref="files">
                </div>
                <img img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
                  class="img-fluid" :src="tempProduct.imageUrl" alt="">
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input v-model="tempProduct.title" type="text" class="form-control" id="title"
                    placeholder="請輸入標題">
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input v-model="tempProduct.category" type="text" class="form-control" id="category"
                      placeholder="請輸入分類">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input v-model="tempProduct.unit" type="unit" class="form-control" id="unit"
                      placeholder="請輸入單位">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                  <label for="origin_price">原價</label>
                    <input v-model="tempProduct.origin_price" type="number" class="form-control" id="origin_price"
                      placeholder="請輸入原價">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input v-model="tempProduct.price" type="number" class="form-control" id="price"
                      placeholder="請輸入售價">
                  </div>
                </div>
                <hr>

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea v-model="tempProduct.description" type="text" class="form-control" id="description"
                    placeholder="請輸入產品描述"></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea v-model="tempProduct.content" type="text" class="form-control" id="content"
                    placeholder="請輸入產品說明內容"></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input v-model="tempProduct.is_enabled"
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
            <button @click="updateProduct" type="button" class="btn btn-primary">確認</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 產品刪除modal -->
    <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
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
            是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button @click="updateProduct" type="button" class="btn btn-danger"
              >確認刪除</button>
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
      tempProduct: {},
      type: null,
      isLoading: false,
      isLoadingFile: false,
      pagination: {},
    };
  },
  methods: {
    getProducts(page = 1) {
      this.isLoading = true;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/products?page=${page}`;
      this.$http.get(api).then((res) => {
        this.products = res.data.products;
        this.pagination = res.data.pagination;
        this.isLoading = false;
      });
    },

    openModal(type, item) {
      this.type = type

      if (this.type === 'add') {
        this.tempProduct = {};
        $('#productModal').modal('show')
      }

      if (this.type === 'edit') {
        this.tempProduct = Object.assign({}, item);
        $('#productModal').modal('show')
      }

      if (this.type === 'del') {
        this.tempProduct = Object.assign({}, item);
        $('#delProductModal').modal('show')
      }

    },

    updateProduct() {
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product`;
      let httpMathod = 'post';

      if (this.type === 'edit') {
        api = `${api}/${this.tempProduct.id}`
        httpMathod = 'put';
      }

      if (this.type === 'del') {
        api = `${api}/${this.tempProduct.id}`
        httpMathod = 'delete';
      }

      this.$http[httpMathod](api, { data: this.tempProduct }).then((res) => {
        if (res.data.success) {
          this.$bus.$emit('message:push', res.data.message, 'success')
          this.getProducts();
        } else {
          this.$bus.$emit('message:push', res.data.message, 'danger')
        }
        $('#productModal').modal('hide');
        $('#delProductModal').modal('hide');
      });

      this.type === '';
    },

    // 上傳圖片處理方法
    uploadFile() {
      this.isLoadingFile = true;
      const img = this.$refs.files.files[0];
      const formData = new FormData();
      formData.append('file-to-upload', img);
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`;
      this.$http.post(url, formData, {
        headers: {
          'Content-type': 'multipart/form-data',
        }
      }).then((res) => {
        this.isLoadingFile = false;
        if (res.data.success) {
          this.$set(this.tempProduct, 'imageUrl' ,res.data.imageUrl);
        } else {
          this.$bus.$emit('message:push', res.data.message, 'danger')
        }
      });
    },

  },
  created() {
    this.getProducts();
  }
};
</script>

<style lang="sass" scoped>

</style>