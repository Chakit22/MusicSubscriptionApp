# Understanding Axios Requests and Responses

## JSON Request Formats

Here, when you pass the data as a payload then as we mentioned that type of content is "application/json" then it is converted into JSON.
If I am passing an array of values it will be converted like

JSON.stringify(["s", "d"])

This will convert into "["s", "d"]" which is JSON nothing but string.

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

`res.status(201).json({message: "Hey there"}); Here, status is mapped to the status in the axios response above, and response.data maps the whole json response`

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

## Key Takeaways

1. The structure of `response.data` depends entirely on what the server sent
2. With Lambda-style responses, the body is often a stringified JSON that needs to be parsed
3. Standard REST APIs typically send already-parsed JSON objects
4. Axios wraps the server's response in its own structure, separating HTTP status from any status code in the response body
5. Always check the structure of your API responses to handle them correctly
6. throw new Error("Failed") returns an error which can be caught within the catch block and be extracted by error.message
