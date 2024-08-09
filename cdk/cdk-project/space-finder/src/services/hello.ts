import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import {v4} from 'uuid';
import {S3Client, ListBucketsCommand} from '@aws-sdk/client-s3';

const s3Client=new S3Client({});
async function handler(event: APIGatewayProxyEvent, context: Context) {

    const command=new ListBucketsCommand({});
    const listBucketResult=await s3Client.send(command);

    console.log('Buckets:', listBucketResult.Buckets);
    const response:APIGatewayProxyResult={
        statusCode: 200,
        body: JSON.stringify('Hello, Serverless!' + v4())
    }
    console.log('Processing event:', event);

    return response;
}

export { handler };