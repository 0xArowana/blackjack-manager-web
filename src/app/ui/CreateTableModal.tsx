"use client";

import React, { useState } from "react";
import { useWriteContract } from "wagmi";
import { DoubleRule } from "../lib/definitions";
import { Close } from "../ui/Icons";
import { pitAbi } from "../../abi";
import { pitAddress, usdcAddress } from "../lib/constants";

const CreateTableModal = () => {
  const { writeContract } = useWriteContract();

  const [maxPlayers, setMaxPlayers] = useState(7);
  const [minBet, setMinBet] = useState(0);
  const [maxBet, setMaxBet] = useState<number | undefined>();
  const [token, setToken] = useState(usdcAddress);
  const [deckCount, setDeckCount] = useState(8);
  const [dealerHitOnSoft17, setDealerHitOnSoft17] = useState(false);
  const [allowDoubleAfterSplit, setAllowDoubleAfterSplit] = useState(false);
  const [doubleRule, setDoubleRule] = useState(DoubleRule.Any);
  const [maxResplitHands, setMaxResplitHands] = useState(4);
  const [allowResplitAces, setAllowResplitAces] = useState(false);
  const [allowHitSplitAces, setAllowHitSplitAces] = useState(false);
  const [allowLateSurrender, setAllowLateSurrender] = useState(false);
  const [allowInsurance, setAllowInsurance] = useState(false);
  const [isSixToFivePayout, setIsSixToFivePayout] = useState(false);

  const getDoubleRuleText = (rule: DoubleRule) => {
    switch (rule) {
      case DoubleRule.NineToEleven:
        return "9-11 only";
      case DoubleRule.TenToEleven:
        return "10 or 11 only";
      default:
        return "Any first two cards";
    }
  };

  const getBlackjackPayoutText = (sixToFive: boolean) => {
    return sixToFive ? "6:5" : "3:2";
  };

  const onSelectDoubleRule = (rule: DoubleRule) => {
    hideDropdown();
    setDoubleRule(rule);
  };

  const onSelectDeckCount = (count: number) => {
    hideDropdown();
    setDeckCount(count);
  };

  const onSelectMaxResplitHands = (hands: number) => {
    hideDropdown();
    setMaxResplitHands(hands);
  };

  const getMaxResplitHandsText = (hands: number) => {
    return `${hands} hands`;
  };

  const hideDropdown = () => {
    const selected = document.activeElement;
    selected?.blur();
  };

  const onSelectMaxPlayers = (players: number) => {
    hideDropdown();
    setMaxPlayers(players);
  };

  const onSelectBlackjackPayout = (sixToFive: boolean) => {
    hideDropdown();
    setIsSixToFivePayout(sixToFive);
  };

  const reset = () => {
    setMaxPlayers(7);
    setMinBet(0);
    setMaxBet(undefined);
    setToken(usdcAddress);
    setDeckCount(8);
    setDealerHitOnSoft17(false);
    setAllowDoubleAfterSplit(false);
    setDoubleRule(DoubleRule.Any);
    setMaxResplitHands(4);
    setAllowResplitAces(false);
    setAllowHitSplitAces(false);
    setAllowLateSurrender(false);
    setAllowInsurance(false);
    setIsSixToFivePayout(false);
  };

  return (
    <dialog id="create_table_modal" className="modal">
      <div className="modal-box flex flex-col">
        <div className="self-end">
          <form method="dialog">
            <button onClick={reset}>
              <Close />
            </button>
          </form>
        </div>
        <div className="text-2xl font-semibold self-center">Create Table</div>
        <div className="py-4 gap-4">
          <label className="flex label cursor-pointer items-between h-14">
            <span>Max players</span>
            <div className="dropdown dropdown-left">
              <div tabIndex={0} role="button" className="btn m-1 h-10">
                {maxPlayers}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] p-2 shadow"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((players) => (
                  <li onClick={() => onSelectMaxPlayers(players)}>
                    <a>{players}</a>
                  </li>
                ))}
              </ul>
            </div>
          </label>
          <label className="flex label cursor-pointer items-between h-14">
            <span>Blackjack payout</span>
            <div className="dropdown dropdown-left">
              <div tabIndex={0} role="button" className="btn m-1 h-10">
                {getBlackjackPayoutText(isSixToFivePayout)}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] p-2 shadow"
              >
                {[false, true].map((payout) => (
                  <li onClick={() => onSelectBlackjackPayout(payout)}>
                    <a>{getBlackjackPayoutText(payout)}</a>
                  </li>
                ))}
              </ul>
            </div>
          </label>
          <label className="flex label cursor-pointer items-between h-14">
            <span>Number of decks</span>
            <div className="dropdown dropdown-left">
              <div tabIndex={0} role="button" className="btn m-1 h-10">
                {deckCount}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] p-2 shadow"
              >
                {[1, 2, 4, 5, 6, 8].map((deckCount) => (
                  <li onClick={() => onSelectDeckCount(deckCount)}>
                    <a>{deckCount}</a>
                  </li>
                ))}
              </ul>
            </div>
          </label>
          <label className="flex label cursor-pointer items-between h-14">
            <span>Allow double on</span>
            <div className="dropdown dropdown-left">
              <div tabIndex={0} role="button" className="btn m-1 h-10">
                {getDoubleRuleText(doubleRule)}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] p-2 shadow"
                style={{ width: 200 }}
              >
                {[
                  DoubleRule.Any,
                  DoubleRule.NineToEleven,
                  DoubleRule.TenToEleven,
                ].map((rule) => (
                  <li onClick={() => onSelectDoubleRule(rule)}>
                    <a>{getDoubleRuleText(rule)}</a>
                  </li>
                ))}
              </ul>
            </div>
          </label>
          <label className="flex label cursor-pointer items-between h-14">
            <span>Allow player to split to</span>
            <div className="dropdown dropdown-left">
              <div tabIndex={0} role="button" className="btn m-1 h-10">
                {getMaxResplitHandsText(maxResplitHands)}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] p-2 shadow"
                style={{ width: 110 }}
              >
                {[2, 3, 4].map((hands) => (
                  <li onClick={() => onSelectMaxResplitHands(hands)}>
                    <a>{getMaxResplitHandsText(hands)}</a>
                  </li>
                ))}
              </ul>
            </div>
          </label>
          <label className="flex label cursor-pointer items-between h-14">
            <span>Allow double after split</span>
            <input
              type="checkbox"
              className="toggle"
              defaultChecked
              onChange={(event) => {
                setAllowDoubleAfterSplit(event.target.checked);
              }}
            />
          </label>
          <label className="flex label cursor-pointer items-between h-14">
            <span>Allow splitting aces</span>
            <input
              type="checkbox"
              className="toggle"
              onChange={(event) => {
                setAllowResplitAces(event.target.checked);
              }}
            />
          </label>
          <label className="flex label cursor-pointer items-between h-14">
            <span>Allow hitting split aces</span>
            <input
              type="checkbox"
              className="toggle"
              onChange={(event) => {
                setAllowHitSplitAces(event.target.checked);
              }}
            />
          </label>
          <label className="flex label cursor-pointer items-between h-14">
            <span>Allow late surrender</span>
            <input
              type="checkbox"
              className="toggle"
              onChange={(event) => {
                setAllowLateSurrender(event.target.checked);
              }}
            />
          </label>
          <label className="flex label cursor-pointer items-between h-14">
            <span>Dealer hits on soft 17</span>
            <input
              type="checkbox"
              className="toggle"
              onChange={(event) => {
                setDealerHitOnSoft17(event.target.checked);
              }}
            />
          </label>
          <label className="flex label cursor-pointer items-between h-14">
            <span>Allow insurance</span>
            <input
              type="checkbox"
              className="toggle"
              onChange={(event) => {
                setAllowInsurance(event.target.checked);
              }}
            />
          </label>
        </div>
        <button
          type="button"
          className="btn btn-primary rounded-2xl"
          onClick={() => {
            writeContract(
              {
                abi: pitAbi,
                address: pitAddress,
                functionName: "createTable",
                args: [
                  maxPlayers,
                  [minBet, maxBet],
                  [
                    deckCount,
                    dealerHitOnSoft17,
                    allowDoubleAfterSplit,
                    doubleRule,
                    maxResplitHands,
                    allowResplitAces,
                    allowHitSplitAces,
                    allowLateSurrender,
                    allowInsurance,
                    isSixToFivePayout,
                  ],
                  token,
                ],
              },
              {
                onError: (e) => console.log(e),
              }
            );
          }}
        >
          Create
        </button>
      </div>
    </dialog>
  );
};

export default CreateTableModal;
