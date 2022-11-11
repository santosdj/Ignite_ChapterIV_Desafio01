import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";

interface IRequest{
    sender_id:string;
    recipient_id:string;
    amount:number;
    description:string;
}

@injectable()
class TransferStatementUseCase{
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    
        @inject('StatementsRepository')
        private statementsRepository: IStatementsRepository
    ){}

    async execute({sender_id,recipient_id,amount,description}:IRequest):Promise<void>{
     const senderBalance = await this.statementsRepository.getUserBalance({
        user_id:sender_id,
        with_statement: false
      }) 

      if(senderBalance.balance < amount){
        throw new AppError("Insuficient funds");
      }

        await this.statementsRepository.create({ 
            user_id:recipient_id,
            sender_id,
            amount,
            description,
            type:OperationType.TRANFER
        })

        await this.statementsRepository.create({ 
            user_id:sender_id,            
            amount,
            description,
            type:OperationType.WITHDRAW
        })


    }

}

export {TransferStatementUseCase}