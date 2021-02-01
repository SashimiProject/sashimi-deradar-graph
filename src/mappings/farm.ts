import {
  Address,
  BigInt,
  BigDecimal,
  log
} from '@graphprotocol/graph-ts';
import {
  convertTokenToDecimal,
  addToken,
  addTransaction,
  ADDRESS_ZERO,
  ZERO_BI,
  ZERO_BD,
  stableTokens,
  BI_2,
  BI_18,
  getEthPrice,
  getSashimiPrice, WETH_ADDRESS, SASHIMI_ADDRESS
} from "./helper";
import {
  ChefInfo,
  FarmPool, Token
} from "../types/schema";
import {
  MasterChef
} from "../types/SashimiFarm/MasterChef";
import {
  Pair
} from "../types/SashimiFarm/Pair";
import {
  Deposit,
  Withdraw,
  MasterChef__poolInfoResult
} from "../types/SashimiFarm/MasterChef";

let MasterChefAddress = Address.fromString('0x1daed74ed1dd7c9dabbe51361ac90a69d851234d');

function getTotalPoint(): BigInt {
  let m = MasterChef.bind(MasterChefAddress);
  let resp = m.try_totalAllocPoint();
  let totalPoint = ZERO_BI;
  if (!resp.reverted) {
    totalPoint = resp.value;
  }
  return totalPoint;
}

function getSashimiPerBlock(): BigDecimal {
  let m = MasterChef.bind(MasterChefAddress);
  let resp = m.try_sashimiPerBlock();
  let per = ZERO_BD;
  if (!resp.reverted) {
    per = convertTokenToDecimal(resp.value, BigInt.fromI32(18));
  }
  return per;
}

function getStartBlock(): BigInt {
  let m = MasterChef.bind(MasterChefAddress);
  let resp = m.try_startBlock();
  let per = ZERO_BI;
  if (!resp.reverted) {
    per = resp.value;
  }
  return per;
}

function updateChefInfo(): void {
  let chef = ChefInfo.load('1');
  if (chef === null) {
    chef = new ChefInfo('1');
    chef.startBlock = getStartBlock();
  }
  chef.totalPoint = getTotalPoint();
  chef.sashimiPerBlock = getSashimiPerBlock();
  chef.save();
}

function getPoolInfo(pid: BigInt): MasterChef__poolInfoResult | null {
  let m = MasterChef.bind(MasterChefAddress);
  let resp = m.try_poolInfo(pid)
  if (!resp.reverted) {
    return resp.value
  }
  return null;
}

class PairToken {
  token0: Address;
  token1: Address;

  constructor(token0: Address, token1: Address) {
    this.token0 = token0;
    this.token1 = token1;
  }
}

function getPair(p: Address): PairToken|null {
  if (p.equals(Address.fromString(ADDRESS_ZERO))) {
    return null;
  }
  let contract = Pair.bind(p);
  let resp0 = contract.try_token0();
  if (resp0.reverted) {
    return null;
  }
  let resp1 = contract.try_token1();
  if (resp1.reverted) {
    return null;
  }
  let token0 = resp0.value;
  let token1 = resp1.value;
  return new PairToken(token0, token1);
}

function getTotalLpValueInUsd(token0: Token, token1: Token, lpToken: Token): BigDecimal {
  let pair = Pair.bind(Address.fromString(lpToken.id));
  let reserve = pair.getReserves();
  if (stableTokens.get(token0.id)) {
    return convertTokenToDecimal(reserve.value0, token0.decimals)
      .times(BI_2.toBigDecimal());
  }
  if (stableTokens.get(token1.id)) {
    return convertTokenToDecimal(reserve.value1, token1.decimals)
      .times(BI_2.toBigDecimal());
  }
  if (token0.id == WETH_ADDRESS) {
    let ethPrice = getEthPrice();
    return convertTokenToDecimal(reserve.value0, token0.decimals)
      .times(ethPrice)
      .times(BI_2.toBigDecimal());
  }
  if (token1.id == WETH_ADDRESS) {
    let ethPrice = getEthPrice();
    return convertTokenToDecimal(reserve.value1, token1.decimals)
      .times(ethPrice)
      .times(BI_2.toBigDecimal());
  }
  if (token0.id == SASHIMI_ADDRESS) {
    let sashimiPrice = getSashimiPrice();
    return convertTokenToDecimal(reserve.value0, token0.decimals)
      .times(sashimiPrice)
      .times(BI_2.toBigDecimal());
  }
  if (token1.id == SASHIMI_ADDRESS) {
    let sashimiPrice = getSashimiPrice();
    return convertTokenToDecimal(reserve.value1, token1.decimals)
      .times(sashimiPrice)
      .times(BI_2.toBigDecimal());
  }
  return ZERO_BD;
}

function addOrUpdateFarm(pid: BigInt, amount: BigInt, coef: BigDecimal): void {
  let pool = FarmPool.load(pid.toString());
  let info = getPoolInfo(pid);
  if (pool === null) {
    pool = new FarmPool(pid.toString());
    pool.totalDeposit = ZERO_BD;
    pool.isUni = true;
    pool.totalDepositUSD = ZERO_BD;
    pool.volume = ZERO_BD;
  } else {
    pool.isUni = pool.isUni && info.value0.equals(Address.fromString(pool.lpToken))
  }
  if (info.value0.equals(Address.fromString(ADDRESS_ZERO))) {
    return;
  }
  pool.allocPoint = info.value1;
  let lpToken = addToken(info.value0);
  pool.lpToken = lpToken.id;
  let pairInfo = getPair(info.value0);
  if (pairInfo !== null) {
    let volume = convertTokenToDecimal(amount, BigInt.fromI32(18));
    let token0 = addToken(pairInfo.token0);
    let token1 = addToken(pairInfo.token1);
    let totalLpValue = getTotalLpValueInUsd(token0 as Token, token1 as Token, lpToken as Token);
    let depositPercent = volume.div(lpToken.totalSupply);
    pool.token0 = token0.id;
    pool.token1 = token1.id;
    pool.volume = pool.volume.plus(totalLpValue.times(depositPercent));
    pool.totalDeposit = pool.totalDeposit.plus(volume.times(coef))
    pool.lpSupplyPercent = pool.totalDeposit.div(lpToken.totalSupply);
    pool.totalDepositUSD = pool.lpSupplyPercent.times(totalLpValue);
    pool.save();
  }
}

export function handleDeposit(event: Deposit): void {
  updateChefInfo();
  addTransaction(event);
  addOrUpdateFarm(event.params.pid, event.params.amount, BigInt.fromI32(1).toBigDecimal());
}

export function handleWithdraw(event: Withdraw): void {
  updateChefInfo();
  addTransaction(event);
  addOrUpdateFarm(event.params.pid, event.params.amount, BigInt.fromI32(-1).toBigDecimal());
}
