<template>
  <nav class="col-md-3 d-none d-md-block bg-light sidebar">
    <div class="sidebar-sticky">
      <h6 class="sidebar-heading d-flex justify-content-between align-items-center
        px-3 mt-4 mb-1 text-muted">
        <span>管理員</span>
        <a class="d-flex align-items-center text-muted" href="#">
          <span data-feather="plus-circle"></span>
        </a>
      </h6>
      <ul class="nav flex-column mb-2">
        <li class="nav-item">
          <router-link to="/admin/products" class="nav-link">
            <i class="ion ion-md-cube"></i>
            產品列表
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/01" class="nav-link">
            <i class="ion ion-md-list-box"></i>
            訂單列表
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/03" class="nav-link">
            <i class="ion ion-md-paper"></i>
            優惠券
          </router-link>
        </li>
      </ul>

      <h6 class="sidebar-heading d-flex justify-content-between align-items-center
        px-3 mt-4 mb-1 text-muted">
        <span>模擬功能</span>
        <a class="d-flex align-items-center text-muted" href="#">
          <span data-feather="plus-circle"></span>
        </a>
      </h6>
      <ul class="nav flex-column mb-2">
        <li class="nav-item">
          <router-link class="nav-link" to="/customer_order">
            <span data-feather="file-text"></span>
            <i class="ion ion-md-clipboard"></i>
            模擬訂單
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>