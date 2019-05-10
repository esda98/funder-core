<template>
    <div>
        <h1 style="float: left; margin: 10px 0">Items</h1>
        <el-button icon="el-icon-plus" style="float:right; margin: 10px 0" @click="showAddItem = true">Add</el-button>

        <el-table
                :data="acctItems"
                stripe
                border>
            <el-table-column
                    prop="item_name"
                    label="Name">
            </el-table-column>
            <el-table-column
                    prop="quantity"
                    label="Quantity">
            </el-table-column>
            <el-table-column
                    prop="price"
                    label="Price">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="Actions"
                    width="120">
                <template slot-scope="scope">
                    <el-button @click="btnViewItemClick(scope.$index)" icon="el-icon-view" plain size="small">View
                    </el-button>
                </template>

            </el-table-column>
        </el-table>
        <el-dialog title="New Item" :visible.sync="showAddItem" >
            <item-detail-view :passedItem="addItem" v-on:done="doneChanges"></item-detail-view>
        </el-dialog>
        <el-dialog title="View Item" :visible.sync="showViewItem" v-if="showViewItem">
            <item-detail-view :passedItem="viewItem" v-on:done="doneChanges"></item-detail-view>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import axios from 'axios';
    import {Item, ItemSubmit} from "@/Classes/Item";
    import ItemDetailView from "@/components/ItemDetailView.vue";
    import {FunderAPI} from "@/Classes/FunderAPI";

    @Component({
        components: {
            ItemDetailView,
        },
    })
    export default class ItemView extends Vue {
        acctItems: Item[] = [];
        addItem: Item = new Item();
        viewItem : Item = new Item();
        showAddItem: boolean = false;
        showViewItem: boolean = false;


        //*** LIFECYCLE HOOKS
        mounted() {
            this.refreshItems();
        }
        ///*** END LIFECYCLE HOOKS
        async refreshItems() {
            let apiRes = await FunderAPI.getItems();
            if (apiRes instanceof Array) {
                this.acctItems = apiRes;
            } else {
                this.$message({
                    showClose: true,
                    message: 'Could not retrieve items',
                    type: 'error'
                });
            }
        }
        btnViewItemClick(index : number) {
            this.viewItem = this.acctItems[index];
            console.log('view item: ' + JSON.stringify(this.viewItem));
            this.showViewItem = true;
        }
        doneChanges() {
            this.showAddItem = false;
            this.showViewItem = false;
            this.refreshItems();
        }


    }
</script>

