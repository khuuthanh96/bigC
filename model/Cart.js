module.exports = function Cart(initItems) {
    this.items = initItems;

    this.totalQty = 0;
    this.totalPrice = 0;

    if (this.items) {
        for (let key in this.items) {
            this.totalQty += this.items[key].qty;
            this.totalPrice += this.items[key].qty * this.items[key].item.price;
        }
    }

    this.add = function (item, id) {
        let storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {qty: 0, item: item, price: 0};
        }
        storedItem.qty++;
        this.totalPrice -= storedItem.price;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.price;
    };

    this.generateArray = function () {
        var arr = [];
        for (let id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};