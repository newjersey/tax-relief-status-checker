# Description

This AWS Lambda Function returns a response record with transaction level information if it exists
for each of ANCHOR, PTR, Say NJ transactions.

# Deployment

Deploying resources using CDK (dev)

```bash
export AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY
export AWS_SESSION_TOKEN
npm run deploy:dev
```

Deploying resources using CDK (prod)

```bash
export AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY
export AWS_SESSION_TOKEN
npm run deploy:prod
```

# Testing

Unit Tests

```bash
npx vitest lambda/
```
