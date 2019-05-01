<template>
    <el-row>
        <el-col :span="4">
            <h3>Fundraisers</h3>
            <el-menu default-active="0" class="el-menu-demo" mode="vertical" @select="handleSelect"
                     style="border-top: 1px solid #e6e6e6;">
                <el-menu-item v-for="(fu, ind) in fundraisers" :index="ind.toString()">{{fu.fundraiser_name}}
                </el-menu-item>
            </el-menu>
        </el-col>
        <el-col :span="16">
            <h3>{{fundToDisplay.fundraiser_name}}</h3>
            <el-select v-model="seller.id" placeholder="Seller" :value="seller.id">
                <el-option
                        v-for="s in sellers"
                        :key="s.id"
                        :label="s.first_name"
                        :value="s.id">
                </el-option>
            </el-select>
            <el-card v-for="(wi, ind) in withdraws" style="margin:10px">
                <div slot="header">
                    <span>{{wi.item_name}}</span>
                    <el-button type="text" style="float:right; padding:0px; margin:0" @click="removeWithdraw(ind)">
                        Remove
                    </el-button>
                </div>
                <el-row>
                    <el-col :span="8">
                        <strong>Quantity</strong><br/><br/>
                        {{wi.quantity}}
                    </el-col>
                    <el-col :span="8">
                        <strong>Price</strong><br/><br/>
                        {{wi.price_at_withdrawal}}
                    </el-col>
                    <el-col :span="8">
                        <strong>Total</strong><br/><br/>
                        {{wi.quantity * wi.price_at_withdrawal}}
                    </el-col>
                </el-row>
            </el-card>
            <el-button v-if="withdraws.length > 0" @click="handleSubmitWithdrawsButton()" type="primary" round>Submit
            </el-button>
        </el-col>
        <el-col :span="4">
            <h3>Items</h3>
            <div style="height: 100vh; border-top: 1px solid #e6e6e6; border-left: 1px solid #e6e6e6;">
                <el-button v-for="(ite, ind) in itemsForFundraiser" @click="handleItemClick(ind)"
                           style="width: 95%;margin: 10px">{{ite.item_name}}
                </el-button>
            </div>
        </el-col>
    </el-row>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import axios from 'axios';
    import {Item, ItemSubmit} from "@/Classes/Item";
    import ItemDetailView from "@/components/ItemDetailView.vue";
    import moment from "moment"
    import {Fundraiser} from "@/Classes/Fundraiser";
    import {FunderAPI} from "@/Classes/FunderAPI";
    import {Seller} from "@/Classes/Seller";
    import {Withdrawal} from "@/Classes/Withdrawal";
    import {Result} from '@/Classes/Result';

    @Component({
        components: {
            ItemDetailView,
        },
    })
    export default class SellView extends Vue {
        fundraisers: Fundraiser[] = [];
        itemsForFundraiser: Item[] = [];
        fundToDisplay: Fundraiser = new Fundraiser();
        sellers: Seller[] = [];
        seller: Seller = new Seller();
        withdraws: Withdrawal[] = [];

        mounted() {
            this.refreshFundraisers();
            this.refreshSellers();
        }

        async refreshFundraisers() {
            var apiRes = await FunderAPI.getFundraisers();
            if (apiRes instanceof Array) {
                this.fundraisers = apiRes;
                if (this.fundraisers.length > 0) {
                    this.handleSelect(0);
                }
            } else {
                this.$message({
                    showClose: true,
                    message: 'Could not retrieve fundraisers',
                    type: 'error'
                });
            }
        }

        async refreshItems() {
            if (this.fundToDisplay.id === null || this.fundToDisplay.id === undefined || this.fundToDisplay.id === '') {
                return;
            }
            //clear out withdraws from past item sets
            this.withdraws = [];
            let apiRes = await FunderAPI.getItemsForFundraiser(this.fundToDisplay.id, true);
            if (apiRes instanceof Array) {
                this.itemsForFundraiser = apiRes;
            } else {
                this.$message({
                    showClose: true,
                    message: 'Could not retrieve items for selected fundraiser',
                    type: 'error'
                });
            }
        }

        async refreshSellers() {
            var apiRes = await FunderAPI.getSellers();
            if (apiRes instanceof Array) {
                this.sellers = apiRes;
                console.log('sellers: ' + JSON.stringify(this.sellers, null, 2));
            } else {
                this.$message({
                    showClose: true,
                    message: 'Could not retrieve sellers for account',
                    type: 'error'
                });
            }
        }

        handleSelect(index: number) {
            console.log('index selected: ' + index);
            this.fundToDisplay = this.fundraisers[index];
            this.refreshItems();
        }

        handleItemClick(index: number) {
            console.log('item button clicked: ' + index);
            console.log('existing withdraws: ' + JSON.stringify(this.withdraws, null, 2));
            //try to find an existing withdraw for this item
            let i = this.itemsForFundraiser[index];
            let existing = this.withdraws.find((w) => {
                return w.item_id === i.id;
            });
            if (existing != null) {
                console.log('found existing');
                //found one
                //ensure they don't exceed quantity of item
                if (i.quantity == existing.quantity) {
                    return;
                }
                //add an item to this withdraw
                existing.quantity++;
            } else {
                console.log('adding new');
                //don't let them add if no items available
                if (i.quantity < 1) {
                    return;
                }
                let withdraw = new Withdrawal();
                withdraw.item_name = i.item_name;
                withdraw.item_id = i.id;
                withdraw.quantity = 1;
                withdraw.price_at_withdrawal = i.price;
                this.withdraws.push(withdraw)
            }
        }

        removeWithdraw(index: number) {
            this.withdraws.splice(index, index + 1);
        }

        handleSubmitWithdrawsButton() {
            console.log('clicked submit withdraws with objs: ' + JSON.stringify(this.withdraws));
            for (let wi of this.withdraws) {
                wi.handler_user_id = 'esda98@gmail.com';
                wi.seller_id = this.seller.id;
                wi.id = "00000000-0000-0000-0000-000000000000";
                wi.withdrawal_time = moment().format('YYYY-MM-DD');
            }
            console.log('withdraws ready to send: ' + JSON.stringify(this.withdraws, null, 2));
            this.submitWithdraws();
        }

        async submitWithdraws() {
            let apiRes = await FunderAPI.addWithdrawal(this.withdraws);
            console.log('apires: ' + JSON.stringify(apiRes, null, 2));
            if (apiRes instanceof Array) {
                this.withdraws = [];
                this.$message({
                    showClose: true,
                    message: 'Successfully added withdrawals!',
                    type: 'success'
                });
            } else {
                this.$message({
                    showClose: true,
                    message: 'Could not add withdrawals',
                    type: 'error'
                });
            }
        }

    }
</script>
