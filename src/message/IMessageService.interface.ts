import { IReplyMarkup } from '../common/model/IReplyMarkup.interface';

export interface IMessageService {
  getUserMarkdown({ username, firstName, id }: { username?: string; firstName?: string; id: number }): string;

  getGameMessageText(parameters: {
    gameId: number;
    createdByUserMarkdown: string;
    playUsers: { username?: string; firstName?: string; id: number; balance: number }[];
    payByUserMarkdown: string;
    isFree?: boolean;
    gameCost?: number;
    gameBalances: { userMarkdown: string; gameBalance: number }[];
  }): string;

  getDeletedGameMessageText(parameters: { gameId: number; createdByUserMarkdown: string }): string;

  parseGameId(text: string): number;

  getReplyMarkup(isFree?: boolean): IReplyMarkup;
  getDoneGameReplyMarkup(): IReplyMarkup;
  getDeletedGameReplyMarkup(): IReplyMarkup;
}
