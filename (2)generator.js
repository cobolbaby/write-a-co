const fs = require('fs');

function size(filename) {
    fs.stat(filename, function(err, stat) {
        if(err) it.throw(err);
        else
            it.next(stat.size);
    });
}

function *main() {
    const sizeInfo = {
        'file1': 0,
        'file2': 0,
        'file3': 0
    };

    sizeInfo['file1'] = yield size('file1.md');
    sizeInfo['file2'] = yield size('file2.md');
    sizeInfo['file3'] = yield size('file3.md');

    console.log(sizeInfo);
}

const it = main();
// 驱动iterator运行
it.next();
