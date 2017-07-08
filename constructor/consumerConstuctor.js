"use strict";

function constuctStreamParams(){
    return {
        StreamName: "testing"
    };
}

function constructShardParams(shardId) {
    return {
        ShardId: shardId,
        // TODO: what is this here?
        ShardIteratorType: "TRIM_HORIZON",
        StreamName: "testing"
    };
}

function constructShardIterator(shardIterator) {
    return {
        ShardIterator: shardIterator
    };
}

module.exports = { constuctStreamParams, constructShardParams, constructShardIterator };