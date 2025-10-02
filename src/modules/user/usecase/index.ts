import { IRepository } from "@share/interface/repository.interface";
import { TokenPayload } from "@/share/interface/auth.interface"
import { PagingDTO } from "@share/model/paging";
import { v7 } from "uuid";
import { IUserUseCase } from "../interface";
import { Gender, Status, User, UserCondDTO, UserCondDTOSchema, UserLoginDTOSchema, UserRegistrationDTO, UserRegistrationDTOSchema, UserUpdateDTO, UserUpdateDTOSchema, type UserLoginDTO } from "../model";
import { ErrEmailExisted, ErrInvalidEmailAndPassword, ErrUserNotActive } from "../model/error";
import bcrypt from "bcryptjs";
import { ErrInvalidToken, ErrorDataNotFound } from "@share/model/base-errors";
import { jwtProvider } from "@share/component/jwt";
import { UserRole } from "@share/model/base-model";
import { AppError } from "@share/app-error";

export class UserUseCase implements IUserUseCase {
  constructor(private readonly repository: IRepository<User, UserCondDTO, UserUpdateDTO>) { }

  async verifyToken(token: string): Promise<TokenPayload> {
    const payload = await jwtProvider.verifyToken(token);

    if (!payload) {
      throw ErrInvalidToken;
    }
    
    const user = await this.repository.get(payload.userId);
    if (!user){
      throw ErrorDataNotFound;
    }

    if (user.status === Status.DELETED || user.status === Status.INACTIVE || user.status === Status.BANNED){
      throw ErrorDataNotFound;
    }

    return {userId: user.id, role: user.role};
  }

  async login(data: UserLoginDTO): Promise<string> {
    const dto = UserLoginDTOSchema.parse(data);

    // 1. Find user by email
    const user = await this.repository.findByCond({ email: dto.email });
    if (!user) {
      throw AppError.from(ErrInvalidEmailAndPassword, 400)
        .withLog(`Login failed: email ${dto.email} not found`);
    }

    // 2. Check password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw AppError.from(ErrInvalidEmailAndPassword, 400)
        .withLog(`Login failed: invalid password for email ${dto.email}`);
    }

    // 3. check status
    if (user.status !== Status.ACTIVE) {
      throw AppError.from(ErrUserNotActive, 400)
        .withLog(`Login failed: user ${dto.email} has status ${user.status}`);
    }

    // 4. Generate token
    const token = await jwtProvider.generateToken({ userId: user.id, role: user.role });
    return token;
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
      role: UserRole.USER,
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

  async profile(userId: string): Promise<User> {
    const user = await this.repository.get(userId);
    if (!user) {
      throw ErrorDataNotFound;
    }
    return user;
  }
}
