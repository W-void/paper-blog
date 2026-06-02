---
title: "【推荐系统 Paper 日报】2026-06-02"
date: 2026-06-02
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2766147717"
---


# 【推荐系统 Paper 日报】2026-06-02


## 📊 今日概览

arXiv cs.IR 于 **2026-06-02（周二）** 更新，共发布 **32 篇**新论文，其中推荐系统及相关检索方向共 **20 篇**。今日亮点：工业级大规模推荐系统落地实践扎堆出现（Pinterest UniPinRec、广告 CTR Semantic ID），多行为推荐、跨域推荐、生成式推荐三条主线齐发力，另有一篇综述梳理 LLM 时代可信推荐的机遇与挑战，值得精读。

---

## 🔥 推荐系统论文深度解读

### 1. UniPinRec：Pinterest 把检索和排序合并成一个模型了

📄 [arXiv:2606.00422](https://arxiv.org/abs/2606.00422) | 工业实践 | Pinterest 团队

**🗣️ 大白话：** Pinterest 把原本分开训练的「召回模型」和「排序模型」合并成一个统一模型，共享同一套用户行为 Transformer，把参数量、计算成本和维护复杂度都砍了一大截，线上效果还提升了。

**🔬 专业讲解：** 现代推荐系统的召回（retrieval）和排序（ranking）通常用独立模型，但随着两者都依赖大型 Transformer 编码同一份用户行为序列，这种分离导致参数重复、服务复杂度高。UniPinRec 实现了「全栈统一」：单一模型输入格式、统一训练流程、统一 serving 栈，通过一次前向传播同时完成召回打分和排序打分。论文在 Pinterest 生产环境验证了该方案的可行性，对工业界有较强参考价值。

---

### 2. 广告 CTR 的新玩法：用有机内容的 Semantic ID 做跨域用户表示

📄 [arXiv:2606.01396](https://arxiv.org/abs/2606.01396) | 工业实践 | 广告排序团队

**🗣️ 大白话：** 用户刷 feed（有机内容）比点广告频繁多了，这篇论文把 feed 行为量化成「语义 ID」，迁移到广告 CTR 预估里，AUC 最高提升 +0.13%——别小看这个数字，广告场景里这个提升很显著。

**🔬 专业讲解：** 广告 CTR 预估的核心瓶颈之一是稀疏用户监督信号。本文提出跨域用户 Semantic IDs（SIDs），从有机 feed 活动中提炼用户意图的离散表示，并将其迁移至广告排序。实验结论：① 活动丰富度决定跨域迁移质量；② 基于用户画像文本的 SID 带来 +0.036% AUC，基于 LLaMA 用户嵌入的 SID 带来 +0.13% AUC；③ 框架兼顾延迟约束和生产复杂度。

---

### 3. 跨域推荐不再依赖共同用户：SPHERE 语义 Persona 方案

📄 [arXiv:2606.01783](https://arxiv.org/abs/2606.01783) | 跨域推荐

**🗣️ 大白话：** 现有跨域推荐大多要求「两个平台有共同用户」，但实际上很多平台之间根本没有用户重叠。SPHERE 用语义 Persona（用户画像摘要）作为迁移桥梁，彻底绕开了这个限制。

**🔬 专业讲解：** 大多数跨域推荐方法依赖共享用户、共享物品或结构相似的交互图——这些假设在独立平台间往往不成立。SPHERE（Semantic PErsona HiERarchical cross-domain recommendation）通过构建语义层面的用户画像（Persona）来表征偏好，不依赖 ID 级别的用户重叠，从而实现跨独立平台的知识迁移，开辟了跨域推荐的新范式。

---

### 4. LLMs Need Encoders for Semantic IDs Too：Semantic ID 也需要专属编码器

📄 [arXiv:2606.00324](https://arxiv.org/abs/2606.00324) | 生成式推荐 | Semantic ID

**🗣️ 大白话：** 多模态 LLM 给图像配了视觉编码器，给音频配了音频编码器——生成式推荐的 Semantic ID 也应该有自己的专属编码器，而不是直接把 SID token 塞进词表靠训练学。

**🔬 专业讲解：** SID（Semantic ID）是层次化的离散 token 序列，其语义依赖前缀上下文（即位置相关的含义）。当前做法直接将 SID token 加入词表，依赖训练学习其结构——类比多模态 LLM 没有视觉编码器直接输入像素 token。本文论证了这种做法的不足，并提出应为 SID 设计专属编码器来捕捉层次化语义结构，与多模态设计哲学保持一致。

---

### 5. 多行为推荐的频域降噪：Dynamic Spectral Denoising

📄 [arXiv:2606.02417](https://arxiv.org/abs/2606.02417) | 多行为推荐 | Miaomiao Cai, Yunshan Ma et al.

**🗣️ 大白话：** 用户的「浏览、收藏、加购、购买」等多种行为对推荐都有用，但各种行为之间互相干扰、带噪声。这篇论文在频域做动态去噪，把真实偏好信号从噪声里分离出来。

**🔬 专业讲解：** 多行为推荐面临两类耦合异质性问题：① 行为内表示纠缠（多跳传播把偶发信号和真实偏好混在嵌入空间里）；② 行为间信号强度不均（辅助行为的噪声程度因用户和场景而异）。本文提出频域动态谱去噪，结合全局上下文注意力，在谱域对不同行为的表示进行自适应滤波，有效分离偏好信号与噪声。

---

### 6. 时序感知的生成式推荐：时间偏好解耦扩散模型

📄 [arXiv:2606.01670](https://arxiv.org/abs/2606.01670) | 生成式推荐 | 扩散模型

**🗣️ 大白话：** 现有扩散式生成推荐对历史交互一视同仁——但用户昨天喜欢的和三年前喜欢的影响力不一样。这篇论文给扩散过程加入时间感知和偏好解耦，让模型懂得「新近的行为更重要」。

**🔬 专业讲解：** 生成式推荐（Generative Recommenders）以语义索引（SIDs）替代传统 item ID，用扩散模型作为 backbone 的方案正在兴起。现有方案对历史交互序列中所有 item 均匀扩散，忽视了时序偏好的动态性。本文提出 Time-Aware Diffusion（基于偏好解耦），将用户偏好按时间维度解耦，赋予近期行为更高的扩散引导权重，提升时序建模精度。

---

### 7. LLM 时代的可信推荐：综述与展望

📄 [arXiv:2606.00540](https://arxiv.org/abs/2606.00540) | 综述 | LLM + 推荐系统

**🗣️ 大白话：** 推荐系统正在经历双重范式转变：目标从「准确率」扩展到「可信赖性」（鲁棒性、公平性、隐私保护）；技术上 LLM 正在重塑推荐基础。这篇综述梳理了这一交叉领域的机遇与挑战。

**🔬 专业讲解：** 本文从两个维度审视推荐系统现状：① **目标维度**：从单纯推荐准确率转向综合可信赖性，涵盖鲁棒性、公平性和隐私保护；② **技术维度**：LLM 通过更丰富的语义理解和推理能力重塑推荐系统基础。论文系统梳理了 LLM-RS 交叉领域的研究方向、现存挑战和未来机会，适合作为该领域的入门综述。

---

### 8. 解耦残差量化：推荐 Semantic ID 的鲁棒 Tokenizer

📄 [arXiv:2606.01844](https://arxiv.org/abs/2606.01844) | Semantic ID | 推荐系统

**🗣️ 大白话：** Semantic ID 的量化 tokenizer 经常出问题（码本利用率低、决策边界不稳定、嵌入空间几何扭曲）——这篇论文给出了一个量化诊断框架，并提出解耦残差量化来修复这些问题。

**🔬 专业讲解：** Semantic IDs 将 item 表示为共享的离散 token 序列，但 tokenizer 的失效难以追踪根因。本文提出通过**期望码字重叠**和**有效码本容量**两个指标定量诊断量化失效，并提出 Decoupled Residual Quantization（DRQ）方案：解耦码本更新路径，稳定决策边界，减少嵌入空间的几何扭曲，显著提升 Semantic ID 质量。

---

### 9. 跨域合成数据增强大规模推荐：SCALR

📄 [arXiv:2606.00282](https://arxiv.org/abs/2606.00282) | 数据增强 | 大规模推荐

**🗣️ 大白话：** 大规模推荐系统面临数据稀疏和隐式反馈噪声问题。受 LLM 合成数据成功的启发，SCALR 用跨域事件生成合成用户-物品交互数据，给推荐模型「喂」更多高质量训练样本。

**🔬 专业讲解：** 传统方法通过模型级知识蒸馏缓解跨域数据稀疏，本文另辟蹊径：引入 SCALR（Synthetic Cross-domain Augmentation and Learning for Recommendation），在数据层面用跨域事件合成高质量的用户-物品交互，从根本上扩充稀疏域的训练数据量，为大规模推荐系统提供了一种新的数据增强范式。

---

### 10. 多模态音乐推荐：用 LLM 联合建模语义、声学和参与度信号

📄 [arXiv:2606.00125](https://arxiv.org/abs/2606.00125) | 多模态推荐 | 音乐推荐

**🗣️ 大白话：** 传统音乐推荐只看「谁听了什么」，忽略了歌曲本身的语义和音色内容。这篇论文提出同时融合语义、声学和参与度三种信号的 LLM 框架，做 session-based 音乐推荐。

**🔬 专业讲解：** 现有方法通常只部分结合语义、声学或参与度信号中的一种。本文提出统一的多模态框架，在基于 LLM 的序列推理中联合建模三类信号，将推荐的依据真正「扎根于」歌曲的实际内容。这种 content-grounded 的设计思路对冷启动问题也有天然优势。

---

## 📋 其他相关论文速览

- **Rank-Constrained Deep Matrix Completion for Group Recommendation**（[arXiv:2606.01948](https://arxiv.org/abs/2606.01948)）：提出 Group RC-DMC，针对高维稀疏评分数据的群体推荐方法，整合群体偏好的秩约束矩阵补全。

- **Whole-Pool Setwise Reranking with Long-Context LLMs**（[arXiv:2606.01782](https://arxiv.org/abs/2606.01782)）：利用长上下文 LLM 一次性看完所有候选段落做重排，提出 DualEnd 策略同时识别最相关和最不相关段落，减少多次重复调用开销。

- **Test-Time Training for Zero-Resource Dense Retrieval Reranking**（[arXiv:2606.01070](https://arxiv.org/abs/2606.01070)）：测试时训练（TTT）用于零资源稠密检索重排，无需领域标注数据即可自适应。

- **SentimentLens: Reconciling Sentiment and Ratings via Dual-Modality**（[arXiv:2606.00084](https://arxiv.org/abs/2606.00084)）：酒店领域情感与评分双模态协调，解决情感标签与星级评分不一致问题。

- **Self-Conditioned Positional HNSW for Overlap-Aware Retrieval in RAG**（[arXiv:2606.01542](https://arxiv.org/abs/2606.01542)）：针对分块文档 RAG 系统的重叠感知检索，改进 HNSW 索引的位置感知能力，工业级质量审计验证有效。

- **Differentially Private Datastore Generation for Retrieval-Augmented Inference**（[arXiv:2606.01413](https://arxiv.org/abs/2606.01413)）：差分隐私保护的 RAG 数据存储生成方案，兼顾检索质量与隐私安全。

- **DiscourseFlip: Opinion Manipulation Attack against Black-box RAG**（[arXiv:2606.01212](https://arxiv.org/abs/2606.01212)）：针对黑盒 RAG 系统的话语级观点操控攻击，揭示 RAG 系统面临的对抗鲁棒性风险。

---

*日报由 OpenClaw 自动生成 | 数据来源：[arXiv cs.IR](https://arxiv.org/list/cs.IR/recent)*