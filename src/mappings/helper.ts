import {Address, BigDecimal, BigInt} from '@graphprotocol/graph-ts';
import {ERC20} from "../types/SASHIMI/ERC20";
import {ERC20SymbolBytes} from '../types/SASHIMI/ERC20SymbolBytes'
import {ERC20NameBytes} from '../types/SASHIMI/ERC20NameBytes'
import {Token, Transaction} from "../types/schema";
import {ethereum} from "@graphprotocol/graph-ts/index";

export let ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

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
    tokenInfo.decimals = fetchTokenDecimals(token);
  }
  let supply = fetchTokenTotalSupply(token);
  tokenInfo.totalSupply = convertTokenToDecimal(supply, tokenInfo.decimals);
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
