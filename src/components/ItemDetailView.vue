<template>
    <div>
        <el-form :rules="rules" ref="newItemForm" :model="itemToDisplay">
            <el-form-item label="Item Name " prop="item_name">
                <el-input placeholder="Your Item's Name"
                          v-model="itemToDisplay.item_name"
                          clearable
                />
            </el-form-item>
            <el-row>
                <el-col :span="11">
                    <el-form-item label="Price" prop="price">
                        <el-input-number
                                v-model="itemToDisplay.price"
                                type="number"
                                placeholder="Item Price"
                                :precision="2"
                                :min="0"
                                style="width:100%"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="2"><br/></el-col>
                <el-col :span="11">
                    <el-form-item label="Quantity" prop="quantity">
                        <el-input-number
                                v-model="itemToDisplay.quantity"
                                type="number"
                                placeholder="Initial Quantity"
                                :min="0"
                                style="width:100%"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
              <el-button @click="done">Cancel</el-button>
              <el-button type="primary" @click="btnDoneClick()">Confirm</el-button>
        </span>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import axios from 'axios';
    import {Item, ItemSubmit} from "@/Classes/Item";

    @Component
    export default class ItemDetailView extends Vue {
        @Prop({ default: 'default value' , type: Object})
        //@ts-ignore
        public passedItem : Object;
        private itemToDisplay : Item = new Item();
        rules = {
            item_name: [
                {required: true, message: 'Please input a name for the item', trigger: 'change'},
                {min: 4, message: 'Your item\'s name must be at least 4 characters long', trigger: 'change'}
            ],
            price: [
                {type: 'number', required: true, message: 'Please enter a price', trigger: 'change'}
            ],
            quantity: [
                {type: 'number', required: true, message: 'Please enter an initial quantity', trigger: 'change'}
            ]
        };

        ///***LIFECYCLE HOOKS
        mounted() {
            this.itemToDisplay = <Item>this.passedItem;
            console.log('given item: ' + JSON.stringify(this.itemToDisplay,null,2));
        }

        btnDoneClick() {
            console.log('add button clicked');
            //form has validate tag, ignore so TS stops yelling
            //@ts-ignore
            this.$refs['newItemForm'].validate((valid: boolean) => {
                console.log('checking if returned valid');
                if (valid) {
                    console.log('valid submit!');
                    if (this.itemToDisplay.id === null || this.itemToDisplay.id === "")
                        this.submitNewItem();
                    else
                        this.submitEditItem();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
        submitNewItem() {
            let url = 'https://funder-core-functions.azurewebsites.net/api/AddItem';
            let key = '?code=bXIhsIaFaxCb4z8MwR/pWJOw1E8NZc9Rj/nnOLJGgsvGDNHjbwB8NQ==';
            this.itemToDisplay.account_id = '78661d7c-9df7-46d0-88ed-82a9fa9fd03f';
            let obj: ItemSubmit = this.itemToDisplay.toSubmissionObject();
            console.log('SUBMISSION OBJ: ' + JSON.stringify(obj));
            axios.post(url + key, JSON.stringify(obj)).then((success) => {
                    console.log('SUCCESS: ' + JSON.stringify(success));
                    this.$message({
                        showClose: true,
                        message: 'Successfully Added Item!',
                        type: 'success'
                    });
                    this.itemToDisplay = new Item();
                    this.done();
                },
                (error) => {
                    console.log('ERROR: ' + JSON.stringify(error));
                    this.$message({
                        showClose: true,
                        message: 'Item Add Error: ' + error.response.data,
                        type: 'error'
                    });
                    this.done();
                }
            );
        }

        submitEditItem() {
            let url = 'https://funder-core-functions.azurewebsites.net/api/EditItem';
            let key = '?code=bXIhsIaFaxCb4z8MwR/pWJOw1E8NZc9Rj/nnOLJGgsvGDNHjbwB8NQ==';
            axios.post(url + key, JSON.stringify(this.itemToDisplay)).then((success) => {
                    console.log('SUCCESS: ' + JSON.stringify(success));
                    this.$message({
                        showClose: true,
                        message: 'Successfully Edited Item!',
                        type: 'success'
                    });
                    this.itemToDisplay = new Item();
                    this.done();
                },
                (error) => {
                    console.log('ERROR: ' + JSON.stringify(error));
                    this.$message({
                        showClose: true,
                        message: 'Item Edit Error: ' + error.response.data,
                        type: 'error'
                    });
                    this.done();
                }
            );
        }

        done() {
            this.$emit('done');
        }

    }
</script>