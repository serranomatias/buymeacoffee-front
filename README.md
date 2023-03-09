
#  :coffee: buymeacoffee
BuyMeACoffee but on the blockchain.

Dapp:
- https://buymeacoffee-blockchain.vercel.app/

## Description

Allow people to send a how many "coffee's" they want, each coffee cost 0,001ETH.
Also the smartcontract allow leave a name and a message to attach in a memo with the date of approved transaction.

## Used
- Solidity
- Hardhat
- Next.js
- Web3Modal
- Ethers.js
- dotEnv

### FrontEnd Explanation
El siguiente código es un componente React llamado "CoffeeButton", que permite a un usuario comprar un café en un contrato inteligente en la red Ethereum.

El componente importa el archivo "BuyMeACoffee.json" que contiene la definición de la interfaz de programación de aplicaciones (ABI) del contrato inteligente "BuyMeACoffee". Se utiliza la librería "ethers" para interactuar con el contrato inteligente.

El contrato inteligente está ubicado en la dirección "0x3FD8878D672C0eD2b225E1abaDA254004e5C6fd1" y su ABI es obtenida del archivo "BuyMeACoffee.json".

La función "buyCoffee" es llamada cuando se hace clic en el botón, y realiza las siguientes acciones:

Verifica si el precio es válido.
Verifica si "ethereum" está disponible en la ventana.
Si "ethereum" está disponible, se crea una nueva instancia de "Web3Provider" y se obtiene un signer.
Se crea una nueva instancia del contrato inteligente utilizando la dirección, la ABI y el signer.
Se ejecuta la función "buyCoffee" en el contrato inteligente con los siguientes parámetros: nombre (opcional), mensaje (opcional) y valor (precio en ETH).
Se espera a que la transacción sea minada y se muestra un mensaje en pantalla con el resultado.
El componente devuelve un botón con el texto "Send Coffee for (precio en ETH) ETH". Al hacer clic en el botón, se llama a la función "buyCoffee".
