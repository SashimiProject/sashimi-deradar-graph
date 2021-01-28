import {Address, BigDecimal, BigInt, log, TypedMap} from '@graphprotocol/graph-ts';
import {ERC20} from "../types/SASHIMI/ERC20";
import {ERC20SymbolBytes} from '../types/SASHIMI/ERC20SymbolBytes'
import {ERC20NameBytes} from '../types/SASHIMI/ERC20NameBytes'
import {Token, Transaction} from "../types/schema";
import {ethereum} from "@graphprotocol/graph-ts/index";

export let ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
export let BURN_ADDRESS = '0x000000000000000000000000000000000000dead';
export let DF_DAI_ADDRESS = '0xd2fa07cd6cd4a5a96aa86bacfa6e50bb3aadba8b';
export let DF_USDC_ADDRESS = '0xb71defdd6240c45746ec58314a01dd6d833fd3b5';
export let DF_USDT_ADDRESS = '0x324eebdaa45829c6a8ee903afbc7b61af48538df';

export let DF_DAI_VAULT_ADDRESS = '0xac8cd3090ca1478d2b1ff300da314f7460771b27';
export let DF_USDC_VAULT_ADDRESS = '0xa6bcd244e51cb5edfcff55929e3ced62feb3f1bd';
export let DF_USDT_VAULT_ADDRESS = '0x1c486c577d980cb16f3eb05b0236fe40621e33dc';

export let UNI_DAI_POOL_ADDRESS = '0xa1484c3aa22a66c62b77e0ae78e15258bd0cb711';
export let UNI_USDC_POOL_ADDRESS = '0x7fba4b8dc5e7616e59622806932dbea72537a56b';
export let UNI_USDT_POOL_ADDRESS = '0x6c3e4cb2e96b01f4b866965a91ed4437839a121a';
export let UNI_WBTC_POOL_ADDRESS = '0xca35e32e7926b96a9988f61d510e038108d8068e';


export let UNI_DAI_VAULT_ADDRESS = '0x53fbf4a6ccffd2b038b28cefc99ef4e624df34c1';
export let UNI_USDC_VAULT_ADDRESS = '0xa7feeaa18ebbe7148adfa08832a84184f3500e61';
export let UNI_USDT_VAULT_ADDRESS = '0x74e4179d4eea6bea5f5924e6309b7990dc36f54e';
export let UNI_WBTC_VAULT_ADDRESS = '0x52632d06ea29614bb2574c462f280feb23d14f16';

export let UNI_ADDRESS = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';
export let DF_ADDRESS = '0x431ad2ff6a9c365805ebad47ee021148d6f7dbe0';
export let DAI_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f';
export let USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
export let USDT_ADDRESS = '0xdac17f958d2ee523a2206206994597c13d831ec7';

let depositTokens = new TypedMap<string, string>();
depositTokens.set(DF_DAI_ADDRESS, DAI_ADDRESS);
depositTokens.set(DF_USDC_ADDRESS, USDC_ADDRESS);
depositTokens.set(DF_USDT_ADDRESS, USDT_ADDRESS);

export function getDepositToken(address: string): string {
  let result = depositTokens.get(address) as string;
  if (result === null) {
    result = ADDRESS_ZERO;
  }
  return result;
}

// export function getDepositToken(address: string): string {
//   let result = ADDRESS_ZERO;
//   if (address === DF_DAI_ADDRESS) {
//     result = DAI_ADDRESS;
//   } else if (address === DF_USDC_ADDRESS) {
//     result = USDC_ADDRESS;
//   } else if (address === DF_USDT_ADDRESS) {
//     result = USDT_ADDRESS;
//   }
//   return result;
// }

let earnTokens = new TypedMap<string, string>();
earnTokens.set(DF_DAI_ADDRESS, DF_ADDRESS);
earnTokens.set(DF_USDC_ADDRESS, DF_ADDRESS);
earnTokens.set(DF_USDT_ADDRESS, DF_ADDRESS);
earnTokens.set(UNI_DAI_POOL_ADDRESS, UNI_ADDRESS);
earnTokens.set(UNI_USDC_POOL_ADDRESS, UNI_ADDRESS);
earnTokens.set(UNI_USDT_POOL_ADDRESS, UNI_ADDRESS);
earnTokens.set(UNI_WBTC_POOL_ADDRESS, UNI_ADDRESS);

export function getEarnToken(address: string): string {
  let result = earnTokens.get(address) as string;
  if (result === null) {
    result = ADDRESS_ZERO;
  }
  return result;
}

// export function getEarnToken(address: string): string {
//   let result = ADDRESS_ZERO;
//   if (address === DF_DAI_ADDRESS || address === DF_USDC_ADDRESS || address === DF_USDT_ADDRESS) {
//     result = DF_ADDRESS;
//   } else {
//     result = UNI_ADDRESS;
//   }
//   return result;
// }

let userAddresses = new TypedMap<string, string>();
userAddresses.set(DF_DAI_ADDRESS, DF_DAI_VAULT_ADDRESS);
userAddresses.set(DF_USDC_ADDRESS, DF_USDC_VAULT_ADDRESS);
userAddresses.set(DF_USDT_ADDRESS, DF_USDT_VAULT_ADDRESS);
userAddresses.set(UNI_DAI_POOL_ADDRESS, UNI_DAI_VAULT_ADDRESS);
userAddresses.set(UNI_USDC_POOL_ADDRESS, UNI_USDC_VAULT_ADDRESS);
userAddresses.set(UNI_USDT_POOL_ADDRESS, UNI_USDT_VAULT_ADDRESS);
userAddresses.set(UNI_WBTC_POOL_ADDRESS, UNI_WBTC_VAULT_ADDRESS);

export function getUserAddress(address: string): string {
  let result = userAddresses.get(address) as string;
  if (result === null) {
    result = ADDRESS_ZERO;
  }
  return result;
}

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')

export function isNullEthValue(value: string): boolean {
  return value == '0x0000000000000000000000000000000000000000000000000000000000000001'
}

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}

export function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
  if (exchangeDecimals == ZERO_BI) {
    return tokenAmount.toBigDecimal()
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals))
}

export function fetchTokenSymbol(tokenAddress: Address): string {
  // hard coded override
  let contract = ERC20.bind(tokenAddress)
  let contractSymbolBytes = ERC20SymbolBytes.bind(tokenAddress)

  // try types string and bytes32 for symbol
  let symbolValue = 'unknown'
  let symbolResult = contract.try_symbol()
  if (symbolResult.reverted) {
    let symbolResultBytes = contractSymbolBytes.try_symbol()
    if (!symbolResultBytes.reverted) {
      // for broken pairs that have no symbol function exposed
      if (!isNullEthValue(symbolResultBytes.value.toHexString())) {
        symbolValue = symbolResultBytes.value.toString()
      }
    }
  } else {
    symbolValue = symbolResult.value
  }

  return symbolValue
}

export function fetchTokenName(tokenAddress: Address): string {

  let contract = ERC20.bind(tokenAddress)
  let contractNameBytes = ERC20NameBytes.bind(tokenAddress)

  // try types string and bytes32 for name
  let nameValue = 'unknown'
  let nameResult = contract.try_name()
  if (nameResult.reverted) {
    let nameResultBytes = contractNameBytes.try_name()
    if (!nameResultBytes.reverted) {
      // for broken exchanges that have no name function exposed
      if (!isNullEthValue(nameResultBytes.value.toHexString())) {
        nameValue = nameResultBytes.value.toString()
      }
    }
  } else {
    nameValue = nameResult.value
  }

  return nameValue
}

export function fetchTokenTotalSupply(tokenAddress: Address): BigInt {
  let contract = ERC20.bind(tokenAddress)
  let totalSupplyValue = BigInt.fromI32(0);
  let totalSupplyResult = contract.try_totalSupply()
  if (!totalSupplyResult.reverted) {
    totalSupplyValue = totalSupplyResult.value
  }
  return totalSupplyValue;
}

export function fetchTokenDecimals(tokenAddress: Address): BigInt {
  let contract = ERC20.bind(tokenAddress)
  // try types uint8 for decimals
  let decimalValue = null
  let decimalResult = contract.try_decimals()
  if (!decimalResult.reverted) {
    decimalValue = decimalResult.value
  }
  return BigInt.fromI32(decimalValue as i32)
}

export function addToken(token: Address): Token|null {
  let tokenInfo = Token.load(token.toHexString());
  if (tokenInfo === null && token.toHexString() != ADDRESS_ZERO){
    tokenInfo = new Token(token.toHexString());
    tokenInfo.symbol = fetchTokenSymbol(token);
    tokenInfo.name = fetchTokenName(token);
    tokenInfo.burned = ZERO_BD;
    tokenInfo.decimals = fetchTokenDecimals(token);
  }
  let contract = ERC20.bind(token);
  let burned = BigDecimal.fromString('0');
  let resp = contract.try_balanceOf(Address.fromString(BURN_ADDRESS));
  if (!resp.reverted) {
    burned = convertTokenToDecimal(resp.value, tokenInfo.decimals);
  }
  let supply = fetchTokenTotalSupply(token);
  tokenInfo.totalSupply = convertTokenToDecimal(supply, tokenInfo.decimals);
  tokenInfo.burned = burned;
  tokenInfo.save();
  return tokenInfo;
}

export function addTransaction(event: ethereum.Event): string {
  let transactionHash = event.transaction.hash.toHexString();
  let transaction = Transaction.load(transactionHash);

  if (transaction == null) {
    transaction = new Transaction(transactionHash);
    transaction.blockNumber = event.block.number;
    transaction.timestamp = event.block.timestamp;
    transaction.save();
  }
  return transaction.id;
}
