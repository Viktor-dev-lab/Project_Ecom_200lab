import { ICartUseCase } from "@modules/cart/interface";
import { Request, Response } from "express";

export class CartHttpService{
  constructor(private readonly cartUseCase: ICartUseCase) {}

  async addProductToCartAPI(req: Request, res: Response) {
    const requester = res.locals.requester;
    const { userId } = requester;
    const dto = { ...req.body, userId };  // important
    const result = await this.cartUseCase.addProductToCart(dto);

    res.status(200).json({ data: result });
  }

  async removeProductFromCartAPI(req: Request, res: Response) {
    const requester = res.locals.requester;
    const { userId } = requester;
    const { id } = req.params;

    const result = await this.cartUseCase.removeProductFromCart(id, userId);

    res.status(200).json({ data: result });
  }

  async listItemsAPI(req: Request, res: Response) {
    const requester = res.locals.requester;
    const { userId } = requester;
    const items = await this.cartUseCase.listItems(userId);

    res.status(200).json({ data: items });
  }

  async updateProductQuantityAPI(req: Request, res: Response) {
    const requester = res.locals.requester;
    const { userId } = requester;
    const dto = req.body;
    await this.cartUseCase.updateProductQuantites(dto, userId);
    res.status(200).json({ data: true });
  }
}