
import {Stack, StackProps} from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import {Code, Function as LambdaFunction, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";


interface LambdaStackProps extends StackProps {
    spacesTable: ITable;
}

export class LambdaStack extends Stack{

        public readonly spacesLambdaIntergration: LambdaIntegration;
        constructor(scope:Construct, id: string, props: LambdaStackProps) {
            super(scope, id, props);



            // const helloLambda=new LambdaFunction(this,"HelloLambda",{
            //     runtime: Runtime.NODEJS_18_X,
            //     handler: 'hello.main',
            //     code: Code.fromAsset(join(__dirname,'..','..','services')),
            //     environment: {
            //         TABLE_NAME: props.spacesTable.tableName
            //     }
            // })

            /*
                Why use NodejsFunction instead of LambdaFunction?
                1. Bundles all code with tree shaking
                2. compiles TS to JS
                3. Leave out AWS_SDK dependencies
                4. completely editable

            */
            // const helloLambda=new NodejsFunction(this,"HelloLambda",{
            //     runtime: Runtime.NODEJS_18_X,
            //     handler: 'hello.main',
            //     code: Code.fromAsset(join(__dirname,'..','..','services')),
            //     environment: {
            //         TABLE_NAME: props.spacesTable.tableName
            //     }
            // })

            //attaching an policy to lambda function role.
            
            // helloLambda.addToRolePolicy(new PolicyStatement({
            //     effect:Effect.ALLOW,
            //     actions:[
            //         's3:ListBuckets',
            //         's3:ListAllMyBuckets'
            //     ],
            //     resources: ['*']

            // }))
              

            // //setting the lambda function arn 
            // this.helloLambdaIntegration=new LambdaIntegration(helloLambda);



            const spacelambda=new NodejsFunction(this,"spaceslambda",{
                runtime: Runtime.NODEJS_18_X,
                handler: 'handler',
                entry: (join(__dirname,'..','..','services','spaces','handler.ts')),
                environment: {
                    TABLE_NAME: props.spacesTable.tableName
                }
            })
            

            spacelambda.addToRolePolicy(new PolicyStatement({
                effect:Effect.ALLOW,
                actions:[
                    'dynamodb:PutItem',
                ],
                resources: [props.spacesTable.tableArn]


            }))

            this.spacesLambdaIntergration=new LambdaIntegration(spacelambda);

        }
}