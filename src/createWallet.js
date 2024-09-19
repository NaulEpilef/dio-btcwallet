import bip32 from "bip32";
import bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import { appendFileSync } from "fs";

// bitcoin - mainnet
// testnet - testnet
const network = bitcoin.networks.testnet;

// "m/49'/0'/0'/0" - mainnet
// "m/49'/1'/0'/0" - testnet
const path = "m/49'/1'/0'/0";

// Escolha quantas carteiras devem ser geradas
const amountWallet = 2;

// Arquivo onde as carteiras serão salvas
const filePath = "carteiras.txt";

for (let i = 0; i < amountWallet; i++) {
  // Conjunto de palavras aleatórias que formam a seed
  const mnemonic = bip39.generateMnemonic();
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  // Carteira a raíz da carteira HD
  const root = bip32.fromSeed(seed, network);

  // Criando uma conta - par pvt-pub keys
  const account = root.derivePath(path);
  const node = account.derive(0).derive(0);

  const btcAddress = bitcoin.payments.p2pkh({
    pubkey: node.publicKey,
    network: network,
  }).address;

  // Dados da carteira
  const walletData = `Carteira gerada:
Endereço: ${btcAddress}
Chave privada: ${node.toWIF()}
Seed: ${mnemonic}
---
`;

  console.log(walletData);

  appendFileSync(filePath, walletData, "utf8");
}
