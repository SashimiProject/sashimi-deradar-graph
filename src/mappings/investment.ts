import {log, Address} from '@graphprotocol/graph-ts';
import { Harvested as OldHarvestedEvent } from "../types/OldInvest/OldInvestment";
import { Harvested as NewHarvestedEvent } from '../types/NewInvest/NewInvestmentContract';
import { NewInvestment, OldInvestment } from "../types/schema";
import {
  addToken,
  addTransaction,
  convertTokenToDecimal,
  ZERO_BD
} from "./helper";

export function handleOldHarvest(event: OldHarvestedEvent): void {
  log.debug('profit address' + event.params.param0.toHexString(), []);
  let profitTokenAddress = event.params.param1;
  let profitToken = addToken(profitTokenAddress);
  addTransaction(event);
  let harvest = OldInvestment.load(profitTokenAddress.toHexString());
  if (harvest === null) {
    harvest = new OldInvestment(profitTokenAddress.toHexString());
    harvest.earnToken = profitToken.id;
    harvest.earnAmount = ZERO_BD;
  }
  harvest.earnAmount = harvest.earnAmount.plus(convertTokenToDecimal(event.params.param2, profitToken.decimals));
  harvest.save();
}

export function handleNewHarvest(event: NewHarvestedEvent): void {
  log.debug('handle new harvest 0 type ' + event.parameters[0].value.kind.toString(), []);
  log.debug('handle new harvest 1 type ' + event.parameters[1].value.kind.toString(), []);
  log.debug('handle new harvest 2 type ' + event.parameters[2].value.kind.toString(), []);
  log.debug('handle new harvest ' + event.params.param1.toHexString(), []);
  // hack, wrong type in contract
  // let profitTokenAddress = changetype<Address>(event.parameters[1].value.data as u32);
  let profitTokenAddress = event.params.param1;
  let profitToken = addToken(profitTokenAddress);
  addTransaction(event);
  let harvest = NewInvestment.load(profitTokenAddress.toHexString());
  if (harvest === null) {
    harvest = new NewInvestment(profitTokenAddress.toHexString());
    harvest.earnToken = profitToken.id;
    harvest.earnAmount = ZERO_BD;
  }
  harvest.earnAmount = harvest.earnAmount.plus(convertTokenToDecimal(event.params.param2, profitToken.decimals));
  harvest.save();
}
