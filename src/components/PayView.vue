<template>
    <div>
        <h1 style="float: left; margin: 10px 0" >Outstanding Withdraws</h1>
        <el-table
                :data="withdrawals"
                stripe
                border>
            <el-table-column
                    prop="item_name"
                    label="Name">
            </el-table-column>
            <el-table-column
                    prop="withdrawal_time_display"
                    label="Time">
            </el-table-column>
            <el-table-column
                    prop="balance"
                    label="Balance">
            </el-table-column>
            <el-table-column
                    prop="quantity"
                    label="Quantity">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="Actions"
                    width="120">
                <template slot-scope="scope">
                    <el-button @click="btnAddPaymentClicked(scope.$index)" icon="el-icon-circle-plus-outline" plain size="small">Pay</el-button>
                </template>

            </el-table-column>
        </el-table>

        <h1 style="float: left; margin: 10px 0">Paid</h1>
        <el-table
                :data="paidWithdraws"
                stripe
                border>
            <el-table-column
                    prop="item_name"
                    label="Name">
            </el-table-column>
            <el-table-column
                    prop="withdrawal_time_display"
                    label="Time">
            </el-table-column>
            <el-table-column
                    prop="balance"
                    label="Balance">
            </el-table-column>
            <el-table-column
                    prop="quantity"
                    label="Quantity">
            </el-table-column>
        </el-table>

        <el-dialog title="Add Payment" :visible.sync="showPay" v-if="showPay">
            <pay-detail-view :passedWithdraw="payWithdraw" v-on:done="doneChanges"></pay-detail-view>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import axios from 'axios';
    import {Item, ItemSubmit} from "@/Classes/Item";
    import PayDetailView from "@/components/PayDetailView.vue";
    import {FunderAPI} from "@/Classes/FunderAPI";
    import {WithdrawalBalanace} from "@/Classes/Withdrawal";

    @Component({
        components: {
            PayDetailView,
        },
    })
    export default class PayView extends Vue {
        withdrawals: WithdrawalBalanace[] = [];
        paidWithdraws: WithdrawalBalanace[] = [];
        payWithdraw: WithdrawalBalanace = new WithdrawalBalanace();
        showPay: boolean = false;

        mounted() {
            this.refreshWithdrawals();
        }

        async refreshWithdrawals() {
            this.withdrawals = [];
            this.paidWithdraws = [];
            let apiRes = await FunderAPI.getWithdrawal();
            if (apiRes instanceof Array) {
                let castedRes: WithdrawalBalanace[] = <WithdrawalBalanace[]>apiRes;
                for (let w of castedRes) {
                    if (w.balance == 0) {
                        this.paidWithdraws.push(w);
                    } else {
                        this.withdrawals.push(w);
                    }
                }
            } else {
                this.$message({
                    showClose: true,
                    message: 'Could not retrieve items for fundraiser',
                    type: 'error'
                });
                this.withdrawals = [];
            }
        }

        btnAddPaymentClicked(index: number) {
            this.payWithdraw = this.withdrawals[index];
            console.log("pay withdraw: " + JSON.stringify(this.payWithdraw,null,2));
            this.showPay = true;
        }

        doneChanges() {
            console.log('done changes');
            this.showPay = false;
            this.refreshWithdrawals();
        }
    }
</script>