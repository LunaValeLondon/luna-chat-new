// netlify/functions/test-event.mjs
export default async function(event, context) {
    console.log('Test event received:', JSON.stringify(event, null, 2));

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    };

    const method = (event.httpMethod || '').toUpperCase();

    if (method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: headers });
    }

    if (method !== 'POST') {
        return new Response(JSON.stringify({ error: `Method ${method} Not Allowed (Expected POST)` }), { status: 405, headers: headers });
    }

    return new Response(JSON.stringify({ message: "Hello from test-event function! Event object received. Check logs for details." }), { status: 200, headers: headers });
}