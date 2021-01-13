import {Address, BigInt} from '@graphprotocol/graph-ts';
import {Transfer as TransferEvent} from "../types/SASHIMI/ERC20";
import {RewardPaid, Staked, Withdrawn} from '../types/VaultDAI/DForce';
import {UNIPool} from '../types/VaultUNIDAI/UNIPool';
import {Token, TransferDayData, TransferHourData, VaultInfo} from "../types/schema";
import {
  addToken,
  addTransaction,
  convertTokenToDecimal,
  ONE_BI,
  getDepositToken,
  getEarnToken,
  getUserAddress,
  ZERO_BD,
  ZERO_BI,
  ADDRESS_ZERO
} from "./helper";

function updateUniswapDayData(event: TransferEvent, tokenAddress: Address, decimals: BigInt): void {
  let timestamp = event.block.timestamp.toI32()
  let dayID = timestamp / 86400
  let dayStartTimestamp = dayID * 86400
  let id = tokenAddress.toHexString() + '-' + dayID.toString();
  let dayData = TransferDayData.load(id);
  if (dayData == null) {
    dayData = new TransferDayData(id);
    dayData.date = dayStartTimestamp
    dayData.token = tokenAddress.toHexString();
    dayData.totalVolume = ZERO_BD;
    dayData.txsCount = ZERO_BI;
    dayData.save()
  }
  dayData = TransferDayData.load(id)
  dayData.totalVolume = dayData.totalVolume.plus(convertTokenToDecimal(event.params.value, decimals));
  dayData.txsCount = dayData.txsCount.plus(ONE_BI);
  dayData.save()
}

function updateUniswapHourData(event: TransferEvent, tokenAddress: Address, decimals: BigInt): void {
  let timestamp = event.block.timestamp.toI32()
  let hourIndex = timestamp / 3600 // get unique hour within unix history
  let hourStartUnix = hourIndex * 3600 // want the rounded effect
  let hourID = event.address
    .toHexString()
    .concat('-')
    .concat(BigInt.fromI32(hourIndex).toString())
  let hourData = TransferHourData.load(hourID);
  if (hourData == null) {
    hourData = new TransferHourData(hourID);
    hourData.date = hourStartUnix;
    hourData.token = tokenAddress.toHexString();
    hourData.totalVolume = ZERO_BD;
    hourData.txsCount = ZERO_BI;
    hourData.save();
  }
  hourData = TransferHourData.load(hourID);
  hourData.txsCount = hourData.txsCount.plus(ONE_BI);
  let volume = convertTokenToDecimal(event.params.value, decimals);
  hourData.totalVolume = hourData.totalVolume.plus(volume);
  hourData.save();
}

export function handleTransfer(event: TransferEvent): void {
  let tokenAddress = event.address;
  let tokenInfo = addToken(tokenAddress);
  updateUniswapDayData(event, tokenAddress, tokenInfo.decimals);
  updateUniswapHourData(event, tokenAddress, tokenInfo.decimals);
  addTransaction(event);
}
