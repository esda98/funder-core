import {ItemSubmit} from "@/Classes/Item";

export class Withdrawal {
    public id: string;
    public item_id: string;
    public seller_id: string;
    public price_at_withdrawal: number;
    public withdrawal_time: string;
    public withdrawal_time_display: string;
    public handler_user_id: string;
    public quantity: number;
    public item_name: string;

    constructor() {
        this.id = "";
        this.item_id = "";
        this.seller_id = "";
        this.price_at_withdrawal = 0;
        this.withdrawal_time = "";
        this.handler_user_id = "";
        this.quantity = 0;
        this.item_name = "";
        this.withdrawal_time_display = "";
    }
}

export class WithdrawalBalanace extends Withdrawal {
    public balance: number = 0;
}