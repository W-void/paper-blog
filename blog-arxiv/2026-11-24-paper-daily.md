---
title: "【推荐系统 Paper 日报】2026-11-24"
date: 2026-11-24
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/md/2800336980"
---

# 【推荐系统 Paper 日报】2026-11-24

## 📊 今日概览

本期对应 arXiv cs.IR 公告日期 2026-11-23（周一），今日共更新 8 篇论文，其中与推荐系统/个性化直接相关的有 3 篇。亮点：一篇 WSDM 2027 工业界论文把 DCN 系列的特征交叉升级到了「除法」，直接在短视频生产环境干掉了 40% 的人工比率特征；另有冷启动跨模型检索和个性化长文风格生成两篇值得关注。

## 🔥 推荐系统论文深度解读

### 1. Deep Cross-Division Network for Product-and-Ratio Feature Interactions in Industrial Ranking

📄 [arXiv:2611.27514](https://arxiv.org/abs/2611.27514) | WSDM 2027 | Mikhail Trapeznikov, Sofia Gulevskaia, Maksim Utushkin, Aleksandr Poslavsky, Alexander D'yakonov

**🗣️ 大白话：** DCN/DCNv2 是工业界特征交叉的标配，但它只会做「乘法」（多项式乘积）。现实里很多关键特征本质是「除法」——比率、转化率、归一化计数，以前都得靠人工把这种特征喂进去。这篇论文给交叉层加了条「除法分支」，让网络自己学出乘、除、混合的交互，把人工设计的比率特征整个删掉了（输入特征少了 40%），线上 A/B 点赞 +3.25%、分享 +16.26%，已在一家短视频大厂的生产排序栈全量部署。

**🔬 专业讲解：** 论文把 DCDN 可表达的交互刻画为多元 Laurent 多项式：K 层网络可生成 ℓ1 阶数最高 K+1、带符号次数介于 -K 到 K+1 的 Laurent 单项式，理论上补齐了 DCNv2 只能表示非负整数次幂的表达力缺口。实验对照的是一个围绕 DCNv2 构建、带人工比率特征的production-optimized 排序基线，替换后省掉整类人工特征工程；线上指标（likes、shares、TVT、fullscreen clicks）全部统计显著。对做特征交叉结构创新的同学，这是把「指数族扩展到负次幂」这条线走通的实证案例，代码已开源。

---

### 2. ERA: Embed, Route, Adapt for Cold-Start Cross-Model Latent Retrieval

📄 [arXiv:2611.26919](https://arxiv.org/abs/2611.26919) | Venkata Chivukula, Zifeng Wang, Jinsung Yoon

**🗣️ 大白话：** 检索系统换 embedding 模型最痛苦：要么全库重新灌一遍向量，要么冷启动阶段没有 query 日志、新 encoder 逐条算向量又贵。ERA 的思路很省钱——只挑一小撮「信息量最大」的文档当锚点（用余弦最远点采样从旧索引里选），训一个轻量 adapter 把新旧模型的表示空间对齐，再配一个路由器：绝大多数 query 直接走 adapter，少数硬 query 才升级到新 encoder。5 个 BEIR 数据集上效果不打折，Arguana 上 nDCG@10 相对提升最高 35%，端到端延迟从约 160ms 降到 38-86ms。

**🔬 专业讲解：** 技术上三个组件协同：① Cosine Farthest Point Sampling 在固定 anchor 预算下最大化锚点覆盖度（对聚类语料尤其有效）；② Manifold Alignment Loss 同时做方向对齐和正交正则，防止表示坍缩到平凡解；③ 确定性路由器把「投影失败最多」的难 query 集中升级，adapter+router 开销仅 1.2ms。对于推荐/检索场景里「换基底模型」这个高频工程痛点，这篇给出了一套可复制的低成本迁移范式，20% 升级预算即可保住感知质量。

---

### 3. Explicit Style Extraction for Personalized Long-Form Text Generation

📄 [arXiv:2611.27211](https://arxiv.org/abs/2611.27211) | Jenitha Reddy Patel 等 20 人（Adobe 团队）

**🗣️ 大白话：** 个性化生成的常规操作是 RAG：把用户几篇旧文塞进 prompt，让模型自己「悟」风格。这篇说：别悟了，把风格提取变成显式步骤。他们定义了 StylePrism——7 大类 28 个风格维度（从修辞顺序到签名习惯），先让模型按这个分类法填一份带引文证据的「用户风格档案」，再照着档案写、照着档案改两轮。LongLaMP 三个长文任务 × 三个 LLM，27 组对比里 25 组赢过 RAG 基线，平均提升 10.2%，最高 35.8%。

**🔬 专业讲解：** 有意思的是消融结论：风格档案当作「修改时的 check-list」有效，单独当写作依据反而全输——说明价值在于推理时的自我批判信号，而非替代样本本身。另外单次隐式推断是更便宜的近似方案，效果接近；oracle 实验也诚实地指出更大的收益需要推理时拿不到的信息，边界划得很清楚。对个性化推荐内容生成、用户模拟（user simulation）这类场景，这套「显式风格画像 + 画像驱动修订」的框架值得直接借鉴。

---

## 📋 其他论文速览

- **Decision Columns as an Index**（arXiv:2611.27910）：用「决策列」构建可解释 embedding，每维是对一个自然语言问题的校准回答，相似度可精确分解到逐问题贡献，实体匹配检索效果追平稠密向量还能给出可审计的解释。
- **Leader Finding: A New Variation of Expert Finding in CQA**（arXiv:2611.26921）：专家找人的新变体——找团队 leader，需要同时平衡技术匹配、管理知识和沟通能力，在 Stack Overflow 两个数据集上 NDCG@10 翻倍。
- **DiTraR**（arXiv:2611.27931）：视频时刻检索，发现主要错误是选错视频而非边界不准；用 witness-interval 精确打分 + 多 scorer 能量集成 + 转录文本 verifier 重排，TVR 验证集 R@1@0.5 达 24.36。
- **Pre-Crawl Prioritization and Seed Classification for Large-Scale Web Archiving**（arXiv:2611.27743）：面向网页归档的爬取优先级，用 URL 词法分析、域名信誉和内容消失概率预测提升覆盖效率（JCDL 2025）。
- **Doppeldwarf-306**（arXiv:2611.27490）：306 座长得几乎一样的青铜小矮人雕像检索基准，冻结 DINOv2 零训练就到 93.1%，位置信息当权重用可拉到 98.7%。
