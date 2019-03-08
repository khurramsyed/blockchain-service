# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project

- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```
- Install crypto-js with --save flag to save dependency to our package.json file
```
npm install crypto-js --save
```
- Install level with --save flag
```
npm install level --save
```
- Install express
```
npm install express --save
```
- Install body-parse
```
npm install body-parse --save
```

## Testing WebServices

Two web service operations are available for this project namely:
- Adding Blocks (POST)
- Retrieving Blkock (GET)
You can easily this project using curl or postman .

## Adding a Block 
You can add a block by providing the data field in a json  as below

```bash
curl -X POST \
  http://localhost:8000/block \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
 "data":"Hello"
}'
```

### Retrieving a Block
You can retrieve a block using curl as follows

```bash
curl -X GET \
  http://localhost:8000/block/7 \
  -H 'cache-control: no-cache'
```
where last part of url , **7** in this case is the block number you want to retrieve.