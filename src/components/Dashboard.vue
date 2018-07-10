<template>
  <div>
    <Navbar/>
    <div class="container-fluid">
      <div class="row">
        <Sidebar></Sidebar>
        <main role="main" class="col-md-10 ml-sm-auto px-4">
          <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Pagination from './Pagination';

export default {
  components: {
    Sidebar,
    Navbar,
  }
};
</script>