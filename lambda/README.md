# Description

This AWS Lambda Function returns a response record with status, application date, and transaction
level information if it exists based off a user's SSN/ITIN and Zipcode.

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
