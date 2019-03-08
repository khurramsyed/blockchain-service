const express = require('express')
const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');
const bodyParser = require('body-parser')


let myBlockChain = new BlockChain.Blockchain();


app = express()
const port = 8000


app.use(bodyParser.urlencoded({
    extended: true
  }))
  
app.use(bodyParser.json())

  
app.get('/block/:id', (req, res) => { 
    myBlockChain.getBlock(req.params.id)
    .then(value => res.send( value))
    .catch(error => {
        console.log(error)
        res.send("Could not retrieve the request block.");
    })
})

app.post('/block', (req, res) =>{
    if(req.body ==null || req.body==undefined || req.body.data== null || req.body.data ==undefined){
        res.writeHead( 400, 'Please provide data in request json body', {'content-type' : 'application/json'});
    }
    const data = req.body.data
    console.log(data)
    myBlockChain.addBlock(new Block.Block(data));
    res.send(req.body);
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
