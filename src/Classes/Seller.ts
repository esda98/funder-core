import {ItemSubmit} from "@/Classes/Item";

export class Seller {
    id: string;
    account_id: string;
    first_name: string;
    last_name: string;
    custom_identifier: number;


    constructor() {
        this.id = "";
        this.account_id = "";
        this.first_name = "";
        this.last_name = "";
        this.custom_identifier = 0;
    }

}