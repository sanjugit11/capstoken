const claimFactory = require("../Model/claimModel");
// const contractabi = require("../abi/contract_abi");
const fetch = require("node-fetch");
const Web3 = require("web3");
const fs = require("fs");
const Tx = require("ethereumjs-tx");
const Binance = require('binance-api-node').default;


//CRUD functions for ico Pool
const claimFactoryCtrl = {
	storeClaim: async (req, res) => {
		try {
			//fetch last record
			const block = await claimFactory.find().limit(1).sort({ $natural: -1 });
			console.log(block, "bbbbbbbbbbbbbbbbbbbbbbb");
			var startBlock = 0;
			if (block.length) {
				startBlock = block[0].block_number + 1;
			}
			console.log(startBlock, "ssssssssssssssssssssssssss");

			const blockchain_data = await fetch(
				// `https://api-testnet.bscscan.com/api?module=account&action=txlist&address=0x48eCf5A848E72B0E20685CfAe117B4f0A0d8025e&startblock=${startBlock}&endblock=latest&sort=desc&apikey=S5MX4JTHR55MSPYRN54BJYDUD3DCC1ZEHN`,
				 `https://api.bscscan.com/api?module=account&action=txlist&address=0x158Ff55242A4365b0F2B53DB358ebB32DDb18E37&startblock=${startBlock}&endblock=latest&sort=asc&apikey=E8XEA7ZBZCNNB94961VQ3CB3T5SBE93TTA`,
			);
			
			let response_data = await blockchain_data.json();
			console.log(
				response_data.result.length,
				"..................blockchain data store in database............line no 31",
			);
			for (i = 0; i < response_data.result.length; i++) {
				let error = response_data.result[i].isError;
				let val = response_data.result[i].value;
				let tx_receipt_status = response_data.result[i].txreceipt_status;

				if (error == 0 && tx_receipt_status == 1 && val > 0) {
					const value18 = response_data.result[i].value / 1000000000000000000;

					const newClaim = new claimFactory({
						contract_address: response_data.result[i].to,
						from_address: response_data.result[i].from,
						value: value18,
						block_number: response_data.result[i].blockNumber,
					});
					console.log(newClaim, "line 47");
					await newClaim.save();
				}
			}
			res.json({ msg: "claim is up-to-date" });
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	sendClaimToken: async (req, res) => {
		try {
			console.log('welcome to send claim')
			const web3 = new Web3(
				new Web3.providers.HttpProvider(
					"https://bsc-dataseed.binance.org/",
				),
			);
            
			//token calulation
			const client = Binance()
			const tokenRes = await client.prices();
			// console.log(tokenRes.BNBUSDT , "this is stoken resposseeeeee");
			const BNBRes = tokenRes.BNBUSDT;
	         const BNBAuto = parseFloat(BNBRes).toFixed(2);

			const token_address = "0xBb380385088497FFDa63468c0764Cb923E467532";
			const claimDetail = await claimFactory.find({
				claim_status: "0",
			});

			
			
			for (i = 0; i < claimDetail.length; i++) {
				let tokenAddress = token_address; // Token contract address
				let toAddress = claimDetail[i].from_address; // User address
		
				let fromAddress = "0x27739aa2Bed45436A7EdF494E6e50d17680bCd8e";
				let privateKey = Buffer.from(
					"3ef9645b66d9117200f58770a9942cfe90d1dabad7ad8d83314dedf248688d22",
					"hex",
				);
				

				const rawdata = fs.readFileSync("abi/contract_abi.json", "utf8");
			
				let ContractAbi = JSON.parse(rawdata);
				let contract = new web3.eth.Contract(
					ContractAbi,
					tokenAddress,
					{
						from: fromAddress,
					},
				);

				// 1e18 === 1 HST
				// let amount = Web3js.utils.toHex(1e18)
				let amount = claimDetail[i].value;
			
                 let BYfixed = amount.toFixed(5) ;
				
				//calculation
				let CalAmount = BYfixed * BNBAuto * 100 ;
				let CalAmount2 = CalAmount.toFixed(2);
                console.log(CalAmount, "9999999999999999999999999999 .........CalAmount.........");
                console.log(CalAmount2, "9999999999999999999999999999 .........CalAmount2.........");

				const weiValue = CalAmount2 * 10**9;
				// const weiValue2 = web3.utils.toWei(`${CalAmount}`, "ether");
				console.log(weiValue,"line no 112 ....................");
				// console.log(weiValue2, "line no ....................119");

				const count = await web3.eth.getTransactionCount(fromAddress);
				// console.log(count, "9999999999999999999999999999...............kine no 122");

				let rawTransaction = {
					from: fromAddress,
					gasPrice: web3.utils.toHex(20 * 1e9),
					gasLimit: web3.utils.toHex(250000),
					to: tokenAddress,
					value: 0x0,
					data: contract.methods.transfer(toAddress, weiValue).encodeABI(),
					nonce: web3.utils.toHex(count),
				
				};
				let transaction = new Tx(rawTransaction);
				// console.log(transaction, "rawTransaction happen on the line ........130");
				transaction.sign(privateKey);
				const trans = await web3.eth.sendSignedTransaction(
					"0x" + transaction.serialize().toString("hex"),
				);
				// console.log(trans, "000000000000000000000000");
				if (trans) {
					const states = await claimFactory.findOneAndUpdate(
						{ from_address: toAddress, claim_status: "0" },
						{ claim_status: "1" },
					);
					// console.log(states, "9999999999999999");
				}
			}
			res.json({ msg: "Tokens have been sent to respective users" });
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
};

module.exports = claimFactoryCtrl;
