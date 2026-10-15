---
title: "【推荐系统 Paper 日报】2026-10-15"
date: 2026-10-15
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2791406955"
---

# 【推荐系统 Paper 日报】2026-10-15

## 📊 今日概览

本期为 arXiv cs.IR 2026-10-15（周四）公告批次，今日共上新 2 篇论文，其中推荐系统相关 1 篇。亮点是那篇"打脸"研究：一个静态价值先验就能让稠密检索在工业级电商场景反超生成式检索 + 14B LLM，对做召回选型的同学很有参考价值。另一篇关于 LLM 工具发现（本质也是检索问题）的规模研究也有不少可迁移的洞见。

## 🔥 推荐系统论文深度解读

### 1. Revisiting Generative vs. Dense Retrieval: A Static Value Prior Reverses the Gap

📄 [arXiv:2610.19065](https://arxiv.org/abs/2610.19065) | arXiv cs.IR | Renbo Tu, Yang Liu, Shuying Sun

**🗣️ 大白话：** 最近生成式检索（GR）很火，大家觉得它能取代传统的稠密检索（DR）做电商召回。这篇论文来泼冷水了：GR 看起来"更值钱"，其实主要是靠推热门商品堆出来的。给 DR 加一步简单的静态商品价值重排，价值指标反超 GR，召回率还比 GR 高。更扎心的是，在工业级内部电商数据上，一个 14B 的 SID-LLM 居然打不过一个小它 47 倍的稠密编码器。

**🔬 专业讲解：** 论文在两个 Amazon Toys 数据集上系统对比 GR 与 DR：GR 在"用户覆盖范围内的最优相关商品价值"上领先，但 DR 在 exact-target recall 和整个排序列表的相关价值上更优。归因分析发现，GR 的价值领先主要来自流行度（popularity）偏差——GR 天然偏向生成高价值的热门 item。只需在 DR 上增加一步注入静态 item value prior 的 reranking，即可逆转价值指标的领先，同时保持 recall 高于 GR。作者进一步在工业规模内部电商数据集上用 LLM-judge 评估相关性，验证了结论的普适性：14B 参数的 SID-LLM 生成式检索仍逊色于约 0.3B 的稠密编码器。这篇的核心贡献是纠偏性的实证工作，提醒社区在评测 GR 时必须控制流行度混杂因素，否则会高估生成式检索的业务价值。

---

## 📋 其他论文速览

- **Plan or Retrieve First? A Scale Study of Tool Discovery Architectures**（arXiv:2610.19068）：LLM 工具发现的两种范式对比——先检索再规划（RtP）vs 先规划再检索（PtR）。在 ToolBench 近 4.7 万个 API 上发现清晰的复杂度分界：单工具查询 RtP 更强，多工具查询 PtR 更优，且该交叉现象在不同检索预算、注册表规模和模型家族下均稳定成立；作者还刻画了"stub 幻觉"失败模式的双刃剑效应，并指出可用 RtP 的 top-1 检索分数做零成本的复杂度自适应路由。
