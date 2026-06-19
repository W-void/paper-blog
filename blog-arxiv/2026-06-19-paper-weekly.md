---
title: "【推荐系统 Paper 周报】2026-06-19"
date: 2026-06-19
authors: [wangshuli]
tags: [推荐系统, Paper周报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2769646578"
---

# 【推荐系统 Paper 周报】2026 W25（06-15 ~ 06-19）

> 📅 **本周时间**：2026-06-15（周一）~ 2026-06-19（周五）
> 📊 **本周日报**：4 篇（06-15、06-17、06-18、06-19）| 共收录推荐系统相关论文 **24 篇**

---

## 本周概览

本周 arXiv cs.IR 推荐系统论文呈现出一个非常明确的主题聚焦：**生成式推荐（Generative Recommendation）** 正经历从"概念热"到"冷思考"的转折——不再是一味追捧 LLM 的强大能力，而是开始系统性地审视其设计假设、副作用与工程可行性。与此同时，工业落地的论文密度达到近期高点，Meta、Google、eBay、快手等巨头纷纷披露已部署系统的技术细节，标志着推荐系统研究范式正从"离线指标竞赛"加速转向"生产系统验证"。

---

## 一、生成式推荐：从狂热到体检

本周超过三分之一的论文直接聚焦生成式推荐，但核心基调已从"展示新能力"转向"诊断老问题"。

### 1. 语义表示与 Tokenization：从启发式到图驱动

**G2Rec**（Meta & UIUC）提出将分布式用户兴趣上下文的**结构化与 tokenization 合二为一**。[Structuring and Tokenizing Distributed User Interest Context for Generative Recommendation](https://arxiv.org/abs/2606.20554) 的核心洞察是：现有语义 tokenization 依赖启发式规则，而图方法又扩展性差。G2Rec 通过 holistic graph-based user co-engagement modeling 捕获全局用户兴趣原型，同时结合语义 tokenization，无需 ground-truth 兴趣标签即可在工业级场景中实现准确建模，且已在 Meta 产品 surface 上在线部署。这是本周唯一一篇**同时打通学术创新+工业部署**的生成式推荐论文，代表了一条可行的落地路径。

**ChronoID** 从另一个角度切入：语义 ID 完全忽略了时间维度。传统 RQ-VAE 生成的 hierarchical token 序列把用户上周点的和去年点的商品映射到同一表示，这显然不合理。[ChronoID: Infusing Explicit Temporal Signals into Semantic IDs for Generative Recommendation](https://arxiv.org/abs/2606.14260) 将交互时间戳编码为时序嵌入，与 item 语义特征融合后再做 codebook 量化，使同一 item 在不同时间窗口拥有不同的语义 ID。在时序偏移场景下，这种"时态感知"设计显著优于时序无感基线。

> **横向对比**：G2Rec 解决的是"空间结构"问题（用户兴趣如何分布），ChronoID 解决的是"时间结构"问题（用户兴趣如何演化）。两者共同指向一个趋势：生成式推荐的语义 ID 设计正从简单的静态编码，走向**时空动态建模**。

### 2. LLM 的"记忆"与"茧房"：两个被忽视的副作用

两篇论文对 LLM 生成式推荐进行了**批判性分析**，值得所有从业者认真读。

[On the Memorization Behavior of LLMs in Generative Recommendation](https://arxiv.org/abs/2606.17276) 的发现令人警醒：LLM 在推荐任务中的性能优势，**绝大部分来自 one-hop 记忆**——训练数据中 item A 后面跟着 item B，模型就死记这个规律。论文量化了这一行为：LLM 的 one-hop 记忆率显著高于非 LLM 的生成式推荐模型，而相对于基线的增益几乎全部由"可被 one-hop 覆盖的用户"贡献。真正需要预训练知识泛化的用户（训练数据中没有类似行为模式）反而被忽略。作者提出的 IIRG 训练策略显式让 LLM 学习多跳协同关系和语义关系，显著提升了这类"困难用户"的推荐效果。

[Do Generative Recommenders Deepen the Information Cocoon?](https://arxiv.org/abs/2606.17707) 则用 LLM 模拟用户做了闭环实验（RecLoop 框架），发现一个反直觉的结论：生成式推荐在**曝光多样性**上其实优于传统序列方法，但反馈循环会在模型内部的 Semantic ID 空间引发"代码空间结构茧房"（Code-Space Structural Cocoon）——用户看到的东西不算太窄，但模型内部编码已经悄悄趋同。更严重的是，茧房严重程度与 tokenization 策略和模型规模强相关：协同信号 tokenization 比语义 tokenization 茧房效应更强；更大模型反而能保持更好的代码空间多样性。

> **洞察**：这两篇论文共同揭示了一个深层矛盾——LLM 推荐能力的**表里不一**。表面上推荐结果多样，但内部表示可能高度同质化；表面上超越基线，但增益主要来自记忆而非泛化。这提醒我们，评估生成式推荐不能只看离线指标，还需要**内部表示分析**和**长期闭环模拟**。此外，"更大模型茧房更小"这一发现与推荐系统的"大模型化"趋势形成了有趣的呼应。

### 3. 大推荐模型（LRM）的工程化：效率与架构

Google 的 **Token Factory** 瞄准 LRM 落地的核心瓶颈：异构信号（ID、类别、统计特征）如何高效整合进 Transformer。[Token Factory: Efficiently Integrating Diverse Signals into Large Recommendation Models](https://arxiv.org/abs/2606.19635) 将传统信号压缩为 soft token，避免了 prompt 长度爆炸和内存占用过高的问题，已在生产环境中验证。这为 LRM 的工业化提供了关键基础设施。

**HoloRec** 则从架构层面重新思考：[HoloRec: Holistic Encoding and Interleaved Reasoning for Generative Recommendation](https://arxiv.org/abs/2606.15331) 提出"整体编码"构建层次化语义表示，以及"交错推理"将推理步骤内嵌到生成 token 序列中，无需外部 CoT 标注。这是对"生成式推荐 = 简单序列生成"这一惯性思维的突破，在精度和可解释性上均有提升。

---

## 二、序列推荐：多信号融合与架构革新

### 1. 负向行为与多任务架构

[Beyond Positive Signals: Unlocking Implicit Negative Behaviors for Enhanced Sequential User Modeling](https://arxiv.org/abs/2606.15252) 将长期被忽视的隐式负向行为（曝光未点击、短停留）引入序列建模。核心挑战在于负向行为含有噪声（可能是用户错过而非不喜欢），作者通过解耦正负行为编码并设计对比学习目标，在 CTR 预测上取得显著提升。这与本周"去噪与流行度偏差"的研究（见第四节）形成了一条贯穿的主线。

[OneRank: Unified Transformer-Native Ranking Architecture for Multi-Task Recommendation](https://arxiv.org/abs/2606.16838) 则对多任务推荐的经典架构提出挑战。现有范式将 Transformer 视为"任务无关编码器"再各接任务头，这带来信息瓶颈和梯度干扰（seesaw 现象）。OneRank 将多任务预测直接融合进 Transformer 的注意力计算与前馈层，使特征编码与任务学习协同进行，从根源解决了 MTL 的核心耦合问题。

### 2. LLM 作为 Embedding 生成器：弥合语义-协同鸿沟

[Harmonizing Semantic and Collaborative in LLMs: Reasoning-based Embedding Generator for Sequential Recommendation](https://arxiv.org/abs/2606.16703) 针对 LLM 作为 Embedding Generator 的两大 Gap：语义空间与协作信号空间的分布偏移，以及 LLM 忽略交互历史中的协作模式。通过**链式推理 Prompt** 让 LLM 在生成 Embedding 时同时考虑语义特征和协作关系，在长尾场景下表现尤为突出。

与之形成对照的是 [One Sequential Recommendation Model Pretrained from Synthetic Priors Predicts Multiple Datasets](https://arxiv.org/abs/2606.15752)，它走另一条路：借鉴 Prior-data Fitted Networks 思想，用合成先验数据预训练一个通用序列推荐模型，推理时无需在目标域重新训练，直接 in-context 预测，实现跨域零样本推荐能力。

> **趋势判断**：序列推荐领域正在分化出两条技术路线——**LLM 增强**（利用 LLM 的语义能力补充协同信号，更适合工业落地）和**先验预训练**（用合成数据学习跨域通用模式，更具学术前瞻性）。本周的论文恰好分别代表了这两条路线。

---

## 三、工业落地：从"算法创新"到"系统验证"

本周工业论文密度极高，且多篇带有**真实系统验证**，这是最值得关注的趋势信号。

| 系统 | 公司 | 场景 | 核心贡献 | 验证方式 |
|------|------|------|----------|----------|
| **G2Rec** | Meta | 序列推荐 | 图建模+语义 tokenization 统一框架 | 产品 surface 在线部署 |
| **CoRe** | 某大型短视频平台 | 搜索查询改写 | 线上 reward 直通的持续强化微调 | 连续运行 5 个月 |
| **Token Factory** | Google | 大推荐模型 | 异构信号压缩为 soft token | 生产环境验证 |
| **PIANO** | 某音乐平台 | 音乐搜索重排 | 信息聚合节点平衡即时意图与长期偏好 | CTR/CVR 双提升 |
| **OneBar** | 某电商 | 短视频 query 推荐 | 端到端内容锚定生成 | 工业部署 |
| **VCG** | eBay | 电商视频冷启动 | domain-adapted CLIP 零样本召回 | A/B 测试，深度完成率 **+50%** |
| **DIF** | 快手 | 冷启动去噪 | 内容相似 warm item 伪标签 | 十亿级用户场景上线 |
| **TEC** | Timee（日本） | 零工平台曝光控制 | 基于未填补容量的曝光重分配 | RCT，求职成功率 **57.6% → 70.0%** |

[CoRe: A Continuously Reward-Finetuned LLM Query Rewriter](https://arxiv.org/abs/2606.14127) 的设计尤其值得细品：它以部署中的多模态相关性模型打分作为 reward 来源，采用乘法比例形式镜像线上融合代数，消除离线 proxy reward 与线上效果之间的 simulation-production gap。训练采用半在线 Mixed Preference Optimization（MPO），在多百万样本规模下将奖励计算成本控制在可每周重新训练的水平。这种"持续强化微调 + 线上 reward 直通"的范式对工业级推荐/搜索系统的 LLM 应用有较强参考价值。

[Designing Recommendation Exposure and Favorite Lists: A Field Experiment in a Spot-Work Platform](https://arxiv.org/abs/2606.17397) 则是一篇推荐系统与经济学交叉的典范。在日本最大零工平台 Timee 上，论文设计了 Thresholded Eligibility Control（TEC）框架，基于岗位的实际需求和未填补容量重分配曝光，而非单纯最大化预测收藏率。RCT 结果显示求职成功率从 57.6% 提升到 70.0%。这对任何涉及**稀缺资源分配**的推荐场景（招聘、住房、医疗预约等）都有参考价值。

> **共同特征**：这些工作不再满足于离线指标的提升，而是强调**与生产系统的对齐**——reward 设计对齐线上排序器、生成目标对齐下游搜索系统、曝光控制对齐真实社会需求。推荐系统的研究范式正在从"算法竞赛"转向"系统思维"。

---

## 四、值得关注的专项方向

### 去噪与偏差：一个长期被忽视的交互问题

[When Recommendation Denoising Meets Popularity Bias](https://arxiv.org/abs/2606.14046) 的发现很有深度：主流去噪方法依赖的"小 loss = 干净样本"假设在尾部 item 上会失效——真实冷门偏好因 loss 天然偏大而被系统性地当作噪声过滤。论文从理论上分析了这一"流行度依赖 loss 分布"对去噪效果的偏差影响，并提出 popularity-calibrated loss reweighting 来解耦两者的交互。这与快手的 DIF（冷启动去噪）形成呼应：去噪不是简单"删掉噪声"，而是需要理解噪声的结构和来源，以及它与流行度偏差的纠缠关系。

### 联邦图推荐 + LLM 知识蒸馏

[Guiding Federated Graph Recommendation with LLM-encoded knowledge](https://arxiv.org/abs/2606.15277) 用 LLM 编码的语义知识作为全局锚点，对联邦图推荐中各客户端的 Embedding 进行语义对齐，同时通过知识蒸馏将 LLM 的文本语义与图协作信号融合。在隐私保护前提下显著缓解了 Non-IID 分布偏移问题。这是一个将 LLM 知识蒸馏与联邦学习隐私保护结合的新颖方向。

### 情绪感知与音乐推荐

[Mood-Aware Music Recommendation: Integrating User Affective Signals into Ranking Systems](https://arxiv.org/abs/2606.13858) 将用户情绪信号注入排序模型，构建 mood-conditioned ranking 框架。在稀疏交互场景下，情感感知特征可作为有效的 side information 弥补 CF 的稀疏性问题。这一方向在心理健康、冥想、运动等场景有广阔的落地空间。

---

## 本周日报索引

| 日期 | 日报链接 | 论文数（推荐相关） |
|------|----------|-------------------|
| 06-15（周一） | [【推荐系统 Paper 日报】2026-06-15](https://km.sankuai.com/collabpage/2769142838) | 6 篇 |
| 06-17（周三） | [【推荐系统 Paper 日报】2026-06-17](https://km.sankuai.com/collabpage/2769302064) | 11 篇 |
| 06-18（周四） | [【推荐系统 Paper 日报】2026-06-18](https://km.sankuai.com/collabpage/2769823588) | 3 篇 |
| 06-19（周五） | [【推荐系统 Paper 日报】2026-06-19](https://km.sankuai.com/collabpage/2769496737) | 4 篇 |

---

> 📝 *本周报由 AI 自动整理生成，基于 arXiv cs.IR 每日论文日报进行周度总结。*