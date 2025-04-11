# Advantages of Lambda Proxy Integration over Custom Methods in API Gateway

## Introduction

Amazon API Gateway offers two main approaches for integrating with Lambda functions: Lambda proxy integration and custom integration. This document outlines the key advantages of using Lambda proxy integration over custom methods.

## Key Advantages

### 1. Automatic Request Mapping

Lambda proxy integration automatically passes the entire request to your Lambda function without requiring manual mapping. This includes:

- HTTP method
- Headers
- Query string parameters
- Path parameters
- Request body

In contrast, with custom integration, you must manually configure how each component of the request is mapped to your Lambda function using Velocity templates.

### 2. Simplified Development

Lambda proxy integration significantly reduces development time and complexity:

- No need to write and maintain Velocity templates
- No need to define request/response mappings
- Faster API development and deployment cycles

### 3. Consistent Request Format

Lambda proxy integration provides a consistent event object structure to your Lambda function:

```json
{
  "resource": "/my/path",
  "path": "/my/path",
  "httpMethod": "GET",
  "headers": {
    "header1": "value1",
    "header2": "value1,value2"
  },
  "multiValueHeaders": {
    "header1": ["value1"],
    "header2": ["value1", "value2"]
  },
  "queryStringParameters": {
    "parameter1": "value1,value2",
    "parameter2": "value"
  },
  "multiValueQueryStringParameters": {
    "parameter1": ["value1", "value2"],
    "parameter2": ["value"]
  },
  "pathParameters": null,
  "stageVariables": null,
  "requestContext": { ... },
  "body": "Hello from Lambda!",
  "isBase64Encoded": false
}
```

### 4. Flexible Response Handling

Lambda proxy integration allows your Lambda function to control the entire response:

- Status code
- Headers
- Response body

This flexibility enables your Lambda function to implement complex response logic without API Gateway configuration changes.

### 5. Support for Multi-Value Parameters

Lambda proxy integration natively supports multi-value headers and query string parameters, making it easier to handle complex requests.

### 6. Reduced Configuration Overhead

With Lambda proxy integration:

- No need to define method request parameters
- No need to define integration request parameters
- No need to define method response parameters
- No need to define integration response parameters

### 7. Easier Maintenance

Lambda proxy integration simplifies maintenance:

- Fewer configuration points to manage
- Less chance of configuration errors
- Easier to update and modify APIs

### 8. Simplified Error Handling with Axios

Lambda proxy integration significantly simplifies error handling when using HTTP clients like Axios:

#### Lambda Proxy Integration

When using Lambda proxy integration, the `statusCode` in the Lambda response is automatically mapped to the HTTP status code of the API Gateway response. This means:

- If the Lambda function returns a `statusCode` in the 200-299 range, Axios will treat it as a successful response
- If the Lambda function returns a `statusCode` outside the 200-299 range, Axios will automatically trigger the catch block

```javascript
// Lambda function with proxy integration
exports.handler = async (event) => {
  // Some error condition
  if (errorCondition) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Bad request" }),
    };
  }

  // Success case
  return {
    statusCode: 200,
    body: JSON.stringify({ data: "Success" }),
  };
};

// Client-side Axios call
axios
  .get("/api/endpoint")
  .then((response) => {
    // This only runs for status codes 200-299
    console.log(response.data);
  })
  .catch((error) => {
    // This automatically runs for status codes outside 200-299
    console.error(error.response.data);
  });
```

#### Custom Integration

With custom integration, you must manually configure error responses and handle them appropriately:

1. Define integration response templates for different status codes
2. Map Lambda function outputs to these templates
3. Configure method responses to handle different status codes

This requires additional configuration in API Gateway and more complex error handling in your client code.

## Example: GET Request Handling

### Lambda Proxy Integration

With Lambda proxy integration, query parameters are automatically available in the `queryStringParameters` object:

```javascript
exports.handler = async (event) => {
  const queryParams = event.queryStringParameters;
  const param1 = queryParams.param1;

  return {
    statusCode: 200,
    body: JSON.stringify({ param1 }),
  };
};
```

### Custom Integration

With custom integration, you must define a Velocity template to map query parameters:

```velocity
{
  "param1": "$input.params('param1')"
}
```

## Conclusion

Lambda proxy integration offers significant advantages in terms of development speed, flexibility, and maintenance. While custom integration provides more fine-grained control over request/response transformation, Lambda proxy integration is generally the preferred approach for most API Gateway use cases due to its simplicity and reduced configuration overhead.

For more information, refer to the [AWS documentation on Lambda proxy integration](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-create-api-as-simple-proxy).
