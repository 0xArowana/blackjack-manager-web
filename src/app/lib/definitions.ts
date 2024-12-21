export type TableRules = {
  deckCount: number;
  dealerHitOnSoft17: boolean;
  allowDoubleAfterSplit: boolean;
  doubleRule: DoubleRule;
  maxResplitHands: number;
  allowResplitAces: boolean;
  allowHitSplitAces: boolean;
  allowLateSurrender: boolean;
  allowInsurance: boolean;
  blackJackPayout: BlackJackPayout;
};

export enum DoubleRule {
  Any,
  NineToEleven,
  TenToEleven,
}

export enum BlackJackPayout {
  ThreeToTwo,
  SixToFive,
}
