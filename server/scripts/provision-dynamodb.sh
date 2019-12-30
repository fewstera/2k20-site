#!/bin/bash

table_name="2k20-messages"
response_code=$(curl http://dynamodb:8000/dynamodb \
  -s -o /dev/null \
  -w '%{http_code}' \
  -H 'X-Amz-Target: DynamoDB_20120810.CreateTable' \
  -H 'Authorization: AWS4-HMAC-SHA256 Credential=x/20190605/eu-west-1/dynamodb/aws4_request SignedHeaders=y, Signature=z' \
  -d @- \
<<EOF
{
  "TableName": "$table_name",
  "KeySchema": [
    {"KeyType": "HASH", "AttributeName": "isPurged"},
    {"KeyType": "RANGE", "AttributeName": "timestamp"}
  ],
  "AttributeDefinitions": [
    {"AttributeName": "isPurged", "AttributeType": "S"},
    {"AttributeName": "timestamp", "AttributeType": "N"}
  ],
  "BillingMode": "PAY_PER_REQUEST"
}
EOF
)

if [ "$response_code" != "200" ] && [ "$response_code" != "400" ]; then
  echo "there was an error provisioning local dynamodb table '$table_name'"
  exit 1
fi
