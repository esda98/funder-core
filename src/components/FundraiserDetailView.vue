<template>
    <div>
        <el-form :rules="rules" ref="newFundForm" :model="fundToDisplay">
            <el-form-item label="Fundraiser Name " prop="fundraiser_name">
                <el-input placeholder="Your Fundraiser's Name"
                          v-model="fundToDisplay.fundraiser_name"
                          clearable
                />
            </el-form-item>
            <el-form-item label="Start Date" prop="start_date">
                <el-date-picker
                        v-model="fundToDisplay.start_date"
                        value-format="yyyy-MM-dd"
                        placeholder="Start Date"
                        style="width:100%"
                />
            </el-form-item>
            <el-form-item label="End Date"  prop="end_date">
                <el-date-picker
                        v-model="fundToDisplay.end_date"
                        value-format="yyyy-MM-dd"
                        placeholder="End Date"
                        style="width:100%"
                />
            </el-form-item>
            <el-form-item label="Items">
                <br/>
                <div v-for="ti in acctItems" style="float:left;display:block;">
                    <el-checkbox :label="ti.item_name + ': $' + ti.price" v-model="ti.is_tied">
                    </el-checkbox>
                    <br/>
                </div>
            </el-form-item>


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
    import moment from "moment"
    import {Fundraiser, FundraiserEditSubmit, FundraiserSubmit} from "@/Classes/Fundraiser";
    import {ItemTied} from "@/Classes/Item";
    import {FunderAPI} from "@/Classes/FunderAPI";

    @Component
    export default class FundraiserDetailView extends Vue {
        @Prop({ default: 'default value' , type: Object})
        //@ts-ignore
        public passedFund : Object;
        private fundToDisplay : Fundraiser = new Fundraiser();
        private acctItems : ItemTied[] = [];

        isDate(rule : any, value : any, callback : any) {
            console.log('checking date value: ' + value);
            if (!value) {
                return callback(new Error('Please enter a date'));
            }
            if (moment(value) == null) {
                return callback(new Error('Please enter a valid date'))
            }
            console.log("valid date: " + moment(value).format("MMMM Do, YYYY"));
            callback();
        }

        rules = {
            fundraiser_name: [
                { required: true, message: 'Please input Fundraiser name', trigger: 'blur' },
                { min: 4, message: 'Your fundraiser\'s name must be at least 4 characters long', trigger: 'blur' }
            ],
            start_date: [
                { validator: this.isDate, trigger: 'change' }
            ],
            end_date: [
                { validator: this.isDate, trigger: 'change' },
            ]
        };

        //***LIFECYCLE HOOKS***
        mounted() {
            this.fundToDisplay = <Fundraiser>this.passedFund;
            console.log('given item: ' + JSON.stringify(this.fundToDisplay,null,2));
            this.refreshItems();

        }
        //***END LIFECYCLE HOOKS***

        async refreshItems() {
            if (this.fundToDisplay.id === null || this.fundToDisplay.id === undefined || this.fundToDisplay.id == '') {
                let key: string = "?code=bXIhsIaFaxCb4z8MwR/pWJOw1E8NZc9Rj/nnOLJGgsvGDNHjbwB8NQ==&accountId=78661d7c-9df7-46d0-88ed-82a9fa9fd03f";
                let getItemsForAcctURL = 'https://funder-core-functions.azurewebsites.net/api/GetItemsForAccount';
                axios.get(getItemsForAcctURL + key).then(result=>{
                    console.log('success item acct retrieve!');
                    console.log('result: ' + JSON.stringify(result.data,null,2));
                    this.acctItems = JSON.parse(result.data.message);
                    console.log('acctItems: ' + JSON.stringify(this.acctItems, null, 2));
                }, reason =>{
                    console.log('Add failure: ' + reason);
                })

            } else {
                //get items for this account's fundraiser and whether they are tied
                //let key: string = "?code=bXIhsIaFaxCb4z8MwR/pWJOw1E8NZc9Rj/nnOLJGgsvGDNHjbwB8NQ==&accountId=78661d7c-9df7-46d0-88ed-82a9fa9fd03f&fundraiserId=" + this.fundToDisplay.id;
                let apiRes = await FunderAPI.getItemsForFundraiser(this.fundToDisplay.id, false);
                if (apiRes instanceof Array) {
                    this.acctItems = apiRes;
                } else {
                    this.$message({
                        showClose: true,
                        message: 'Could not retrieve items for fundraiser',
                        type: 'error'
                    });
                }
                // axios.get(getItemsForFundraiserURL + key).then(result=>{
                //     console.log('success item retrieve!');
                //     console.log('result: ' + JSON.stringify(result.data,null,2));
                //     this.acctItems = JSON.parse(result.data.message);
                //     console.log('acctItems: ' + JSON.stringify(this.acctItems, null, 2));
                // }, reason =>{
                //     console.log('Add failure: ' + reason);
                // })
            }
        }

        btnDoneClick() {
            console.log('done button clicked');
            //form has validate tag, ignore so TS stops yelling
            //@ts-ignore
            this.$refs['newFundForm'].validate((valid:boolean) => {
                console.log('checking if returned valid');
                if (valid) {
                    if (moment(this.fundToDisplay.start_date, 'YYYY-MM-DD') > moment(this.fundToDisplay.end_date, 'YYYY-MM-DD')) {
                        this.$message({
                            showClose: true,
                            message: 'End Date must be greater than or equal to your start date',
                            type: 'error'
                        });
                        return;
                    }

                    console.log('valid submit!');
                    //set false for undefined props of is_tied
                    for (let x of this.acctItems) {
                        if (x.is_tied === null || x.is_tied == undefined) { x.is_tied = false; }
                    }
                    if (this.fundToDisplay.id == null || this.fundToDisplay.id === "") {
                        //new fundraiser, no ID defined
                        this.submitNewFundraiser();
                    } else {
                        this.submitEditFundraiser();
                    }

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }

        submitNewFundraiser() {
            let url ='https://funder-core-functions.azurewebsites.net/api/AddFundraiser';
            let key = '?code=bXIhsIaFaxCb4z8MwR/pWJOw1E8NZc9Rj/nnOLJGgsvGDNHjbwB8NQ==';
            this.fundToDisplay.account_id = '78661d7c-9df7-46d0-88ed-82a9fa9fd03f';
            let obj : FundraiserSubmit = this.fundToDisplay.toSubmissionObject(this.acctItems);
            console.log('SUBMISSION OBJ: ' + JSON.stringify(obj));
            axios.post(url + key,JSON.stringify(obj)).then((success) =>{
                    console.log('SUCCESS: ' + JSON.stringify(success));
                    this.$message({
                        showClose: true,
                        message: 'Successfully Added Fundraiser!',
                        type: 'success'
                    });
                    this.fundToDisplay = new Fundraiser();
                    this.done();
                },
                (error) => {
                    console.log('ERROR: ' + JSON.stringify(error));
                    this.$message({
                        showClose: true,
                        message: 'Fundraiser Add Error: ' + error.response.data,
                        type: 'error'
                    });
                }
            );
        }

        submitEditFundraiser() {
            let url = 'https://funder-core-functions.azurewebsites.net/api/EditFundraiser';
            let key = '?code=bXIhsIaFaxCb4z8MwR/pWJOw1E8NZc9Rj/nnOLJGgsvGDNHjbwB8NQ==';
            console.log('fundraiser '+ typeof this.fundToDisplay + ': ' + JSON.stringify(this.fundToDisplay,null,2));
            console.log('items ' + typeof this.acctItems + ': ' + JSON.stringify(this.acctItems,null,2));
            let obj : FundraiserSubmit = new FundraiserEditSubmit(this.fundToDisplay, this.acctItems);
            console.log('SUBMISSION OBJ: ' + JSON.stringify(obj));
            axios.post(url + key,JSON.stringify(obj)).then((success) =>{
                    console.log('SUCCESS: ' + JSON.stringify(success));
                    this.$message({
                        showClose: true,
                        message: 'Successfully Edited Fundraiser!',
                        type: 'success'
                    });
                    this.fundToDisplay = new Fundraiser();
                    this.done();
                },
                (error) => {
                    console.log('ERROR: ' + JSON.stringify(error));
                    this.$message({
                        showClose: true,
                        message: 'Fundraiser Edit Error: ' + error.response.data,
                        type: 'error'
                    });
                }
            );
        }

        done() {
            this.$emit('done');
        }

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>