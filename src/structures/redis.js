const redis = require('redis');
const client = redis.createClient();

exports.set = (key, value) => {
    return new Promise((resolve, rejection) => {
        client.set(key, value, (err, reply) => {
            if(err) 
                rejection(err);
            else
                resolve(reply);
        });
    });
}

exports.del = key => {
    return new Promise((resolve, rejection) => {
        client.del(key, (err, reply) => {
            if(err) 
                rejection(err);
            else
                resolve(reply);
        });
    });
}

exports.get = key => {
    return new Promise((resolve, rejection) => {
        client.get(key, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.append = (key, value) => {
    return new Promise((resolve, rejection) => {
        client.append(key, value, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.incr = (key, value = 1) => {
    return new Promise((resolve, rejection) => {
        client.incrby(key, value, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.incrfloat = (key, value = 1.0) => {
    return new Promise((resolve, rejection) => {
        client.incrbyfloat(key, value, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.decr = (key, value = 1) => {
    return new Promise((resolve, rejection) => {
        client.decrby(key, value, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.rpush = key => {
    return new Promise((resolve, rejection) => {
        client.rpush(key, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.list = (key, start = 0, stop = -1) => {
    return new Promise((resolve, rejection) => {
        client.lrange(key, start, stop, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.lpop = key => {
    return new Promise((resolve, rejection) => {
        client.lpop(key, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.lindex = (key, index = 0) => {
    return new Promise((resolve, rejection) => {
        client.lindex(key, index, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.zadd = (key, score, member) => {
    return new Promise((resolve, rejection) => {
        client.zadd(key, score, member, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.zadd = (key, score, member) => {
    return new Promise((resolve, rejection) => {
        client.zadd(key, score, member, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.zadd = (key, score, member) => {
    return new Promise((resolve, rejection) => {
        client.zadd(key, score, member, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.zscore = (key, member) => {
    return new Promise((resolve, rejection) => {
        client.zscore(key, member, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.zrank = (key, member) => {
    return new Promise((resolve, rejection) => {
        client.zrevrank(key, member, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.zincr = (key, amount = 1, member) => {
    return new Promise((resolve, rejection) => {
        client.zincrby(key, amount, member, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.zrange = (key, start = 0, stop = -1) => {
    return new Promise((resolve, rejection) => {
        client.zrevrange(key, start, stop, 'withscores', (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.zrem = (key, member) => {
    return new Promise((resolve, rejection) => {
        client.zrem(key, member, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.hset = (key, field, value) => {
    return new Promise((resolve, rejection) => {
        client.hset(key, field, value, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.hget = (key, field) => {
    return new Promise((resolve, rejection) => {
        client.hget(key, field, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.hincr = (key, field, amount = 1) => {
    return new Promise((resolve, rejection) => {
        client.hincrby(key, field, amount, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.exists = key => {
    return new Promise((resolve, rejection) => {
        client.exists(key, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.hexists = (key, field) => {
    return new Promise((resolve, rejection) => {
        client.hexists(key, field, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.hkeys = key => {
    return new Promise((resolve, rejection) => {
        client.hkeys(key, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.hvals = key => {
    return new Promise((resolve, rejection) => {
        client.hvals(key, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.hgetall = key => {
    return new Promise((resolve, rejection) => {
        client.hgetall(key, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.hdel = (key, field) => {
    return new Promise((resolve, rejection) => {
        client.hdel(key, field, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.hlen = key => {
    return new Promise((resolve, rejection) => {
        client.hlen(key, (err, reply) => {
            if(err)
                rejection(err);
            else 
                resolve(reply);
        });
    });
}

exports.lrange = (key, start = 0, end = -1) => {
    return new Promise((resolve, rejection) => {
        client.lrange(key, start, end, (err, reply) => {
            if(err)
                rejection(err);
            else
                resolve(reply);
        });
    })
}

exports.rpush = (key, value) => {
    return new Promise((resolve, rejection) => {
        client.rpush(key, value, (err, reply) => {
            if(err)
                rejection(err);
            else
                resolve(reply);
        });
    })
}

exports.lpop = key => {
    return new Promise((resolve, rejection) => {
        client.lpop(key, (err, reply) => {
            if(err)
                rejection(err);
            else
                resolve(reply);
        });
    })
}

exports.llen = key => {
    return new Promise((resolve, rejection) => {
        client.llen(key, (err, reply) => {
            if(err)
                rejection(err);
            else
                resolve(reply);
        });
    })
}

exports.sadd = (key, value) => {
    return new Promise((resolve, rejection) => {
        client.sadd(key, value, (err, reply) => {
            if(err)
                rejection(err);
            else
                resolve(reply);
        });
    })
}

exports.srem = (key, value) => {
    return new Promise((resolve, rejection) => {
        client.srem(key, value, (err, reply) => {
            if(err)
                rejection(err);
            else
                resolve(reply);
        });
    })
}

exports.smembers = key => {
    return new Promise((resolve, rejection) => {
        client.smembers(key, (err, reply) => {
            if(err)
                rejection(err);
            else
                resolve(reply);
        });
    })
}

exports.sismember = (key, member) => {
    return new Promise((resolve, rejection) => {
        client.sismember(key, member, (err, reply) => {
            if(err)
                rejection(err);
            else
                resolve(reply);
        });
    })
}

client.on('connect', async () => console.log('Redis has connected!'));

exports.client = client;