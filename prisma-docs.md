# Tích hợp Prisma ORM vào dự án MySQL có sẵn

MySQL là hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở phổ biến, nổi tiếng về tốc độ, độ tin cậy và dễ sử dụng. Trong hướng dẫn này, bạn sẽ học cách thêm Prisma ORM vào một dự án TypeScript hiện có, kết nối với MySQL, thực hiện introspect (đồng bộ ngược) cấu trúc database có sẵn và bắt đầu truy vấn dữ liệu an toàn (type-safe) với Prisma Client.

## Yêu cầu tiên quyết

Bạn cần có:

- **Node.js**: Phiên bản v20.19+, v22.12+, hoặc v24.0+ đã được cài đặt.
- Kiến thức cơ bản về JavaScript hoặc TypeScript.

## 1. Cài đặt Prisma ORM

Di chuyển vào thư mục dự án của bạn và cài đặt các dependencies cần thiết:
```bash
npm install prisma @types/node --save-dev
npm install @prisma/client @prisma/adapter-mariadb dotenv
```

Giải thích các gói:

- **prisma**: Prisma CLI dùng để chạy các lệnh như `prisma init`, `db pull`, và `generate`.
- **@prisma/client**: Thư viện Prisma Client dùng để truy vấn database trong code.
- **@prisma/adapter-mariadb**: Driver adapter giúp kết nối Prisma Client với database MySQL/MariaDB (tăng hiệu suất và tính năng).
- **dotenv**: Giúp tải các biến môi trường từ file `.env`.

## 2. Khởi tạo Prisma ORM

Thiết lập dự án Prisma bằng cách tạo file schema với lệnh sau:
```bash
npx prisma init --datasource-provider mysql --output ../generated/prisma
```

Lệnh này sẽ thực hiện các việc sau:

- Tạo thư mục `prisma/` chứa file `schema.prisma` (cấu hình kết nối DB).
- Tạo file `.env` ở thư mục gốc để chứa biến môi trường.
- Tạo file `prisma.config.ts` để cấu hình Prisma.

Nội dung file `prisma.config.ts` được tạo ra:
```typescript
// prisma.config.ts
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
```

File schema được tạo ra sử dụng ESM-first prisma-client generator với đường dẫn output tùy chỉnh:
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "mysql"
}
```

## 3. Kết nối Database

Cập nhật file `.env` với thông tin kết nối MySQL của bạn:
```env
# .env
DATABASE_URL="mysql://username:password@localhost:3306/mydb"

# Các biến môi trường riêng lẻ (dùng cho adapter sau này)
DATABASE_USER="username"
DATABASE_PASSWORD="password"
DATABASE_NAME="mydb"
DATABASE_HOST="localhost"
DATABASE_PORT=3306
```

Thay thế các giá trị tương ứng:

- **username**: Tên đăng nhập MySQL.
- **password**: Mật khẩu MySQL.
- **localhost:3306**: Host và port của MySQL.
- **mydb**: Tên database của bạn.

## 4. Introspect Database (Đồng bộ ngược)

Chạy lệnh sau để Prisma đọc cấu trúc database hiện có của bạn:
```bash
npx prisma db pull
```

Lệnh này sẽ đọc biến `DATABASE_URL`, kết nối tới database, và introspect (phân tích) cấu trúc bảng. Sau đó, nó sẽ tự động dịch cấu trúc SQL thành các model trong file `prisma/schema.prisma`.

Lúc này, file schema của bạn đã chứa các model đại diện cho các bảng dữ liệu hiện có.

## 5. Baseline Database (Tạo mốc ban đầu)

Để sử dụng tính năng Prisma Migrate với một database đã có dữ liệu, bạn cần tạo một bản "baseline" (điểm mốc).

Đầu tiên, tạo thư mục migration:
```bash
mkdir -p prisma/migrations/0_init
```

Tiếp theo, sinh file migration SQL dựa trên schema hiện tại:
```bash
npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql
```

Hãy kiểm tra file `migration.sql` vừa tạo để đảm bảo nó khớp với cấu trúc database của bạn.

Cuối cùng, đánh dấu migration này là "đã áp dụng" (applied) để Prisma biết rằng database đã có cấu trúc này rồi:
```bash
npx prisma migrate resolve --applied 0_init
```

Bây giờ bạn đã có một mốc chuẩn cho database hiện tại.

## 6. Generate Prisma Types

Tạo Prisma Client dựa trên schema vừa introspect:
```bash
npx prisma generate
```

Lệnh này sẽ tạo ra Prisma Client an toàn kiểu (type-safe) được thiết kế riêng cho database của bạn tại thư mục `generated/prisma`.

## 7. Khởi tạo Prisma Client

Tạo một file tiện ích (utility file) để khởi tạo Prisma Client. Chúng ta sẽ truyền driver adapter vào constructor của PrismaClient.

Tạo file `lib/prisma.ts`:
```typescript
// lib/prisma.ts
import "dotenv/config";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';

// Cấu hình Adapter
const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5 // Giới hạn kết nối
});

// Khởi tạo Prisma Client với adapter
const prisma = new PrismaClient({ adapter });

export { prisma }
```

## 8. Truy vấn Database

Bây giờ bạn có thể dùng Prisma Client để truy vấn. Tạo file `script.ts`:
```typescript
// script.ts
import { prisma } from './lib/prisma'

async function main() {
  // Ví dụ: Lấy tất cả bản ghi từ bảng User
  // Thay 'user' bằng tên model thực tế trong schema của bạn
  const allUsers = await prisma.user.findMany()
  console.log('All users:', JSON.stringify(allUsers, null, 2))
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

Chạy script để kiểm tra:
```bash
npx tsx script.ts
```

## 9. Phát triển tiếp (Evolve Schema)

Khi bạn muốn thay đổi cấu trúc database trong tương lai:

### 9.1. Cập nhật file Prisma Schema

Thêm model mới hoặc chỉnh sửa model hiện tại trong `prisma/schema.prisma`. Ví dụ thêm model Post:
```prisma
// prisma/schema.prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
}

model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String?
  posts Post[] // Quan hệ 1-n
}
```

### 9.2. Tạo và chạy Migration
```bash
npx prisma migrate dev --name your_migration_name
```

Lệnh này sẽ:

- Tạo file SQL migration mới.
- Chạy migration vào database.
- Tự động chạy lại `prisma generate` để cập nhật Client.

## 10. Khám phá dữ liệu với Prisma Studio

Prisma Studio là giao diện trực quan (GUI) để xem và sửa dữ liệu. Chạy lệnh:
```bash
npx prisma studio
```