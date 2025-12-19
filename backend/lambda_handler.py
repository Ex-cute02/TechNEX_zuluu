import json
import os
from mangum import Mangum
from app.main import app

# Create the Mangum handler for AWS Lambda
handler = Mangum(app, lifespan="off")

# Optional: Add custom error handling
def lambda_handler(event, context):
    """
    AWS Lambda handler function
    """
    try:
        return handler(event, context)
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            })
        }