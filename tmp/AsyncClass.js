


class AsyncClass {
    constructor(time) {
        this.time = time;
    }

    async test() {
        var self = this;
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve("abc")
            }, self.time);
        });

    }

}

async function test() {
    var self = this;
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve("abc")
        }, 2000);
    });

}

async function test1() {
    var self = this;
    await test();

}

var t = new AsyncClass(2000)

/*setTimeout(function () {
    console.log("await test");
    await test();
    console.log("test finished");
},100)*/

var abc = async () => {
    var t = new AsyncClass(2000);
    console.log("a")
    await t.test();
    console.log("b")
    await t.test();
    console.log("c")
    await test1();
    console.log("finished")
}

abc();