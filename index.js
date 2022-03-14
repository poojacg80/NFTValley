"use strict";
const express = require('express')
const app = express()
const port = 3000
// Import the library
const xrpl = require("xrpl")


  // Define the network client
  app.get('/account_info', (req, res) => {
  const SERVER_URL = req.query.server_url;
    //<<ENTER_ SERVER_URL>>
  const client = new xrpl.Client(SERVER_URL)
   client.connect()
  
  // Create a wallet and fund it with the Testnet faucet:
  const fund_result =  client.fundWallet();
  const test_wallet = fund_result.wallet;
  console.log(fund_result);

  // Get info from the ledger about the address we just funded

   
  const response =  client.request({
    "command": "account_info",
    "account": test_wallet.address,
    "ledger_index": "validated"
  })
  console.log(response);
     res.send(response);
})
  // Listen to ledger close events
app.get('/Listen_ledger', (req, res) => {
    const SERVER_URL = req.query.server_url;
  const client = new xrpl.Client(SERVER_URL)
   client.connect();
  client.request({
    "command": "subscribe",
    "streams": ["ledger"]
  })
  client.on("ledgerClosed",  (ledger) => {
    client.disconnect();
    console.log(`Ledger #${ledger.ledger_index} validated with ${ledger.txn_count} transactions!`)
  })
     res.send(`Ledger #${ledger.ledger_index} validated with ${ledger.txn_count} transactions!`);
})


async function main() {

  // Define the network client
  const client = new xrpl.Client(req.query.server_url);//"wss://s.altnet.rippletest.net:51233"
  await client.connect()

// Example credentials
const wallet = xrpl.Wallet.fromSeed(req.query.seed);//"sn3nxiW7v8KXzPzAqzyHXbSSKNuN9"
console.log(wallet.address) // rMCcNuTcajgw7YTgBy1sys3b89QqjUrMpH

// Prepare transaction -------------------------------------------------------
  const prepared = await client.autofill({
    "TransactionType": "Payment",
    "Account": wallet.address,
    "Amount": xrpl.xrpToDrops(req.query.amount),
    "Destination": req.query.destination //"rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
  })
  const max_ledger = prepared.LastLedgerSequence
  console.log("Prepared transaction instructions:", prepared)
  console.log("Transaction cost:", xrpl.dropsToXrp(prepared.Fee), "XRP")
  console.log("Transaction expires after ledger:", max_ledger)
  
// Sign prepared instructions ------------------------------------------------
  const signed = wallet.sign(prepared)
  console.log("Identifying hash:", signed.hash)
  console.log("Signed blob:", signed.tx_blob)
  
// Submit signed blob --------------------------------------------------------
  const tx = await client.submitAndWait(signed.tx_blob)

// Wait for validation -------------------------------------------------------
  // submitAndWait() handles this automatically, but it can take 4-7s.

// Check transaction results -------------------------------------------------
  console.log("Transaction result:", tx.result.meta.TransactionResult)
  console.log("Balance changes:", JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2));
  return "Balance changes:", JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2);
  
// Disconnect when done (If you omit this, Node.js won't end the process)

}
app.get('/transaction', async (req, res) => {
 try {    
      let screenshot = await main()
      res.send({ result: screenshot })
  } catch(e) {
      // catch errors and send error status
      console.log(e);
      res.sendStatus(500);
  }

})
//***************************
//** Mint Token *************
//***************************

async function mintToken() {
    const wallet = xrpl.Wallet.fromSeed(req.query.seed)
    const client = new
         xrpl.Client(req.query.server_url)
    await client.connect()
    console.log("Connected to devnet")
	
    const transactionBlob = {
        TransactionType: "NFTokenMint",
        Account: wallet.classicAddress,
        URI: xrpl.convertStringToHex(tokenUrl.value),
        Flags: parseInt(flags.value),
        TokenTaxon: 0
    }

    const tx = await client.submitAndWait(transactionBlob,{wallet})

    const nfts = await client.request({
        method: "account_nfts",
        account: wallet.classicAddress  
    })
    console.log(nfts)

    console.log("Transaction result:", tx.result.meta.TransactionResult)
    console.log("Balance changes:",
      JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
	  
    client.disconnect()
} //End of mintToken

app.get('/mintToken', async (req, res) => {
 try {    
      let screenshot = await mintToken()
      res.send({ result: screenshot })
  } catch(e) {
      // catch errors and send error status
      console.log(e);
      res.sendStatus(500);
  }

})

//***************************
//** Get Tokens *************
//***************************

async function getTokens() {
    const wallet = xrpl.Wallet.fromSeed(req.query.seed)
    const client = new xrpl.Client(req.query.server_url)
    await client.connect()
    console.log("Connected to devnet")
	
    const nfts = await client.request({
        method: "account_nfts",
        account: wallet.classicAddress  
    })

    console.log(nfts)

    client.disconnect()
} //End of getTokens

app.get('/getTokens', async (req, res) => {
 try {    
      let screenshot = await getTokens()
      res.send({ result: screenshot })
  } catch(e) {
      // catch errors and send error status
      console.log(e);
      res.sendStatus(500);
  }

})

//***************************
//** Burn Token *************
//***************************

async function burnToken() {
  const wallet = xrpl.Wallet.fromSeed(req.query.seed)
  const client = new xrpl.Client(req.query.server_url)
  await client.connect()
  console.log("Connected to devnet")
  
  const transactionBlob = {
      "TransactionType": "NFTokenBurn",
      "Account": wallet.classicAddress,
      "TokenID": tokenId.value
  }
 
  const tx = await client.submitAndWait(transactionBlob,{wallet})
 
  const nfts = await client.request({
    method: "account_nfts",
    account: wallet.classicAddress  
  })
  
  console.log(nfts)
  console.log("Transaction result:", tx.result.meta.TransactionResult)
  console.log("Balance changes:",
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))

  client.disconnect()
}
// End of burnToken()
app.get('/burnToken', async (req, res) => {
 try {    
      let screenshot = await burnToken()
      res.send({ result: screenshot })
  } catch(e) {
      // catch errors and send error status
      console.log(e);
      res.sendStatus(500);
  }

})
//********************************
//** Create Sell Offer ***********
//********************************

async function createSellOffer() {
    const wallet = xrpl.Wallet.fromSeed(req.query.seed)
    const client = new xrpl.Client(req.query.server_url)
    await client.connect()
    console.log("Connected to devnet")

  const transactionBlob = {
        "TransactionType": "NFTokenCreateOffer",
        "Account": wallet.classicAddress,
        "TokenID": tokenId.value,
        "Amount": amount.value,
        "Flags": parseInt(flags.value)
  }

  const tx = await client.submitAndWait(transactionBlob,{wallet})
 
  console.log("***Sell Offers***")
  let nftSellOffers
    try {
        nftSellOffers = await client.request({
        method: "nft_sell_offers",
        tokenid: tokenId.value  
      })
      } catch (err) {
        console.log("No sell offers.")
    }
  console.log(JSON.stringify(nftSellOffers,null,2))
  console.log("***Buy Offers***")
  let nftBuyOffers
  try {
    nftBuyOffers = await client.request({
    method: "nft_buy_offers",
    tokenid: tokenId.value })
  } catch (err) {
    console.log("No buy offers.")
  }
  console.log(JSON.stringify(nftBuyOffers,null,2))
 
  console.log("Transaction result:",
    JSON.stringify(tx.result.meta.TransactionResult, null, 2))
  console.log("Balance changes:",
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))

  client.disconnect()
  // End of createSellOffer()
}
app.get('/createSellOffer', async (req, res) => {
 try {    
      let screenshot = await createSellOffer()
      res.send({ result: screenshot })
  } catch(e) {
      // catch errors and send error status
      console.log(e);
      res.sendStatus(500);
  }

})
//********************************
//** Create Buy Offer ***********
//********************************
async function createBuyOffer() {

    const wallet = xrpl.Wallet.fromSeed(req.query.seed)
    const client = new xrpl.Client(req.query.server_url)
    await client.connect()
    console.log("Connected to devnet")

  const transactionBlob = {
        "TransactionType": "NFTokenCreateOffer",
        "Account": wallet.classicAddress,
        "Owner": owner.value,
        "TokenID": tokenId.value,
        "Amount": amount.value,
        "Flags": parseInt(flags.value)
  }

  const tx = await client.submitAndWait(transactionBlob,{wallet})

  console.log("***Sell Offers***")
  let nftSellOffers
    try {
        nftSellOffers = await client.request({
        method: "nft_sell_offers",
        tokenid: tokenId.value  
      })
      } catch (err) {
        console.log("No sell offers.")
    }
  console.log(JSON.stringify(nftSellOffers,null,2))
  console.log("***Buy Offers***")
  let nftBuyOffers
  try {
    nftBuyOffers = await client.request({
    method: "nft_buy_offers",
    tokenid: tokenId.value })
  } catch (err) {
    console.log("No buy offers.")
  }
  console.log(JSON.stringify(nftBuyOffers,null,2))
  
  console.log("Transaction result:",
    JSON.stringify(tx.result.meta.TransactionResult, null, 2))
  console.log("Balance changes:",
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
	
  client.disconnect()
  // End of createBuyOffer()
}
app.get('/createBuyOffer', async (req, res) => {
 try {    
      let screenshot = await createBuyOffer()
      res.send({ result: screenshot })
  } catch(e) {
      // catch errors and send error status
      console.log(e);
      res.sendStatus(500);
  }

})
//***************************
//** Get Offers *************
//***************************

async function getOffers() {
    const wallet = xrpl.Wallet.fromSeed(req.query.seed)
    const client = new xrpl.Client(req.query.server_url)
    await client.connect()
    console.log("Connected to devnet")
	
    console.log("***Sell Offers***")
    let nftSellOffers
      try {
      nftSellOffers = await client.request({
        method: "nft_sell_offers",
        tokenid: tokenId.value  
      })
    } catch (err) {
      console.log("No sell offers.")
    }
    console.log(JSON.stringify(nftSellOffers,null,2))
    console.log("***Buy Offers***")
    let nftBuyOffers
    try {
      nftBuyOffers = await client.request({
      method: "nft_buy_offers",
      tokenid: tokenId.value
      })
    } catch (err) {
      console.log("No buy offers.")
    }
    console.log(JSON.stringify(nftBuyOffers,null,2))

    client.disconnect()
  // End of getOffers()
}
app.get('/getOffers', async (req, res) => {
 try {    
      let screenshot = await getOffers()
      res.send({ result: screenshot })
  } catch(e) {
      // catch errors and send error status
      console.log(e);
      res.sendStatus(500);
  }

})
//***************************
//** Cancel Offer ***********
//***************************
async function cancelOffer() {
    const wallet = xrpl.Wallet.fromSeed(req.query.seed)
    const client = new xrpl.Client(req.query.server_url)
    await client.connect()
    console.log("Connected to devnet")

    const tokenID = offerTokenId.value
    const tokenIDs = [tokenID]

      const transactionBlob = {
          "TransactionType": "NFTokenCancelOffer",
         "Account": wallet.classicAddress,
         "TokenIDs": tokenIDs
      }

  const tx = await client.submitAndWait(transactionBlob,{wallet})

  console.log("***Sell Offers***")
  let nftSellOffers
    try {
        nftSellOffers = await client.request({
        method: "nft_sell_offers",
        tokenid: tokenId.value  
      })
      } catch (err) {
        console.log("No sell offers.")
    }
  console.log(JSON.stringify(nftSellOffers,null,2))
  console.log("***Buy Offers***")
  let nftBuyOffers
  try {
    nftBuyOffers = await client.request({
    method: "nft_buy_offers",
    tokenid: tokenId.value })
  } catch (err) {
    console.log("No buy offers.")
  }
  
  console.log(JSON.stringify(nftBuyOffers,null,2))
  console.log("Transaction result:",
    JSON.stringify(tx.result.meta.TransactionResult, null, 2))
  console.log("Balance changes:",
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
	

  client.disconnect()
  // End of cancelOffer()
}
app.get('/cancelOffer', async (req, res) => {
 try {    
      let screenshot = await cancelOffer()
      res.send({ result: screenshot })
  } catch(e) {
      // catch errors and send error status
      console.log(e);
      res.sendStatus(500);
  }

})
//***************************
//** Accept Sell Offer ******
//***************************
async function acceptSellOffer() {

    const wallet = xrpl.Wallet.fromSeed(req.query.seed)
    const client = new xrpl.Client(req.query.server_url)
    await client.connect()
    console.log("Connected to devnet")
	  const transactionBlob = {
        "TransactionType": "NFTokenAcceptOffer",
        "Account": wallet.classicAddress,
        "SellOffer": tokenOfferIndex.value,
  }
    const tx = await client.submitAndWait(transactionBlob,{wallet})
	  const nfts = await client.request({
    method: "account_nfts",
    account: wallet.classicAddress  
  })
  console.log(JSON.stringify(nfts,null,2))
  console.log("Transaction result:",
    JSON.stringify(tx.result.meta.TransactionResult, null, 2))
  console.log("Balance changes:",
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
	  client.disconnect()
  // End of acceptSellOffer()
}
app.get('/acceptSellOffer', async (req, res) => {
 try {    
      let screenshot = await acceptSellOffer()
      res.send({ result: screenshot })
  } catch(e) {
      // catch errors and send error status
      console.log(e);
      res.sendStatus(500);
  }

})
//***************************
//** Accept Buy Offer ******
//***************************

async function acceptBuyOffer() {
  const wallet = xrpl.Wallet.fromSeed(req.query.seed)
  const client = new xrpl.Client(req.query.server_url)
  await client.connect()
  console.log("Connected to devnet")
    const transactionBlob = {
        "TransactionType": "NFTokenAcceptOffer",
        "Account": wallet.classicAddress,
        "BuyOffer": tokenOfferIndex.value
  }
    const tx = await client.submitAndWait(transactionBlob,{wallet})
	  const nfts = await client.request({
    method: "account_nfts",
    account: wallet.classicAddress  
  })
  console.log(JSON.stringify(nfts,null,2))
  console.log("Transaction result:",
      JSON.stringify(tx.result.meta.TransactionResult, null, 2))
  console.log("Balance changes:",
      JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
	    client.disconnect()
  // End of submitTransaction()
}
app.get('/acceptBuyOffer', async (req, res) => {
 try {    
      let screenshot = await acceptBuyOffer()
      res.send({ result: screenshot })
  } catch(e) {
      // catch errors and send error status
      console.log(e);
      res.sendStatus(500);
  }

})
  app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

