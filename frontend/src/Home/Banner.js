import React, { useState, useEffect } from 'react'
import Web3 from 'web3';
import Binance from 'binance-api-node';
import { getDataAPI, getTransactionAPI } from "../utils";
// import Web3Modal from "web3modal";
// import WalletConnectProvider from "@walletconnect/web3-provider";
//  import logo1 from './logoqr/frame.png';
import Popup from './Popup';



const Banner = () => {
    const [Address, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [chanAmount, setChangeAmount] = useState();
    const [transactionAddress, setTransactionAddress] = useState('');
    const [buttonPopup ,setButtonPopup] = useState(false);
    const web31 = new Web3(Web3.givenProvider);

    const client = Binance();
    useEffect(async () => {
        await client.prices().then((e) => setChangeAmount(e.BNBUSDT));
    }, [])

    const handleAmount = (e) => {
        e.preventDefault()
        setAmount(e.target.value)
    }

    const x = amount * chanAmount * 100
    const y = amount * chanAmount;


    const connectMetamask = async () => {
        const chainid = await web31.eth.getChainId();
        if (chainid == "97") {
            try {
                await window.ethereum.enable();
                const accounts = await web31.eth.getAccounts();
                const address = accounts[0];
                // console.log(web31.eth.getChainId, "this is your chainn id")
                setAddress(
                    address.slice(0, address.length / 9) +
                    "..." +
                    address.slice(38, address.length / 1),
                );
                setTransactionAddress(address)

            } catch (error) {
                console.error(error);
            }
        } else {
            alert("Connect to Binance Mainnet OR MetaMask extension is not detected!");
        }
    }


    useEffect(() => {
        getDataAPI("claim_store").then(function (response) {
            // console.log(response.data.msg);
            getTransactionAPI("claim_token_distribute").then((res) => console.log(res.data.msg));
        })

    }, [])

    const prepare =  () => {
        getDataAPI("claim_store");
    }
    const Deliver = () => {
        getTransactionAPI("claim_token_distribute");
    }

    setInterval(() =>{

    })
  
    const transactionMetamask = async () => {
        if (transactionAddress) {

            if (window.ethereum) {
                try {
                    await window.ethereum.enable();
                    //const address = await web3.eth.getAccounts();
                    const res = await web31.eth.sendTransaction({
                        to: '0x0C9982e9cF6EB49f2376459BFEbCc210c45F3F13',
                        from: transactionAddress,
                        value: amount * 10 ** 18,
                    });
                    console.log(res)
                if(res.status == true){
                    await prepare()
                    await Deliver()
                }
                } catch (error) {
                    // console.log(error);
                    return {
                        connectedStatus: false,
                        status: "🦊 there is some problem in transaction",
                    };
                }
            } else {
                alert("Metamask extensions not detected!");
            }
        } else {
            alert("please connect your Metamask OR Trust wallet");
        }
    };

    
    
    const [navToggle, setNavToggle] = useState(false)
    const [screenWidth, setScreenWidth] = useState('')

    setInterval(() => {
        setScreenWidth(window.innerWidth)
        // console.log(window.innerWidth,'....................')
    },1500)
    useEffect(() => { 
        if(screenWidth > 990){
            setNavToggle(true)
        }
    },[screenWidth])

    const toggle = () => {
        if(screenWidth > 990){
            setNavToggle(true)
        }
        if(screenWidth < 990){
            setNavToggle(false)
        }
    }

    return (
        <div>
            <nav class="navbar navbar-expand-lg navbar-white fixed-top" id="banner">
                <div class="container">

                    <a class="navbar-brand" href="#caps-token"><span><img src="img/core-img/logo.png" alt="logo" /></span> CAPS TOKEN</a>

                    <button class="navbar-toggler" type="button" onClick={() => setNavToggle(true)} data-toggle="collapse" data-target="#collapsibleNavbar">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    {/* <button class="navbar-toggler" type="button">
                        <span class="navbar-toggler-icon"></span>
                    </button> */}
                    {navToggle ? <div class="collapse navbar-collapse" id="collapsibleNavbar">
                        <ul class="navbar-nav ml-auto">
                            <li class="nav-item">
                                <a class="nav-link" onClick={() => toggle()} href="#home">Home</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" onClick={() => toggle()} href="#whitepaper">Whitepaper</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" onClick={() => toggle()} href="#roadmap">Roadmap</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" onClick={() => toggle()} href="#faq">Pre-Sale Package</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" onClick={() => toggle()} href="#faq">FAQ</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" onClick={() => toggle()} href="#contact">Contact</a>
                            </li>

                            <li class="lh-55px"><a onClick={() => setButtonPopup(true) & toggle()} href="#qrScan" class="btn login-btn ml-50">Via QR </a></li>
                            <Popup trigger={buttonPopup} setTrigger = {setButtonPopup}>
                                <h6 style={{color:"white",backgroundColor:"#ff0a4e" ,textAlign :"center"}}>Read the Token Guide Below</h6>
                            </Popup>
                            {Address ? "" : <li class="lh-55px"><a onClick={() => connectMetamask() & toggle()} href="#buy" class="btn login-btn ml-50">Connect Wallet </a></li>}
                            {Address ? <li class="lh-55px"><a href="#buy" class="btn login-btn ml-50">{Address} </a></li> : ""}
                        </ul>
                    </div> : ""}
                </div>
            </nav>

            {/* ##### Welcome Area Start #####  */}
            <section class="hero-section moving section-padding" id="home">
                <div class="moving-bg"></div>
                {/* Hero Content */}
                <div class="hero-section-content">

                    <div class="container ">
                        <div class="row align-items-center">
                            {/* Welcome Content */}
                            <div class="row">
                                <div class="welcome-content col-md-7" style={{ marginLeft: 34 }}>
                                    <div>
                                        <div class="promo-section">
                                        </div>
                                        <h3 class="fadeInUp" data-wow-delay="0.2s" style={{ paddingTop: 80 }}>Welcome to CAPSTONE</h3>
                                        <p class="w-text fadeInUp" data-wow-delay="0.3s">CAPS token is the official cryptocurrency of Capstone Markets Brokerage.</p>
                                        <p class="w-text fadeInUp" data-wow-delay="0.3s">Capstone Markets provides a full range of services including and not limited to Trading Financial Markets, Financial Education, Trading Alerts, AI software and Algo Trading Robots, payable using CAPS token.</p>
                                        <p class="w-text fadeInUp" data-wow-delay="0.3s">It is also the first ever token that gives you the opportunity to be a shareholder of the company through the current Pre-sales PROMOTIONAL PACKAGE.</p>

                                        <p class="w-text fadeInUp" data-wow-delay="0.3s">Don't just buy tokens. Own the company too!</p>
                                        <div class="dream-btn-group fadeInUp" data-wow-delay="0.4s">
                                        <p>Pay Address : 0x158Ff55242A4365b0F2B53DB358ebB32DDb18E37</p>
                                            <a href="#whitepaper" class="btn more-btn mr-2 mobile_btn">Whitepaper</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4" style={{ position: "relative", zIndex: 1, marginTop: 195, marginLeft: 60 }}>
                                    <div style={{ width: 320, height: 320, backgroundColor: "white", borderRadius: 10 }}>
                                        <div style={{ paddingLeft: 68, paddingTop: 30 }}>
                                            <p style={{ backgroundColor: "#ff0a4e", width: 185,fontWeight:"bold" ,textAlign:"center",borderRadius:4,height:30}}>Buy Token</p>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", paddingLeft: 10, paddingTop: 10 }}>
                                            <h5>BNB :</h5><span>  </span><input style={{ height: 50, width: 200, border: "none", paddingLeft: 10 }} type="text" placeholder="  Enter BNB amount" name="amount" value={amount} onChange={handleAmount} /><h6>BNB</h6>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", paddingLeft: 10, paddingTop: 10 }}>
                                            <h5>Total :</h5><span style={{ height: 30, width: 180, paddingLeft: 10 }} >  {x.toFixed(2)}</span><h6>CAPS</h6>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", paddingLeft: 10, paddingTop: 10 }}>
                                            <h5>Total USD :</h5><span style={{ height: 30, width: 100, paddingLeft: 10 }} >  {y.toFixed(2)}</span><h6>$</h6>
                                        </div>
                                        <div style={{ paddingLeft: 100, paddingTop: 10 }}>
                                            <a onClick={() => transactionMetamask()} href="#buy" class="btn buy">Buy</a>
                                            
                                        </div>
                                       
                                    </div>
                                    <br/>
                                    <h5 style={{backgroundColor:"black",textAlign:"center",width:320}}>How to get token</h5>
                                      <h5 style={{color:"white",marginLeft:40,}}>Trust Wallet & Metamask</h5>
                                      <div style={{lineHeight: 1.6 ,color:"white"}}>* Scan & Pay from Trust & Metamask Button <br></br>
                                          *Wait for 60 seconds & Refresh the browser<br></br>
                                          * Add token with this Address.<br></br>0xbb380385088497ffda63468c0764cb923e467532
                                           </div>
                                    
                                </div>
                            </div>
                            {/* <div class="col-lg-6">
                                <div class="dotted mt-30 fadeInUp" data-wow-delay="0.5s">
                                    <img src="img/core-img/platform1.png" alt="" />
                                </div>
                            </div> */}

                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default Banner
