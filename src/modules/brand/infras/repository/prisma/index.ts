import { IBrandRepository } from "@/modules/brand/interface";
import { BrandUpdateDTO, BrandFilterDTO } from "@/modules/brand/model/dto";
import { Brand } from "@/modules/brand/model/model";
import { prisma } from '../../../../../share/lib/prisma';
import { ModelStatus } from "@share/model/base-model";
import { PagingDTO } from "@share/model/paging";

export class PrismaBrandRepository implements IBrandRepository {
    async get(id: string): Promise<Brand | null> {
        const brand = await prisma.brand.findUnique({ where: { id } });
        if (!brand) return null;
        return {...brand, status: brand.status as ModelStatus} as Brand
    }
    async findByCond(cond: BrandFilterDTO): Promise<Brand | null> {
        const brand = await prisma.brand.findFirst({ where: cond });
        if (!brand) return null;
        return {...brand, status: brand.status as ModelStatus} as Brand
    }
    async list(cond: BrandFilterDTO, paging: PagingDTO): Promise<Array<Brand>> {
        const brands = await prisma.brand.findMany({where: cond, skip: paging.limit * (paging.page - 1), take: paging.limit});
        return brands.map(brand => ({...brand, status: brand.status as ModelStatus})) as Brand[];
    }
    async listByIds(ids: string[]): Promise<Array<Brand>> {
        const brands = await prisma.brand.findMany({ where: { id: { in: ids } } });
        return brands.map(brand => ({...brand, status: brand.status as ModelStatus})) as Brand[];
    }
    async insert(data: Brand): Promise<boolean> {
        await prisma.brand.create({data})
        return true
    }
    async update(id: string, data: BrandUpdateDTO): Promise<boolean> {
        await prisma.brand.update({ where: { id }, data })
        return true
    }
    async delete(id: string, isHard: boolean): Promise<boolean> {
        isHard ?
            await prisma.brand.delete({ where: { id } }) :
            await prisma.brand.update({ where: { id }, data: { status: ModelStatus.DELETED } });
        return true
    }
}