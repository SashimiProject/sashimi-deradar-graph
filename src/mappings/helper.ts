import {Address, BigDecimal, BigInt, log, TypedMap} from '@graphprotocol/graph-ts';
import { ERC20 } from '../types/SashimiFarm/ERC20';
import { ERC20SymbolBytes } from '../types/SashimiFarm/ERC20SymbolBytes';
import {ERC20NameBytes} from '../types/SashimiFarm/ERC20NameBytes'
import { Pair } from '../types/SashimiFarm/Pair';
import {Token, Transaction} from '../types/schema';
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
export let SASHIMI_ADDRESS = '0xc28e27870558cf22add83540d2126da2e4b464c2';
export let WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

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

let STABLE_TOKEN_ADDRESSES = new TypedMap<string, string>();
STABLE_TOKEN_ADDRESSES.set(DAI_ADDRESS, DAI_ADDRESS);
STABLE_TOKEN_ADDRESSES.set(USDT_ADDRESS, USDT_ADDRESS);
STABLE_TOKEN_ADDRESSES.set(USDC_ADDRESS, USDC_ADDRESS);
export let stableTokens = STABLE_TOKEN_ADDRESSES;

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')
export let BI_18 = BigInt.fromI32(18);
export let BI_2 = BigInt.fromI32(2);

export let UNI_ROUTER = '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f';
export let SASHIMI_ROUTER = '0xf028f723ed1d0fe01cc59973c49298aa95c57472';

// WETH-USDT
let SASHIMI_WETH_USDT_ADDRESS = '0x490ccb3c835597ff31e525262235487f9426312b';
// WETH-USDT
let UNISWAP_WETH_USDT_ADDRESS = '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852';
// WETH-SASHIMI
let SASHIMI_WETH_SASHIMI_ADDRESS = '0x3fa4b0b3053413684d0b658689ede7907bb4d69d';
// WETH-SASHIMI
let UNISWAP_WETH_SASHIMI_ADDRESS = '0x4b618087dae7765823bc47ffbf38c8ee8489f5ca';

export function getEthPrice(): BigDecimal {
  let contract = Pair.bind(Address.fromString(UNISWAP_WETH_USDT_ADDRESS));
  let resp = contract.try_getReserves();
  let result = ZERO_BD;
  if (resp.reverted) {
    return result;
  }
  let reserve0 = convertTokenToDecimal(resp.value.value0, BigInt.fromI32(18));
  let reserve1 = convertTokenToDecimal(resp.value.value1, BigInt.fromI32(6));
  return reserve1.div(reserve0);
}

let sashimiThreshold = BigDecimal.fromString('5000');

export function getSashimiPrice(): BigDecimal {
  let ethPrice = getEthPrice();
  let contract = Pair.bind(Address.fromString(UNISWAP_WETH_SASHIMI_ADDRESS));
  let resp = contract.try_getReserves();
  let result = ZERO_BD;
  if (resp.reverted) {
    return result;
  }
  // eth
  let reserve0 = convertTokenToDecimal(resp.value.value0, BigInt.fromI32(18));
  // sashimi
  let reserve1 = convertTokenToDecimal(resp.value.value1, BigInt.fromI32(18));
  if (reserve1.lt(sashimiThreshold)) {
    return reserve1;
  }
  result = reserve0.div(reserve1);
  return result.times(ethPrice);
}

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

export function getBurned(contract: ERC20, decimals: BigInt): BigDecimal {
  let burned = BigDecimal.fromString('0');
  let resp = contract.try_balanceOf(Address.fromString(BURN_ADDRESS));
  if (!resp.reverted) {
    burned = convertTokenToDecimal(resp.value, decimals);
  }
  return burned;
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
  let burned = getBurned(contract, tokenInfo.decimals);
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
