Load Testing Guide (PM2 + Autocannon)
Tài liệu này mô tả cách setup, chạy và đọc kết quả test chịu tải cho backend Node.js (Express) sử dụng PM2 (cluster mode) và Autocannon.
Áp dụng cho:

Local test (Windows)
Test API REST
Đánh giá RPS, latency, error rate


1. Mục tiêu

Chạy backend ở chế độ multi-process (cluster) bằng PM2
Tạo tải giả lập hàng nghìn CCU
Đo:

RPS (Requests Per Second)
Latency (p50 / p95 / p99)
Error / Timeout


So sánh hiệu năng giữa các cấu hình


2. Yêu cầu môi trường

Node.js >= 18
PM2 (global)
Autocannon (global hoặc npx)
Project đã build ra JS (dist/)

Cài đặt:
bashnpm install -g pm2
npm install -g autocannon

3. Build project trước khi test
Không test trực tiếp bằng ts-node.
bashnpx tsc
Kết quả:
bashdist/index.js

4. Cấu hình PM2 (Cluster)
pm2.config.js
jsmodule.exports = {
  apps: [
    {
      name: "index",
      script: "dist/index.js",
      instances: "max", // chạy theo số CPU core
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};

5. Start server bằng PM2
bashnpx pm2 start pm2.config.js
```

Kết quả mong đợi:
- Nhiều instance được tạo (ví dụ 20 process)
- Status: online
```
App [index] launched (20 instances)
Kiểm tra:
bashpm2 list

6. Realtime monitoring (khuyến nghị)
bashpm2 monit
Theo dõi:

CPU usage
Memory usage
Load theo từng process


7. Chạy load test với Autocannon
7.1 Test cơ bản
bashautocannon http://localhost:8000/V1/brands
7.2 Test với CCU lớn (3000 connections)
bashautocannon -c 3000 -d 10 http://localhost:8000/V1/brands
Giải thích:

-c 3000: 3000 concurrent connections (CCU)
-d 10: chạy trong 10 giây

7.3 Test có worker threads (khuyến nghị)
bashautocannon -c 3000 -d 10 -t 4 http://localhost:8000/V1/brands

-t 4: dùng 4 worker threads để bắn request
Giúp load ổn định hơn, latency chính xác hơn