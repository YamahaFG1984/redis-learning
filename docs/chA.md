# 附录 A 快速搭建环境（现代版）

> 对应原书附录 A "Quick and dirty setup"。原书内容完全围绕 2013 年的软件版本展开（Redis 2.6.9、Python 2.6/2.7、通过 `ez_setup.py`+`easy_install` 装包），这些具体步骤今天已经全部过时。这里按现代方式重新整理一份安装指南，同时说明原书每一步"现在应该怎么做"。

## 原书的方法 vs 现代方法

| 场景 | 原书（2013） | 现在应该怎么做 |
|---|---|---|
| Linux 装 Redis | 警告 apt 仓库版本太老（Ubuntu 10.4 只有 Redis 1.2.6），改为从源码编译 `redis-2.6.9.tar.gz`（下载地址 `redis.googlecode.com`，Google Code 早已关站） | 直接用官方 APT/YUM 仓库（`packages.redis.io`）或发行版自带包，版本已经足够新；容器化场景直接用官方 Docker 镜像 |
| macOS 装 Redis | 用小众包管理器 **Rudix**（`rudix.googlecode.com`，项目早已停止维护） | 用 **Homebrew**：`brew install redis` |
| Windows 装 Redis | 用非官方移植版（Dusan Majkic 的 GitHub 仓库，或 Microsoft 早期 alpha 分支），明确警告 Windows 缺少 `fork()`，后台保存会阻塞 | Windows 从来没有官方原生支持；现代做法是 **WSL2 跑 Linux 版 Redis**、**Docker Desktop**，或第三方商业移植版 **Memurai** |
| 装 Python 客户端 | 手动下载 `ez_setup.py` 引导 `easy_install`（因为怕麻烦没用 pip+virtualenv） | 直接 `pip install redis`，`easy_install` 早已从 setuptools 里移除 |
| Python 版本 | Python 2.6/2.7 | **Python 2 已在 2020 年 1 月终止支持**，一律用 Python 3 |
| 验证安装 | 交互式 `python` 里 `import redis; conn = redis.Redis(); conn.set(...)` | 相同思路依然适用，见下方 |

## 现代安装步骤

### Linux（Ubuntu/Debian）

```bash
# 官方仓库（比发行版自带的更新更及时）
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
sudo apt-get update
sudo apt-get install redis
sudo systemctl enable --now redis-server
```

### macOS

```bash
brew install redis
brew services start redis
```

### 最快的方式：Docker（跨平台，推荐用于本书示例代码的本地开发）

```bash
docker run -d --name redis -p 6379:6379 redis:latest
# 想要 RedisJSON/RediSearch/TimeSeries/Bloom 等现代模块，用 redis-stack 镜像：
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
```

### 客户端库安装

```bash
# Python
pip install redis

# Node.js / TypeScript
npm install ioredis
# 或官方客户端
npm install redis

# Java（Maven，Jedis）
# <dependency>
#   <groupId>redis.clients</groupId>
#   <artifactId>jedis</artifactId>
#   <version>5.x</version>
# </dependency>
```

## Hello Redis：验证安装

**Python**

```python
import redis
conn = redis.Redis(decode_responses=True)
conn.set("hello", "world")
print(conn.get("hello"))  # world
```

**Java**

```java
import redis.clients.jedis.UnifiedJedis;

public class Hello {
    public static void main(String[] args) {
        try (UnifiedJedis jedis = new UnifiedJedis("redis://localhost:6379")) {
            jedis.set("hello", "world");
            System.out.println(jedis.get("hello")); // world
        }
    }
}
```

**TypeScript**

```ts
import { Redis } from "ioredis";
const redis = new Redis();
await redis.set("hello", "world");
console.log(await redis.get("hello")); // world
```

## 配合本书示例用的 Web 框架：Django 与 Hono.js

原书完全没有涉及 Web 框架集成（第 2 章的"页面缓存"用的是自己手写的中间件概念）。既然本书示例会用 Django（Python）和 Hono.js（TypeScript）演示，这里给出最基础的接入方式。

### Django 接入 Redis

```bash
pip install django django-redis
```

```python
# settings.py
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "OPTIONS": {"CLIENT_CLASS": "django_redis.client.DefaultClient"},
    }
}
# 也可以直接用 Redis 做 Session 存储（对应第 2 章的登录会话主题）
SESSION_ENGINE = "django.contrib.sessions.backends.cache"
SESSION_CACHE_ALIAS = "default"
```

```python
# views.py
from django.core.cache import cache
from django.http import JsonResponse

def hello(request):
    cache.set("hello", "world", timeout=300)
    return JsonResponse({"hello": cache.get("hello")})
```

### Hono.js 接入 Redis（ioredis）

```bash
npm install hono ioredis @hono/node-server
```

```ts
// index.ts
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { Redis } from "ioredis";

const redis = new Redis();
const app = new Hono();

app.get("/hello", async (c) => {
  await redis.set("hello", "world", "EX", 300);
  return c.json({ hello: await redis.get("hello") });
});

serve({ fetch: app.fetch, port: 3000 });
```

## 关于 Redis 授权协议的一段历史（原书完全不涉及，但今天必须了解）

2024 年 3 月，Redis Ltd. 把 Redis 7.4 之后的版本从传统的 BSD 三条款开源协议，改成了 **RSALv2（Redis Source Available License）和 SSPLv1** 双协议，不再是 OSI 认可的开源协议。这直接导致：

- Linux 基金会牵头，原 Redis 核心维护者中的一部分人 fork 出了 **Valkey**——保持 BSD 协议，目前主流云厂商（AWS、Google Cloud 等）新的托管 Redis 兼容服务基本都切换到了 Valkey 底层。
- 2025 年，Redis 又宣布 **回归 AGPLv3 开源协议**，重新拥抱开源社区。

对本书的读者来说，这段历史不影响你学习的核心内容——**Valkey 目前和 Redis 在命令、协议层面高度兼容**，本书所有代码示例在 Valkey 上同样适用；只是在生产选型时，需要留意你用的具体版本/发行版遵循哪个协议，这可能涉及许可合规问题，建议查阅当前最新的官方协议条款。

## 本章小结

原书附录 A 的具体步骤（Rudix、`ez_setup.py`、2.4/2.6 时代的下载链接）今天已经全部作废，但它提出的核心问题——"怎么最快装好 Redis + 客户端库，跑通第一个 SET/GET"——依然是每个 Redis 学习者的第一步。现代答案是：**Docker 一行命令起服务，`pip`/`npm`/Maven 一行命令装客户端**，比 2013 年简单太多。
