# Understanding Axios Requests and Responses

## JSON Response Formats

JSON data can be in two different formats:
These are the only valid formats

- A collection of key-value pairs enclosed by curly braces `{...}`
- An ordered list of values enclosed by square brackets `[...]`

## Server Response Handling

When a server uses `res.json()`, it sends the entire object as-is to the client. This is important to understand when working with APIs that return responses in different formats.

## Lambda-style vs Standard Responses

### Lambda-style Response (Stringified Body)

```javascript
// Server side
const lambdaStyleResponse = {
  statusCode: 200,
  body: JSON.stringify({ message: "Hello from Lambda!" }),
  additionalProps: "some value",
};
res.json(lambdaStyleResponse);

// Client side
console.log(response.data);
// {
//   statusCode: 200,
//   body: '{"message":"Hello from Lambda!"}',
//   additionalProps: "some value"
// }

// To use the body data
const parsedBody = JSON.parse(response.data.body);
console.log(parsedBody); // { message: "Hello from Lambda!" }
```

### Already-Parsed Response

```javascript
// Server side
const normalResponse = {
  statusCode: 200,
  body: { message: "This body is already parsed." },
};
res.json(normalResponse);

// Client side
console.log(response.data);
// {
//   statusCode: 200,
//   body: { message: "This body is already parsed." }
// }

// To use the body data (no parsing needed)
console.log(response.data.body); // { message: "This body is already parsed." }
```

## Axios Response Structure

The Axios response object has the following structure:

```typescript
interface AxiosResponse<T = any, D = any> {
  data: T; // The response data returned by the server
  status: number; // HTTP status code
  statusText: string; // HTTP status message
  headers: object; // HTTP headers
  config: object; // Request configuration
  request?: any; // Request that generated this response
}
```

Important points:

- `response.data` contains whatever was sent by the server's `res.json()`
- The HTTP status code (`response.status`) is separate from any status codes inside the response body
- When handling errors, the error object may contain a `response` property with the same structure

## Error Handling

When an error occurs, Axios throws an `AxiosError` that may contain the response:
error.response is again of type Axios Response

```typescript
try {
  const response = await axios.get("/some-url");
  // Handle success
} catch (error) {
  if (axios.isAxiosError(error)) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request);
    } else {
      // Something happened in setting up the request
      console.log("Error", error.message);
    }
  }
}
```

### Important: HTTP Status Codes vs Response Body Error Properties

Axios only triggers the catch block when the HTTP status code is outside the 200-299 range. Even if the response body contains an error property or indicates a failure, Axios will still resolve the promise successfully if the HTTP status code is in the 2xx range.

```javascript
// Example: Server returns HTTP 200 but indicates error in response body
// Server side
app.get("/api/data", (req, res) => {
  res.status(200).json({
    success: false,
    error: true,
    message: "Some business logic error occurred",
  });
});

// Client side
try {
  const response = await axios.get("/api/data");
  // This will execute because HTTP status is 200
  // You must check the response body for error indicators
  if (response.data.error) {
    console.log("Error in response body:", response.data.message);
    // Handle the error appropriately
  } else {
    // Process successful response
  }
} catch (error) {
  // This will NOT execute for HTTP 200 responses
  // Only executes for network errors or HTTP status codes outside 200-299
  console.error("HTTP error:", error);
}
```

Therefore, always check the response body for error indicators when working with APIs that may return error information with successful HTTP status codes.

## Key Takeaways

1. The structure of `response.data` depends entirely on what the server sent
2. With Lambda-style responses, the body is often a stringified JSON that needs to be parsed
3. Standard REST APIs typically send already-parsed JSON objects
4. Axios wraps the server's response in its own structure, separating HTTP status from any status code in the response body
5. Always check the structure of your API responses to handle them correctly
6. throw new Error("Failed") returns an error which can be caught within the catch block and be extracted by error.message
7. Axios only enters the catch block for HTTP status codes outside the 200-299 range, regardless of error properties in the response body
8. For APIs that return error information with 2xx status codes, you must explicitly check the response body for error indicators
