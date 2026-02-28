
RENDER_URL="https://webhook-endpoint-w3ow.onrender.com/"

echo "Testing health check..."
curl -X GET $RENDER_URL

echo -e "\n\nTesting webhook endpoint..."
curl -X POST $RENDER_URL/webhook \
  -H "Content-Type: application/json" \
  -d '{"data": "hello"}'

echo -e "\n"