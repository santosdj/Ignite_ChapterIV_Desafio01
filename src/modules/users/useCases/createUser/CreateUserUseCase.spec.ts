import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase : CreateUserUseCase;
let usersRepository:InMemoryUsersRepository;

describe("User Creations", ()=>{

    beforeEach(() => {
      usersRepository = new InMemoryUsersRepository();
      createUserUseCase = new CreateUserUseCase(usersRepository);
    });
  
    it("should be able to create a new user", async () => {
      const user = await createUserUseCase.execute({
        name:"Darcio Santos", email:"test@finapi.com.br", password:"senha123"} 
      );
  
      expect(user).toHaveProperty("id");
      expect(user).toBeInstanceOf(User);
    });

    it("should not be able to create a new user with another existing user's  email", async () => {

        await expect(async()=>{
            await createUserUseCase.execute({
            name:"Darcio Santos", email:"test@finapi.com.br", password:"senha123"} 
            );

            const user = await createUserUseCase.execute({
                name:"Joel Santos", email:"test@finapi.com.br", password:"senha123"} )
        }).rejects.toBeInstanceOf(CreateUserError)
    });
})