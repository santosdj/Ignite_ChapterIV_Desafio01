import { OperationType, Statement } from "../entities/Statement";

export class BalanceMap {
  static toDTO({statement, balance}: { statement: Statement[], balance: number}) {
    const parsedStatement = statement.map(({
      id,
      amount,
      description,
      type,
      created_at,
      updated_at,
      sender_id
    }) => {

      if(type===OperationType.TRANFER){
        const obj = {
        id,
        sender_id,
        amount: Number(amount),
        description,
        type,
        created_at,
        updated_at,
      
     }

     return obj}
    else return {
      id,
      amount: Number(amount),
       description,
       type,
       created_at,
       updated_at
      }
    
    }
    );

    return {
      statement: parsedStatement,
      balance: Number(balance)
    }
  }
}
