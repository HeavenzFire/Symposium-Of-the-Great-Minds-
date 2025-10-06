export interface Thinker {
  id: string;
  name: string;
  field: string;
  avatarUrl: string;
  persona: string;
}

export interface UserTurn {
  type: 'user';
  question: string;
}

export interface SymposiumResponse {
  thinker: Thinker;
  response: string;
  rebuttal?: string;
}

export interface SymposiumTurn {
  type: 'symposium';
  responses: SymposiumResponse[];
}

export type ConversationTurn = UserTurn | SymposiumTurn;