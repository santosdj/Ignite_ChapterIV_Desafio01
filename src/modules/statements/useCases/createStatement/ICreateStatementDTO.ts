import { OperationType, Statement } from "../../entities/Statement";

export type ICreateStatementDTO4 =
Pick<
  Statement,
  'user_id' |
  'description' |
  'amount' |
  'type' |
'sender_id'
>;

export type ICreateStatementDTO = {
  user_id:string;
  description:string; 
  amount :number;
  type : OperationType;
  sender_id?:string;
}



