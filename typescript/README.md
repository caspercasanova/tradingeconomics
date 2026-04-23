# Trading Economics - Typescript - Market Data Stream

Trading Economics provides its users with economic indicators and quotes, delayed feeds and historical data for currencies, commodities, stock indexes, share prices and bond yields. 

#
## Example

Create an app.ts file with the contents:


```typescript
import { TEClient} from 'tradingeconomics-stream'

// Credentials

let key = ''
let secret = ''

if (process.env.apikey){
  const apikey = process.env.apikey
  if (apikey.includes(':')) {
    key = apikey.split(':')[0]
    secret = apikey.split(':')[1]
  }
}

if (!key || !secret) {
  throw new Error('API key is required. Please subscribe to a plan at https://tradingeconomics.com/api/pricing.aspx to get an API key.')
}

console.log("Credentials:", key)

// Subscribing to Quotes

const subscribe = (asset: string) => {
  const client = new TEClient({
    key: key,
    secret: secret,
  })

  client.subscribe(asset)

  client.on('message', msg => {
    console.log(`Got price for asset ${asset}:`, msg.price)
  })
}

subscribe('EURUSD:CUR')

```

#
**Install Packages**

```bash
npm install 'tradingeconomics-stream'
npm install -g typescript
npm i --save-dev @types/node
```


#
**Compile Typescript**

```bash
tsc app.ts
```

**Run the app**

Please subscribe to a plan at https://tradingeconomics.com/api/pricing.aspx to get an API key.

```bash
export apikey=your_key:your_secret
node app.js
```
#

**Docker**

Please pass your API key as an environmental variable

```bash
docker run --rm -it --init --name te-typescript -e apikey=your_key:your_secret tradingeconomics/typescript:latest
```
#



##

**More examples in Javascript**


https://github.com/tradingeconomics/tradingeconomics/tree/master/nodejs

##

#

**Acknowledgements** 


Jonas Hals


https://github.com/boxhock/tradingeconomics-nodejs-stream



