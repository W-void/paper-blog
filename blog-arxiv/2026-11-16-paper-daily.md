---
title: "【推荐系统 Paper 日报】2026-11-16"
date: 2026-11-16
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/md/2799350620"
---

# 【推荐系统 Paper 日报】2026-11-16

## 📊 今日概览

本期对应 arXiv cs.IR 2026-11-16（周一）公告，今日共更新 7 篇，其中推荐系统相关 2 篇。亮点相当集中：**RecMem**（NeurIPS 2026）用循环记忆压缩破解生成式推荐的长序列成本难题，**RACE**（WSDM 2027）则让模型压缩"看人下菜碟"——按每条请求的不确定性动态分配算力。两篇都瞄准同一个工业界痛点：生成式/序列推荐怎么又准又省地跑在线上。

## 🔥 推荐系统论文深度解读

### 1. RecMem: Recurrent Memory Compression for Long-Sequence Generative Recommendation

📄 [arXiv:2611.17921](https://arxiv.org/abs/2611.17921) | NeurIPS 2026 | Haoyi Hu, Gaoyang Guo, Yunjia Xi, Wen Chen, Weiwen Liu, Jian Wu, Yuning Jiang, Weinan Zhang（上海交大 & 华为）

**🗣️ 大白话：** 生成式推荐模型吃用户历史越长越准，但历史越长算力越烧钱——总不能每个用户都塞 1200 条行为进去吧？RecMem 的思路是给模型装一个"固定大小的记忆本"：不管你刷了多少年，都把历史压缩进 16 个记忆槽里，模型只看这 16 格 + 216 个 token 的上下文就够了。效果呢？只损失了 HSTU-1200 约 12% 的 Recall@10，却把上下文砍到不足 1/5，还顺便证明了"压缩后的记忆和全量推理的结果偏差有个不随历史长度增长的上界"——数学上给你兜了底。

**🔬 专业讲解：** RecMem 围绕三个设计目标构建：空间不变性（memory state 与历史长度解耦）、语义保真（用推荐损失监督记忆压缩，确保保留的是"对预测有用"的信息）、终身可演化（slot 级 forget-gated 更新支持流式持续写入）。架构上采用分叉式 encoder-decoder：下层共享、上层分治，配合 stream-consistency training 对齐"逐条流式处理"与"整包 packed 处理"两种模式的预测分布；作者在收缩性与近似半群一致性假设下推导出两种处理顺序的状态偏差 horizon-independent bound。实验在 MerRec 上以 16 slots / 216-token decoder context 对比 HSTU-1200 的 1200 token，保留 87.9% Recall@10、97.0% Recall@200，超过 PHSTU 及 recent-only / retrieval 类基线；远距离历史分析证实被归档的旧交互仍贡献预测信号。对工业界做长周期用户建模（如年度级行为序列）而言，这是一条比"无限拉长上下文"更务实的路线。

---

### 2. RACE: Ranking-Uncertainty Aware Capacity-Adaptive Customization for Efficient Sequential Recommendation

📄 [arXiv:2611.18244](https://arxiv.org/abs/2611.18244) | WSDM 2027 Main Conference | Tianqi Liu, Kaipu Sun, Kairui Fu 等（阿里）

**🗣️ 大白话：** 现在的模型压缩（蒸馏、剪枝、截断序列）都是"一刀切"——所有用户的请求用同样大小的模型、同样长的序列。但有的用户意图特别明显（点啥买啥），有的用户行为复杂得像谜语。RACE 的做法是：先给每个请求估一个"模型自己心里有多没底"的分数（ranking 不确定性），心里有底的请求走瘦身版模型 + 短序列，没底的请求才上完整火力。相当于给推荐服务装了"按需分配算力"的调度器，又快又准。

**🔬 专业讲解：** RACE 的核心是把模型预测的分布稳定性转译为实例级复杂度信号：从 top-K 预测的分布稳定性导出 list-wise ranking-uncertainty 度量，作为实例复杂度的可测代理；再用轻量预测器通过自监督从浅层特征提前预测该不确定性（避免先跑完整推理才知道难不难）。拿到信号后做双维度实例级瘦身：① 结构维度——hypernetwork 风格的 channel sensitivity extractor 识别参数冗余，动态裁剪通道；② 数据维度——importance-aware progressive sequence filtering 按重要性渐进过滤序列 token，缓解数据冗余。四个公开数据集上，RACE 在精度、效率和自适应性上全面超越 SOTA 压缩基线。对资源受限的线上部署（边缘设备、高 QPS 场景）非常有借鉴价值，"uncertainty as resource allocator"这个视角也值得迁移到排序粗排/精排的级联预算分配上。

---

## 📋 其他论文速览

- **StreamEmbed: Real-Time Indexing from Pixels for Screenshot Retrieval**（arXiv:2611.18516）：利用屏幕截图像素冗余做增量视觉编码——空间 token 剪枝 + 时序 KV 复用，在 M2 Pro 上比全图编码快 3.7 倍且不掉精度，一年屏幕历史只要 0.13GB 内存，为本地化"视觉记忆检索"铺路。
- **Explanations that Transfer: Interpreting Medical Retrieval with Sparse AutoEncoders**（arXiv:2611.18179）：用稀疏自编码器（SAE）把医疗检索的稠密 embedding 变成可解释的稀疏特征，域内检索更准、域外迁移损失更小，还能解释"为什么召回这篇文档"。
- **MeReader: An Offline, Privacy-Preserving, Progress-Aware AI Assistant for Narrative eBook Reading**（arXiv:2611.18513）：离线、隐私保护的电子书阅读助手，混合检索（向量 + BM25 + 摘要 embedding）严格限定在读者当前进度内，防剧透；2b-4b 本地模型即可达到 5b+ 模型的理解水平。
- **Towards High-Performance Multimodal Discovery**（arXiv:2611.17726）：数字图书馆场景下的多模态检索评测——用页面图像向量（而非 OCR 文本）同时编码文字与图表语义，显著提升含图示内容的发现效果，并验证了向量库配置是规模化落地的关键。
- **Who Counts as Exposed? Measurement Choices in an Open, Re-estimable Index of Occupational AI Exposure**（arXiv:2611.18168）：构建开放可复算的职业 AI 暴露度指数，系统分析"上下文注入"与"校准方式"两大设计选择如何改变 18,796 个职业-任务对的暴露判定，警示政策用途的指数应声明设计选择。
