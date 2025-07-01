// netlify/functions/chat/chat.js

exports.handler = async function(event, context) {
    // Define CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*', // Allows all origins
        'Access-Control-Allow-Methods': 'POST, OPTIONS', // Allowed methods for your endpoint
        'Access-Control-Allow-Headers': 'Content-Type', // Allowed request headers
    };

    // Handle OPTIONS preflight request for CORS
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
            const query = requestBody.query; // Assuming your frontend sends { "query": "..." }

            // Basic validation for the query
            if (!query || typeof query !== 'string') {
                return {
                    statusCode: 400,
                    headers: headers,
                    body: JSON.stringify({ error: 'Missing or invalid "query" in request body.' }),
                };
            }

            // --- Your core chat logic would go here ---
            // For now, let's just echo the query and indicate success.
            const responseMessage = `Received your query: "${query}". This is a placeholder response from Node.js function.`;

            return {
                statusCode: 200,
                headers: headers,
                body: JSON.stringify({ message: responseMessage }),
            };

        } catch (error) {
            console.error("Error parsing request body or processing:", error);
            return {
                statusCode: 500,
                headers: headers,
                body: JSON.stringify({ error: 'Internal Server Error: Could not process request.' }),
            };
        }
    }

    // Return a 405 Method Not Allowed for other HTTP methods
    return {
        statusCode: 405,
        headers: headers,
        body: JSON.stringify({ error: 'Method Not Allowed. Only POST and OPTIONS are supported.' }),
    };
};