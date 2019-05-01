<template>
    <div>
        <el-form :rules="rules" ref="paymentForm" :model="payment">
            <el-form-item label="Payment Amount" prop="amount">
                <el-input-number
                        v-model="payment.amount"
                        type="number"
                        placeholder="Amount to Pay"
                        :precision="2"
                        :min="0"
                        style="width:100%"
                />
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
              <el-button @click="done">Cancel</el-button>
              <el-button type="primary" @click="btnDoneClick()">Confirm</el-button>
        </span>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import axios from 'axios';
    import {Item, ItemSubmit} from "@/Classes/Item";
    import ItemDetailView from "@/components/ItemDetailView.vue";
    import {FunderAPI} from "@/Classes/FunderAPI";
    import {WithdrawalBalanace} from "@/Classes/Withdrawal";
    import {Payment} from '@/Classes/Payment'

    export default class PayDetailView extends Vue {
        @Prop({ default: 'default value' , type: Object})
        //@ts-ignore
        public passedWithdraw : Object;
        private withdraw : WithdrawalBalanace = new WithdrawalBalanace();
        public payment: Payment = new Payment();
        rules = {
            price: [
                {type: 'number', required: true, message: 'Please enter a price', trigger: 'change'}
            ]
        };

        ///***LIFECYCLE HOOKS
        mounted() {
            console.log('trying to call mounted');
            this.withdraw = <WithdrawalBalanace>this.passedWithdraw;
            console.log('given withdraw: ' + JSON.stringify(this.withdraw,null,2));
        }

        btnDoneClick() {
            console.log('clicked done on payment: ' + JSON.stringify(this.payment,null,2));
            // if (this.payment.amount > this.withdraw.balance) {
            //     this.$message({
            //         showClose: true,
            //         message: 'Max Amount Payable is: ' + this.withdraw.balance,
            //         type: 'error'
            //     });
            //     return;
            // }

        }

        done() {
            this.$emit('done');
        }

    }
</script>
