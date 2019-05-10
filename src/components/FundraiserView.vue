<template>
  <div>
    <h1 style="float: left; margin: 10px 0" >Fundraisers</h1>
    <el-button icon="el-icon-plus" style="float:right; margin: 10px 0" @click="showAddFund = true">Add</el-button>

    <el-table
      :data="fundraisers"
      stripe
      border>
      <el-table-column
              prop="fundraiser_name"
              label="Name">
      </el-table-column>
      <el-table-column
              prop="start_date_display"
              label="Start">
      </el-table-column>
      <el-table-column
              prop="end_date_display"
              label="End">
      </el-table-column>
      <el-table-column
              fixed="right"
              label="Actions"
              width="120">
        <template slot-scope="scope">
          <el-button @click="btnViewFundClick(scope.$index)" icon="el-icon-view" plain size="small">View</el-button>
        </template>

      </el-table-column>
    </el-table>
    <el-dialog title="New Fundraiser" :visible.sync="showAddFund" v-if="showAddFund">
      <fundraiser-detail-view :passedFund="addingFund" v-on:done="doneChanges"></fundraiser-detail-view>
    </el-dialog>
    <el-dialog title="View Fundraiser" :visible.sync="showViewFund" v-if="showViewFund">
      <fundraiser-detail-view :passedFund="viewFund" v-on:done="doneChanges"></fundraiser-detail-view>
    </el-dialog>
  </div>


</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';
import moment from "moment"
import {Fundraiser, FundraiserSubmit} from "@/Classes/Fundraiser";
import FundraiserDetailView from "@/components/FundraiserDetailView.vue";
import {FunderAPI} from "@/Classes/FunderAPI";

@Component({
  components: {
    FundraiserDetailView,
  },
})
export default class FundraiserView extends Vue {
  fundraisers: Fundraiser[] = [];
  addingFund: Fundraiser = new Fundraiser();
  viewFund : Fundraiser = new Fundraiser();
  showAddFund: boolean = false;
  showViewFund : boolean = false;
  //*** lifecycle hooks
  mounted() {
    this.refreshFundraisers();
  }
  //*** END LIFECYCLE HOOKS
  doneChanges() {
    this.showAddFund = false;
    this.showViewFund = false;
    this.refreshFundraisers();
  }

  async refreshFundraisers() {
    var apiRes = await FunderAPI.getFundraisers();
    if (apiRes instanceof Array) {
      this.fundraisers = apiRes;
    } else {
      this.$message({
        showClose: true,
        message: 'Could not retrieve fundraisers',
        type: 'error'
      });
    }

  }

  //***EVENTS ***
  btnViewFundClick(index: number) {
    console.log('view clicked with event: ' + JSON.stringify(event));
    console.log('clicked element: ' + JSON.stringify(this.fundraisers[index]));
    this.viewFund =this.fundraisers[index];
    this.showViewFund = true;
  }
  //***END EVENTS

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
