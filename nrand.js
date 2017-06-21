var nrand = require('gauss-random')

var data = [];
var sum = {
    grand: 0,
    mrand: 0
};

var len = 1000;

for (var i = 0; i < len; ++i) {
    var item = {
        grand: nrand(),
        mrand: Math.random()
    }
    sum.grand += item.grand;
    sum.mrand += item.mrand;
    console.log(item);
}

var avg = {
    grand: sum.grand/len,
    mrand: sum.mrand/len
};

console.log("avg", avg);
