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
