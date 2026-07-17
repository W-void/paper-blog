---
title: "【推荐系统 Paper 日报】2026-07-17"
date: 2026-07-17
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2775493939"
---

# 【推荐系统 Paper 日报】2026-07-17

## 📊 今日概览

arXiv cs.IR 于 **Fri, 17 Jul 2026** 共发布 50 篇论文，其中推荐系统相关论文 **19 篇**。本期工业实践扎堆——从 Pinterest、Instagram、淘宝天猫到 Apple TV 都有新工作，生成式推荐方向尤其热闹。三大亮点：①因果检索在 Pinterest 全量部署砍掉 85% 无效触发；②美团团队提出 NONTP 将生成式推荐 HR@10 提升 34.3%；③ Instagram 的 SlimPer 用固定尺寸表征建模 10k+ 历史事件且不增内存。

## 🔥 推荐系统论文深度解读

### 1. CoSimRec: Measuring Coordinated-Content Penetration in Recommender Feedback Loops

📄 [arXiv:2607.15114](https://arxiv.org/abs/2607.15114) | 作者：Nan Li, Jiahong Shao, Jiuyang Lyu

**🗣️ 大白话：** 刷量团伙、水军、 coordinated inauthentic behavior（协调虚假行为）——推荐系统会不会帮着放大这些内容？这篇论文搭建了一个「仿真沙盘」CoSimRec，让机器人账户、真实用户、推荐算法在同一个闭环里运行，测量恶意内容在系统中的渗透程度。实验发现，基于 popularity 和 feedback-sensitive 的排序策略确实会放大协调攻击，而同步感知防御策略能有效降低渗透。

**🔬 专业讲解：** CoSimRec 是一个基于 Agent 的离线评估框架，首次将「协调账户-动态排序-非机器人响应-排序干预」整合到同一个闭环过程中。核心贡献是提出 APR（Algorithmic Penetration Rate）指标族，衡量目标内容在非机器人曝光中的占比、相对于无攻击基线的提升、以及每次协调交互带来的曝光增益。在 MIND、MovieLens、LastFM 上测试了多种推荐器（Random、Popularity-based、MF、BPR-MF），发现 popularity-based 和 feedback-sensitive 策略在所有六种主从数据集-推荐器组合中都产生显著正向 APR-Lift（最高达 0.4505），而同步感知防御策略在所有对应场景下均降低 APR。这项工作为推荐系统的鲁棒性评估提供了新的标准化工具。

---

### 2. Long-History User Transformers for Real-Time Ad Ranking

📄 [arXiv:2607.14331](https://arxiv.org/abs/2607.14331) | 作者：Viacheslav Ovchinnikov, Georgii Smirnov, Nikolai Savushkin, Veronika Ivanova, Maksim Kuzin

**🗣️ 大白话：** 广告排序要算得快（几百毫秒内），但用户历史越长模型越准。Yandex 的解法很妙：把「重模型」和「轻模型」解耦——离线用大 Transformer 把用户全部历史编码成紧凑向量存在缓存里，实时推理时只跑轻量模型结合最新上下文。缓存向量即使有点「过时」也 robust，实验能恢复全量实时 Transformer 72-80% 的质量。

**🔬 专业讲解：** 本文提出一种两阶段架构解决实时广告 CTR 预测中的「长历史 vs 低延迟」矛盾。离线阶段：高容量 Transformer 异步编码用户全跨面交互历史，预训练采用双目标（反馈预测 + 下一项预测），输出紧凑表征存入 feature store。在线阶段：轻量运行时模型将缓存表征与最近事件及请求上下文融合。离线实验显示该架构恢复全量实时 Transformer 72-80% 的质量，且缓存表征对陈旧性 robust，支持低成本刷新策略。生产 A/B 实验：搜索广告排名指标 +2.77%、Yandex Advertising Network +2.1%，收入分别 +2.26% 和 +0.43%，且未增加 serving 延迟。

---

### 3. Deep-learning Causal Retrieval Optimization for Efficient e-commerce Distribution in Pinterest

📄 [arXiv:2607.14161](https://arxiv.org/abs/2607.14161) | **KDD'26** | 作者：Junpeng Hou, XianXing Zhang, Sai Xiao, Derek Cheng, Darren Reger, Olafur Gudmundsson, Mehdi Ben Ayed, Zhiqing Rao, Huizhong Duan

**🗣️ 大白话：** Pinterest 上用户浏览灵感，偶尔会买点东西。但购物内容推荐早了、推多了反而会打扰用户。这篇论文的核心思想是：不是每次用户浏览时都要触发购物候选生成器——用因果推断判断「这次推购物内容有没有用」，没用就不推。全量上线后，砍掉 85% 的无效购物触发，但关键购物指标不变，反而总体验更好（+0.26% 总会话），Pin 收藏还涨了 1.10%。

**🔬 专业讲解：** 本文将电商内容分发建模为早期检索中的因果触发决策问题。采用深度多任务模型联合预测多事件的结果和 uplift，训练使用 doubly-robust pseudo-outcome 结合校准后的结果损失，实现稳定、单稳健的 uplift 学习。随机数据日志提供反事实覆盖，评估同时使用常规和反向指标。线性时间离线 replay 选择阈值并预测策略影响，与线上结果一致性极高。生产部署中，模型与远程检索调用并行运行，不增加端到端延迟。Web 规模实验：减少 85% 购物触发，关键购物会话保持中性，总会话 +0.26%，Pin 收藏 +1.10%，基础设施大幅节省。

---

### 4. Not Only NTP: Extending Training Signal Coverage for Generative Recommendation

📄 [arXiv:2607.12277](https://arxiv.org/abs/2607.12277) | 作者：Changhao Li, Shuli Wang, Junwei Yin, Senjie Kou, Yinqiu Huang, Chi Wang, Yinhua Zhu, Haitao Wang, Xingxing Wang

**🗣️ 大白话：** 生成式推荐里大家用「Next Token Prediction」（NTP）训练模型，但 NTP 有两个盲区：①只看相邻两步，学不到长程行为结构；②多域序列里，每个目标只受前一步隐状态影响，跨域信息没利用上。本文提出 NONTP，用两个辅助任务「时间对比学习（TCL）」和「跨域学习（TDL）」来扩展信号覆盖，推理时零开销扔掉。在美团四域工业数据集上，HR@10 比 NTP 高 34.3%，线上 A/B 测试 CTR +1.8%、GMV +2.1%。

**🔬 专业讲解：** 本文指出 NTP 存在「时间局部性」和「空间局部性」两个结构性限制。TCL（Temporal Contrastive Learning）采用 BYOL 风格的 EMA 教师 + InfoNCE 将隐状态与 K 步未来轨迹对齐；TDL（Trans-Domain Learning）对跨域隐状态做 mean-pooling 并通过共享预测头预测，开辟第二条梯度路径且无额外参数。推理时两者均丢弃。美团四域工业数据集（全量排序）HR@10 +34.3%（vs NTP）、+18.3%（vs MBGR）；Amazon Movie-Book-CDs 基准 HR@10 +2.8%、NDCG@10 +3.7%。线上 A/B 测试 CTR +1.8%、GMV +2.1%（均 p < 0.01）。消融实验确认各组件独立贡献。

---

### 5. SlimPer: Make Personalization Model Slim and Smart

📄 [arXiv:2607.12281](https://arxiv.org/abs/2607.12281) | 作者：Siqi Wang, Xianjie Chen, Shaofeng Deng, Albert Chen, Romil Shah, Jiawei Huang, Zhaoqin Wang, Zhang Zhang, Yiqun Liu, Meilei Jiang, Anish Dubey, Moyan Mei, Tongxin Wang, Nathan Berrebbi, Misael Manjarres, Armand Sauzay, Shardul Kothapalli, Aryaman Vinchhi, Kevin Johnstone, Juheon Lee, Gufan Yin, Ziheng Huang, Justin Lin, Mert Terzihan, Yilin Qi, Cynthia Yang, Colin Peppler, Qi Ding, Ruohan Sun, Ge Song, Litao Deng, Parichay Kapoor, Matt Ma, Huihui Cheng, Jiyuan Zhang, Yanli Zhao, Yiping Han, Fangqiu Han, Ning Yao, Arun Singh, Jordan Edwards, Zhengyu Su, Abhishek Kumar, Guangdeng Liao, Ankit Asthana

**🗣️ 大白话：** Transformer 架构被广泛用于推荐系统，但有个问题：生成模型需要逐 token 自回归预测，所以中间张量随序列长度增长。但推荐只输出一组相关性分数，不需要 token 级监督。SlimPer 的思路是：把个性化排序变成「迭代精炼一个固定大小的 <user, item> 知识库」——每层只查必要 token，算相关性分数，精炼知识库，每层成本固定 O(N)。因此模型深度与历史长度解耦，10k+ 事件也轻松建模。已在 Instagram Reels 和 Feed 部署。

**🔬 专业讲解：** SlimPer 将个性化排序重新定义为紧凑统一 <user, item> 知识库的迭代精炼过程。每层选择性查询原始多模态用户侧 token，计算显式相关性匹配分数，并精炼知识库，每层成本 O(N) 且中间表征固定大小。请求级优化通过在所有候选 item 间共享一份用户侧 token 副本来进一步削减内存。统一融合稀疏、稠密和序列特征，注意力机制提供天然可解释性。Instagram Reels 和 Feed 生产部署，用户参与度可测量提升，同时精简整体系统。

---

### 6. RecRec: Latent Interests Recursive Reasoning for Sequential Recommendation

📄 [arXiv:2607.12945](https://arxiv.org/abs/2607.12945) | 作者：Wenhao Deng, Junchen Fu, Hanwen Du, Alexandros Karatzoglou, Ioannis Arapakis, Hangjun Guo, Kaiwen Zheng, Yongxin Ni, Joemon M. Jose

**🗣️ 大白话：** 序列推荐通常「一次过」——编码历史，直接预测。最近有人提出「推理时多算几步」来提升效果，但怎么组织这些推理步骤还是开放问题。RecRec 的答案是：把推理和预测解耦。先用 Context Compressor 把用户历史压缩成几个「潜在兴趣向量」，再用 Recursive Reasoner 在这些向量上反复推理，最后预测。不需要 RL，纯监督训练，推理深度可以随便调不用重新训练。

**🔬 专业讲解：** RecRec（Recursive Reasoning for Recommendation）是无 RL 的框架，通过将推理与预测解耦来克服先前方法固定 d 维状态瓶颈。两阶段监督训练：Context Compressor 通过 Interest Diversity Regularizer 将 backbone 隐状态蒸馏为少量潜在兴趣，每个兴趣捕捉用户行为的不同方面；Recursive Reasoner 在独立中间隐空间中迭代精炼这些兴趣。深度监督允许推理时自由调整深度。四个真实数据集上超越 SOTA 推理增强方法，且三个数据集的增益超越训练时深度。发现指向一种解耦的多向量方案，释放潜在推理摆脱单状态瓶颈。

---

### 7. Learning to Forget: Satiation-Aware Long-Sequence Transducers for Mitigating Post-Purchase Redundancy

📄 [arXiv:2607.12714](https://arxiv.org/abs/2607.12714) | 作者：Yipin Dai, Ruocong Tang, Xing Fang, Yang Huang, Jing Wang, Zhentao Song, He Guo

**🗣️ 大白话：** 序列推荐有个盲区：买了东西后，用户对这个品类/需求会「暂时饱和」，但模型还是继续推荐同类商品。比如刚买了手机壳，再推荐手机壳就是冗余。本文提出 SAM（Satiation-Aware Mechanism）教模型「学会遗忘」：买了东西后，相关历史兴趣暂时抑制，同时根据购买历史学习每个用户的「补货节奏」，等到预测复购周期临近时再「唤醒」。线上 A/B 测试将购买后重复率（PPRR）降低了 60% 以上。

**🔬 专业讲解：** SAM 包含三个核心组件：① 双路径交叉注意力架构，回溯抑制已满足意图关联的历史点击，同时从长期购买历史中提取个性化补货节奏；② 自适应饱和门控单元（ASGU）生成时间敏感软掩码，购买后立即抑制已满足兴趣，随着预测复购周期临近逐步「重新唤醒」；③ 自监督 Time-to-Next-Purchase（TTNP）辅助任务，无需人工标注即可学习潜在产品生命周期。工业数据集离线实验和线上 A/B 测试显示 SAM 将 PPRR（购买后重复率）降低超过 60%。

---

### 8. Cheaper is Better: A Discount-Aware Network for Conversion Rate Prediction in E-commerce Recommendation System

📄 [arXiv:2607.12578](https://arxiv.org/abs/2607.12578) | 作者：Ruocong Tang, Yang Huang, Xing Fang, Chenyi Yan, Chuike Sun, Jing Wang

**🗣️ 大白话：** 电商推荐里点击率（CTR）预测完了还要预测转化率（CVR），但 CVR 面临数据稀疏、样本选择偏差、延迟反馈三大难题。更重要的是：商品折扣率既影响定价又影响用户购买行为，但现有方法很少显式建模。DANet（Discount-Aware Network）专门解决这个问题：用傅里叶变换捕捉折扣率的长期频率趋势；用分布去偏模块缓解不同促销组合和周期导致的用户折扣率偏差；最后用监督回归辅助任务显式学习折扣标签。已在阿里天猫 APP 全量部署。

**🔬 专业讲解：** DANet 三组件：① 时频变换模块，利用傅里叶变换推导频谱并捕捉商品折扣率长期趋势；② 分布去偏模块，缓解不同购买组合和促销活动导致的用户特定折扣率偏差，以及不同促销周期关联的周期性偏差；③ 监督回归辅助任务，建立显式商品折扣标签以提升模型值精度。真实数据集离线实验 AUC 提升 1.61%；线上 A/B 测试 pCVR +3.63%、GMV +2.23%。已在阿里巴巴天猫 APP 成功部署。

---

### 9. Where Reasoning Matters: Rethinking Latent Reasoning in Semantic ID-based Generative Recommendation

📄 [arXiv:2607.12425](https://arxiv.org/abs/2607.12425) | 作者：Shangxin Yang, Min Gao, Zongwei Wang, Junliang Yu

**🗣️ 大白话：** 基于语义 ID 的生成式推荐，每个商品用一串短 token 表示，模型逐个 token 生成。最近有人提出「推理时多算几步」来改进生成质量。但问题来了：一个商品由多个 token 组成，每个 token 应该分配多少推理步骤？直觉是：前面的 token（粗粒度）信息量更大，后面的 token（细粒度）信息增量小。本文验证了这一点：用 Information Gain（IG）衡量每个 token 位置对目标商品的不确定性削减量，发现早期位置 IG 高、后期位置 IG 低。基于此提出 IBA——把推理步骤当作有限资源，学习如何分配到不同 token 位置，实现更优的精度-计算权衡。

**🔬 专业讲解：** 本文提出位置级信息增益（IG）来衡量语义 ID 各位置对目标商品的不确定性削减。实验发现早期语义 ID 位置通常提供更高 IG，后期贡献较少附加信息。进一步分析表明对高 IG 位置应用更多推理带来更大期望收益。基于此提出 IBA（Information-Gain Budget Allocation），将潜在推理步骤视为有限计算资源，学习如何在语义 ID 位置间分配，向信息丰富位置分配更多推理、向贡献较小位置分配更少。多公开数据集上 IBA 一致提升强生成式推荐基线，并在精度-计算权衡上优于固定或匹配不当的步骤分配。

---

### 10. Beyond Semantic IDs: Encoding Business-Value Ranking into Document Identifiers for Generative Retrieval

📄 [arXiv:2607.11392](https://arxiv.org/abs/2607.11392) | 作者：Gui Ling, Zhihong Chen, Yu Li, Tong Xiong, Kunhai Lin, Kaixuan Zhang, Yuliang Yan, Dan Ou, Haihong Tang, Bo Zheng

**🗣️ 大白话：** 生成式检索（GR）给每个商品一个 ID，模型通过自回归生成来检索。但现有语义 ID 方案有两个问题：①碰撞问题——不同商品 ID 可能一样；②DocID 的编码目标跟系统的业务目标（比如 GMV）不一致。本文提出 CRID（Cluster-Ranked Identifier），把 DocID 拆成「语义聚类」和「业务价值排序」两部分，无碰撞、支持增量更新。在淘宝 3 亿商品上实验，超越最强 embedding-based 检索基线，全量部署 GMV +1.06%。

**🔬 专业讲解：** CRID 将 DocID 解耦为语义聚类和业务价值排序，产生无碰撞标识符并支持通过簇内重排序进行增量更新。引入分析框架将检索收益分解为个性化偏好和统计先验泛化，揭示语义簇大小如何控制两个组件的平衡。淘宝 3 亿商品电商语料实验：CRID 超越最强 embedding-based 检索基线 top-K Hitrate，全量部署 GMV +1.06%。

---

## 📋 其他论文速览

- **TMallGS: Scaling Unified Feature and Sequence Modeling for Generative E-commerce Search**（arXiv:2607.13398）——天猫搜索的生成式排序架构，含分层分布校准 Tokenization、域自适应门控 Transformer、解耦 FiLM 晚融合、上下文感知偏置网络、误差感知渐进训练。线上 A/B 测试 UCTCVR 和 GMV 显著提升。

- **Can We Steer the Black-Box? Towards Controllability-Centric Evaluation of Recommender Systems with Collaborative Agents**（arXiv:2607.13418）——提出 CtrlBench-Rec 多智能体框架，系统评估推荐系统的可控性：目标内容发现、兴趣画像塑造、流行度偏差缓解。首个可控推荐研究标准化工具包。

- **Personalizing Incremental Video Search with Hybrid Text and ID Embeddings**（arXiv:2607.13493）——Apple TV 增量搜索个性化系统，融合 TextEmb（多语言语义编码器）和 IdEmb（协同 ID 嵌入）。模糊前缀查询（1-3字符）NDCG@10 +8.63%，线上点击率 +1.14%、转化率 +1.23%。

- **Long-term User Engagement Optimization through Model-agnostic Downstream Rewards Learning**（arXiv:2607.14192）——Pinterest 的统一模型无关下游奖励框架，通过离线筛选框架识别早期可观测且预测未来留存的会话级行为，提出多源用户行为模式衍生的模型无关下游奖励信号。已部署到 Pinterest Homefeed、Related Pins、Search、Notifications。

- **User Preference Induction with LLMs for Offline Top-N Recommendation Evaluation**（arXiv:2607.11354）——用 LLM 做两阶段偏好归纳：先总结用户历史交互为文本画像，再用 LLM 对未观测候选做相关性判断。扩展后的评价更完整，缓解流行度敏感偏差。

- **Impact of Expert-Following Strategies in Financial Asset Recommendation**（arXiv:2607.14556）——基于历史 ROI 识别顶级投资者并推荐其购买的资产，按 ROI 加权购买频率评分。在真实交易历史上同时显著提升 ROI 和 nDCG。

- **ViHoRec: A Quality-Controlled Vietnamese Hotel Recommendation Dataset and Cold-Start Benchmark**（arXiv:2607.12946）——越南首个公开、质量受控的酒店推荐数据集，18,267 次交互、6,832 用户、560 酒店。含冷启动基准和可复现构建流程。

- **Accelerating A/B-Tests with Counterfactual Estimation: Reducing Variance through Policy Overlap**（arXiv:2607.14604）——利用策略重叠加速 A/B 测试：当治疗和对照策略对某个动作达成一致时，该结果只贡献噪声。通过 Δ-Off-Policy Estimation 获得无偏平均治疗效果估计，方差随策略分歧而非原始结果方差缩放。