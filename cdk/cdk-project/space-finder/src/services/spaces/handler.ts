import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { postSpaces } from "./PostSpaces";
import { getSpaces } from "./GetSpaces";


const ddbclient=new DynamoDBClient();


async function handler(event: APIGatewayProxyEvent, context: Context):Promise<APIGatewayProxyResult> {

    let message: string="";
    try{
        switch(event.httpMethod){
            case "GET":
                const getResponses=getSpaces(event,ddbclient)
                return getResponses;
    
            case "POST":
                const postResponse=postSpaces(event,ddbclient)
                return postResponse;
    
            default:
                break;
        }
        const response:APIGatewayProxyResult={
            statusCode: 200,
            body: JSON.stringify(message)
        }
    
        return response;
    }
    catch(e:any)
    {
        console.error(e);
        return{
            statusCode: 500,
            body: JSON.stringify(e.message)
        }
    }
    
}

export { handler };