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
              <el-button @click="done()">Cancel</el-button>
              <el-button type="primary" @click="btnDoneClick()">Confirm</el-button>
        </span>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {WithdrawalBalanace} from "@/Classes/Withdrawal";
    import {Payment} from '@/Classes/Payment'
    import {FunderAPI} from "@/Classes/FunderAPI";

    @Component
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
            console.log('given withdraw at done: ' + JSON.stringify(this.withdraw,null,2));
            console.log('clicked done on payment: ' + JSON.stringify(this.payment,null,2));
            if (this.payment.amount <= 0) {
                console.log('too small payment');
                this.$message({
                    showClose: true,
                    message: 'Must submit a payment of an amount greater than 0',
                    type: 'error'
                });
                return;
            }
            if (this.payment.amount > this.withdraw.balance) {
                console.log('too high payment');
                this.$message({
                    showClose: true,
                    message: 'Max Amount Payable is: ' + this.withdraw.balance,
                    type: 'error'
                });
                return;
            }
            console.log('valid payment');

            this.submitPayment();
        }

        async submitPayment() {
            //set properties of payment
            this.payment.handler_user_id = "esda98@gmail.com";
            this.payment.payment_type = 'Cash';
            this.payment.withdrawal_id = this.withdraw.id;


            console.log('trying to submit payment');
            let apiRes = await FunderAPI.addPayment(this.payment);
            if (apiRes != null) {
                if (apiRes.success) {
                    this.$message({
                        showClose: true,
                        message: 'Successfully submitted payment',
                        type: 'success'
                    });
                    this.done();
                } else {
                    this.$message({
                        showClose: true,
                        message: 'Failed to submit payment',
                        type: 'error'
                    });
                }
            } else {
                this.$message({
                    showClose: true,
                    message: 'Failed to submit payment',
                    type: 'error'
                });
            }
        }

        done() {
            this.$emit('done');
        }

    }
</script>
