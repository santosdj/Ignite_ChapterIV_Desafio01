import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import {CreateStatementError} from "./CreateStatementError"
import { OperationType, Statement } from "../../entities/Statement";

let usersRepository:InMemoryUsersRepository;
let statementsRepository:InMemoryStatementsRepository;
let createUserUseCase:CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;


describe("Create Statements", ()=>{

    beforeEach(()=>{
        usersRepository=new InMemoryUsersRepository();
        statementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(usersRepository);
        createStatementUseCase = new CreateStatementUseCase(usersRepository,statementsRepository);
    });



    it("should be able to create an statement.", async ()=>{
        const user=  await createUserUseCase.execute({
            name:"Darcio Santos", email:"test@finapi.com.br", password:"senha123"} 
        );
        const id = user.id;
        console.log(id);
        const statement = await createStatementUseCase.execute({
            user_id: id as string,
            type: OperationType.DEPOSIT,
            amount:2,
            description:"invalid id with drawn"
        });

        expect(statement.amount).toBe(2);
        expect(statement.user_id).toBe(user.id);    


    });


    it("should not be able to create a statement to an invalid user", async ()=>{
       await expect(async ()=>{
            await createUserUseCase.execute({
                name:"Darcio Santos", email:"test@finapi.com.br", password:"senha123"} 
            );
            const statement = await createStatementUseCase.execute({
                user_id:"invalid id",
                type: OperationType.WITHDRAW,
                amount:2,
                description:"invalid id with drawn"
            })

        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    });


    it("should not be able to create a statement for an user without funds", async ()=>{
       await expect(async ()=>{
           const user =  await createUserUseCase.execute({
                name:"Darcio Santos", email:"test@finapi.com.br", password:"senha123"} 
            );
            const id = user.id;
            const statement = await createStatementUseCase.execute({
                user_id: id as string,
                type: OperationType.WITHDRAW,
                amount:2,
                description:"invalid id with drawn"
            })

        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    });

})