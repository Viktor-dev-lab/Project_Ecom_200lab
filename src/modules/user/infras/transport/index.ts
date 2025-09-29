import { IUserUseCase } from "@modules/user/interface";
import { User, UserCondDTO, UserCondDTOSchema, UserRegistrationDTO, UserRegistrationDTOSchema, UserUpdateDTO, UserUpdateDTOSchema, UserLoginDTOSchema } from "@modules/user/model";
import { BaseHttpService } from "@share/transport/http-server";
import {z} from "zod";

export class UserHTTPService extends BaseHttpService<UserRegistrationDTO, UserUpdateDTO, User, UserCondDTO> {
  constructor(readonly useCase: IUserUseCase) {
    super(useCase, UserRegistrationDTOSchema, UserUpdateDTOSchema, UserCondDTOSchema);
  }

  async registerAPI(req: any, res: any): Promise<void> {
    try {
      const {success, data, error} = UserRegistrationDTOSchema.safeParse(req.body);
      if (!success) {
        const tree = z.treeifyError(error);
        res.status(400).json({
          message: tree,
        });
        return;
      }

      const newID = await this.useCase.register(data);
      return res.status(200).json({ newID });

    } catch(error: any){
      return res.status(400).json({
        message: (error as Error).message,
      });
    }
  }


  async loginAPI(req: any, res: any): Promise<void> {
    try {
      const { success, data, error } = UserLoginDTOSchema.safeParse(req.body);
      if (!success) {
        const tree = z.treeifyError(error);
        res.status(400).json({
          message: tree,
        });
        return;
      }

      const token = await this.useCase.login(data);
      return res.status(200).json({ token });

    } catch (error: any) {
      return res.status(400).json({
        message: (error as Error).message,
      });
    }

  }

  async profileAPI(req: any, res: any): Promise<void> {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const payload = await this.useCase.verifyToken(token);
      if (!payload) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const user = await this.useCase.profile(payload.userId);
      const { salt, password, ...rest } = user;
      return res.status(200).json(rest);

    } catch (error: any) {
      return res.status(400).json({
        message: (error as Error).message,
      });
    }
  }
}