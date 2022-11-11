import {Request,Response} from "express";
import {container} from "tsyringe";
import { TransferStatementUseCase } from "./TransferStatementUseCase";


class TransferStatementController{
    async handle(request:Request, response:Response):Promise<Response>{
        const { id : sender_id} = request.user;
        const { user_id: recipient_id} = request.params;
        const { amount, description } = request.body;

        const transferStatementUseCase = container.resolve(TransferStatementUseCase);
        await transferStatementUseCase.execute({sender_id, recipient_id, amount,description})

        return response.send()
    }
}

export {TransferStatementController}