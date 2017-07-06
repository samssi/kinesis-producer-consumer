"use strict";

const AWS = require("aws-sdk");
const R = require("ramda");
AWS.config.update({region: "eu-west-1"});
const kinesis = new AWS.Kinesis({apiVersion: '2013-12-02'});

const params = {
    StreamName: "testing"
};

const shardPrintFunction = x => console.log(x.Data.toString("utf-8"));

kinesis.describeStream(params, (err, streamData) => {
    if (err) console.log(err);
    else {
        streamData.StreamDescription.Shards.forEach(
                shard => {
                kinesis.getShardIterator(
                    {
                        ShardId: shard.ShardId,
                        // TODO: what is this here?
                        ShardIteratorType: "TRIM_HORIZON",
                        StreamName: "testing"
                    },
                    (err, shardIteratorData) => {
                        if (err) console.log(err);
                        else {
                            kinesis.getRecords({
                                    ShardIterator: shardIteratorData.ShardIterator
                            },
                                (err, recordsData) => {
                                    if (err) console.log(err, err.stack);
                                    else {
                                        console.log(recordsData);
                                        R.forEach(shardPrintFunction, recordsData.Records);
                                    }
                                }
                            );
                        }
                    }
                );
            }
        );
    }
});

