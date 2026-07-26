# 《Redis in Action》现代化学习笔记

本目录是基于 Josiah Carlson 所著《Redis in Action》（2013，Manning）整理的中文学习笔记。原书基于 **Redis 2.6 + Python 2** 编写，本笔记在忠实还原原书设计思路、数据结构选型和踩坑经验的基础上，补充了：

- **现代 Redis（7.x / 8.x，以及 Valkey）的等价能力和命令变化**（如 listpack 替代 ziplist、Redis Functions 替代手写脚本缓存、Streams 替代手工消息队列、HyperLogLog 替代手工基数估算、HASH 字段级 TTL 等）。
- **这些年社区的生产实践**（连接池、缓存击穿防护、分布式锁的正确姿势、Redis Cluster 与本书手工分片方案的对照等）。
- **Python / Java / TypeScript 三语言示例代码**，Web 框架以 **Django**（Python）和 **Hono.js**（TypeScript）为例。

> **网页版**：`html/` 目录下提供了每一章的 HTML 版本（`html/index.html` 为导航首页），配有 mermaid 流程图/时序图帮助理解数据结构和交互流程，用浏览器打开 `docs/html/index.html` 即可阅读，无需额外构建步骤。

## 目录

| 章节 | 标题 | 核心内容 |
|---|---|---|
| [第 1 章](ch01.md) | 认识 Redis | 五种基础数据结构、文章投票系统入门案例 |
| [第 2 章](ch02.md) | 剖析一个 Redis Web 应用 | 登录会话、购物车、页面缓存、行缓存、访问分析 |
| [第 3 章](ch03.md) | Redis 命令大全 | STRING/LIST/SET/HASH/ZSET/Pub-Sub/SORT/事务/过期，逐命令现代化标注 |
| [第 4 章](ch04.md) | 保障数据安全与性能 | RDB/AOF 持久化、主从复制、WATCH/MULTI/EXEC、Pipeline、性能诊断 |
| [第 5 章](ch05.md) | 用 Redis 支撑应用运维 | 日志、多精度计数器与统计、IP 归属地查询、服务发现与配置中心 |
| [第 6 章](ch06.md) | 构建应用组件 | 自动补全、分布式锁、计数信号量、任务队列、可靠消息投递、文件分发 |
| [第 7 章](ch07.md) | 基于搜索的应用 | 倒排索引、ZSET 组合排序、广告投放（eCPM 学习）、职位搜索 |
| [第 8 章](ch08.md) | 构建一个简单的社交网络 | 用户/状态、时间线、关注关系、发帖扇出策略、流式 API |
| [第 9 章](ch09.md) | 降低内存占用 | 紧凑结构编码（ziplist→listpack）、分片结构、位打包 |
| [第 10 章](ch10.md) | 扩展 Redis | 只读从库、可写查询从库、手工分片方案与 Redis Cluster 的对照 |
| [第 11 章](ch11.md) | 用 Lua 给 Redis 写脚本 | EVAL/EVALSHA、锁/信号量/自动补全/交易的 Lua 重写、Redis Functions |
| [附录 A](chA.md) | 快速搭建环境（现代版） | Docker/APT/Homebrew 安装、Django 与 Hono.js 接入示例 |

### 补充章节（原书未覆盖，按现代互联网实践新增）

| 章节 | 标题 | 核心内容 |
|---|---|---|
| [第 12 章](ch12.md) | 安全与访问控制 | ACL 最小权限账号、TLS、protected-mode、生产安全清单 |
| [第 13 章](ch13.md) | 用 Redis 做限流 | 固定/滑动窗口、令牌桶、GCRA（redis-cell）、Hono.js 限流中间件 |
| [第 14 章](ch14.md) | 可观测性与生产排障 | SLOWLOG/LATENCY/MEMORY、maxmemory-policy、Prometheus+Grafana、RedisInsight |
| [第 15 章](ch15.md) | Redis 与 AI 应用 | RediSearch 向量检索、RAG 集成、语义缓存 |
| [第 16 章](ch16.md) | 数据分层与结构选型方法论 | DB vs Redis 决策图、结构选型决策树、12 个高频场景三语言示例 |

## 阅读建议

- 如果你从未用过 Redis，按 1→11 顺序读，附录 A 可以随时穿插用来搭环境。
- 如果你已经熟悉 Redis 基础，想直接看"这本 2013 年的书哪些地方过时了"，重点看第 9、10、11 章（编码方式、分片方案、脚本机制都有实质性演进），以及第 3 章的命令对照表。
- 每章末尾都附了一份"Listing 对照表"，方便你对照原书随书代码（`chXX/listings/chXX_listing_source.py`）逐段阅读。

## 一句话版本演进提示

原书基于 Redis 2.6（2012），本笔记写作时最新稳定版是 Redis 8.x / Valkey 8.x（2024-2025）。中间跨越的关键版本节点：2.8（SCAN、HyperLogLog）、3.0（Redis Cluster）、3.2（GEO、BITFIELD）、4.0（模块系统、HSET 多字段、RDB+AOF 混合持久化）、5.0（Streams）、6.0（RESP3、ACL、客户端缓存）、6.2（统一 ZRANGE、LMOVE、COPY）、7.0（Functions、多部分 AOF）、7.4（HASH 字段级 TTL）、8.0（原生 JSON/概率数据结构/向量检索并入核心）。
