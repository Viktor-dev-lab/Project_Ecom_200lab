import {AddCartItemDTO, CartItem, CartItemCondDTO, CartProduct, UpdateCartItemDTO} from "../model";
import { IUseCase } from "@/share/interface/usecase.interface";
import { IRepository } from "@/share/interface/repository.interface";

export interface ICartUseCase {
  addProductToCart(dto: AddCartItemDTO): Promise<boolean>;
  removeProductFromCart(id: string, requesterId: string): Promise<boolean>;
  listItems(requesterId: string): Promise<Array<CartItem> | null >;
}

export interface ICartRepository extends IRepository<CartItem, CartItemCondDTO, UpdateCartItemDTO> {
  listItems(userId: string): Promise<Array<CartItem> | null>;
 }

export interface IProductQueryRepository {
  findById(id: string): Promise<CartProduct | null>
  findByIds(ids: string[]): Promise<Array<CartProduct>>;
}
