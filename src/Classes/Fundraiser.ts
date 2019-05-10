import {ItemTied} from "@/Classes/Item";

export class FundraiserSubmit {
    account_id: string;
    fundraiser_name: string;
    start_date: string;
    end_date: string;
    items: ItemTied[];

    constructor(fund: Fundraiser, items: ItemTied[]) {
        this.account_id = fund.account_id;
        this.fundraiser_name = fund.fundraiser_name;
        this.start_date = fund.start_date;
        this.end_date = fund.end_date;
        this.items = items;
    }
}

export class FundraiserEditSubmit extends FundraiserSubmit {
    id: string;

    constructor(fund: Fundraiser, items: ItemTied[]) {
        super(fund,items);
        this.id = fund.id;
    }
}

export class Fundraiser {
    id: string;
    account_id: string;
    fundraiser_name: string;
    start_date: string;
    end_date: string;
    start_date_display: string;
    end_date_display: string;


    constructor() {
        this.id = "";
        this.account_id = "";
        this.fundraiser_name = "";
        this.start_date = "";
        this.end_date = "";
        this.start_date_display = "";
        this.end_date_display = "";
    }

    toSubmissionObject(items: ItemTied[]) : FundraiserSubmit {
        return new FundraiserSubmit(this, items);
    }


}