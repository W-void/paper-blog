---
title: "【推荐系统 Paper 日报】2026-10-24"
date: 2026-10-24
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/md/2793389981"
---

# 【推荐系统 Paper 日报】2026-10-24

## 📊 今日概览

本期覆盖 arXiv cs.IR 10月23日（周五）公告的 27 篇新论文，其中推荐系统相关 5 篇。今日最亮眼的是快手 OneLatent：把显式思维链压缩成 latent token 做推荐推理，线上 A/B 实测收入提升 9.6%，推理吞吐直接翻了 17 倍；LinkedIn 的 PAIR 则告诉我们"相似度检索"在职业社交场景是错的，互补意图才是正解。

## 🔥 推荐系统论文深度解读

### 1. OneLatent: Latent Reasoning for Efficient Foundation Recommendation Models

📄 [arXiv:2610.30675](https://arxiv.org/abs/2610.30675) | 工业界（快手）| Hao Jiang, Peiru Du, Pengfei Yao 等

**🗣️ 大白话：** 现在流行让大模型"先想再推荐"，但让模型每次都写一大段推理太慢太贵。快手这招是把推理过程"压缩"成几个可学习的隐藏 token——模型不用真的写出思考过程，而是把思考内化成几个"暗号"，直接基于暗号出推荐结果。效果没掉，速度快了 17 倍，还在快手中介广告场景实测提升了 9.6% 收入。

**🔬 专业讲解：** 论文针对 FRM（基础推荐模型）中 Think-then-Answer 范式的两大痛点：显式 CoT 生成冗长推理轨迹的推理开销，以及手工模板难以捕捉动态多样的用户兴趣。OneLatent 提出三点：① MV-ACoT（多视角自适应 CoT）从多视角探索用户兴趣并自适应调整推理复杂度，生成多样化高质量教师监督；② 三阶段 latent-token 对齐范式，将 CoT 轨迹渐进内化为可学习的 latent token，实现 Latent-Reason-then-Answer 推理；③ 多阶段课程式后训练激活 latent token 推理能力。在快手工业级数据集与公开 LLM-Rec 基准上，相比 Think/No-Think 变体 SID@64 分别提升 17.44%/9.33%，在线推理吞吐提升 17 倍以上；线上 A/B（本地服务广告场景）相对 OneRec、OneReason 等强基线预估收入 +9.6%，并配套了可扩展的实时 FRM 服务系统。这是 latent reasoning 在大规模推荐落地的一次标志性实践。

---

### 2. PAIR: Preference-Aligned Intent Retrieval for Premium People Recommendation at LinkedIn

📄 [arXiv:2610.30941](https://arxiv.org/abs/2610.30941) | 工业界（LinkedIn）| Zhongkai Shangguan, Yanbin Kang, Yihan Cao 等

**🗣️ 大白话：** 找工作的人想看的是招聘官，不是和自己履历相似的"同行"。LinkedIn 指出：职业社交里"相似 profile"的检索逻辑根本不对，得学"互补意图"——谁会点谁。他们用 DPO 的偏好学习思路改造成对比学习检索，0.6B 小模型就打出了 MAR@100=0.45 的效果。

**🔬 专业讲解：** 传统用户推荐依赖 profile 相似度或社交近邻，适用于同质连接的社交网络；但 LinkedIn 这类专业平台上交互是目标驱动、跨角色的（求职者↔招聘者），需要互补意图匹配。PAIR 的核心设计：① 受 DPO 偏好学习启发，但将偏好学习实例化为 exposure-conditioned 多负例对比目标，无需显式参考模型，训练简洁且可扩展至大规模候选集；② 用户侧用带位置编码的点击历史聚合捕捉时序，固定历史窗口内常数代价更新用户表示，新交互无需重编码历史——线上服务时个性化更新只靠轻量 CPU 运算，避免了重复 LLM 推理。Premium 检索任务上 0.6B 模型达到 MAR@100 0.45。对做双边/多角色匹配推荐（招聘、相亲、买家卖家）的同学很有参考价值。

---

### 3. UserArena: Benchmarking Interactive User Simulation for Long-Horizon Shopping Agents

📄 [arXiv:2610.30932](https://arxiv.org/abs/2610.30932) | Benchmark | Jujia Zhao, Jiakai Tang, Jing Yu 等

**🗣️ 大白话：** 想做"会跟用户多轮互动的购物 Agent"，就得先有一个能模拟真实用户的沙盒。UserArena 搞了个超大规模电商交互基准：1.1 万真实用户的 6.5 万条会话轨迹、56 万商品、13 种动作，还能拿真实线上 A/B 结果做离线验证。同时提出了轨迹级蒸馏（OPTD）让模拟器更"像真人"。

**🔬 专业讲解：** Agentic recommendation 需要忠实捕捉交互环境与用户行为响应的推荐世界模型，但现有资源缺少长时程、细粒度真实用户轨迹，也不支持轨迹级评估和与生产 A/B 结果的对齐验证。UserArena 提供 64,729 条会话轨迹（11,010 用户、566,102 商品、13 种动作类型），配交互环境，支持从输出合法性、局部决策到序列行为、个性化、最终结果五级评估，并可与受控生产 A/B 结果离线对齐。为提升长时程模拟保真度，提出 On-Policy Trajectory Distillation（OPTD）：用轨迹级意图在学生模型自生成的 rollout 上提供稠密教师目标。实验显示 OPTD 在其评估协议下保真度最强、离线模拟中最接近生产策略效应。对 Agent 推荐策略的离线评估与仿真训练是重要基础设施。

---

### 4. FAIRGate: Agentic Runtime Policy Selection and Verified Repair for Fairer Recommendation Delivery

📄 [arXiv:2610.30359](https://arxiv.org/abs/2610.30359) | 会议（IRAI 2026）| Navkar Jain, Enock Ayiku, Kenneth Fletcher

**🗣️ 大白话：** 推荐公平性一般要么训练时写死一个目标，要么排序后套一个固定重排规则。FAIRGate 的思路是：在 ranker 和最终 top-K 之间加一个"Agent 调度员"，根据每次请求的实时状态（候选池、曝光欠债、用户偏好历史等）从现成策略库里挑一个合适的公平性策略执行，最后还有个"验收员"确保改完之后相关性、可行性、审计约束都达标。

**🔬 专业讲解：** 部署时候选池、物品元数据、曝光债务、用户偏好历史与效用预算都在变，单一训练目标或固定重排难以适配每个请求。FAIRGate 是模型无关的投递控制器：Agent 不从头定义公平目标，而是从预定义策略库（长尾曝光、物品组曝光均衡、集中度控制、校准保护、弃权）中选择；确定性执行器通过约束修复（constrained repair）应用所选策略；验证器仅在相关性、可行性、元数据、校准与审计约束全部满足时接受结果；末端的 LLM 组件只拿到已验证的审计轨迹，在排序决策固定后生成有证据链的叙述。核心贡献是把"运行时公平决策"做到可度量、有界、可重放，避免 Agent 自由发挥。

---

### 5. Bezier-Guided Adaptive Flow for Cross-domain Sequential Recommendation

📄 [arXiv:2610.30825](https://arxiv.org/abs/2610.30825) | 学术 | Ziang Lu, Yu Zhang, Xinzhe Jiang 等

**🗣️ 大白话：** 跨域序列推荐想让 A 域的兴趣知识帮到 B 域，但每个人跨域的偏好一致性不一样：有人购物口味全平台统一，有人在美团点外卖和买手机完全是两个人。BGAFlow 让"迁移多少"因人而异，还用贝塞尔曲线当参考轨迹、学一个残差流来平滑地演化语义表示。

**🔬 专业讲解：** 针对现有方法全局对齐目标或粗粒度迁移策略会引入无关信息、难以适配个体偏好差异的问题，BGAFlow 三步走：① 统一双域预训练 + LLM 推断的用户画像建立共享语义空间；② 基于隐兴趣重叠估计个性化迁移范围（personalized horizon），决定每个用户的迁移程度；③ 构造条件贝塞尔曲线作为几何参考，学习残差流（residual flow）基于中间偏好状态渐进细化轨迹，并引入动态偏好反馈调整迁移方向，配合推荐监督与轨迹正则保证适配有效平滑。真实数据集上全面超越 SOTA 基线，验证了个性化迁移控制与状态自适应语义演化的价值。

---

## 📋 其他论文速览

- **The Fusion Tax: When Hybrid Retrieval Hurts**（arXiv:2610.30612）：混合检索的"融合税"诊断——最好的融合方法也有 13-48% 的查询排得比单路更差，RRF 在稠密检索明显更强时税最重，融合决策应取决于目标语料的稀疏-稠密平衡。
- **Getting a GRIP on Graph-Based Search for Learned Sparse Retrieval**（arXiv:2610.30425）：推翻"LSR 该用倒排索引"的共识，GRIP 把倒排优点注入图检索，MS MARCO 138M 文档上 95% recall@10 延迟比 Seismic 快 2.5 倍。
- **Lychee: Certified Screening of Inverted Lists for High-Recall Vector Search**（arXiv:2610.30697）：GPU 倒排检索的"认证筛除"，多数向量不用读全精度就能排除，十亿向量上 recall 0.9999 比 IVF-Flat 快 44.5 倍。
- **IRAH: Hierarchical Agentic Tree Search for Retrieval Pipeline Optimization**（arXiv:2610.30167）：用 LATS 式树搜索 + 元学习热启动自动搭 RAG 检索管线，评测预算受限下平均 nDCG@10 达 0.4816。
- **The Fusion Tax 之外，检索评测侧还有 Deep Search in Real-World Web Environments**（arXiv:2610.30181）：OpenDS-World 基准测真实开放网页上的多步深度搜索，12 个前沿模型最高 39% 准确率，比人类评测（21.1%）高但不稳定。
- **When Agentic Retrieval Fails Silently**（arXiv:2610.30423）：Adobe 生产环境证据：Agent 场景里 CTR/MRR 的归因假设失效（谁看、何时看、什么导致转化都变了），提出 LARA 三层评估框架修复归因。
- **Protection Is Not One Event: RAG Protection Survey**（arXiv:2610.30193）：118 篇 RAG 防护论文按"实测终点"系统分类，发现防住逐字复制≠防住隐私恢复：8-gram 守卫把复制降到 0%，自适应攻击者仍能找回 48.3% 隐藏事实。
- **Data-Void Exploits in Web-Searching LLMs**（arXiv:2610.30365）：NDSS 2027，攻击者只需一个页面填进"数据空洞"，联网 LLM 就有 31% 概率引用攻击内容，提示语气和模型选择都挡不住。
- **FlexVDR**（arXiv:2610.30177）：视觉文档检索的查询自适应预算分配，单个模型按需调节计算量，不用重训练。
- **FormBench**（arXiv:2610.30175）：配方专利细粒度检索基准，5.5 万查询，商业 API 编码器在域内几何坍缩下表现惨烈（C1 上 0.009），BM25 反而能打。
- **Formal-Informal Mathematical Alignment**（arXiv:2610.31011）：CIKM 2026，把 Stacks Project 的非形式化数学与 mathlib 形式化对应起来，检索+LLM 重排+验证发现新对齐并接入 MaRDI 知识图谱。
