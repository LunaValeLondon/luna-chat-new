def handler(event, context):
    return {
        "statusCode": 200,
        "body": "Hello from your ultra-minimal Python function!",
        "headers": {
            "Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*"
        }
    }