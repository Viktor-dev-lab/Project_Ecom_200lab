import { IUserUseCase } from "@modules/user/interface";
import { User, UserCondDTO, UserCondDTOSchema, UserRegistrationDTO, UserRegistrationDTOSchema, UserUpdateDTO, UserUpdateDTOSchema } from "@modules/user/model";
import { BaseHttpService } from "@share/transport/http-server";

export class UserHTTPService extends BaseHttpService<UserRegistrationDTO, UserUpdateDTO, User, UserCondDTO> {
  constructor(useCase: IUserUseCase) {
    super(useCase, UserRegistrationDTOSchema, UserUpdateDTOSchema, UserCondDTOSchema);
  }
}