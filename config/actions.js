class Action {
    constructor(name) {
        this._name = name;
    }

    callback(...args) {
        if (args.length)
            return `${this._name}:${args.join(";")}`;

        return this._name;
    }

    regexp(...args) {
        if (!args.length)
            return this._name;

        const patterns = args
            .map((pattern) => `(${pattern})`)
            .join(";");

        return new RegExp(`^${this._name}:${patterns}$`);
    }
}


/* actions */
const adminConfirmPayment = new Action("admin_confirm_payment");


const actions = {
    adminConfirmPayment,

}

export default actions;