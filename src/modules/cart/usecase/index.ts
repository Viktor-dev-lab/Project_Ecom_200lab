import { AppError, ErrForbidden } from "@share/app-error";
import { v7 } from "uuid";
import { ICartRepository, ICartUseCase, IProductQueryRepository } from "../interface";
import { AddCartItemDTO, addCartItemDTOSchema, CartItem } from "../model";
import { ErrCartItemNotFound, ErrProductNotEnoughQuantity, ErrProductNotFound } from "../model/error";

export class CartUseCase implements ICartUseCase {
  constructor(
    private readonly repo: ICartRepository,
    private readonly productQueryRepo: IProductQueryRepository,
  ) { }

  async addProductToCart(dto: AddCartItemDTO): Promise<boolean> {
    const dataDTO = addCartItemDTOSchema.parse(dto);
    const { userId, productId, attribute, quantity } = dataDTO;

    // 1. Get Product (CartProduct model, with quantity)
    const product = await this.productQueryRepo.findById(productId);

    if (!product) {
      throw AppError.from(ErrProductNotFound, 400);
    }
    // 2. Check if the product is already in the cart
    const existingItem = await this.repo.findByCond({ userId, productId, attribute })
    if (existingItem) {
      // check product quantity if enough (after add more quantity)
      const newQuantity = existingItem.quantity + quantity;
      if (product.quantity < newQuantity) throw AppError.from(ErrProductNotEnoughQuantity, 400);

      // add more quantity
      await this.repo.update(existingItem.id, { ...existingItem, quantity: newQuantity });
    } else {
      // check product quantity if enough
      if (product.quantity < quantity) throw AppError.from(ErrProductNotEnoughQuantity, 400);
      // add product item to cart
      const newId = v7();
      const newItem = { ...dataDTO, id: newId, createdAt: new Date(), updatedAt: new Date() };
      await this.repo.insert(newItem);
    }

    return true;
  }
  async removeProductFromCart(id: string, requesterId: string): Promise<boolean> {
    const existingItem = await this.repo.get(id);

    if (!existingItem) {
      throw AppError.from(ErrCartItemNotFound, 400);
    }

    if (existingItem.userId !== requesterId) {
      throw ErrForbidden.withLog('This item does not belong to this user');
    }

    await this.repo.delete(id, true);
    return true;
  }
  async listItems(requesterId: string): Promise<Array<CartItem> | null> {
    const cartItems = await this.repo.listItems(requesterId);
    if (!cartItems || cartItems.length === 0) return [];

    const productIds = cartItems.map((item) => item.productId);
    const products = await this.productQueryRepo.findByIds(productIds);
    if (!products || products.length === 0) return cartItems;

    const productMap = new Map(products.map((p) => [p.id, p]));
    const enrichedItems = cartItems.map((item) => {
      const product = productMap.get(item.productId);
      return {
        ...item, product: product || null,
      } as CartItem;
    });
    return enrichedItems;
  }
}