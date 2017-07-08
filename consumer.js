"use strict";

const AWS = require("aws-sdk");
const R = require("ramda");
const consumerConstructor = require("./constructor/consumerConstuctor")

AWS.config.update({region: "eu-west-1"});
const kinesis = new AWS.Kinesis({apiVersion: '2013-12-02'});


const shardPrintFunction = x => console.log(x.Data.toString("utf-8"));

function printRecords(err, recordsData) {
    if (err) console.log(err, err.stack);
    else {
        console.log("data: ");
        console.log(recordsData);
        R.forEach(shardPrintFunction, recordsData.Records);
    }
}

function findIntitalIterator(err, shardIteratorData, func) {
    if (err) console.log(err);
    else {
        kinesis.getRecords(consumerConstructor.constructShardIterator(shardIteratorData.ShardIterator), func);
    }
}

function allShardsFromBeginning(err, streamData, func) {
    if (err) console.log(err);
    else {
        streamData.StreamDescription.Shards.forEach(shard => {
            kinesis.getShardIterator(consumerConstructor.constructShardParams(shard.ShardId), (err, streamData) =>
                findIntitalIterator(err, streamData, func));
        });
    }
}

function fromShardIterator(err, streamData, shardIterator, func) {
    if (err) console.log(err);
    else {
        streamData.StreamDescription.Shards.forEach(shard =>
            kinesis.getShardIterator(consumerConstructor.constructShardParams(shard.ShardId), (err, streamData) =>
                kinesis.getRecords(constructShardIterator(shardIterator), func)));
    }
}

kinesis.describeStream(consumerConstructor.constuctStreamParams(), (err, streamData) => allShardsFromBeginning(err, streamData, printRecords));
//kinesis.describeStream(params, (err, streamData) => fromShardIterator(err, streamData, "AAAAAAAAAAFTa27KTq7ZzuKIsAu3YhjtS8Mu6/6+2RfWYyiUW2B1FuwxsWu8xtBJS82UqOm2cgmtR69kpp9fz8N2DwUykasdCQCcDsmf3MeYz4Hm8aiA52iZOWFO9FfgnfhZ2TGnmrwDETE94GBEuEgRqOHVsbU1lIMx/3Wx9mRqRBqazbn+SnuV1OREF0vm6xw8KjyZaLnqGkqqQeSrH8V7L5kK3Vjd", printRecords));


