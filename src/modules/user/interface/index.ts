import { IUseCase} from "@share/interface/usecase.interface";
import { TokenPayload } from "@/share/interface/auth.interface"
import { User, UserCondDTO, UserLoginDTO, UserRegistrationDTO, UserUpdateDTO } from "../model";

export interface IUserUseCase extends IUseCase<UserRegistrationDTO, UserUpdateDTO, User, UserCondDTO> {
  login(data: UserLoginDTO): Promise<string>;
  register(data: UserRegistrationDTO): Promise<string>;
  verifyToken(token: string): Promise<TokenPayload>;
  profile(token: string): Promise<User>;
}
