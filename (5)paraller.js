const fs = require('fs');

function size(filename) {
    // 让`size`不耦合`next()`
    throw new Error('error');
    return function(fn) {
        fs.stat(filename, function(err, stat) {
            if(err) fn(err);
            else
                fn(null, stat.size);
        });
    }
}

function toThunk(fn) {
    if(Array.isArray(fn)) {
        const results = [];
        // 等待完成的任务
        let pending = fn.length;
        return function(cb) {
            let finished = false;
            fn.forEach(function(func, index) {
                if(finished) {
                     return;
                }
                func.call(this, function(err, res) {
                    if(err) {
                        finished = true;
                        cb(err);
                    } else {
                        results[index] = res;
                        // 如果再无任务，才返回`results`
                        if(--pending === 0) {
                            cb(null, results);
                        }
                    }
                } );
            })
        }
    }
}

function runGenerator(gen) {
    // 先获得迭代器
    const it = gen();
    // 驱动generator运行
    next();

    function next(err, res) {
        if(err) {
            return it.throw(err);
        }

        const { value, done } = it.next(res);
        if(done) {
            return;
        }
        thunk = toThunk(value);
        if(typeof thunk === 'function') {
            thunk.call(this, function(err, res) {
                if(err) {
                    next(err, null);
                } else {
                    next(null, res);
                }
            });
        }
    }
}

function *main() {
    const sizeInfo = {
        'file1': 0,
        'file2': 0,
        'file3': 0
    };
    try{
        sizes = yield[
            size('file1.md'),
            size('file2.md'),
            size('file3.md')
        ];

        sizeInfo['file1'] = sizes[0];
        sizeInfo['file2'] = sizes[1];
        sizeInfo['file3'] = sizes[2];
    } catch(error) {
        console.error('error:', error);
    }
    console.dir(sizeInfo);
}

runGenerator(main);

