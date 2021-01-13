import {Address} from '@graphprotocol/graph-ts';
import {RewardPaid, Staked, Withdrawn} from '../types/VaultDAI/DForce';
import {UNIPool} from '../types/VaultUNIDAI/UNIPool';
import {Token, VaultInfo} from "../types/schema";
import {
  addToken,
  addTransaction,
  convertTokenToDecimal,
  getDepositToken,
  getEarnToken,
  getUserAddress,
  ZERO_BD,
  ADDRESS_ZERO
} from "./helper";

function createVaultInfo(address: Address, depositToken: Token | null, earnToken: Token | null): VaultInfo {
  let vault = VaultInfo.load(address.toHexString());
  if (vault === null) {
    vault = new VaultInfo(address.toHexString());
    vault.depositToken = depositToken.id;
    vault.depositAmount = ZERO_BD;
    vault.earnAmount = ZERO_BD;
    vault.earnToken = earnToken.id;
  }
  return vault as VaultInfo;
}

export function handleDFRewardPaid(event: RewardPaid): void {
  let address = event.address.toHexString();
  let user = getUserAddress(address);
  let deposit = getDepositToken(address);
  let earn = getEarnToken(address);
  if (event.params.user.toHexString() === user && user !== ADDRESS_ZERO) {
    let depositToken = addToken(Address.fromString(deposit));
    let earnToken = addToken(Address.fromString(earn));
    let dforce = VaultInfo.load(event.address.toHexString());
    if (dforce === null) {
      dforce = createVaultInfo(event.address, depositToken, earnToken);
      dforce.save();
    }
    addTransaction(event);
    dforce.earnAmount = dforce.earnAmount
      .plus(convertTokenToDecimal(event.params.reward, earnToken.decimals));
    dforce.save();
  }
}

export function handleDFStaked(event: Staked): void {
  let address = event.address.toHexString();
  let user = getUserAddress(address);
  let deposit = getDepositToken(address);
  let earn = getEarnToken(address);
  if (event.params.user.toHexString() === user && user !== ADDRESS_ZERO) {
    let depositToken = addToken(Address.fromString(deposit));
    let earnToken = addToken(Address.fromString(earn));
    let dforce = VaultInfo.load(event.address.toHexString());
    if (dforce === null) {
      dforce = createVaultInfo(event.address, depositToken, earnToken);
      dforce.save();
    }
    addTransaction(event);
    dforce.depositAmount = dforce.depositAmount
      .plus(convertTokenToDecimal(event.params.amount, depositToken.decimals));
    dforce.save();
  }
}

export function handleDFWithdrawn(event: Withdrawn): void {
  let address = event.address.toHexString();
  let user = getUserAddress(address);
  let deposit = getDepositToken(address);
  let earn = getEarnToken(address);
  if (event.params.user.toHexString() === user && user !== ADDRESS_ZERO) {
    let depositToken = addToken(Address.fromString(deposit));
    let earnToken = addToken(Address.fromString(earn));
    let dforce = VaultInfo.load(event.address.toHexString());
    if (dforce === null) {
      dforce = createVaultInfo(event.address, depositToken, earnToken);
      dforce.save();
    }
    addTransaction(event);
    dforce.depositAmount = dforce.depositAmount
      .minus(convertTokenToDecimal(event.params.amount, depositToken.decimals));
    dforce.save();
  }
}

function getLpToken(address: Address): Address {
  let contract = UNIPool.bind(address);
  return contract.stakingToken();
}

export function handleUNIRewardPaid(event: RewardPaid): void {
  let address = event.address.toHexString();
  let user = getUserAddress(address);
  let earn = getEarnToken(address);
  if (event.params.user.toHexString() === user && user !== ADDRESS_ZERO) {
    let lpTokenAddress = getLpToken(event.address);
    let depositToken = addToken(lpTokenAddress);
    let earnToken = addToken(Address.fromString(earn));
    let vaultInfo = VaultInfo.load(event.address.toHexString());
    if (vaultInfo === null) {
      vaultInfo = createVaultInfo(event.address, depositToken, earnToken);
      vaultInfo.save();
    }
    addTransaction(event);
    vaultInfo.earnAmount = vaultInfo.earnAmount
      .plus(convertTokenToDecimal(event.params.reward, earnToken.decimals));
    vaultInfo.save();
  }
}

export function handleUNIStaked(event: Staked): void {
  let address = event.address.toHexString();
  let user = getUserAddress(address);
  let earn = getEarnToken(address);
  if (event.params.user.toHexString() === user && user !== ADDRESS_ZERO) {
    let lpTokenAddress = getLpToken(event.address);
    let depositToken = addToken(lpTokenAddress);
    let earnToken = addToken(Address.fromString(earn));
    let vaultInfo = VaultInfo.load(event.address.toHexString());
    if (vaultInfo === null) {
      vaultInfo = createVaultInfo(event.address, depositToken, earnToken);
      vaultInfo.save();
    }
    addTransaction(event);
    vaultInfo.depositAmount = vaultInfo.depositAmount
      .plus(convertTokenToDecimal(event.params.amount, depositToken.decimals));
    vaultInfo.save();
  }
}

export function handleUNIWithdrawn(event: Withdrawn): void {
  let address = event.address.toHexString();
  let user = getUserAddress(address);
  let earn = getEarnToken(address);
  if (event.params.user.toHexString() === user && user !== ADDRESS_ZERO) {
    let lpTokenAddress = getLpToken(event.address);
    let depositToken = addToken(lpTokenAddress);
    let earnToken = addToken(Address.fromString(earn));
    let vaultInfo = VaultInfo.load(event.address.toHexString());
    if (vaultInfo === null) {
      vaultInfo = createVaultInfo(event.address, depositToken, earnToken);
      vaultInfo.save();
    }
    addTransaction(event);
    vaultInfo.depositAmount = vaultInfo.depositAmount
      .minus(convertTokenToDecimal(event.params.amount, depositToken.decimals));
    vaultInfo.save();
  }
}

