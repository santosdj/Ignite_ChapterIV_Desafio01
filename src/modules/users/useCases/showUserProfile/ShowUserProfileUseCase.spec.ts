import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let showUserProfileUseCase : ShowUserProfileUseCase;
let usersRepository:InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("User Profile", ()=>{

    beforeEach(() => {
      usersRepository = new InMemoryUsersRepository();
      createUserUseCase = new CreateUserUseCase(usersRepository);
      showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
    });
  
    it("should be able to list a user profile by id", async () => {
      const user = await createUserUseCase.execute({
        name:"Darcio Santos", email:"test@finapi.com.br", password:"senha123"} 
      );
      const id = user.id as string;
  
      const userProfile = await showUserProfileUseCase.execute(id);

      expect(userProfile.id).toBe(id);
    });

    it("should not be able to list a user profile with an invalid id", async () => {
       expect( async () =>{
        const user = await createUserUseCase.execute({
            name:"Darcio Santos", email:"test@finapi.com.br", password:"senha123"} 
          );
          const id = user.id as string;
      
          const userProfile = await showUserProfileUseCase.execute("123");
    
          expect(userProfile.id).toBe(id);
       }).rejects.toBeInstanceOf(ShowUserProfileError);
       
      });

    
})