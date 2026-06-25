---
title: "【推荐系统 Paper 日报】2026-06-25"
date: 2026-06-25
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2770985550"
---

# 【推荐系统 Paper 日报】2026-06-25

## 📊 今日概览

arXiv cs.IR 今日公告 **20 篇**论文（公告日期：Thu, 25 Jun 2026），其中**3 篇**与推荐系统高度相关，占比 15%。本期亮点集中在「生成式推荐」与「用户表征」两大方向，均来自工业界大厂的落地实践，值得关注。

---

## 🔥 推荐系统论文深度解读

### 1. Recommendation as Generation: Unifying Personalized Video Generation and Recommendation at Industrial Scale

📄 [arXiv:2606.25496](https://arxiv.org/abs/2606.25496) | 作者：Yanhua Cheng, Bo Wang, Haotian Zhang, Xinyuan Gao, Zhihui Yin, Ben Xue, Yongzhi Li, Jieting Xue, Ye Ma, Minquan Wang, Jiahui Li, Tianyu Xu, Zhiqiang Liu, Xiao Lin, Shiyang Wen, Changcheng Li, Liu Liu, Quan Chen, Peng Jiang, Kun Gai

**🗣️ 大白话：**

传统短视频推荐是在「已有的视频池里挑合适的给用户看」，但这套玩法有个天花板：视频库是固定的，再牛的推荐算法也只能在现有内容里做匹配。如果用户兴趣非常细、非常动态，库里的视频可能根本不够 match。这篇论文干脆提出一个更激进的思路：**别挑了，直接给每个用户「生成」专属视频**。

他们把这个新范式叫 **Recommendation-as-Generation（RaG）**，核心就是一套共享的语义 ID（SID）体系，把视频拆解成「内容语义」和「创意风格语义」两部分。系统先推断用户兴趣，然后让 Video Generation Agent（VGA）根据这些语义 ID 去生成视频——包括画面构图、音频对齐、艺术效果等全链路。更狠的是，他们还搞了一个跨域协同奖励学习机制，让「兴趣对齐」「用户反馈」「视频质量」三者同时优化。最后这套东西已经**在 4 亿+ DAU 的平台上跑起来了**，在线 A/B 测试相比强 baseline 广告收入提升 1.87%。

**🔬 专业讲解：**

RaG 的核心架构围绕三个层次：
1. **共享语义 ID（SID）**：将视频表示解耦为内容语义和创意风格语义，既支持用户兴趣的细粒度建模，又支持可控生成。
2. **Video Generation Agents（VGA）**：以推断出的 SID 为条件，驱动分层规划与细化，覆盖视觉构图、音频对齐和艺术效果增强。
3. **协同跨域奖励学习**：联合约束兴趣对齐、用户反馈和视频质量评估，实现生成与推荐的闭环优化。

实验在**工业级规模**（4 亿+ DAU）的平台上验证，且是在收入关键的广告场景下进行在线 A/B 测试。结果相比生产环境的强 GRM baseline，**广告收入提升最高达 1.87%**，证明了生成式推荐在规模化商业场景中的额外价值。论文的启示在于：推荐系统的下一步可能不是更好地匹配现有内容，而是直接生成匹配内容。

---

### 2. S2-CAR: Segmentation-Supervised Complexity-Adaptive Recommendation

📄 [arXiv:2606.25415](https://arxiv.org/abs/2606.25415) | 作者：Linjiang Guo, Nitin Bisht, Shiqing Wu, Xianzhi Wang, Guandong Xu

**🗣️ 大白话：**

做序列推荐的时候，常见做法是把用户的历史行为序列一股脑丢进模型。但问题是，用户的行为序列里往往混杂了多种意图：上午在看科技视频，下午刷到美食，晚上又在看游戏直播。这些兴趣变化可能很隐蔽，没有明显的「边界」。现有的模型要么把整条序列当成一个整体来理解，要么用固定的时间窗口硬切，结果切不准，导致不同意图之间相互干扰，模型过度依赖最近的行为信号。

这篇论文提出的 S2-CAR 解决的就是这个「怎么切」的问题。它把用户意图建模成一种**连续的 latent energy state**，然后用一个 Context-Aware Soft Temporal Point Process（Soft-TPP）来发现意图边界——不是按固定时间间隔切，而是根据 latent energy 的自然衰减来触发分段。切好之后，再用一个 Segment-Count-Adaptive 的多意图提取模块，把语义相近的片段聚合成 compact 的多兴趣表示。在 3 个公开数据集（电影、电商、游戏）上对比 13 个 baseline，S2-CAR 全面 SOTA，而且这个能量分段模块还能**即插即用**到现有的序列推荐 backbone 上。

**🔬 专业讲解：**

S2-CAR 包含两个核心组件：
1. **Context-Aware Soft-TPP**：将用户意图建模为连续隐态能量，通过能量自然衰减触发分段边界，无需预设时间间隔规则。这避免了传统固定窗口切分的 rigid 问题，更贴合真实意图的隐式转移。
2. **Segment-Count-Adaptive Multi-Intent Extraction**：在 Soft-TPP 分段基础上，层次化聚合意图一致的片段，生成紧凑的多兴趣表示，避免跨意图干扰和短视行为。

实验覆盖了电影（MovieLens）、电商（Amazon）、游戏（Steam）三个领域的代表性数据集，对比 13 个 SOTA baseline，在所有数据集和指标上均取得一致提升。消融实验进一步验证了 energy-based segmentation 作为即插即用模块的有效性，集成到现有 backbone 后仍有显著提升。

---

### 3. TokenMinds: Pretrained User Tokens and Embeddings for User Understanding in Large Recommender Systems

📄 [arXiv:2606.25147](https://arxiv.org/abs/2606.25147) | 作者：Qingyun Liu, Bo Yan, Yang Liu, Yuji Roh, Ekansh Sharma, Likang Yin, Emma Olowo, Min-hsuan Tsai, Yuxuan Li, Diego Uribe, Saksham Aggarwal, Siqi Wu, Yuan Hao, Vikas Kedigehalli, Lukasz Heldt, Lichan Hong, Li Wei, Xinyang Yi

**🗣️ 大白话：**

工业推荐系统的用户建模通常输出稠密向量（embedding），但固定维度的向量天生有表达力瓶颈。最近有人尝试用 LLM 生成文本化的「用户 token」，但这种方式只能捕捉话题共现，学不到深层的行为序列模式，而且生成的文本很难跟 item 属性对齐。

TokenMinds 的出发点是：**既然 Semantic ID（SID）对 item 表征很有效，为什么不把这套思路搬到用户侧？** 他们把 PLUM 框架从 item 检索扩展到用户建模，用预训练 LLM 改造出的 encoder-decoder 架构，同时输出两类东西：
- **离散的 SID-based user tokens**（语义化的、可解释的）
- **传统的稠密 user embeddings**（兼容下游既有模型）

这种双输出设计的好处是「既要又要」：离散 token 提供语义可解释性，稠密向量保持对现有系统的兼容。更妙的是，共享的 SID 词汇表天然支持跨场景迁移——他们把长视频和短视频的用户行为统一到一个模型里，大幅降低了训练和服务成本。论文已经在 YouTube 多个场景上全量上线，服务**数十亿用户**。

**🔬 专业讲解：**

TokenMinds 的技术核心：
1. **扩展 PLUM 至用户建模**：将原本用于 item 检索的 SID 生成框架扩展为用户理解，通过 encoder-decoder 架构同时生成离散 user tokens 和稠密 user embeddings。
2. **双输出设计**：离散 token 提供语义 grounding（与 item 属性共享词汇空间），稠密 embedding 保证与现有下游 ranking 模型的无缝兼容。
3. **跨场景统一**：通过共享 SID 词汇表，将长视频和短视频等多场景行为统一建模，减少训练和服务成本。

实验包含大量离线评估和 YouTube 多个场景的在线全量实验，结果表明 SID-based user tokens 在工业规模下完全可行，且 tokens 与 embeddings 在不同生产 ranking 系统中提供了互补价值。该系统的异步基础设施将表征生成与下游打分解耦，支撑了全量数十亿用户的服务。

---

## 📋 其他论文速览

- **AutoRelAnnotator**（arXiv:2606.25871）：在搜索广告中通过校准模型级联实现成本可控的相关性标注，离线处理 1.5 亿+ 标注，兼顾准确率与算力成本。
- **How Large Language Models Source Brand Reputation**（arXiv:2606.25787）：分析 LLM 回答品牌问题时引用的来源，发现 85.7% 指向第三方网站，Wikipedia 在 11/12 种语言中 dominate。
- **A Stochastic Epidemiological Model of Latent Tuberculosis in a Radiation Exposed Mars Colony**（arXiv:2606.25728）：火星殖民地中潜伏结核的随机流行病模型，将宇宙辐射与免疫抑制联系起来，与推荐系统无关但标题足够科幻。
- **TheoremGraph**（arXiv:2606.25363）：构建跨越形式/非形式数学的定理级依赖图，含 1180 万定理环境和 1830 万候选依赖。
- **Adaptive Re-Ranking**（arXiv:2606.25249）：基于效用函数的成本感知查询路由，在检索-重排序管道中根据查询复杂度自适应选择重排序模型，延迟降低 1.15-53 倍。
- **Extreme Meta-Classification for Large-Scale Zero-Shot Retrieval**（arXiv:2606.25237）：EMMETT/IRENE 框架为 zero-shot item 实时合成分类器，Recall@10 提升 15%，在大型搜索引擎广告检索中 CTR 提升 4.2%。
- **Tracing Target Answers in Poisoned Retrieval Corpora**（arXiv:2606.25721）：通过 token 影响归因追踪 RAG 中毒攻击中的目标答案，无需额外分类器或 LLM 验证。
- **BitNet Text Embeddings**（arXiv:2606.25674）：BITEMBED 将 LLM  backbone 转换为三值权重的 BitNet 风格嵌入编码器，支持多精度输出嵌入。
- **Is GraphRAG Needed?**（arXiv:2606.25656）：系统对比 9 种标准化 RAG 场景，提出上下文工程方法使 GraphRAG/Agentic RAG 的 token 用量减少 19%-53%。
- **Memory Makes the Difference**（arXiv:2606.25361）：评估不同记忆角色对对话 agent 响应质量的影响，澄清记忆提升事实准确性和约束意识。
- **Data-Driven Evolution of Library and Information Science Research Methods**（arXiv:2606.25320）：基于细粒度方法实体分析 1990-2022 年 LIS 领域研究方法的演变。
- **Measuring Research Difficulty of Academic Papers**（arXiv:2606.25307）：提出学术论文研究难度综合评估体系，发现 NLP 领域中等难度研究学术影响力最大（倒 U 型关系）。
- **Automatic Generation of Highlights**（arXiv:2606.25253）：基于 prompt learning 的学术论文亮点自动生成，ChatGPT 在少量样本下达到 SOTA 水平。
- **The Hitchhiker's Guide to Agentic AI**（arXiv:2606.24937）：Agentic AI 的综合性实践指南，从 Transformer 到生产部署的全栈覆盖。
- **Error-Aware TF-IDF RAG for ASR Error Correction**（arXiv:2606.24915）：利用历史错误构建稀疏惩罚矩阵的纠错检索框架，波斯语 FLEURS 上 WER 从 23.06% 降至 18.83%。
- **Invisible to humans, visible to machines**（arXiv:2606.24897）：PubMed 等四个生物医学 API 的 Unicode 字符保真度审计，发现 PubMed AbstractText 仅保留 0.6% 的排版标点。