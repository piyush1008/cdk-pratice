import { DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 } from "uuid";
import {unmarshall } from "@aws-sdk/util-dynamodb";


export async function getSpaces(event: APIGatewayProxyEvent, ddbclient:DynamoDBClient):Promise<APIGatewayProxyResult>{

        if (event.queryStringParameters && 'id' in event.queryStringParameters) {
            // Handle the case where 'id' is present in queryStringParameters
        }

        if(event.queryStringParameters)
        {
            if('id' in event.queryStringParameters)
            {
                 const id=event.queryStringParameters.id;
                 if(id)
                 {
                    const getItemResponse=await ddbclient.send(new GetItemCommand({
                        TableName: process.env.Table_NAME,
                        Key: {
                            'id': {
                                S: id
                            }
                        }
                     }))
                     if(getItemResponse.Item)
                     {
                        const unmarshalledItem=unmarshall(getItemResponse.Item)
                         return {
                             statusCode: 200,
                             body: JSON.stringify(getItemResponse.Item)
                         };
                     }
                     else{
                         return {
                             statusCode: 404,
                             body: JSON.stringify({ message: "Space not found" })
                         };
                     }
                    }
                 else{
                     return {
                         statusCode: 400,
                         body: JSON.stringify({ message: "Invalid request: id parameter is missing" })
                     };
                 }
                
            }
            else{
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: "Invalid request: id parameter is missing" })
                };
            }
        }

        const result=await ddbclient.send(new ScanCommand({
            TableName: process.env.Table_NAME
        }))

        const unmarshallItems=result.Items?.map(item=> unmarshall(item))
        console.log(result);
        return {
            statusCode: 201,
            body: JSON.stringify(unmarshallItems)
        };
}