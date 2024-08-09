import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 } from "uuid";
import {marshall} from "@aws-sdk/util-dynamodb";


export async function postSpaces(event: APIGatewayProxyEvent, ddbclient:DynamoDBClient):Promise<APIGatewayProxyResult>{
        const randomId=v4();

        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Invalid request: body is missing" })
            };
        }

        const item=JSON.parse(event.body);
        const result=await ddbclient.send(new PutItemCommand({
            TableName: process.env.Table_NAME,

            Item:marshall(item)
        }))

        console.log(result);
        return {
            statusCode: 201,
            body: JSON.stringify({id: randomId })
        };
}