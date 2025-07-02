import { GoogleGenAI } from '@google/genai';

// The main handler for the Netlify Function
export default async function(event, context) {
    // --- Log the entire event object for debugging ---
    console.log('Received event:', JSON.stringify(event, null, 2));

    // --- API Key and Environment Variable Check ---
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        console.error('GEMINI_API_KEY environment variable is not set.');
        // Return an error Response if API key is missing
        const errorBody = JSON.stringify({ error: 'Server configuration error: Gemini API key missing.' });
        return new Response(errorBody, {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // CORS header
            },
        });
    }

    // Initialize the Google Generative AI client after API_KEY is confirmed
    const genAI = new GoogleGenAI({ apiKey: API_KEY });

    // Set up CORS headers
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins for simplicity during development
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Use a safe way to get httpMethod, defaulting to empty string if undefined/null
    const method = (event.httpMethod || '').toUpperCase();

    // Handle preflight OPTIONS request for CORS
    if (method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: headers }); // No content for preflight success
    }

    // Only allow POST requests for actual chat
    if (method !== 'POST') {
        const errorBody = JSON.stringify({ error: 'Method Not Allowed' });
        return new Response(errorBody, { status: 405, headers: headers });
    }

    try {
        const requestBody = JSON.parse(event.body);
        const userQuery = requestBody.query;

        if (!userQuery) {
            const errorBody = JSON.stringify({ error: 'Missing "query" in request body.' });
            return new Response(errorBody, { status: 400, headers: headers });
        }

        console.log('Received query:', userQuery);

        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent(userQuery);
        const response = await result.response;
        const text = response.text();

        console.log('Gemini response:', text);

        // Construct the success Response object
        const successBody = JSON.stringify({ response: text });
        return new Response(successBody, { status: 200, headers: headers });

    } catch (error) {
        console.error('Error generating content:', error);
        // Construct the error Response object
        const errorBody = JSON.stringify({ error: 'Failed to generate content from Gemini API.', details: error.message });
        return new Response(errorBody, {
            status: 500,
            headers: headers,
        });
    }
}