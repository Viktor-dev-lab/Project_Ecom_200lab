import express, { Express, Request, Response } from "express";
import { config } from 'dotenv'
import { z } from 'zod';

config();

const app: Express = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(express.json()); // xử lý JSON body
app.use(express.urlencoded({ extended: true })); // xử lý form-data

app.get("/", (req: Request, res: Response) => {
  res.send("Hello TypeScript + Express!");
});

app.get("/categories", (req: Request, res: Response) => {
  res.status(200).json({
    data: categories,
    code: 200
  });
});

app.get("/categories/:id", (req: Request, res: Response) => {
  const category = categories.find((category) => category.id === req.params.id);
  if (!category) {
    return res.status(404).json({
      message: "Category not found",
      code: 404
    });
  }
  res.status(200).json({
    data: category,
    code: 200
  });
});

app.post('/category', (req: Request, res: Response) => {
  const parseResult = CategoryCreateSchema.safeParse(req.body);

  if (!parseResult.success) {
    const tree = z.treeifyError(parseResult.error);

    return res.status(400).json({
      code: 400,
      message: "Validation error",
      errors: tree,
    });
  }

  const { name, image, description, parentId } = parseResult.data;

  // Tạo id mới
  const maxId = categories.length > 0
    ? Math.max(...categories.map(category => Number(category.id)))
    : 0;

  const newId = maxId + 1;

  const category: Category = {
    id: String(newId),
    name,
    image,
    description,
    parentId,
    position: categories.length + 1,
    status: CategoryStatus.Active,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  categories.push(category);

  res.status(201).json({
    data: category,
    code: 200,
  });
});


app.patch('/category/:id', (req: Request, res: Response) => {
  const { name, image, description, parentId, status } = req.body as CategoryUpdateDTO;
  const category = categories.find((c) => c.id === req.params.id);

  if (!category) {
    return res.status(404).json({
      code: 404,
      message: "Category not found",
    });
  }

  const errors: string[] = [];

  if (!name || typeof name !== "string" || name.trim() === "") {
    errors.push("name is required and must be a non-empty string");
  }

  if (!image || typeof image !== "string" || image.trim() === "") {
    errors.push("image is required and must be a non-empty string");
  }

  if (!description || typeof description !== "string" || description.trim() === "") {
    errors.push("description is required and must be a non-empty string");
  }

  if (!parentId || typeof parentId !== "string" || parentId.trim() === "") {
    errors.push("parentId is required and must be a non-empty string");
  }

  if (
    !status ||
    ![CategoryStatus.Active, CategoryStatus.Inactive].includes(status)
  ) {
    errors.push("status is required and must be either 'Active' or 'Inactive'");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      code: 400,
      errors,
    });
  }

  category.name = name;
  category.image = image;
  category.description = description;
  category.parentId = parentId;
  category.status = status;
  category.updatedAt = new Date();

  return res.status(200).json({
    code: 200,
    message: "Category updated successfully",
    data: category,
  });
});

app.delete('/category/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  categories = categories.filter((category) => category.id !== id);
  const categoryFound = categories.find((category) => category.id === req.params.id);

  if (!categoryFound) {
    return res.status(404).json({
      message: "Category not found",
      code: 404
    });
  }

  res.status(200).json({
    code: 200,
    data: true
  })

});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


enum CategoryStatus {
  Active = 'active',
  Inactive = 'inactive',
  Deleted = 'deleted'
}

// DTO
const CategoryCreateSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  image: z.string().url({ message: "Image must be a valid URL" }),
  description: z.string().optional(),
  parentId: z.string().uuid({ message: "Parent ID must be a valid UUID" }).nullable().optional(),
});


type CategoryUpdateDTO = {
  id: string,
  name: string,
  image?: string,
  description?: string;
  parentId?: string | null,
  status: CategoryStatus
}

// Business object/model/entity
// Zod schema
const CategorySchema = z.object({
  id: z.uuid({ message: "ID must be a valid UUID" }),                               // id bắt buộc
  name: z.string().min(3, 'name must be at least 3 characters').default("Untitled Category"), // tối thiểu 3 ký tự + default
  image: z.url({ message: "Image must be a valid URL" }).optional(),               // image URL optional
  description: z.string().optional(),                   // description optional
  position: z.number().int().min(0, 'invalid position').default(0),         // số nguyên >= 0 + default
  parentId: z.string().uuid().nullable().optional(),    // parentId có thể null hoặc optional
  status: z.enum(CategoryStatus),
  createdAt: z.date(),        // default now
  updatedAt: z.date(),        // default now
});

// TypeScript type inferred từ schema
type Category = z.infer<typeof CategorySchema>;

let categories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    image: "https://example.com/images/electronics.jpg",
    description: "Devices, gadgets and electronic accessories",
    position: 1,
    status: CategoryStatus.Active,
    createdAt: new Date("2025-01-01T10:00:00Z"),
    updatedAt: new Date("2025-01-10T12:00:00Z")
  },
  {
    id: "2",
    name: "Laptop",
    image: "https://example.com/images/fashion.jpg",
    description: "Apple, ASUS, and MSI",
    position: 2,
    parentId: "1", // ví dụ Fashion nằm trong Electronics (hoặc bạn bỏ đi cũng được)
    status: CategoryStatus.Inactive,
    createdAt: new Date("2025-01-05T09:30:00Z"),
    updatedAt: new Date("2025-01-15T15:45:00Z")
  }
];