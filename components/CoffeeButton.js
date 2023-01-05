import abi from '../utils/BuyMeACoffee.json';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers'
import toast, { Toaster } from 'react-hot-toast';

function CoffeeButton(props) {

      // Contract Address & ABI
  const contractAddress = "0x3FD8878D672C0eD2b225E1abaDA254004e5C6fd1";
  const contractABI = abi.abi;

    const buyCoffee = async () => {
        try {
          const { ethereum } = window;
    
          if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum, "any");
            const signer = provider.getSigner();
            const buyMeACoffee = new ethers.Contract(
              contractAddress,
              contractABI,
              signer
            );
    
            console.log("buying coffee..");
            toast.success("buying coffee");
            const coffeeTxn = await buyMeACoffee.buyCoffee(
              name ? name : "anon",
              message ? message : "Enjoy your coffee!",
              { value: ethers.utils.parseEther("0.001") }
            );
    
            await coffeeTxn.wait();
    
            console.log("mined ", coffeeTxn.hash);
            toast.success("mined ", coffeeTxn.hash);
    
            console.log("Coffee purchased!");
            toast.success("Coffee purchased");
    
            // Clear the form fields.
            setName("");
            setMessage("");
          }
        } catch (error) {
          console.error(error);
          toast.error(error.message)
        }
      };
      const buyLargeCoffee = async () => {
        try {
          const { ethereum } = window;
    
          if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum, "any");
            const signer = provider.getSigner();
            const buyMeACoffee = new ethers.Contract(
              contractAddress,
              contractABI,
              signer
            );
    
            console.log("buying Large coffee..");
            toast.success("buying Large coffee");
            const coffeeTxn = await buyMeACoffee.buyCoffee(
              name ? name : "anon",
              message ? message : "Enjoy your coffee!",
              { value: ethers.utils.parseEther("0.005") }
            );
    
            await coffeeTxn.wait();
    
            console.log("mined ", coffeeTxn.hash);
            toast.success("mined ", coffeeTxn.hash);
    
            console.log("Large Coffee purchased!");
            toast.success("Large Coffee purchased");
    
            // Clear the form fields.
            setName("");
            setMessage("");
          }
        } catch (error) {
          console.error(error);
          toast.error(error.message)
        }
      };
    return (
        <>
            <button
                type="button"
                onClick={buyCoffee}
                className="bg-amber-900 px-4 py-2 rounded-full cursor-pointer text-white m-5 hover:bg-amber-700 transition"
            >
                {`Coffee for 0,001 ETH`}
            </button>
            <button
                type="button"
                onClick={buyLargeCoffee}
                className="bg-amber-900 px-4 py-2 rounded-full cursor-pointer text-white m-5 hover:bg-amber-700 transition"
            >
                {`Large Coffee for 0,005 ETH`}
            </button>
        </>
    )
}


export default CoffeeButton;