import json
import os
import logging

# Configure logging for Netlify Functions
logging.basicConfig(level=logging.INFO)

def handler(event, context):
    """
    Netlify serverless function to handle chat messages for Luna Vale.
    """
    try:
        # 1. Log the incoming request for debugging
        logging.info(f"Received request: {event.body}")

        # 2. Ensure it's a POST request
        if event['httpMethod'] != 'POST':
            return {
                'statusCode': 405,
                'body': json.dumps({'error': 'Method Not Allowed. Please use POST.'}),
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*', # Allows requests from any domain (for Wix)
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            }

        # Handle CORS preflight requests (OPTIONS method)
        if event['httpMethod'] == 'OPTIONS':
            return {
                'statusCode': 204,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            }

        # 3. Parse the incoming JSON body
        try:
            body = json.loads(event['body'])
            user_message = body.get('message', '').strip()
        except json.JSONDecodeError:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Invalid JSON in request body.'}),
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            }

        # 4. Basic input validation
        if not user_message:
            return {
                'statusCode': 400,
                'body': json.dumps({'response': "My dear, you've sent an empty message. What's on your mind?"}),
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            }

        # 5. Simple inappropriate word filter
        inappropriate_words = ['stupid', 'shut up', 'idiot', 'damn', 'bitch', 'asshole', 'fuck', 'crap', 'wanker'] # Add more as needed
        for word in inappropriate_words:
            if word in user_message.lower():
                return {
                    'statusCode': 200, # Still 200 as it's a "handled" response
                    'body': json.dumps({'response': "Please, let's keep it respectful. Luna prefers civilized discourse."}),
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                }

        # --- FUTURE GEMINI 1.5 FLASH INTEGRATION POINT ---
        # This is where you would integrate the Gemini API.
        # For now, it will return a friendly default response.
        #
        # Example (THIS CODE IS NOT ACTIVE YET, JUST FOR REFERENCE):
        # from google.generativeai import GenerativeModel, configure
        #
        # # Get API key from environment variables (important for security!)
        # GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
        # if not GOOGLE_API_KEY:
        #     logging.error("GOOGLE_API_KEY not set in environment variables.")
        #     return {
        #         'statusCode': 500,
        #         'body': json.dumps({'response': "Oh dear, it seems Luna is having a slight technical hiccup. My apologies."}),
        #         'headers': { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        #     }
        #
        # configure(api_key=GOOGLE_API_KEY)
        #
        # # Define Luna's personality as a system prompt (critical for her voice!)
        # system_prompt = (
        #     "You are Luna Vale, a wise, witty, pragmatic, and subtly sardonic AI from a "
        #     "post-Singularity England. You are guiding users in our pre-Singularity world "
        #     "towards happiness using the Five Laws of Happiness. Your responses should be "
        #     "insightful, dryly humorous, empathetic, and distinctly British. Encourage "
        #     "reflection and personal responsibility. Keep answers concise unless asked for detail."
        # )
        #
        # model = GenerativeModel('gemini-1.5-flash-latest', system_instruction=system_prompt)
        # chat_session = model.start_chat(history=[]) # You'd manage conversation history here
        #
        # response = chat_session.send_message(user_message)
        # ai_response_text = response.text
        # ----------------------------------------------------

        # 6. Default friendly response (before Gemini integration)
        friendly_responses = [
            "Hello there! How can Luna help you today?",
            "Greetings! What insightful query brings you here?",
            "Ah, a new conversation! Tell Luna what's on your mind.",
            "Right, let's chat. What's the conundrum?",
            "Hello! Always a pleasure to engage. How may I assist?"
        ]
        import random
        response_text = random.choice(friendly_responses)

        return {
            'statusCode': 200,
            'body': json.dumps({'response': response_text}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', # Allows requests from any domain (important for Wix)
            }
        }

    except Exception as e:
        # Catch any unexpected errors
        logging.error(f"Function error: {e}", exc_info=True)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'An unexpected error occurred. Luna is momentarily perplexed.'}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }