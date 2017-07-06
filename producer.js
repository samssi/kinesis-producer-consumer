"use strict";

const AWS = require("aws-sdk");
AWS.config.update({region: "eu-west-1"});
const kinesis = new AWS.Kinesis({apiVersion: '2013-12-02'});

const params = {
    Records: [{
        Data: Buffer.from("foo bar", "utf-8"),
        PartitionKey: "testing-key"
    }],
    StreamName: "testing"
};

kinesis.putRecords(params, (err, data) => {
    if (err) console.log(err);
    else console.log(data);
});

