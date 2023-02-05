import abi from '../utils/BuyMeACoffee.json';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers'
import toast, { Toaster } from 'react-hot-toast';

function CoffeeButton(props) {

  // Contract Address & ABI
  const contractAddress = "0x3FD8878D672C0eD2b225E1abaDA254004e5C6fd1";
  const contractABI = abi.abi;



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
        if (props.price === "0.001" || props.price === 0.001) {
          toast.success("Buying coffee..");
          console.log("buying coffee..");
        } else {
          toast.success("buying Large coffee");
          console.log("buying Large coffee..");
        }
        const coffeeTxn = await buyMeACoffee.buyCoffee(
          props.name ? props.name : "anon",
          props.message ? props.message : "Enjoy your coffee!",
          { value: ethers.utils.parseEther(props.price) }
        );

        await coffeeTxn.wait();

        console.log("mined ", coffeeTxn.hash);
        toast.success("mined ", coffeeTxn.hash);

        if (props.price === "0.001" || props.price === 0.001) {
          toast.success("Coffee purchased!");
          console.log("Coffee purchased!");
        } else {
          toast.success("Large coffee purchased!");
          console.log("Large Coffee purchased!");
        }



      }
    } catch (error) {
      if(revertData.includes("user rejected transaction")) {
        toast.error("User rejected transaction");
      } else {
        toast.error(error.message);
      }
    }
  };
  return (
    <>
      <button
        type="button"
        onClick={buyLargeCoffee}
        className="bg-amber-900 px-4 py-2 rounded-full cursor-pointer text-white m-5 hover:bg-amber-700 transition"
      >
        {`Send Coffee for ${props.price} ETH`}
      </button>
    </>
  )
}


export default CoffeeButton;