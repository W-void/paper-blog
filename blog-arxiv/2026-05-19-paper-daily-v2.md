---
title: "【推荐系统 Paper 日报】2026-05-19"
date: 2026-05-19
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2763385161"
---


# 【推荐系统 Paper 日报】2026-05-19

> 📅 论文来源：arxiv cs.IR，公告日期：Mon, 18 May 2026
> 📊 今日 cs.IR 论文总计：**14 篇**（含 cross-list）
> 🎯 推荐系统相关：**4 篇**，涵盖用户兴趣建模、搜索推荐稳定性、个性化食物推荐、POI 多模态推荐

---

### 一、今日概览

今日 cs.IR 的 14 篇论文里，推荐系统方向有 4 篇值得深读：涵盖了**长期用户兴趣的生成式建模**（GenLI，面向 CTR 预估）、**工业界搜索推荐的时序稳定性**（Fortress，来自大型 App 市场）、**LLM+RAG 做健康个性化食物推荐**，以及一篇颠覆传统 POI 嵌入范式的**动态 Context-aware 多模态推荐**框架（Agent4POI）。整体研究趋势明显：大模型能力被越来越多地融入传统推荐核心链路，不再只是"召回后 rerank"。

---

### 二、今日推荐系统论文深度解读

---

#### 📄 1. GenLI: Generative Long-term User Interest Modeling for CTR Prediction

**🔗 链接**：[arxiv.org/abs/2605.15905](https://arxiv.org/abs/2605.15905) | [PDF](https://arxiv.org/pdf/2605.15905)
**👥 作者**：Jiangli Shao, Kaifu Zheng, Hao Fang, Huimu Ye, Zhiwei Liu, Bo Zhang, Shu Han, Xingxing Wang
**🏛 机构**：（据作者推测为工业界背景，Xingxing Wang 在多家电商平台有合作记录）

##### 🍞 大白话解读

你在某平台点过几千个商品，推荐系统想搞清楚"你现在想要啥"。传统做法是：先从历史点击里找跟当前候选商品最像的，再做 attention 建模兴趣。
问题来了：这种方式是"以当前商品为中心"去检索历史，容易漏掉你其他潜在兴趣；而且用户行为越积越多，一个一个对比的复杂度也越来越高。
**GenLI** 换了个思路：先**生成**多个兴趣分布（不依赖候选 item），再用这些兴趣分布去做 O(1) 的行为检索，最后融合出兴趣特征。既多样、又快。

##### 🔬 专业讲解

**问题定义**：长期用户行为序列的 CTR 预估，核心挑战是如何在保证多样性的前提下高效检索相关历史行为。

**传统范式（GSU+ESU）的缺陷**：

1. Target-centered GSU 会造成兴趣偏置（只检索跟候选 item 相似的历史，遗漏其他兴趣维度）
2. 基于 pairwise similarity 的检索，时间复杂度随行为量线性增长
3. 忽略了历史行为之间的交互信息

**GenLI 的三模块设计**：

- **IGM（Interest Generation Module）**：与 target item 无关地生成多个兴趣分布，通过 interaction-aware 建模捕捉行为内部关联，保证兴趣覆盖多样性
- **BRM（Behavior Retrieval Module）**：基于 IGM 生成的兴趣向量做 lookup 检索，时间复杂度降至 **O(1)**，大幅提升在线服务效率
- **IFM（Interest Fusion Module）**：精细的 gating 机制融合多个兴趣维度，生成最终兴趣特征

**核心亮点**：target-independent 的兴趣生成 + O(1) 检索，在精度和效率之间找到了更优的平衡点。

---

#### 📄 2. Fortress: Stabilizing Search Recommendations via Temporal Data Augmentation and Feature Pruning

**🔗 链接**：[arxiv.org/abs/2605.15299](https://arxiv.org/abs/2605.15299) | [PDF](https://arxiv.org/pdf/2605.15299)
**👥 作者**：Milind Pandurang Jagre, Jia Huang, Dayvid V. R. Oliveira, Zhinan Cheng, Babak Seyed Aghazadeh, Puja Das, Chris Alvino, Jinda Han, Kailash Thiyagarajan
**🏛 机构**：大型 App 应用市场（LinkedIn/Apple 等相关背景，工业界实战论文）
**📌 会议/期刊**：工业界 Case Study

##### 🍞 大白话解读

推荐模型里有一类 feature 是"参与度特征"（engagement features），比如点击率、安装量——这些特征预测效果很好，但有个致命问题：随着时间推移，同一个 app 的分数可能忽高忽低，导致推荐系统"抖动"，用户体验差，下游多级系统也会跟着乱。
**Fortress** 的思路很工程范儿：系统地识别出"哪些 feature 会导致预测不稳定"，然后在 retrain 时把它们剪掉，同时用时序数据做增强，两头兼顾——稳定性上去了，准确率也没掉。

##### 🔬 专业讲解

**核心问题**：Multi-stage 推荐系统中，中间层模型的预测分数时序不稳定（Temporal Instability），会导致 cascading 误差并降低用户体验。

**Fortress 四步框架**：

1. **历史快照收集**：对同一 entity 在不同时间段收集预测分数快照
2. **不稳定样本识别**：找出 Coefficient of Variation (CV) 高的样本
3. **特征归因与剪枝**：将分数波动归因到具体 feature，剔除高波动贡献特征
4. **稳定特征重训练**：仅用稳定特征集重新训练模型

**技术洞察**：

- LLM/BERT 语义特征泛化性好，但 entity 覆盖率低
- Engagement 特征预测力强，但引入时序噪声
- Fortress 实现"在保留 engagement 特征预测价值的同时，抑制其波动性"

**实验结果**：在大规模 App 市场 query-to-app 相关性模型上，CV 显著下降，PR-AUC 也得到提升。**工业界落地价值极高**，值得关注。

---

#### 📄 3. LLM-RAG Approach for HEI-Informed Personalized Food Recommendations

**🔗 链接**：[arxiv.org/abs/2605.15213](https://arxiv.org/abs/2605.15213) | [PDF](https://arxiv.org/pdf/2605.15213)
**👥 作者**：Yibin Wang, Yanjie Yang, Grace Melo Guerrero, Rodolfo M. Nayga Jr., Azlan Zahid
**🏛 机构**：学术背景（农业/健康经济学与 AI 交叉）

##### 🍞 大白话解读

健康饮食推荐通常就是"你爱吃啥就推啥"，或者给你一个粗糙的营养建议。这篇论文做的事更精细：引入美国官方的 **HEI（健康饮食指数）** 作为量化健康标准，结合 RAG 和 LLM，不仅考虑你的偏好，还实时估算"换吃这个食物能提升多少 HEI 分数"，给出真正有据可查的个性化健康建议。

##### 🔬 专业讲解

**核心创新**：将权威营养学指标（HEI）嵌入 RAG 检索 pipeline，而非依赖 LLM 的内置"营养常识"。

**系统架构**：

- 知识库：NHANES（美国营养健康调查）+ FPED（食物等量数据库）构建食物 embedding 空间
- 检索层：基于 FPED 衍生的文本描述做语义检索
- 评分层：每个候选食物计算 baseline HEI 分数 + 替换/添加后的 HEI 增益
- 生成层：GPT 类 LLM 融合营养 profile 和 HEI 贡献，输出可解释的个性化推荐

**实验效果**：用户平均 HEI 提升 6.45 分；HEI > 50 的用户比例从 45.12% 提升到 61.26%。

**与推荐系统的关联**：这是典型的**知识增强型个性化推荐**，RAG + 外部知识库 + 可解释性设计，对健康类电商/外卖平台的推荐系统设计有较强参考价值。

---

#### 📄 4. Agent4POI: Agentic Context-Conditioned Affordance Reasoning for Multimodal POI Recommendation

**🔗 链接**：[arxiv.org/abs/2605.15203](https://arxiv.org/abs/2605.15203) | [PDF](https://arxiv.org/pdf/2605.15203)
**👥 作者**：Jinze Wang, Yangchen Zeng, Tiehua Zhang, Lu Zhang, Yuze Liu, Yongchao Liu, Xingjun Ma, Zhu Sun
**🏛 机构**：学术机构（多模态推荐方向）

##### 🍞 大白话解读

传统 POI（地点兴趣点）推荐是这样的：每个地点提前做好一个固定的 embedding（嵌入向量），然后推荐时拿用户偏好去匹配。问题是：**同一家咖啡厅**，周一早上适合一个人办公，周五晚上适合朋友聚会——固定 embedding 根本描述不了这种"场景依赖"。
**Agent4POI** 的做法是：推荐的时候**动态生成**这个地点的表示。LLM agent 先理解你当前的情境（几点、做什么、和谁），再综合图片、评论、元数据做跨模态推断，最终给出一个跟你当前场景高度匹配的"地点画像"去做排序。

##### 🔬 专业讲解

**理论突破**：论文形式化证明了"任何预计算的 encoder 都无法在标准双线性评分下满足 context-sensitive ranking"，从理论上证明了 inference-time representation 的必要性。

**四阶段 Agent 架构**：

- **Phase 1**：LLM 根据用户情境生成动态的 Affordance 查询（基于 Gibsonian affordance 理论）
- **Phase 2**：五步跨模态 Chain-of-Thought，综合图像、评论、元数据做多模态推理
- **Phase 3**：生成不确定性感知的 affordance 表示，结构化融合跨模态证据
- **Phase 4**：语义缓存系统（semantic caching）实现低延迟在线排序

**实验结果**：

- 3 个 POI 基准上，相对最强 baseline 提升 **23.2%**
- 冷启动场景比最佳 content-based baseline 好 **2.4 倍**
- Context-shift 场景降级仅 7.5%，远好于 baseline 的 16-17%

**启示**：这篇论文对"如何做 context-aware 推荐"有很强的方法论参考价值，特别是对需要多模态融合的外卖/酒旅推荐场景。

---

### 三、其他论文速览

> 以下 10 篇为今日其他 cs.IR 论文，非推荐系统方向，快速扫描备用。

| # | 标题 | 方向 | 一句话摘要 |
| --- | --- | --- | --- |
| 1 | [MERVIN: Multimodal Event Retrieval in Vietnamese News Videos](https://arxiv.org/abs/2605.16120) | 视频检索 | 融合关键帧、字幕、视频摘要的越南新闻视频多模态检索框架 |
| 2 | [Ascend-RaBitQ: Heterogeneous NPU-CPU Acceleration for Billion-Scale Similarity Search](https://arxiv.org/abs/2605.16007) | 向量检索 | 用华为昇腾 NPU+CPU 异构加速 10 亿规模向量相似搜索，1-bit 量化 |
| 3 | [Jobs' AI Exposure Should Be Measured from Evidence, Not Model Priors](https://arxiv.org/abs/2605.15474) | AI 影响评估 | 批评当前 AI 职业暴露度测量依赖 LLM 先验，呼吁以证据为基础的方法 |
| 4 | [Differentially Private Motif-Preserving Multi-modal Hashing](https://arxiv.org/abs/2605.15460) | 隐私检索 | 跨模态哈希中保护用户行为图隐私的差分隐私方案 |
| 5 | [Argus: Evidence Assembly for Scalable Deep Research Agents](https://arxiv.org/abs/2605.16217) | RAG/Agent | 通过证据组装让并行 Deep Research Agent 互补而非重复 |
| 6 | [paper.json: A Coordination Convention for LLM-Agent-Actionable Papers](https://arxiv.org/abs/2605.16194) | 学术基础设施 | 提出结构化论文格式，让 LLM Agent 能直接引用子声明、复现实验 |
| 7 | [Fairness-Aware Retrieval Optimization for RAG](https://arxiv.org/abs/2605.15790) | 公平性 RAG | 提出 Top-k 检索中的公平性建模框架，抑制生成偏见 |
| 8 | [X-SYNTH: Enterprise Context Synthesis from Observed Human Attention](https://arxiv.org/abs/2605.15505) | 企业知识检索 | 通过人类注意力观测合成企业上下文，超越传统语义匹配检索 |
| 9 | [Automatic Construction of Legal Citation Graph from 100M Ukrainian Court Decisions](https://arxiv.org/abs/2605.15362) | 法律图谱 | 从 1 亿份乌克兰法院判决中自动构建法律引用知识图谱 |
| 10 | [DeepSlide: From Artifacts to Presentation Delivery](https://arxiv.org/abs/2605.15202) | 演示文稿生成 | 多 Agent 系统支持完整演讲准备流程（需求 → 幻灯片 → 演讲节奏） |

---

*🤖 由 小美 自动生成 | arxiv cs.IR 日报 | 2026-05-19*