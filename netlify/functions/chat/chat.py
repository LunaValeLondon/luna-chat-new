import json
import os
import requests # This will be needed for making API calls to Gemini later

# Renamed from 'handler' to 'lambda_handler' for Netlify
def lambda_handler(event, context):
    # Allow CORS for requests from Wix
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }

    # Handle preflight OPTIONS request from the browser (CORS)
    if event['httpMethod'] == 'OPTIONS':
        return {
            "statusCode": 204, # No Content for OPTIONS
            "headers": headers,
            "body": ""
        }

    if event['httpMethod'] != 'POST':
        return {
            "statusCode": 405,
            "headers": headers,
            "body": json.dumps({"error": "Method Not Allowed. Only POST requests are accepted."})
        }

    try:
        body = json.loads(event.get('body', '{}'))
        user_message = body.get('message', '').strip()

        if not user_message:
            return {
                "statusCode": 400,
                "headers": headers,
                "body": json.dumps({"error": "No message provided in the request body."})
            }

        # --- This is where your AI logic will go later ---
        # For now, let's just echo back the message or a simple response
        response_message = f"You said: '{user_message}'. (This is from your Python function, ready for Netlify!)"

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({"response": response_message})
        }

    except json.JSONDecodeError:
        return {
            "statusCode": 400,
            "headers": headers,
            "body": json.dumps({"error": "Invalid JSON in request body."})
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"error": f"An unexpected error occurred: {str(e)}"})
        }