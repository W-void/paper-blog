---
title: "【推荐系统 Paper 日报】2026-07-20"
date: 2026-07-20
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2775626989"
---

# 【推荐系统 Paper 日报】2026-07-20

## 📊 今日概览

arXiv 本期公告日期为 **2026年7月17日（周五）**，cs.IR 领域本周共收录 **83 篇**论文，其中**推荐系统相关 28 篇**入选本期日报。本期亮点：工业界大厂的实战成果密集——Meta 的 SlimPer 将 Transformer 推荐系统压缩到单用户 O(N) 复杂度；阿里巴巴 DANet 折扣感知转化率预测提升 GMV 2.23%；Tmall 的 TmallGS 统一特征与序列建模；Meituan 的 NONTP 突破 NTP 仅关注单步预测的局限。学术界也呈现两大趋势：一是 **可解释性与可操控性**（CtrlBench-Rec、NAILS、RouteRec），二是 **隐式推理在序列推荐中的深化**（RecRec、IBA、Learning to Forget）。

---

## 🔥 推荐系统论文深度解读

### 1. SlimPer: Make Personalization Model Slim and Smart

📄 [arXiv:2607.12281](https://arxiv.org/abs/2607.12281) | 工业部署 · Meta（Instagram） | Siqi Wang et al.

**🗣️ 大白话：** Transformer 推荐系统有个怪癖：它继承了生成式模型的架构习惯，中间张量要按序列长度逐 token 展开，但推荐系统只关心每篇帖子/视频的打分，根本不需要做逐词生成。Meta 团队把这个"多余的骨架"精简掉了，让模型深度和计算量脱钩，用户历史再长也能用 O(N) 的单层开销处理，还能给 10k+ 细粒度事件建模。

**🔬 专业讲解：** SlimPer 提出将个性化排序重构为**迭代精炼一个紧凑的 `<user, item>` 知识基**。每层模型只做三件事：①从原始多模态用户侧 token 中选择性查询；②计算显式相关性匹配分数；③精炼知识基。关键创新在于**请求时共享一份用户侧 token 副本**，候选池中的 item 共用，从而极大减少内存。稀疏、稠密和序列特征被统一进单一 backbone，且注意力机制天然可解释。部署在 Instagram Reels 和 Feed 上，实现了用户指标提升和系统效率提升的双重收益。

---

### 2. Cheaper is Better: A Discount-Aware Network for CVR Prediction

📄 [arXiv:2607.12578](https://arxiv.org/abs/2607.12578) | 工业部署 · 阿里巴巴 Tmall | Ruocong Tang et al.

**🗣️ 大白话：** 电商平台做转化率预测，总是盯着用户画像和商品特征，却很少考虑"商品折扣率"这个既有定价意义、又影响用户冲动消费的关键变量。Tmall 团队把折扣率当成一等公民引入 CVR 模型，用傅里叶变换提取长期折扣趋势、用去偏模块校正促销带来的分布偏差，效果：离线 AUC +1.61%，线上 A/B GMV +2.23%。

**🔬 专业讲解：** DANet 包含三个组件：①**时频变换模块**（Fourier Transform 提取折扣率的频率谱，捕获长期趋势）；②**分布去偏模块**（缓解不同购买组合和促销活动带来的折扣率偏差，以及不同促销期的周期性偏差）；③**监督回归辅助任务**（显式建模折扣标签，提升值精度）。已在 Tmall APP 全量部署，验证了折扣特征在电商转化率建模中的独立增益。

---

### 3. TMallGS: Scaling Unified Feature and Sequence Modeling for Generative E-commerce Search

📄 [arXiv:2607.13398](https://arxiv.org/abs/2607.13398) | 工业部署 · 阿里巴巴 Tmall | Zhentao Song et al.

**🗣️ 大白话：** 现在工业搜索都在往 Transformer 和 LLM 架构统一，但直接把特征全部塞进 token 序列，忽视了电商特征的异构性——有的字段是文本、有的是数值、有的是图片。Tmall 团队建了一套系统，给不同特征分别建最优的投影空间，再用门控 Transformer 处理，最后还要一个偏置网络把系统 bias（比如广告位位置）从用户意图中解耦出来。

**🔬 专业讲解：** TmallGS 五大组件：①**分层分布校准 Tokenization**（Field-wise Saliency Reweighting + Distribution-Calibrated Projection）；②**Field-Adaptive Gated Transformer**（每域独立 QKV 投影和噪声自适应门控）；③**解耦 FiLM 晚融合**（保留高频显式信号）；④**上下文感知偏置网络**（系统偏置与意图解耦）；⑤**误差感知渐进训练**（动态加权损失）。线下实验和线上 A/B 测试均显著提升了 UCTCVR 和 GMV，是 Tmall 搜索统一架构升级的生产级方案。

---

### 4. NONTP: Extending Training Signal Coverage for Generative Recommendation

📄 [arXiv:2607.12277](https://arxiv.org/abs/2607.12277) | 工业部署 · 美团 | Changhao Li et al.

**🗣️ 大白话：** 生成式推荐模型都用"下一个 token 预测"来训练，但有两个致命盲区：①只学单步，不管长期行为结构（时间局部性）；②多域序列里，每个目标 embedding 只从前一步拿梯度，跨域上下文之间没有显式通路（空间局部性）。美团团队加了两个辅助目标：一个 BYOL 风格的时间对比学习，一个跨域均值池化预测头，零推理开销，HR@10 提升 34.3%。

**🔬 专业讲解：** NONTP 的核心：① **TCL（Temporal Contrastive Learning）** 用 EMA teacher 和 InfoNCE 对齐隐状态与 K 步未来轨迹；② **TDL（Trans-Domain Learning）** 跨域隐状态均值池化后预测，开辟了第二条梯度通路，无需额外参数。两者在推理时均丢弃。四域 Meituan 工业数据集（全排序）HR@10 +34.3%，Amazon 公开基准 +2.8% HR@10、+3.7% NDCG@10。线上 A/B 确认 CTR +1.8%、GMV +2.1%（p < 0.01）。

---

### 5. RecRec: Latent Interests Recursive Reasoning for Sequential Recommendation

📄 [arXiv:2607.12945](https://arxiv.org/abs/2607.12945) | 学术 · 格拉斯哥大学 / 华为 | Wenhao Deng et al.

**🗣️ 大白话：** 序列推荐最近开始学 LLM 那套"先思考、再回答"，但之前的方法把推理和预测都挤在一个固定维度里，导致推理越深越混乱。这篇论文把推理和预测拆开：先用一个小网络把用户历史压缩成几个"兴趣胶囊"，然后让这些兴趣在独立空间里做递归推理，推理深度在推理时随便调，不用重新训练。

**🔬 专业讲解：** RecRec = Context Compressor + Recursive Reasoner。Compressor 将 backbone 隐状态蒸馏为一组**潜在兴趣向量**，并引入 Interest Diversity Regularizer 使每个兴趣捕获不同用户行为侧面。Reasoner 在独立的中间隐空间中递归精炼这些兴趣。**深度监督**允许训练时固定深度，推理时自由增减。四个真实数据集上超越 SOTA 推理增强方法，且三个数据集上增益超越训练深度。这是首次将推理与预测解耦，把推理状态结构本身作为序列推荐的独立设计轴。

---

### 6. Where Reasoning Matters: Rethinking Latent Reasoning in Semantic ID-based Generative Recommendation

📄 [arXiv:2607.12425](https://arxiv.org/abs/2607.12425) | 学术 · 重庆大学 | Shangxin Yang et al.

**🗣️ 大白话：** 生成式推荐用语义 ID 来表示商品，每个商品是一段短 token 序列，逐 token 自回归生成。问题来了：每个 token 都给同样的推理步数？前面的 token 信息量更大，应该给它更多"思考预算"，后面的 token 可以少算。这篇论文用信息增益（IG）来量化每个 token 位置的不确定性降低程度，然后做预算分配。

**🔬 专业讲解：** 作者发现**语义 ID 靠前位置通常提供更高信息增益（IG），靠后位置边际贡献递减**。基于此提出 **IBA（Information-Gain Budget Allocation）**：将隐式推理步数视为有限计算资源，学习如何分配到不同语义 ID 位置，信息多的地方多给步数，信息少的地方少给。多数据集上 IBA 始终超越强基线，同时取得更优的精度-计算权衡。

---

### 7. Learning to Forget: Satiation-Aware Long-Sequence Transducers for Mitigating Post-Purchase Redundancy

📄 [arXiv:2607.12714](https://arxiv.org/abs/2607.12714) | 工业部署 · 阿里巴巴 Tmall | Yipin Dai et al.

**🗣️ 大白话：** 用户买了瑜伽垫后，再推荐瑜伽垫就是浪费。但现有序列推荐模型把购买当成正信号，越买越推，完全忽略了"购买 = 兴趣终结"这个事实。Tmall 团队提出了一个"会遗忘"的模型，买完后自动抑制相关兴趣，等复购周期快到了再逐渐唤醒。线上购买后重复推荐率下降 60%。

**🔬 专业讲解：** SAM（Satiation-Aware Mechanism）三组件：①**双路径交叉注意力**（反向抑制已满足意图的历史点击，同时从长期购买历史中检索个性化补货节奏）；②**自适应饱和门控单元（ASGU）**（时间敏感软掩码，购买后立即抑制已满足兴趣，随预测复购周期临近逐渐再激活）；③**自监督时间到下次购买（TTNP）辅助任务**（无标注学习产品生命周期）。线下工业数据集和线上 A/B 测试显著降低 PPRR（Post-Purchase Repeat Rate）超 60%。

---

### 8. CoSimRec: Measuring Coordinated-Content Penetration in Recommender Feedback Loops

📄 [arXiv:2607.15114](https://arxiv.org/abs/2607.15114) | 学术 · 新加坡国立大学 | Nan Li et al.

**🗣️ 大白话：** 推荐系统的对抗性测试通常只看"能不能把目标商品推到排名前列"，但真实世界的水军攻击往往不是一次性的，而是持续操纵一批账号，让它们在推荐反馈循环中像滚雪球一样放大。这篇论文建了一个模拟框架，把水军、推荐模型、普通用户放在一个闭环里跑，发现 popularity-based 和 feedback-sensitive 的排序策略最容易被利用，而同步感知防御能大幅降低攻击效果。

**🔬 专业讲解：** CoSimRec 是**离线基于智能体的评估框架**，同时建模：协调账号、动态排序、非机器人响应、排序干预。核心指标 **APR（Algorithmic Penetration Rate）** 家族衡量目标内容占非机器人曝光和交互的份额、对照基线的提升、以及每次协调交互带来的曝光增益。在 MIND、MovieLens、LastFM 上评估，覆盖随机、popularity、feedback-sensitive、MF、BPR-MF 五种推荐器，主分析十次随机种子，人口规模实验最高 1000 用户。发现 popularity-based 和 feedback-sensitive 在所有六种场景下都产生显著正向 APR-Lift（LastFM 最高 0.4505），同步感知防御在每一场景下都降低 APR。

---

### 9. Can We Steer the Black-Box? Towards Controllability-Centric Evaluation of Recommender Systems with Collaborative Agents

📄 [arXiv:2607.13418](https://arxiv.org/abs/2607.13418) | 学术 · 中国科学院 | Jiwen Zhou et al.

**🗣️ 大白话：** 推荐系统像个黑箱，用户说"我想看小众电影"或"不要给我推热门"，它常常听不进去。这篇论文建了一个多智能体测试框架，通过三个可控性任务（找目标内容、塑造兴趣画像、消除热门偏见）来系统评估推荐系统的"听话程度"。结果发现：引导长尾内容是最难的瓶颈。

**🔬 专业讲解：** CtrlBench-Rec 是首个标准化的推荐系统**可控性评估工具包**。定义三个核心任务：①目标内容发现（目标导向检索）；②兴趣画像塑造（隐式表示引导）；③热门偏见消除（算法偏好纠偏）。多智能体协作框架系统化执行这些任务。真实数据集和多模型实验表明，框架能有效量化可控性，暴露核心瓶颈——**对长尾内容的持续抗导性**。为可控推荐研究、算法审计和用户赋权提供了首个标准化工具集。

---

### 10. ZoRRO: A Zero-Weight Personalized Recommender System for Scalable News Recommendation

📄 [arXiv:2607.10910](https://arxiv.org/abs/2607.10910) | 学术/工业 · 哥本哈根大学 / UC San Diego | Johannes Kruse et al.

**🗣️ 大白话：** 训练模型太贵了，能不能干脆不训练？ZoRRO 是一个零参数、零训练的新闻推荐系统，它用纯文本和语义匹配来做个性化，离线排名比强神经网络基线好，线上点击率接近 SOTA 深度学习模型，但速度快了 600 倍。更有趣的是：点击率相近的模型，推荐的分布可能完全不同，影响整体信息流。

**🔬 专业讲解：** ZoRRO 是**零权重、无训练**的新闻推荐框架。核心在于用轻量化方法（如文本嵌入相似度）结合用户历史阅读进行实时个性化，无需任何模型训练。离线和在线实验均验证其有效性。关键洞察：离线-在线性能差距确实存在，且**相似点击率下不同模型的推荐分布差异显著**——这对评估指标体系提出了重要启示。

---

### 11. NAILS: Normative Alignment of Recommender Systems via Internal Label Shift

📄 [arXiv:2607.10915](https://arxiv.org/abs/2607.10915) | 学术 · 哥本哈根大学 / UC San Diego | Johannes Kruse et al.

**🗣️ 大白话：** 推荐系统只顾点击率，不管推荐出来的东西品类分布是否健康、是否符合编辑价值观。NAILS 是一种轻量级方法：不改模型，不重新训练，只调整输出的分布，让推荐结果的品类分布对齐到目标分布，同时尽量保持用户的个人偏好。

**🔬 专业讲解：** NAILS 将推荐输出与目标属性分布（如品类分布）对齐的问题，形式化为**层次分类框架内的内部标签偏移**。修改用户条件物品分布以诱导指定属性上的边际分布，同时保留现有推荐系统学习到的偏好。无需模型重新训练。实验表明，NAILS 在最小影响用户参与度的前提下，一致改善属性级对齐，为价值驱动的推荐提供实用机制。

---

### 12. Personalizing Incremental Video Search with Hybrid Text and ID Embeddings

📄 [arXiv:2607.13493](https://arxiv.org/abs/2607.13493) | 工业部署 · Apple TV | Vivek Kanojiya et al.

**🗣️ 大白话：** Apple TV 搜索有个特点：用户打字到一半就搜，输入很短（1-3 个字符），意图模糊。这时候如果推荐视频，个性化特别有用。Apple 团队把文本嵌入和协同 ID 嵌入混在一起，用 XGBoost 做排序。在短输入上 NDCG@10 提升 8.63%，长输入只提升 1.46%——个性化在模糊场景下增益最大。上线后点击率 +1.14%，转化率 +1.23%。

**🔬 专业讲解：** 系统学习两个物品嵌入空间：①多语言文本编码器（TextEmb），通过对比学习在共交互三元组上微调；②协同 ID 嵌入（IdEmb），从交互数据训练。服务时从近期观看历史构建用户表示，将文本和 ID 余弦相似度注入 pairwise XGBoost 排序器。切片分析：1-3 字符模糊前缀 NDCG@10 提升 +8.63%，长查询 +1.46%。历史越长的用户越受益：1-5 项历史用户提升 +2.13%，51-100 项 +4.37%。线上 A/B 验证 TAP +1.14%、CVR +1.23%，转化物品排名 +2.91%。

---

### 13. What Would You Click? Personalized Video Thumbnail Generation

📄 [arXiv:2607.12882](https://arxiv.org/abs/2607.12882) | 学术 · 昆士兰大学 | Zhiyu He et al.

**🗣️ 大白话：** 视频封面图片直接影响用户点击，但现在的封面生成是给所有人同一个图。能不能给每个用户生成不同的封面？这篇论文做了一件很自然但没人做的事：先按用户喜好检索视频里的关键帧，再用扩散模型生成个性化封面。用户研究表明，用户更喜欢个性化的封面。

**🔬 专业讲解：** 两阶段框架：第一阶段，**个性化关键帧检索器**捕获细粒度用户-视频交互并结合视频语义摘要，选择与用户偏好和视频上下文一致的关键帧；第二阶段，**VLM 引导的扩散管道**将这些关键帧转化为封面，注入语义基础视觉线索。两公开数据集 SOTA，用户研究证实点击偏好提升。

---

### 14. Deep-learning Causal Retrieval Optimization for Efficient E-commerce Distribution in Pinterest

📄 [arXiv:2607.14161](https://arxiv.org/abs/2607.14161) | 工业部署 · Pinterest | Junpeng Hou et al.

**🗣️ 大白话：** Pinterest 的商业内容分发有个困境：推多了用户烦，推少了少赚钱。传统做法是凭经验设阈值，但 Pinterest 团队用因果学习做了一个"触发器"，在需要时推商业内容，不需要时不推。购物触发减少了 85%，但关键会话不下降，总会话 +0.26%，收藏 +1.10%。

**🔬 专业讲解：** 将购物候选生成器的触发决策框架为**因果决策问题**。深度多任务模型联合预测多个事件的结果和 uplift，用**双重稳健伪结果**结合校准损失进行稳定单稳健 uplift 学习。随机数据日志提供反事实覆盖，模型用常规和反向指标双重评估。线性时间离线 replay 选择阈值并预测策略影响，与线上结果高度一致。模型与远程检索并行运行，零端到端延迟回归。Web 规模：购物触发减少最高 85%，关键购物会话持平，总会话 +0.26%，Pin 收藏 +1.10%，基础设施大幅节省。

---

### 15. Scaling and Stabilizing Large-Scale Embedding-Based Retrieval

📄 [arXiv:2607.10096](https://arxiv.org/abs/2607.10096) | 工业部署 · Walmart | Zhen Yang et al.

**🗣️ 大白话：** 嵌入检索在电商搜索里越来越重要，但训练时用的小候选池和推理时面对的上亿物品之间有巨大的鸿沟。Walmart 团队用在线跨批次采样把负样本多样性提升一个数量级，还结合交叉编码器和元数据启发式做离线挖掘。升级模型时不用从零开始，而是用老模型的知识给新模型做 warm-start，避免召回行为突变。

**🔬 专业讲解：** ①**混合硬负样本挖掘**（在线跨批次采样 + 混合离线挖掘：交叉编码器预测 + 元数据启发式）；②**Legacy-Aware 蒸馏**（从 DistilBERT 到 GTE-base，用 Warm-Start Distillation 传递领域知识）。线上部署：NDCG@5 +7.34%，总收入 +0.50%。生产级验证的嵌入检索升级方案。

---

### 16. From Raw IDs to Semantic Planning: How Recommender Systems Utilize Information at Scale

📄 [arXiv:2607.09540](https://arxiv.org/abs/2607.09540) | 综述/前瞻 · 华为 / 都柏林大学 | Changhong Jin et al.

**🗣️ 大白话：** 推荐系统的发展史，本质上是一部"如何利用信息"的进化史。从早期的纯 ID（黑箱记忆），到语义 ID（给 ID 赋予含义），再到未来的"语义规划"——先预测用户想看什么类型的内容，再具体生成实例。这篇论文是未来方向的重要综述。

**🔬 专业讲解：** 论文提出三个递进层次：①为什么早期 ID 主导；②为什么语义信息被封装进 ID；③未来"语义规划"——系统先预测语义目标，再实例化为具体物品或生成创意。该框架需要重新思考评估标准，以及用户、平台、内容提供者之间的利益协调。

---

### 17. Long-History User Transformers for Real-Time Ad Ranking

📄 [arXiv:2607.14331](https://arxiv.org/abs/2607.14331) | 工业部署 · Yandex | Viacheslav Ovchinnikov et al.

**🗣️ 大白话：** 广告系统要求几百毫秒内完成打分，但大序列模型太复杂了。Yandex 的解法：离线用大模型把用户历史编码成一个紧凑向量，存到特征库，在线时只需要一个小模型做最后一层组合。效果恢复了大模型的 72-80%，但延迟不增加。搜索广告排名 +2.77%，收入 +2.26%。

**🔬 专业讲解：** 高容量离线 Transformer 异步编码用户完整跨场景交互历史，缓存为紧凑表示到特征库；轻量级在线模型结合缓存表示、最近事件和请求上下文。离线编码器用**双目标**（反馈预测 + 下一项预测）自回归预训练。搜索广告 CTR +2.77%，YAN 广告 +2.1%，收入 +2.26% / +0.43%。

---

### 18. Tokenizing Numerical and Embedding Features for LLM RecSys

📄 [arXiv:2607.10016](https://arxiv.org/abs/2607.10016) | 工业探索 · 字节跳动 | Zhe Xu et al.

**🗣️ 大白话：** LLM 做推荐时，大多只处理文本 token，但工业推荐系统里有大量的连续数值特征和上游编码器产出的稠密嵌入。这篇论文把这些连续特征映射成"软 token"注入 LLM，让异构信号都能被标准 token 接口消费。

**🔬 专业讲解：** 软 token 融合框架：将数值和嵌入特征映射到 LLM 嵌入空间。实例化于共享参数 LLM-based 双塔检索模型，并引入交互式融合模块，在插入最终 LLM 输入前精炼嵌入和数值软 token。Amazon 三个基准上超越 LLM 基线，且交互式融合优于直接拼接。

---

### 19. RouteRec: Strict Evaluation of Recommender-Agent Selection and Aggregation

📄 [arXiv:2607.09908](https://arxiv.org/abs/2607.09908) | 学术 · 天津大学 | Kaiji Zhou et al.

**🗣️ 大白话：** 推荐系统有很多异构模型：协同过滤、序列模型、内容检索、LLM 重排。到底该用哪个？RouteRec 做了严格的消融实验：硬选择（请求级只用一个模型）效果还不如 BM25，但学习过的聚合（item 级融合）效果最好，但需要 LLM 调用 70% 的混合策略。结论是：item 级聚合比请求级选择更有前途。

**🔬 专业讲解：** 框架比较请求级硬选择与 item 级学习聚合。五个异构智能体（CF、序列、CB、LLM reranker）。MovieLens-1M 上全质量 oracle 存在大量 headroom（HR@10 = 0.584）。但硬选择在无泄漏协议下仍低于 BM25。item 级聚合：仅廉价模型变体与 BM25 HR 持平、NDCG 更高；门控全智能体聚合 HR@10 = 0.295，需 70.2% LLM 调用。关键洞察：请求级单智能体选择对稀疏候选场景过粗，item 级聚合是更有前景的动作空间。

---

### 20. Serving the Long Tail: Training-Free LLM Candidate Generation for Vacation Rental Marketplaces

📄 [arXiv:2607.09877](https://arxiv.org/abs/2607.09877) | 工业部署 · Vrbo / Expedia | Syed Mohammed Arshad Zaidi et al.

**🗣️ 大白话：** 度假租赁平台有个经典问题：热门房源被推荐系统反复推，但新房源、小众房源、季节性房源几乎没有交互信号，协同过滤完全无法服务。Vrbo 用 LLM 的静态元数据（不依赖交互数据）来做候选生成，不训练，覆盖数千万零交互房源。效果：长尾召回从几乎为零提升到有效覆盖。

**🔬 专业讲解：** 零训练、LLM-based 候选生成：离架 LLM 合成多样化语义查询 → 预训练文本编码器嵌入 → ANN 索引从 1170 万房源检索。Union 融合策略与 IBKNN 合并，保留行为通道排序，保证对已有服务房源不降级。160 万焦点房源评估：将候选覆盖扩展到 IBKNN 无法触及的数万个房源，长尾段最大增益，共享房源上每 K 都不输 IBKNN。下游学习排序进一步提升。3B 开源模型与 API 模型的召回差距从 27-46% 压到 <1%，支持自托管小模型部署。

---

### 21. ViHoRec: A Quality-Controlled Vietnamese Hotel Recommendation Dataset

📄 [arXiv:2607.12946](https://arxiv.org/abs/2607.12946) | 学术 · 越南 · Nha Trang University | Minh Hoang Nguyen

**🗣️ 大白话：** 越南语的推荐系统研究长期缺少公开数据集。这篇论文发布了 18,267 条交互、6,832 用户、560 酒店的数据集，做了跨平台实体对齐、隐私保护（HMAC 假名），还提供了冷启动基准。发现：短历史用户下模型性能急剧下降，UserKNN 在稀疏场景最强。

**🔬 专业讲解：** 贡献：①可复现构建流程（跨平台实体对齐 + 定量质量控制）；②HMAC 假名隐私保护发布；③公共冷启动基准（时间留出最后一项、数据为中心消融、无依赖基线）。公共分上短历史用户模型急剧退化（BPR-MF Recall@10: 0.065 vs. 0.120），UserKNN 整体最强。定位为稀疏冷启动主导的低资源推荐测试床。

---

### 22. Impact of Expert-Following Strategies in Financial Asset Recommendation

📄 [arXiv:2607.14556](https://arxiv.org/abs/2607.14556) | 学术 · 北海道大学 | Ryuki Unno et al.

**🗣️ 大白话：** 金融机构推荐资产时，通常要么只看收益，要么只看和用户偏好匹配，二者难以兼顾。这篇论文提出：找出历史上最赚钱的投资人，推荐他们买的资产，按收益率加权。结果：收益和匹配度同时提升。

**🔬 专业讲解：** Expert-Following 策略：识别历史 ROI 最高的投资者，推荐其购买资产，用 ROI 加权购买频率评分。真实交易历史实验：所有四个阈值下，ROI 和 nDCG 同时优于市场平均基线。解决了收益-相关性的根本权衡。

---

### 23. Stream-aware Side Adaptation for Large Pre-trained Multimodal Embedding Models in Sequential Recommendation

📄 [arXiv:2607.10909](https://arxiv.org/abs/2607.10909) | 学术 · 格拉斯哥大学 / 华为 | Junchen Fu et al.

**🗣️ 大白话：** 大模型嵌入（如 Qwen3-VL）很强，但直接用在推荐上因为领域不匹配，效果不如预期。常用的 side adapter 方法，随着层数加深反而退化。问题出在：深层融合时历史状态没有保留好。本文用"流感知"方法，让每层适配器都记住之前层的输出，避免退化。

**🔬 专业讲解：** Stresa 框架：① **Stream-aware Hidden-Adapter Fusion（SHAF）** 在融合时保留历史 side 记忆；② **Residual Stream Adapter（ReSA）** 产生选择性残差更新。冻结大模型、序列推荐公开数据集上，Stresa 始终超越标准 side adapter 和 SOTA 基线。验证了将大模型嵌入适配到序列推荐的前景。

---

### 24. RecRec: Recursive Refinement for Sequential Recommendation

📄 [arXiv:2607.10541](https://arxiv.org/abs/2607.10541) | 学术 · 微软 | Pervez Shaik et al.

**🗣️ 大白话：** 另一篇同名的 RecRec（递归精炼），作者来自微软。核心思路类似：用户偏好是一个持续隐状态，每次交互后递归更新。但方法不同：用一个轻量递归模块，通过"证据锚定"机制防止递归过程中语义漂移。仅用 3.9M-14M 参数，就能匹敌或超越 SOTA。

**🔬 专业讲解：** RecRec（微软版）维护紧凑隐状态，通过共享递归模块以交互证据为条件更新。关键创新：**证据锚定校正机制**，通过将每次更新锚定到原始交互上下文，防止深度递归推理中的语义漂移。三个基准数据集上匹配或超越 SOTA 序列、图和推理增强推荐器。消融证实递归精炼和证据锚定门控均显著贡献。

---

### 25. MMRM: A Multiplex Multimodal Representation Model for Product Ranking in E-commerce Search

📄 [arXiv:2607.11030](https://arxiv.org/abs/2607.11030) | 工业部署 · 京东 | Zhen-Lin Chen et al.

**🗣️ 大白话：** 电商搜索里的多模态信息（图片、标题、属性）通常用一个大语言模型提取表示，然后作为物品特征丢进排序模型。但有两个问题：①只用一个协同信号来微调，浪费了多任务排序需要的异构信号；②多模态表示只是当普通特征用，没有充分发挥用户行为建模的潜力。京东团队提出 MMRM，一次推理同时产出多个"视图"的表示，并用于用户行为序列建模。

**🔬 专业讲解：** MMRM：共享 backbone + 任务特定 token + 投影层，同时从多个信号学习，单次推理产出综合多路物品表示。排序模型中引入**多路用户表示策略**：通过搜索行为序列建模，利用多路物品表示导出任务特定用户表示。京东电商搜索引擎已部署，服务数百万日活用户，验证效率与效果双优。

---

### 26. PaperRouter-Agent: A Content-Grounded LLM Agent for Personalized Hierarchical Paper Routing

📄 [arXiv:2607.11564](https://arxiv.org/abs/2607.11564) | 学术 · 南方科技大学 | Keshen Zhou et al.

**🗣️ 大白话：** 研究人员用文献管理器收藏论文，每个人都有一套自己的文件夹层级。新论文来了，该放到哪个文件夹？这不是固定分类，而是每个人的个性化 folksonomy。这篇论文用 LLM 智能体，不训练，基于文件夹里已有论文做路由，Recall@1 从 0.39 提升到 0.61。

**🔬 专业讲解：** 个性化层次论文路由（PHPR）：无训练分配新论文到用户特定层级。PaperRouter-Agent 基于文件夹内容而非仅名称做路由决策：缩小候选层级 → 检索文件夹证据 → 检视成员论文验证适配 → 整合过去拒绝的相似门控反馈。真实个人库上 Recall@1 从 0.39 到 0.61，Recall@3 从 0.57 到 0.83。LaMP-2 基准上准确率从 44.5% 到 51.5%（+9.0 macro-F1）。

---

### 27. Consensus vs. Dissent: Dynamic LLM Modeling of Subjective Preferences in Group Recommenders

📄 [arXiv:2607.10235](https://arxiv.org/abs/2607.10235) | 学术 · 马斯特里赫特大学 / 代尔夫特理工大学 | Cedric Waterschoot et al.

**🗣️ 大白话：** 一群人推荐时，少数人的偏好常常被忽视。这篇论文用微调 LLM 来模拟"公平感"，根据群体内的偏好分布动态选择聚合策略。用户研究表明，当考虑少数派和联盟时，LLM 的判断最贴合人类对公平、满意度和共识的感知。

**🔬 专业讲解：** 基于 DeepSeek-V3.1 和人工评估构建的推理数据集，微调 LLM 为实时评判模型。多个社会选择聚合策略生成候选，动态选择最大化预测人类评价（公平、满意度、共识）的推荐。用户研究（n=284）证实该方法在满意度和共识上得分最高。LLM 判断与人工感知的对齐度在考虑群体配置交互效应（如少数派或联盟）时最佳。

---

### 28. Impact of Expert-Following Strategies in Financial Asset Recommendation

📄 [arXiv:2607.14556](https://arxiv.org/abs/2607.14556) | 学术 · 北海道大学 | Ryuki Unno et al.

**🗣️ 大白话：** 金融机构面临收益与相关性的双重优化难题。推荐系统通常只优化其一，导致收益与匹配度之间的权衡。专家跟随策略通过追踪历史 ROI 表现最优的投资者，实现收益与 nDCG 同时提升。

**🔬 专业讲解：** 框架从真实交易历史中识别顶级投资者，推荐其购买的资产，按 ROI 加权购买频率评分。在所有四个阈值下，ROI 和 nDCG 均显著优于市场平均基线。为金融推荐系统提供了同时优化收益与相关性的可行策略。

---

## 📋 其他论文速览

- **Bridge Evidence**（arXiv:2607.15253）：多步搜索中静态检索效用不能预测因果效用，智能体搜索需要新的评估范式。
- **LLM-Based Re-Ranking for Real Estate Search**（arXiv:2607.14835）：LLM 重排提升房产搜索质量，通过语义理解和用户需求推理实现更精准匹配。
- **SAGA**（arXiv:2607.14494）：Schema-Aware Grounding，用 Agent 自动将自然语言转化为 SPARQL 查询。
- **Cluster with Auctions for Vector Search**（arXiv:2607.13728）：向量搜索的聚类与拍卖机制结合，优化大规模近似最近邻检索。
- **MESH**（arXiv:2607.12392）：异构内容统一检索扩展，将不同模态和结构的数据统一为可检索表示。
- **Beyond Semantic IDs**（arXiv:2607.11392）：将业务价值排序编码进文档标识符，超越语义 ID 的生成式检索。
- **Boolean queries are all you need?**（arXiv:2607.11362）：探讨布尔查询在信息检索中的充分性。
- **User Preference Induction with LLMs for Offline Top-N Evaluation**（arXiv:2607.11354）：用 LLM 诱导用户偏好进行离线 Top-N 推荐评估。
- **SVD-RAG**（arXiv:2607.10316）：基于 SVD 的树组织检索增强生成，提升结构化查询效率。
- **Transforming LLMs into Efficient Cross-Encoders**（arXiv:2607.11933）：知识蒸馏将 LLM 转化为高效交叉编码器用于 RAG 重排。
