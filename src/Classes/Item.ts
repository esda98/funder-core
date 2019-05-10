export class ItemSubmit {
    account_id: string;
    item_name: string;
    quantity: number;
    price: number;
    constructor(item: Item) {
        this.account_id = item.account_id;
        this.item_name = item.item_name;
        this.quantity = item.quantity;
        this.price = item.price;
    }

}

export class Item {
    id: string;
    account_id: string;
    item_name: string;
    quantity: number;
    price: number;


    constructor() {
        this.id = "";
        this.account_id = "";
        this.item_name = "";
        this.quantity = 0;
        this.price = 0;
    }

    toSubmissionObject() : ItemSubmit {
        return new ItemSubmit(this);
    }

}

export class ItemTied extends Item {
    is_tied : boolean = false;
}