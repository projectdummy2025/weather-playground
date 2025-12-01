# OpenRouter Integration Guide 🚀

This document provides a guide for developers on integrating applications with OpenRouter, with a particular focus on utilizing its advanced Reasoning feature. OpenRouter offers a unified API key to access a wide array of AI models, including free options like `openai/gpt-oss-20b:free`.

## Key Concept: Reasoning Feature

The Reasoning feature enables AI models to perform an intermediate "thought" process before generating a final response. This can lead to more coherent, accurate, and contextually aware outputs. When using this feature, you may observe "reasoning tokens" indicating the computational effort spent on this internal deliberation.

## 1. Using OpenRouter SDK (JavaScript/Node.js) ⚡

For JavaScript/TypeScript developers, the official `@openrouter/sdk` provides the most streamlined integration, supporting streamed responses and easy access to reasoning token usage.

### Installation

```bash
npm install @openrouter/sdk
```

### Example Code

```javascript
import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
  apiKey: "<YOUR_OPENROUTER_API_KEY>" // Replace with your OpenRouter API Key
});

async function main() {
  // Stream the response for a real-time user experience
  const stream = await openrouter.chat.send({
    model: "openai/gpt-oss-20b:free",
    messages: [
      {
        role: "user",
        content: "How many r's are in the word 'strawberry'?"
      }
    ],
    stream: true,
    streamOptions: {
      includeUsage: true // Essential for retrieving token usage, including reasoning tokens
    }
  });

  let response = "";
  
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      response += content;
      process.stdout.write(content); // Print content incrementally
    }
    
    // Token usage information is typically found in the final chunk
    if (chunk.usage) {
      console.log("\n\n🧠 Reasoning tokens:", chunk.usage.reasoningTokens);
    }
  }
}

main();
```

## 2. Python (using `requests` library) 🐍

For Python developers preferring the standard `requests` library for HTTP communication.

### Important Considerations:

*   Use `extra_body` to enable the reasoning feature.
*   For multi-turn conversations, it's crucial to pass the `reasoning_details` from the assistant's previous response back into the `messages` array of subsequent requests to maintain contextual reasoning.

### Example Code

```python
import requests
import json

API_KEY = "<YOUR_OPENROUTER_API_KEY>" # Replace with your OpenRouter API Key
URL = "https://openrouter.ai/api/v1/chat/completions"

# --- First Call ---
response = requests.post(
  url=URL,
  headers={
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
  },
  data=json.dumps({
    "model": "openai/gpt-oss-20b:free",
    "messages": [
        {
          "role": "user",
          "content": "How many r's are in the word 'strawberry'?"
        }
      ],
    "extra_body": {"reasoning": {"enabled": True}} # Enable reasoning
  })
)

# Extract response and reasoning details
resp_json = response.json()
assistant_msg = resp_json['choices'][0]['message']

# --- Second Call (Continuing the conversation) ---
# Maintain chat history, INCLUDING reasoning_details to preserve reasoning context
messages = [
  {"role": "user", "content": "How many r's are in the word 'strawberry'?"},
  {
    "role": "assistant",
    "content": assistant_msg.get('content'),
    "reasoning_details": assistant_msg.get('reasoning_details')  # Re-pass reasoning details
  },
  {"role": "user", "content": "Are you sure? Think carefully."}
]

response2 = requests.post(
  url=URL,
  headers={
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
  },
  data=json.dumps({
    "model": "openai/gpt-oss-20b:free",
    "messages": messages,  # Send complete history
    "extra_body": {"reasoning": {"enabled": True}}
  })
)

print(response2.json()['choices'][0]['message']['content'])
```

## 3. TypeScript & Web (using native `fetch`) 🌐

For frontend or environments supporting the native `fetch` API. The core concept remains similar to the Python example, emphasizing the importance of `reasoning_details` for continuous context.

### Example Code

```typescript
// --- First Call ---
let response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${"<YOUR_OPENROUTER_API_KEY>"}`, // Replace with your OpenRouter API Key
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "model": "openai/gpt-oss-20b:free",
    "messages": [
      {
        role: "user",
        content: "How many r's are in the word 'strawberry'?"
      }
    ],
    // Enable reasoning here
    "extra_body": {"reasoning": {"enabled": true}} 
  })
});

const result = await response.json();
const firstMessage = result.choices[0].message;

// --- Second Call (Follow-up) ---
const messages = [
  {
    role: 'user',
    content: "How many r's are in the word 'strawberry'?",
  },
  {
    role: 'assistant',
    content: firstMessage.content,
    // Important: Re-pass reasoning_details to maintain context
    reasoning_details: firstMessage.reasoning_details, 
  },
  {
    role: 'user',
    content: "Are you sure? Think carefully.",
  },
];

const response2 = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${"<YOUR_OPENROUTER_API_KEY>"}`, // Replace with your OpenRouter API Key
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    "model": "openai/gpt-oss-20b:free",
    "messages": messages 
  })
});

const finalResult = await response2.json();
console.log(finalResult.choices[0].message.content);
```

## 4. OpenAI SDK in TypeScript 🛠️

Developers accustomed to the OpenAI SDK can still leverage it by overriding the `baseURL` to point to OpenRouter. A minor type casting (`@ts-ignore` or explicit type definition) might be necessary due to the OpenAI SDK's lack of native support for the `reasoning_details` property.

### Example Code

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '<YOUR_OPENROUTER_API_KEY>', // Replace with your OpenRouter API Key
});

async function main() {
  // First Call
  const apiResponse = await client.chat.completions.create({
    model: 'openai/gpt-oss-20b:free',
    messages: [
      {
        role: 'user' as const,
        content: "How many r's are in the word 'strawberry'?",
      },
    ],
    // @ts-ignore - The OpenAI SDK does not natively recognize this property
    extra_body: { reasoning: { enabled: true } }
  });

  // Type assertion to correctly handle reasoning_details
  type ORChatMessage = (typeof apiResponse)['choices'][number]['message'] & {
    reasoning_details?: unknown;
  };
  
  const response = apiResponse.choices[0].message as ORChatMessage;

  // Construct history for the second call
  const messages = [
    {
      role: 'user' as const,
      content: "How many r's are in the word 'strawberry'?",
    },
    {
      role: 'assistant' as const,
      content: response.content,
      reasoning_details: response.reasoning_details, // Pass back unmodified
    },
    {
      role: 'user' as const,
      content: "Are you sure? Think carefully.",
    },
  ];

  // Second Call
  const response2 = await client.chat.completions.create({
    model: 'openai/gpt-oss-20b:free',
    messages, // Send complete history
    // @ts-ignore - The OpenAI SDK does not natively recognize this property
    extra_body: { reasoning: { enabled: true } }
  });
  
  console.log(response2.choices[0].message.content);
}

main();
```

## 5. Quick Check with `cURL` 💻

For quick testing directly from the terminal without writing code, use the following `cURL` command:

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{
  "model": "openai/gpt-oss-20b:free",
  "messages": [
    {
      "role": "user",
      "content": "How many r`s are in the word `strawberry?`"
    }
  ],
  "extra_body": {
    "reasoning": {
      "enabled": true
    }
  }
}'
```

## Final Notes: Security

Always ensure the confidentiality of your `<YOUR_OPENROUTER_API_KEY>`. Never commit API keys directly into public repositories or expose them in client-side code. Utilize environment variables or secure configuration management practices.

Happy Coding! 🚀
