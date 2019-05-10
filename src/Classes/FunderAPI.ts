import moment from "moment"
import {Fundraiser} from "@/Classes/Fundraiser";
import axios from 'axios';
import {Item, ItemTied} from "@/Classes/Item";
import {Seller} from "@/Classes/Seller";
import {Withdrawal, WithdrawalBalanace} from "@/Classes/Withdrawal";
import {Result} from "@/Classes/Result";
import {Payment} from "@/Classes/Payment";

export class FunderAPI {
    private static key = "?code=bXIhsIaFaxCb4z8MwR/pWJOw1E8NZc9Rj/nnOLJGgsvGDNHjbwB8NQ==";
    private static acctId = "78661d7c-9df7-46d0-88ed-82a9fa9fd03f";
    private static getFundraiserURL = 'https://funder-core-functions.azurewebsites.net/api/GetFundraisersForAccount';
    private static getItemsURL = "https://funder-core-functions.azurewebsites.net/api/GetItemsForAccount";
    private static getItemsForFundraiserURL = "https://funder-core-functions.azurewebsites.net/api/GetItemsForFundraiser";
    private static getSellersURL = "https://funder-core-functions.azurewebsites.net/api/GetSellersForAccount";
    private static addWithdrawalsURL = "https://funder-core-functions.azurewebsites.net/api/AddWithdrawals";
    private static getWithdrawalsURL = 'https://funder-core-functions.azurewebsites.net/api/GetWithdrawals';
    public static addPaymentURL = "https://funder-core-functions.azurewebsites.net/api/AddPayment" +
        "";
    public static deleteItemURL = "https://funder-core-functions.azurewebsites.net/api/DeleteItem";

    public static async getFundraisers() : Promise<(Fundraiser[]|null)> {
        let queryStr = '&accountId=' + this.acctId;
        let fundArr: Fundraiser[];
        try {
            let response = await axios.get(this.getFundraiserURL + this.key + queryStr);
            console.log('result: ' + JSON.stringify(response.data, null, 2));
            if (response.data.success === false) { return null; }
            fundArr = JSON.parse(response.data.message);
            for (let x of fundArr) {
                // x.start_date = moment(x.start_date, 'YYYY-MM-DDTHH:mm:ss').format("YYYY-MM-DD");
                // x.end_date =  moment(x.end_date, 'YYYY-MM-DDTHH:mm:ss').format("YYYY-MM-DD");
                x.start_date_display = moment(x.start_date, 'YYYY-MM-DDTHH:mm:ss').format("MMMM Do, YYYY");
                x.end_date_display = moment(x.end_date, 'YYYY-MM-DDTHH:mm:ss').format('MMMM Do, YYYY');
            }
            return fundArr;
        } catch (error) {
            return null;
        }
    }
    public static async getItems() : Promise<(Item[] | null)> {
        let queryStr = "&accountId=" + this.acctId;
        let itemArr: Item[];
        try {
            let response = await axios.get(this.getItemsURL + this.key + queryStr);
            //ensure a proper response was returned
            if (response.data.success === false) { return null; }
            itemArr = JSON.parse(response.data.message);
        } catch (error) {
            return null;
        }
        return itemArr;
    }
    public static async getItemsForFundraiser(fundId : string, onlyTied: boolean) : Promise<(ItemTied[]|null)> {
        let queryStr = '&accountId=' + this.acctId + '&fundraiserId=' + fundId;
        let fundItems: ItemTied[];

        try {
            let response = await axios.get(this.getItemsForFundraiserURL + this.key + queryStr);
            fundItems = JSON.parse(response.data.message);
            if (onlyTied){
                //filter out the untied items
                fundItems = fundItems.filter(value => {return value.is_tied;});
            }
        } catch (error) {
            return null;
        }
        return fundItems;
    }

    public static async getSellers(): Promise<(Seller[] | null)> {
        let queryStr = "&accountId=" + this.acctId;
        let sellerArr: Seller[];
        try {
            let response = await axios.get(this.getSellersURL + this.key + queryStr);
            //ensure a proper response was returned
            if (response.data.success === false) { return null; }
            sellerArr = JSON.parse(response.data.message);
        } catch (error) {
            return null;
        }
        return sellerArr
    }

    public static async addWithdrawal(ws : Withdrawal[]): Promise<(Result[]|null)> {
        let resultArr: Result[];
        try {
            let response = await axios.post(this.addWithdrawalsURL + this.key, JSON.stringify(ws));
            console.log('add w data: ' + JSON.stringify(response.data));
            resultArr = response.data;
        } catch (error) {
            return null;
        }
        return resultArr;
    }

    public static async getWithdrawal(): Promise<(WithdrawalBalanace[]|null)> {
        let queryStr = '&accountId=' + this.acctId;
        let withArr: WithdrawalBalanace[];
        try {
            let response = await axios.get(this.getWithdrawalsURL + this.key + queryStr);
            //ensure a proper response was returned
            if (response.data.success === false) { return null; }
            withArr = JSON.parse(response.data.message);
            for (let x of withArr) {
                x.withdrawal_time_display = moment(x.withdrawal_time, 'YYYY-MM-DDTHH:mm:ss').format("MMMM Do, YYYY h:MM A");
            }
        } catch (error) {
            return null;
        }
        return withArr
    }

    public static async addPayment(pay: Payment) : Promise<(Result|null)> {
        let result: Result;
        try {
            let response = await axios.post(this.addPaymentURL + this.key, JSON.stringify(pay));
            console.log('add w data: ' + JSON.stringify(response.data));
            result = response.data;
        } catch (error) {
            return null;
        }
        return result;
    }

    public static async deleteItem(item: Item): Promise<(Result|null)> {
        let result: Result;
        try {
            let response = await axios.post(this.deleteItemURL + this.key, JSON.stringify(item));
            console.log('add w data: ' + JSON.stringify(response.data));
            result = response.data;
        } catch (error) {
            return null;
        }
        return result;
    }

}