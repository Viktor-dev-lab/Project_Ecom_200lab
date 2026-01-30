docker run -d --name redis-nj02 --restart unless-stopped -p 6380:6379 -v nj-redis:/data redis:6.2 redis-server --appendonly yes --requirepass "root123"

| Thành phần                 | Ý nghĩa                          |
| -------------------------- | -------------------------------- |
| `-d`                       | Chạy container ở background      |
| `--name redis-nj02`        | Tên container                    |
| `--restart unless-stopped` | Tự restart trừ khi stop thủ công |
| `-p 6380:6379`             | Map port host → container        |
| `-v nj-redis:/data`        | Lưu data Redis vào volume        |
| `redis:6.2`                | Image Redis version 6.2          |
| `--appendonly yes`         | Bật AOF persistence              |
| `--requirepass`            | Đặt mật khẩu Redis               |

4. Kết nối Redis bằng redis-cli
4.1. Kết nối từ máy host
redis-cli -h localhost -p 6380 -a root123

4.2. Kết nối từ bên trong container
docker exec -it redis-nj02 redis-cli -a root123

4.3 Cách cài đặt
corepack prepare pnpm@latest --activate
npm install redis

REDIS_URL = redis://[username]:[password]@[host]:[port]/0
[0-15] nhiều redis
REDIS_URL = redis://default:root123@localhost:6380

