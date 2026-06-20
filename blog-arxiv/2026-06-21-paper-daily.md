---
title: "【推荐系统 Paper 日报】2026-06-21"
date: 2026-06-21
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2769996550"
---

# 【推荐系统 Paper 日报】2026-06-21

## 📊 今日概览

本期论文来自 arXiv cs.IR 公告（Fri, 19 Jun 2026），共计 **18 篇** 新论文，其中与推荐系统直接相关的 **4 篇**。本期亮点包括：工业级生成式推荐中的用户兴趣建模新框架、大规模推荐模型中异构信号的高效融合、电商视频推荐的冷启动解决方案，以及隐式反馈去噪在冷启动场景下的落地实践。快手十亿级用户规模的真实部署尤为值得关注。

---

## 🔥 推荐系统论文深度解读

### 1. G2Rec: Structuring and Tokenizing Distributed User Interest Context for Generative Recommendation

📄 [arXiv:2606.20554](https://arxiv.org/abs/2606.20554) | 作者：Ruizhong Qiu, Yinglong Xia, Dongqi Fu, Hanqing Zeng, Ren Chen, Xiangjun Fan, Hong Li, Hong Yan, Hanghang Tong

**🗣️ 大白话：**

生成式推荐（Generative Recommendation）是最近很火的方向——不再用传统打分模型预测用户会不会点击某个商品，而是让模型直接"生成"用户的下一个交互。但这里面有个核心难题：如何把用户行为历史和物品语义信息都有效地塞进模型里？

G2Rec 就是来解决这个问题的。它有两个绝活：一是用图的方式捕捉用户之间的共同行为模式（全局信息），二是把物品语义"tokenize"成离散表示（类似大语言模型的词元）。关键是，它能把这两者优雅地结合起来，让模型同时知道"用户 A 和用户 B 喜欢相似的东西"以及"这些东西长什么样/有什么属性"。更厉害的是，它已经在实际产品中上线了，而且不需要人工标注的真实兴趣数据。

**🔬 专业讲解：**

G2Rec 的核心创新在于统一了 holistic graph-based user co-engagement modeling 与 semantic tokenization：

- **图结构建模**：利用用户共同交互的全局图信息，而不是只关注局部邻域（如 GNN 的局限性）或序列化图的方式（如 graph serialization 的 scalability 问题）。
- **语义 tokenization**：通过显式监督信号学习物品的语义 token，克服传统启发式方法（如聚类或离散化）缺乏监督的缺陷。
- **工业级部署**：框架已在实际产品线上部署验证，支持大规模工业级序列推荐。

**💡 一句话总结：** 让生成式推荐模型既看得懂"用户社交图谱"，又理解"物品语义本质"——G2Rec 把两者拧成一股绳，并且已经在产线跑通了。

---

### 2. Token Factory: Efficiently Integrating Diverse Signals into Large Recommendation Models

📄 [arXiv:2606.19635](https://arxiv.org/abs/2606.19635) | 作者：Xilun Chen, Shao-Chuan Wang, Baykal Cakici, Lukasz Heldt, Lichan Hong, Raghu Keshavan, Aniruddh Nath, Li Wei, Xinyang Xi

**🗣️ 大白话：**

大语言模型（LLM）已经证明在推荐领域有潜力，但传统的 ID-based 或 textualized 特征表示在跟 LLM 结合时存在明显短板：直接把特征变成文本会搞出超长的 prompt，导致内存和计算开销爆炸。Token Factory 的思路很聪明：把各种异构信号（用户画像、物品属性、交互历史等）变成"软 token"（soft tokens），而不是文本字符串。这些软 token 可以直接被 Transformer 处理，既保留了信息密度，又避免了 prompt 长度爆炸的问题。

**🔬 专业讲解：**

Token Factory 的核心贡献在于提出了一种将传统推荐信号转换为"soft token"的框架：

- **异构信号压缩**：将用户/物品/上下文等多维度信号统一映射为连续的 soft token 表示，支持高效集成。
- **Prompt 长度控制**：避免了传统"textualization"方法导致的长 prompt 问题，显著降低了计算和内存开销。
- **生产级验证**：在 production-scale 推荐环境中进行了实验验证，证明了在性能和效率上的双重优势。

**💡 一句话总结：** 推荐特征 + LLM = prompt 爆炸？Token Factory 把特征变成软 token，既保留了信息又不让 prompt 长上天。

---

### 3. VCG: A Multimodal Retrieval Framework for E-Commerce Video Feeds under Extreme Cold-Start Conditions

📄 [arXiv:2606.19627](https://arxiv.org/abs/2606.19627) | 作者：Katya Mirylenka, Egor Malykh, Mahdyar Ravanbakhsh, Michael Gygli, Marco-Andrea Buchmann, Andrew Dzhoha, Svitlana Borzenko, Francesca Catino, Mohamed Gaafar, Maarten Versteegh, Thomas Kober, Dario d'Andrea, Ellie Langhans

**🗣️ 大白话：**

电商正在从"搜索商品列表"转向"刷视频流"——就像抖音/TikTok 那样。但新视频刚上传时没有任何历史数据，协同过滤完全失效。VCG 系统通过领域自适应的 CLIP 模型，把用户和视频映射到同一个语义空间，用视频的视觉内容来直接做推荐，而不是依赖行为数据。A/B 测试显示视频完播率提升了 50%。

**🔬 专业讲解：**

VCG 解决的是电商视频推荐中的极端冷启动问题：

- **零样本检索**：基于领域自适应的 CLIP 模型，将用户和视频嵌入到共享语义空间，实现不依赖行为历史的 zero-shot retrieval。
- **偏差缓解**：针对沉浸式视频流中的位置和时长偏差，设计了有效的缓解策略。
- **生成 vs 判别式**：对比实验发现，生成式模型（LLM）在属性预测上表现更好，但判别式模型（CLIP）在检索任务中避免了 embedding space collapse，更适合推荐场景。
- **在线效果**：A/B 测试显示 deep video completion 提升 50%，验证了 multimodal retrieval 在电商视频推荐中的实际价值。

**💡 一句话总结：** 新视频没数据？VCG 直接用视觉内容做推荐，A/B 测试完播率提升 50%，判别式（CLIP）比生成式（LLM）更适合检索场景。

---

### 4. Denoising Implicit Feedback for Cold-start Recommendation

📄 [arXiv:2606.19658](https://arxiv.org/abs/2606.19658) | 作者：Gaode Chen, Shicheng Wang, Shikun Li, Rui Huang, Xinghua Zhang, Yunze Luo, Shipeng Li, Shiming Ge, Ruina Sun, Yinjie Jiang, Jun Zhang

**🗣️ 大白话：**

推荐系统里用的隐式反馈（比如用户点击、停留时长）有很多噪音——用户可能点了标题党但内容不相关，或者因为位置排在前面才点了。冷启动的新物品尤其容易被这些噪音坑，因为缺乏历史数据来清洗。DIF 方法的思路是：用户对"内容类型"的偏好是稳定的，所以可以通过新物品与已有物品的"内容相似度"来推断用户是否真正感兴趣。然后通过不确定性估计来动态调整每个样本的置信度，实现样本级别的去噪。

**🔬 专业讲解：**

DIF（Denoising Implicit Feedback）提出了模型无关的隐式反馈去噪方法：

- **伪标签生成**：基于"用户内容偏好稳定"的假设，通过与冷启动物品内容相似的 warm items 推断用户兴趣的伪标签。
- **置信度建模**：基于冷物品与 warm items 的内容相似度，建模伪标签的置信度，并聚合多个伪标签以提高准确性。
- **不确定性估计**：通过相对熵和物品冷启动状态，显式估计样本标签的不确定性，自适应地引导伪标签修正噪声标签。
- **理论保证与部署**：既有理论证明，又在快手十亿级用户规模的短视频应用上部署，显著提升了冷启动场景的多个商业指标。

**💡 一句话总结：** 冷启动物品的隐式反馈太脏？DIF 用内容相似度生成伪标签 + 不确定性估计实现精准去噪，已在快手十亿用户规模上线验证。

---

## 📋 其他论文速览

- **ELVA**（arXiv:2606.20280）：通过基于规则的强化学习框架解决多模态检索中的"粒度盲区"问题，在标准检索基准和 MRBench 新基准上取得 SOTA，MRBench 提升 13.1%。

- **ScholarQuest**（arXiv:2606.20235）：面向开放文献环境的 Agentic 学术搜索基准，覆盖 1000+ 计算机科学主题，揭示了当前最佳 Agent 召回率仅 0.355 的巨大提升空间。

- **GEO at Scale**（arXiv:2606.20065）：首次大规模测量品牌在不同 AI 搜索引擎（ChatGPT/Claude/Perplexity/Gemini）中的可见度，发现品牌知名度形成三阶梯队，"best-of" 列表是最被引用的内容格式。

- **PACMS**（arXiv:2606.20047）：基于子模函数的上下文选择引擎，为 LLM Agent 解决"上下文窗口溢出时该保留什么"的问题，替代传统的"按时间截断"机制。

- **Stellar**（arXiv:2606.19960）：多模态文档检索框架，通过磁盘存储 token 级嵌入和动态加载候选嵌入，将内存开销和查询延迟降低 1-2 个数量级。

- **Closing Calibration Gap in Semantic Caching**（arXiv:2606.19719）：指出语义缓存中离线 PR-AUC 指标与部署效果的失配，提出 P-CHR AUC 和 CRR 两个缓存感知的评估指标。

- **SAFE-Cascade**（arXiv:2606.19646）：成本自适应的视觉语言路由系统，用于图表问答——先用 OCR+文本模型回答，再决定是否升级到 VLM，减少 26.9% 的 VLM 调用。

- **MonaVec**（arXiv:2606.19458）：面向边缘和离线 AI 的纯 Rust 向量搜索内核，无需训练、支持 4-bit 量化，单文件即可运行，目标成为向量搜索界的 SQLite。

- **Easy Reads**（arXiv:2606.20550）：自动化工具，从 arXiv 获取 TeX 源码并重新排版，支持调整字体大小和列数，让论文更易读。

- **Streaming Tool Use in RAG**（arXiv:2606.20113）：量化分析 Streaming RAG 中工具调用何时能"提前收敛"，在 realistic 操作点下 73.9% 的查询可实现显著延迟隐藏。

- **Multi-Agent Transactive Memory**（arXiv:2606.19911）：多智能体共享轨迹记忆框架，让不同 LLM Agent 之间可以复用彼此的经验轨迹，在 ALFWorld 和 WebArena 中验证有效。

- **Query-aware Routing for Filtered ANN**（arXiv:2606.19898）：基于轻量 ML 模型的查询感知路由框架，在过滤 ANN 搜索中自适应选择最优检索方法，实现 SOTA 的召回-QPS 平衡。

- **Admission-Time Hubness Control**（arXiv:2606.19692）：在向量检索的入库阶段控制 hubness 问题，通过全局门控机制在召回 1.0 的同时仅增加 3.1% 的入库延迟。

- **SLARouter**（arXiv:2606.19376）：在线 LLM 路由算法，从稀疏单侧反馈中学习成本最优策略，提供成本最优性和 SLA 合规性理论保证，运营成本降低最多 2.2 倍。
