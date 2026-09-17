---
title: "【推荐系统 Paper 日报】2026-09-17"
date: 2026-09-17
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2787108188"
---

# 【推荐系统 Paper 日报】2026-09-17

## 📊 今日概览

本期 arXiv cs.IR 公告日期为 2026-09-17（周四），共收录 17 篇论文，其中推荐系统与个性化相关 6 篇。今天的关键词是「生成式推荐落地」：快手把用户真实偏好理由规模化用于排序、Instagram 把榜单级生成式推荐平滑嫁接到成熟排序系统上，两篇工业论文都给出了线上验证结果；此外序列推荐的「机器遗忘」、LLM 排序器的校准陷阱也值得关注。

## 🔥 推荐系统论文深度解读

### 1. SARA: Scaling Articulated Rationales for MLLM-based Recommendation

📄 [arXiv:2609.17639](https://arxiv.org/abs/2609.17639) | 快手工业论文 | Haoke Xiao, Yueyang Liu, Yuhui Zhang 等

**🗣️ 大白话：** 传统推荐只看用户「做了什么」（点了、看完了、划走了），但不知道「为什么」。这篇论文让用户自己用文字解释为什么喜欢或讨厌一个内容，然后把这个信号规模化地喂给推荐模型。快手从 2.4 亿直播用户里挖掘和清洗出高质量「偏好理由」数据，训练了一个 7B 多模态模型来给全站 1000 万作者自动生成这类理由，最后接进线上排序，A/B 实验证实有效。

**🔬 专业讲解：** 论文提出 AUR（Articulated User Rationales）作为一类带极性（正/负）、带原因层级的文本信号，解决其稀疏、低质、覆盖低的落地难题：① 数据引擎大规模引出并清洗 AUR，构建作者中心的 SARA-HQ 数据集；② 通过大规模 SFT + Quality-Refining DPO 对齐通用 MLLM 得到 SARA-7B，把理由生成能力从 86,564 个被 AUR 覆盖的作者泛化到全量 1000 万作者；③ SARA-Ranker 通过 rationale-aware 交互建模和 rejection-memory 建模，将生成的正/负理由融入生产排序。离线评测、人工校准和在线 A/B 均显示 SARA-7B 生成的理由更具体、极性一致、更贴合事实，排序侧互动指标提升。

---

### 2. LIGE-GR: A Smooth Leap from Ranking to Generative Recommendation in the LLM Era

📄 [arXiv:2609.18148](https://arxiv.org/abs/2609.18148) | Instagram/Meta 工业论文 | Venkat Srinivas, Chenzhang He, Sam Woodmansee 等

**🗣️ 大白话：** 生成式推荐很酷，但真把它塞进一个跑了多年、被各业务定制到面目全非的成熟推荐系统里？风险大到没人敢。这篇论文的聪明之处在于「不推倒重来」：把现有的逐 item 打分排序系统直接泛化成「整页榜单一起生成 + 一起评估」的框架，老的模型、价值函数、serving 基建全部保留。已经在 Instagram 短视频推荐上落地验证。

**🔬 专业讲解：** 论文指出 LLM 范式融入工业推荐的两难：序列级生成优化如何引入，以及如何在不动存量系统（业务约束、serving 基建、组织归属）的前提下渐进升级。LIGE-GR（LIstwise GEneration and evaluation Generative Recommendation）将 pointwise 推荐系统泛化为 listwise 生成系统：推荐即生成一个整体最优的有序列表，并在列表层面做联合评估与优化，而非重训全栈。这种兼容式设计让成熟系统直接受益于 listwise 优化（如列表内多样性与互补性建模），同时保持对既有模型、价值函数与推理基础设施的向后兼容。已在 Instagram 短视频推荐场景验证。

---

### 3. SURF: Subtractive Updates for Recommender Forgetting

📄 [arXiv:2609.18695](https://arxiv.org/abs/2609.18695) | Filippo Betello, Antonio Purificato, Nicola Tonellotto, Fabrizio Silvestri

**🗣️ 大白话：** 用户说「把我的数据从推荐模型里删掉」（GDPR 要求），正常做法是全量重训，贵到肉疼。SURF 的思路很妙：只把要遗忘的 item 的「邻域」拿出来训一个小模型，然后在推理时把小模型的打分从原模型里「减掉」，相当于做减法抹除影响。效果接近全量重训，但只要 2% 的时间预算。

**🔬 专业讲解：** 面向序列推荐系统（SRS）的近似机器遗忘框架。SURF 三阶段：① 在 embedding 空间定位待遗忘 item 的邻域子集；② 在该紧凑子集上训练辅助模型；③ 推理时从原模型得分中减去辅助模型得分，实现定向遗忘。相比需要全量重训的精确遗忘和忽略时序行为的已有近似方法，SURF 在 7 个数据集、5 个 baseline 上取得与全量重训相当的遗忘效果，NDCG@20 最高提升 32%，时间开销仅为重训 baseline 的约 2%。对隐私合规场景（GDPR 被遗忘权）非常实用。

---

### 4. ESCIM: On Predicting Post-Click Conversion Rate via Counterfactual Inference

📄 [arXiv:2510.04816](https://arxiv.org/abs/2510.04816) | ICDM 2025 | Junhyung Ahn, Sanghack Lee

**🗣️ 大白话：** 转化率预估的老难题：只有点了才可能转化，所以模型只用点击样本训练，但点击又太少。已有办法用「没点的样本」来补，但都是拍脑袋的启发式。这篇论文用因果推断来正经回答一个反事实问题：「如果用户点了这个推荐，他会转化吗？」——先学一个用户行为序列的因果模型，对未点击样本做「点击干预」推断出反事实转化率，再变成伪标签加入训练。

**🔬 专业讲解：** 提出 Entire Space Counterfactual Inference Multi-task Model（ESCIM）。核心流程：① 训练用户序贯行为的结构因果模型（SCM）；② 对未点击 item 施加假想干预（click）进行反事实推断，估计 counterfactual CVR；③ 设计多种方法将预测的反事实 CVR 转化为二值反事实转化标签；④ 将生成的样本并入训练。相比依赖 clicked/non-clicked 分布差异启发式校正的 prior work，以因果原则为指导生成非点击样本标签，缓解了点击样本稀疏与选择偏差。对广告与电商 CVR 建模有直接参考价值。

---

### 5. How Calibration Content Shapes Attention-Based Reranking

📄 [arXiv:2609.17764](https://arxiv.org/abs/2609.17764) | UCSD | Petros Karypis, Hossein Rajaby Faghihi, Peter Chen, ..., Julian McAuley

**🗣️ 大白话：** 现在流行的注意力重排器有个标配操作：先用「空 query」跑一遍打分，再从真实打分里减掉，用来消除位置和结构偏差。但这篇论文发现：当你给模型塞了很长的指令、persona、few-shot 示例时，这个「空 query 校准」会把有用的相关性信号也一起减掉，反而伤性能。他们提出一个免训练的插值校准方法来修复。

**🔬 专业讲解：** Attention-based reranker 通常通过 null-query calibration pass 消除位置/结构偏置。本文证明现代 prompt 内容（约束、指令、persona、演示）会进入 scoring readout，使 null pass 变成 relevance-aware 而非真正「null」，且校准在长而详细的指令 prompt 下尤其有害。提出 interpolated null calibration：训练无关、可调控指令内容进入 null baseline 的比例，在指令重任务上恢复被标准校准破坏的排序性能（恢复后的排序甚至超过生成式 reranker），同时在 null pass 仍与相关性无关时保留校准收益。另发现 in-context demonstrations 几乎不受校准干扰，因为其只通过 query pass 起作用。做 LLM/注意力排序的同学建议精读，这是个容易被忽略的坑。

---

### 6. Understanding AI Provider Recommendations in Local Service Markets

📄 [arXiv:2609.18341](https://arxiv.org/abs/2609.18341) | NYU Abu Dhabi | Hazem Ibrahim, Yasir Zaki

**🗣️ 大白话：** 你问 AI 助手「推荐个医生/理财顾问」，它一本正经推荐的名字可能根本不存在！作者把 AI 推荐的医生、诊所、投资顾问和官方注册库逐一比对：不联网时，模型基本在编造——开源模型只有 4% 推荐医生真实存在于当地，闭源模型 11%，而且匹配上的还多是撞名。联网搜索后真实率跳到 64-71%。更吓人的是：不联网时被推荐的理财公司，有 SEC 违规记录的比例是基准率的 3.6 倍。搜索不仅让推荐变真，还让推荐变好。

**🔬 专业讲解：** 对四个有官方注册库支撑的服务领域、美国 100 大都会区的 AI 服务商推荐进行系统性审计，设置三条件对照：开源权重模型、无搜索闭源模型、带搜索闭源模型。发现：① 无搜索时两模型在 web 覆盖薄弱的领域大规模幻觉编造；② 开源模型的注册库匹配纯属名字巧合（matched clinicians 与随机抽取无异）；③ 搜索显著提升真实性并消除都会区规模偏差；④ 无搜索时被推荐咨询公司的 SEC misconduct 披露率是注册库基线的 3.6 倍（规模校正后），带搜索后反而显著低于基线；⑤ 餐饮领域存在 3-5 倍评论数溢价但评分溢价不足 0.1 星。对推荐系统的可信度评估与「幻觉式推荐」风险量化有警示意义。

---

## 📋 其他论文速览

- **One-Step Retrieval Framework for Real-Time Sponsored Search Ads Using Hierarchical Text Representations**（arXiv:2609.18296）：ANGLE 框架把广告检索、相关性、排序统一进单个 LLM，用「商业意图 + 广告摘要」分层文本表示替代离散语义 ID，线上消费 +1.81%、GMV +2.16%。
- **Single-Token Expected-Value Scoring for Cold-Start Candidate Ranking**（arXiv:2609.18188）：Indeed 的候选人-职位排序原语，把相关性建模为等级 token 上的序数分类，读首 token 概率分布的期望作为分数，单步解码低延迟，SLM + 混合序数回归损失（MSE+CE）。
- **DUPAR: Dual-Path Conversational Retrieval via Speech Retriever with Cross-Turn Evidence Caching**（arXiv:2609.18042）：语音对话检索双通道设计，快走音频编码器直查跨轮证据缓存，慢走全索引融合，噪声场景 Recall@10 从 0.771 提到 0.875，查询侧提速 3.75 倍。
- **DRAG: One Size Does Not Fit All! Dynamic Retriever and Generator Selection for RAG**（arXiv:2609.17709）：查询自适应选择检索器-生成器组合，免训练版用查询性能预测（QPP）信号路由，性能持平强静态 baseline 但推理成本大降。
- **PageRecall: Measuring Page Selection in Literature-Grounded QA**（arXiv:2609.18154）：文献问答系统中证据定位的瓶颈在检索不在阅读——页面召回仅 52.6% 时定位准确率高达 94%，改整篇入上下文后召回 100%。
- **Quanta: A Self-Contained Python Library for Hybrid Retrieval over Quantised Embeddings, Lexical Indexes, and Knowledge Graphs**（arXiv:2609.18248）：把 4-bit 量化向量检索、BM25、知识图谱遍历统一到单个 API，用加权 RRF 融合信号，图谱只做候选扩展不做相关性打分。
- **Beyond Static RAG: An Adaptive, Tri-Metric Routing Framework**（arXiv:2609.17564）：低显存 GPU 上 RAG 的「压缩悖论」，三指标路由器在 Raw/神经/词法三种管线间确定性调度，0% OOM、49.3% Combined F1。
- **Time-Aligned Evolving Concept Graphs for Scientific Relation Forecasting**（arXiv:2609.18163）：时间对齐的演化概念图联合建模语义与结构演化，科学关系预测 AUROC 从 0.9290 提到 0.9722。
- **SEEK: Secure and Efficient Encrypted Keyword Search**（arXiv:2609.18459）：同态加密 + 2PC 的隐私保护消息关键词搜索协议，相关计算快 5.47 倍，加密上传开销降两个数量级。
- **The Death of Schema Linking? Text-to-SQL in the Age of Well-Reasoned LLMs**（arXiv:2408.07702）：新代 LLM 面对大量无关 schema 也能正确使用相关表列，干脆砍掉 schema linking，BIRD 榜第一（71.83%）。
- **Exploring LLMs and RAG for Plausible and Explainable Material Prediction of Vehicle Components**（arXiv:2609.18437）：LLM 预测汽车零部件材料，纯生成基线反超 RAG 变体，暴露 RAG 在领域语料与评测设计上的落地挑战。
