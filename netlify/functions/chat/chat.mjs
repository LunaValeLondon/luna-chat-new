// Filename: netlify/functions/chat/chat.js
import { GoogleGenerativeAI } from '@google/genai'; // Correct ES Module import

export async function handler(event, context) { // Correct ES Module export for the handler
    // Define CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*', // Allows all origins
        'Access-Control-Allow-Methods': 'POST, OPTIONS', // Allowed methods for your endpoint
        'Access-Control-Allow-Headers': 'Content-Type', // Allowed request headers
    };

    // Handle OPTIONS preflight request for CORS (important for web browsers)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ message: 'CORS preflight successful' }),
        };
    }

    // Handle POST request
    if (event.httpMethod === 'POST') {
        try {
            // Parse the request body (assuming it's JSON)
            const requestBody = JSON.parse(event.body);
            const userQuery = requestBody.query; // Assuming your frontend sends { "query": "..." }

            // Basic validation for the query
            if (!userQuery || typeof userQuery !== 'string') {
                return {
                    statusCode: 400,
                    headers: headers,
                    body: JSON.stringify({ error: 'Missing or invalid "query" in request body.' }),
                };
            }

            // --- Gemini API Integration Starts Here ---
            // Initialize Gemini API client.
            // It automatically reads GEMINI_API_KEY from Netlify's environment variables.
            // Make sure GEMINI_API_KEY is set in your Netlify Site Settings -> Environment variables.
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

            // Get the generative model (using gemini-pro for text generation)
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            // This is your prompt for Gemini, currently just the user's query.
            // We will add Luna's personality and JSON data here in a later step!
            const prompt = userQuery;

            // Log the prompt to Netlify Function logs (useful for debugging)
            console.log("Netlify Function (chat.js): Sending prompt to Gemini:", prompt);

            // Send the prompt to Gemini and get the response
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const geminiText = response.text(); // Extract the text content from Gemini's response

            // Log Gemini's response to Netlify Function logs
            console.log("Netlify Function (chat.js): Received response from Gemini:", geminiText);

            // Return Gemini's actual response in the body
            return {
                statusCode: 200,
                headers: headers,
                body: JSON.stringify({ message: geminiText }),
            };

        } catch (error) {
            console.error("Netlify Function (chat.js): Error processing request or calling Gemini:", error);
            // Return a more informative error for debugging
            return {
                statusCode: 500,
                headers: headers,
                body: JSON.stringify({
                    error: 'Internal Server Error: Could not process request or call AI.',
                    details: error.message || 'Unknown error. Check Netlify function logs for more details.'
                }),
            };
        }
    }

    // Return a 405 Method Not Allowed for any HTTP methods other than POST or OPTIONS
    return {
        statusCode: 405,
        headers: headers,
        body: JSON.stringify({ error: 'Method Not Allowed. Only POST and OPTIONS are supported.' }),
    };
}