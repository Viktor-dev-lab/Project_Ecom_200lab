import type { IQueryRepository } from "@share/interface/repository.interface";
import { IBrandQueryRepository, ICategoryQueryRepository, IProductUseCase } from "@modules/product/interface";
import { ProductCondDTO, ProductCreateDTO, ProductUpdateDTO } from "@modules/product/model/dto";
import { ProductCreateSchema, ProductUpdateSchema, ProductCondSchema } from "@modules/product/model/dto";
import { Product } from "@modules/product/model/product";
import { BaseHttpService } from "@share/transport/http-server";
import { Request, Response } from "express";


export class ProductHTTPService extends BaseHttpService<ProductCreateDTO, ProductUpdateDTO, Product, ProductCondDTO> {

  private readonly productBrandRepository: IBrandQueryRepository;
  private readonly productCategoryRepository: ICategoryQueryRepository;
  private readonly prodQueryRepo: IQueryRepository<Product, ProductCondDTO>

  constructor(
    useCase: IProductUseCase,
    productBrandRepository: IBrandQueryRepository,
    productCategoryRepository: ICategoryQueryRepository,
    prodQueryRepo: IQueryRepository<Product, ProductCondDTO>
  ) {
    super(useCase, ProductCreateSchema, ProductUpdateSchema, ProductCondSchema);
    this.productBrandRepository = productBrandRepository;
    this.productCategoryRepository = productCategoryRepository;
    this.prodQueryRepo = prodQueryRepo
  }

  async getDetailAPI(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.useCase.getDetail(id);

      if (!result) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      const brand = await this.productBrandRepository.get(result!.brandId!);

      if (brand) {
        result!.brand = brand!;
      }

      const category = await this.productCategoryRepository.get(result!.categoryId!);

      if (category) {
        result!.category = category!;
      }

      res.status(200).json({ data: result });
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      });
    }
  }

  async listProductByIdsAPI(req: Request, res: Response) {
    const { ids } = req.body;
    const result = await this.prodQueryRepo.listByIds(ids);
    res.status(200).json({ data: result });
  }
}

