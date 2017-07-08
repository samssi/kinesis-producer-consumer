"use strict";

const AWS = require("aws-sdk");
const R = require("ramda");

AWS.config.update({region: "eu-west-1"});
const kinesis = new AWS.Kinesis({apiVersion: '2013-12-02'});

const params = {
    StreamName: "testing"
};


const shardPrintFunction = x => console.log(x.Data.toString("utf-8"));

function constructShardParams(shardId) {
    return {
        ShardId: shardId,
        // TODO: what is this here?
        ShardIteratorType: "TRIM_HORIZON",
        StreamName: "testing"
    }
}

function printRecords(err, recordsData) {
    if (err) console.log(err, err.stack);
    else {
        console.log("data: ");
        console.log(recordsData);
        R.forEach(shardPrintFunction, recordsData.Records);
    }
}

function findInitialShardIterator(err, shardIteratorData, func) {
    if (err) console.log(err);
    else {
        console.log(shardIteratorData);
        kinesis.getRecords({
            ShardIterator: shardIteratorData.ShardIterator
        }, func);
    }
}

function fromBeginning(err, streamData, func) {
    if (err) console.log(err);
    else {
        streamData.StreamDescription.Shards.forEach(shard =>
            kinesis.getShardIterator(constructShardParams(shard.ShardId), (err, streamData) => findInitialShardIterator(err,streamData, func)));
    }
}

kinesis.describeStream(params, (err, streamData) => fromBeginning(err, streamData, printRecords));

