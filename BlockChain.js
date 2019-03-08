/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
        this.db = new LevelSandbox.LevelSandbox();
        this.generateGenesisBlock();
    }

    // Helper method to create a Genesis Block (always with height= 0)
    // You have to options, because the method will always execute when you create your blockchain
    // you will need to set this up statically or instead you can verify if the height !== 0 then you
    // will not create the genesis block
    async generateGenesisBlock(){
        // Add your code here
        let blockHeight = await this.getNextBlockHeight();
        if(blockHeight<=0){
            let genesisBlock = new Block.Block("This is Genesis Block");
            console.log ("Creating Genesis Block");
            await this.addBlock(genesisBlock);
        }else {
            console.log("Genesis Block is Already created -- > Not Creating another Genesis");
        }
    }

    // Get block height, it is a helper method that return the height of the blockchain
    async getNextBlockHeight() {
        // Add your code here
        let blockHeight = await this.db.getBlocksCount();
        return blockHeight;
    }

    async getBlockHeight() {
        // Add your code here
        let blockHeight = await this.db.getBlocksCount();
        return blockHeight -1;
    }

    // Add new block
    async addBlock(newBlock) {
        newBlock.height = await this.getNextBlockHeight();
        // UTC timestamp
        newBlock.time = new Date().getTime().toString().slice(0,-3);
        // previous block hash
        if(newBlock.height>0){

            let previousBlockJson = await this.getBlock(newBlock.height-1);
            let previousBlock = JSON.parse(previousBlockJson);
            newBlock.previousBlockHash = previousBlock.hash;
        }
        // Block hash with SHA256 using newBlock and converting to a string
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        console.log("ADDING BLOCK = "+ JSON.stringify(newBlock));

        await this.db.addDataToLevelDB(JSON.stringify(newBlock));
    }

    // Get Block By Height
    async getBlock(height) {
        let block = await this.db.getLevelDBData(height);
        return block;
    }


    // Validate if Block is being tampered by Block Height
    async validateBlock(height) {
         
            // Add your code here   
            try {
            let retreivedBlockJson =  await this.getBlock(height);
            let retreivedBlock = JSON.parse(retreivedBlockJson);
            let retrievedBlockHash = retreivedBlock.hash;
            retreivedBlock.hash = "";
            let recalculatedHash = SHA256(JSON.stringify(retreivedBlock)).toString();
            if(retrievedBlockHash === recalculatedHash){
                return true;
            }else{
                return false;
            }
            } catch (error) {
                console.log("Error "+ error);
            }
    }

    // Validate Blockchain
    async validateChain() {
        let self = this;
        let errors = [] ;
        let blockHeight = await self.getNextBlockHeight();
        let maxBlocks = await self.getNextBlockHeight();
        let i = 0;
        try{
            for(i=0; i< blockHeight ; i++) {              
                let blockValidationResult = await self.validateBlock(i);
                let currentBlockJson = await self.getBlock(i);
                let currentBlock = JSON.parse(currentBlockJson);
                let nextBlocksPreviousHash = await self.getNextBlocksPreviousBlockHash(i);
                console.log("this.getNextBlocksPreviousHash " + nextBlocksPreviousHash +"currentBlock.hash ="+ currentBlock.hash);
                if(blockValidationResult == false ){
                    errors.push("Invalid Block "+i);
                }
                if( i >= maxBlocks && nextBlocksPreviousHash != currentBlock.hash){
                    errors.push("Invalid Block "+i +"previous block hash does'nt match");
                }
            }
            return errors;
        }catch(err){
            console.log(err);
        }
    }

    async getNextBlocksPreviousBlockHash(height){
        let self = this;
        let maxBlocks = await self.getNextBlockHeight();
        let nextBlockHeight =height+1;
        if(nextBlockHeight < maxBlocks && nextBlockHeight >=1){
            let nextBlockJson = await self.getBlock(nextBlockHeight)
            console.log("Next Block Json " +nextBlockJson)
            let nextBlock = JSON.parse(nextBlockJson);
            
            return nextBlock.previousBlockHash;
        }else{
            return "Non Existent Block";
        }
    }

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise( (resolve, reject) => {
            console.log("Modifying Block @"+height)
            self.db.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                console.log("blockModified = "+ blockModified);
                resolve(blockModified);
            }).catch((err) => { console.log(err); reject(err)});
        });
    }
   
}

module.exports.Blockchain = Blockchain;