<template>
  <div id="app" style="padding: 0">
    <el-menu
            default-active="Fundraiser"
            class="el-menu-vertical-demo"
            mode="horizontal"
            style="padding: 0;margin: 0 6px 0 0 ;width:100%;"
            background-color="#006f6a"
            text-color="#fff"
            active-text-color="#02ebd3"
            router>
      <el-menu-item index="Fundraiser" style="margin:2px">
        Fundraisers
      </el-menu-item>
      <el-menu-item index="Item" style="margin:2px">
        Items
      </el-menu-item>
      <el-menu-item index="Sell" style="margin:2px">
        Sell
      </el-menu-item>
      <el-menu-item index="Pay" style="margin:2px">
        Pay
      </el-menu-item>
    </el-menu>

    <router-view style="padding: 10px;"></router-view>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FundraiserView from './components/FundraiserView.vue';


@Component({
  components: {
    FundraiserView,
  },
})
export default class App extends Vue {
  mounted() {
    //go to default route of fundraiser
    this.$router.push('Fundraiser');
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
