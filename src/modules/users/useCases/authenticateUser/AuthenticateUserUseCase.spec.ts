import auth from "../../../../config/auth";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

import {IAuthenticateUserResponseDTO} from "./IAuthenticateUserResponseDTO"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepository:InMemoryUsersRepository;

describe("User Authentication", ()=>{

    beforeEach(()=>{
        usersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    })

    it("it should be able to authenticate an existing user",async ()=>{
        const email = "test@finapi.com.br";
        const password = "senha123"
        await createUserUseCase.execute({
            name:"Darcio Santos", 
            email ,
            password
        });

       const authenticatedUser = await authenticateUserUseCase.execute({email,password}) 

        expect(authenticatedUser).toHaveProperty("token");
        expect(authenticatedUser.user.email).toBe(email);

    })

    it("should not be able to authenticate an user with a non existing email",()=>{
        expect(async()=>{
            const email = "test@finapi.com.br";
            const password = "senha123"
            await createUserUseCase.execute({
                name:"Darcio Santos", 
                email ,
                password
            });    
           const authenticatedUser = await authenticateUserUseCase.execute({email:"wrong email",password}) 
            }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    })

    it("should not be able to authenticate an user with a wrong password",()=>{
        expect(async()=>{
            const email = "test@finapi.com.br";
            const password = "senha123"
            await createUserUseCase.execute({
                name:"Darcio Santos", 
                email ,
                password
            });    
           const authenticatedUser = await authenticateUserUseCase.execute({email,password:"wrong password"}) 
            }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    })

})