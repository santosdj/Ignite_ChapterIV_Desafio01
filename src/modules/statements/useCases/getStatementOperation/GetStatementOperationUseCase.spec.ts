import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType, Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepository:InMemoryUsersRepository;
let statementsRepository:InMemoryStatementsRepository;
let createUserUseCase:CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase : GetStatementOperationUseCase;


describe("Get Statements", ()=>{

    beforeEach(()=>{
        usersRepository=new InMemoryUsersRepository();
        statementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(usersRepository);
        createStatementUseCase = new CreateStatementUseCase(usersRepository,statementsRepository);
        getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository,statementsRepository);    
    });



    it("should be able to get a statement", async ()=>{
       const user =  await createUserUseCase.execute({
          name:"Darcio Santos",
          email:"test@finapi.com.br",
          password:"senha123"} 
       );

        const id = user.id as string;
        const statement = await createStatementUseCase.execute({
            user_id: id,
            type: OperationType.DEPOSIT,
            amount:2,
            description:"invalid id with drawn"
        });

        const statementOperation = await getStatementOperationUseCase.execute({user_id:id,statement_id:statement.id as string})

        expect(statementOperation.user_id).toBe(id);
        expect(statementOperation.id).toBe(statement.id);
        expect(statement).toBeInstanceOf(Statement);
    });



    it("should not be able to get a statement of an invalid user", ()=>{
        expect(async ()=>{
           const user =  await createUserUseCase.execute({
                name:"Darcio Santos", email:"test@finapi.com.br", password:"senha123"} 
            );

            const id = user.id as string;
            const statement = await createStatementUseCase.execute({
                user_id: id,
                type: OperationType.DEPOSIT,
                amount:2,
                description:"invalid id with drawn"
            });

            const statementOperation = await getStatementOperationUseCase.execute({user_id:"wronguser",statement_id:statement.id as string})

        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
    });


    it("should not be able to get a statement with an invalid id", ()=>{
        expect(async ()=>{
           const user =  await createUserUseCase.execute({
                name:"Darcio Santos", email:"test@finapi.com.br", password:"senha123"} 
            );

            const id = user.id as string;
            const statement = await createStatementUseCase.execute({
                user_id: id,
                type: OperationType.DEPOSIT,
                amount:2,
                description:"invalid id with drawn"
            });

            const statementOperation = await getStatementOperationUseCase.execute({user_id:id,statement_id:"wrong id"})

        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    });



});
