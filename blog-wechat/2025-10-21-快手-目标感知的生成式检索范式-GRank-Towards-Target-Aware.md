---
title: "「快手」目标感知的生成式检索范式｜GRank: Towards Target-Aware"
date: 2025-10-21
tags: [公众号]
---


![](../static/img/wechat/6c5616ec-9ccd-4cbf-acdd-c846fd28bb59-a4fda3.webp)


GRank: Towards Target-Aware and Streamlined Industrial Retrieval with a Generate-Rank Framework 
https://arxiv.org/pdf/2510.15299

最近生成式文章看多了，突然看到【Target-Aware】
这么接地气的文章，倍感亲切。这篇文章虽然不如onerec那样高大上，但方法清晰、目的明确，就是用rank模型提升retrieval模型的效果，增强retrieval模型的target感知能力。

# 1 背景

工业推荐系统通常采用多阶段级联架构（检索→粗排→精排→重排），所以检索的质量决定了后续阶段的性能上限。

现在检索方法的缺点：
1. **Target-Agnostic Retrieval。** 现在这些双塔或者生成式模型，由于没有和候选的交互，限制了它们从嘈杂的行为历史中辨别微妙用户意图的能力。
2. **Structured Indices with Constraints。** 尽管通过结构化索引能一定程度弥补target-agnostic的能力差距，比如：树、图、量化，（尤其现在SID几乎都是标配了），但在检索中实现target-aware还是存在重大挑战。（p.s. 这应该是在说向量化召回的优势。）

作者也对结构化索引的缺陷给出了详细解释：

1. 在方法论层面，结构化索引展现出两个主要约束：首先，它们固有的以item为中心的设计范式在候选项扩展期间排除了个性化用户信号，从而在检索路径与实际用户兴趣之间创建了潜在的不一致。其次，技术实现存在特定的限制——树索引由于离线层次划分而遭受级联错误，图索引受限于静态相似性度量，这些度量不能很好地适应复杂的嵌入空间，量化技术则因其欧几里得几何假设而经历客观上的不对齐。
2. 工程挑战同样具有深远的影响：所有索引类型之间的结构不平衡导致不可预测的tp99延迟，需要大量过度配置计算资源以维持服务可用性。此外，构建和更新索引的复杂且耗时的过程在生产环境中形成了重大瓶颈，这些环境中的用户分布不断演变。

# 2 方法

模型结构如下，很简单，生成器-评估器范式。
![](../static/img/wechat/a7fc0df0-aa04-4a5f-9189-2e0308ffbd70-50c104.webp)

# 3 实验


![](../static/img/wechat/81c68804-e255-4421-abe5-5f9b404eed15-a8758b.webp)

消融实验：

![](../static/img/wechat/13ad765d-c0df-42dd-8ebf-8db81c5fa93a-ed9c2f.webp)

online AB：快手单栏的业务

![](../static/img/wechat/ebabf7c6-e771-4885-9f75-5d76669f8fcc-03b58a.webp)
