import { IRepository, TokenPayload } from "@share/interface";
import { PagingDTO } from "@share/model/paging";
import { v7 } from "uuid";
import { IUserUseCase } from "../interface";
import { Gender, Role, Status, User, UserCondDTO, UserCondDTOSchema, UserLoginDTO, UserRegistrationDTO, UserRegistrationDTOSchema, UserUpdateDTO, UserUpdateDTOSchema } from "../model";
import { ErrEmailExisted } from "../model/error";
import bcrypt from "bcryptjs";
import { ErrorDataNotFound } from "@share/model/base-errors";

export class UserUseCase implements IUserUseCase {
  constructor(private readonly repository: IRepository<User, UserCondDTO, UserUpdateDTO>) { }
  
  verifyToken(token: string): Promise<TokenPayload> {
    throw new Error("Method not implemented.");
  }

  login(data: UserLoginDTO): Promise<string> {
    throw new Error("Method not implemented.");
  }

  async register(data: UserRegistrationDTO): Promise<string> {
    const dto = UserRegistrationDTOSchema.parse(data);

    // Check email existed
    const existedUser = await this.repository.findByCond({ email: dto.email });
    if (existedUser) {
      throw ErrEmailExisted;
    }

    // 2. Gen salt & hash password
    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    // 3. Create new user
    const newId = v7();
    const newUser: User = {
      ...dto,
      password: hashedPassword,
      id: newId,
      status: Status.ACTIVE,
      gender: Gender.UNKNOWN,
      salt: salt,
      role: Role.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 4. Insert to DB
    await this.repository.insert(newUser);
    return newId;
  }

  async create(data: UserRegistrationDTO): Promise<string> {
    return await this.register(data);
  }

  async getDetail(id: string): Promise<User | null> {
    const data = await this.repository.get(id);

    if (!data || data.status === Status.DELETED) {
      throw ErrorDataNotFound;
    }

    return data;
  }

  async update(id: string, data: UserUpdateDTO): Promise<boolean> {
    const dto = UserUpdateDTOSchema.parse(data);

    const product = await this.repository.get(id);
    if (!product || product.status === Status.DELETED) {
      throw ErrorDataNotFound;
    }

    await this.repository.update(id, dto);

    return true;
  }

  async list(cond: UserCondDTO, paging: PagingDTO): Promise<User[]> {
    const parsedCond = UserCondDTOSchema.parse(cond);

    return await this.repository.list(parsedCond, paging);
  }

  async delete(id: string): Promise<boolean> {
    const product = await this.repository.get(id);

    if (!product || product.status === Status.DELETED) {
      throw ErrorDataNotFound;
    }

    await this.repository.delete(id, false);

    return true;
  }
}
