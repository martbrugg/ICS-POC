var Cell = require("./Cell");

class ReqHandler extends Cell {
    constructor(id, options) {
        super(id, options)
        this._init();
        this.count = 0;

    }

    _init() {
        this.on('req', function (sender, data) {
            this.count++;
            this.sendMessage(sender, 'res', 'hello back' + this.count);
        })
    }


}


module.exports = ReqHandler;