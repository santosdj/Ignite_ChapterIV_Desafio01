import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepository:InMemoryUsersRepository;
let statementsRepository:InMemoryStatementsRepository;
let createUserUseCase:CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase:GetBalanceUseCase;

describe("Balance", ()=>{
    beforeEach(()=>{
        usersRepository=new InMemoryUsersRepository();
        statementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(usersRepository);
        createStatementUseCase = new CreateStatementUseCase(usersRepository,statementsRepository);
        getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);
    });  
    
    it("should be able to an user balance", async ()=>{
        const user=  await createUserUseCase.execute({
            name:"Darcio Santos", email:"test@finapi.com.br", password:"senha123"} 
        );
        const id = user.id as string;
        const statement = await createStatementUseCase.execute({
            user_id: id,
            type: OperationType.DEPOSIT,
            amount:2,
            description:"invalid id with drawn"
        });

      const balance = await getBalanceUseCase.execute({user_id:id});

      expect(balance.balance).toBe(2);
      expect(balance.statement[0].description).toBe("invalid id with drawn")


    });

    it("should not be able to get user balance for an invalid user",async ()=>{
        await expect(async ()=>{
           const user =  await createUserUseCase.execute({
                name:"Darcio Santos", email:"test@finapi.com.br", password:"senha123"} 
            );
            const id = user.id as string;
            const statement = await createStatementUseCase.execute({
                user_id: id,
                type: OperationType.DEPOSIT,
                amount:2,
                description:"invalid id with drawn"
            })

            const balance = await getBalanceUseCase.execute({user_id:id});


        }).rejects.toBeInstanceOf(GetBalanceError);
    });
})