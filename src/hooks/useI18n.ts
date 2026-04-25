import { useState, useEffect, useCallback } from 'react';

type Lang = 'zh' | 'en';

interface Translations {
  [key: string]: string | Translations;
}

const translations: Record<Lang, Translations> = {
  zh: {
    nav: {
      home: '首页',
      drama: '短剧',
      assets: '资产',
      market: '交易',
      stake: '质押',
      tasks: '任务',
      shop: '商城',
      profile: '个人中心',
      search: '搜索',
    },
    home: {
      heroTitle: '投资短剧IP',
      heroSubtitle: '分享版权收益',
      heroDesc: 'FunReelRWA 是全球首个短剧IP版权碎片化投资平台',
      exploreAssets: '探索资产',
      watchDrama: '观看短剧',
      hotAssets: '热门资产',
      hotAssetsDesc: '投资优质短剧IP，分享版权收益',
      viewAll: '查看全部',
      hotDramas: '热门短剧',
      hotDramasDesc: '观看精彩短剧，赚取积分奖励',
      assetProjects: '资产项目',
      dramaContent: '短剧内容',
      platformUsers: '平台用户',
      totalStaked: '质押总量',
      stats: {
        assets: '资产项目',
        dramas: '短剧内容',
        users: '平台用户',
        staked: '质押总量',
      },
    },
    assets: {
      title: '资产投资',
      subtitle: '投资优质短剧IP，获取稳定收益',
      totalAssets: '总发行资产',
      avgReturn: '平均收益率',
      participants: '参与人数',
      targetAmount: '目标金额',
      raisedAmount: '已募集',
      apy: '年化收益',
      duration: '期限',
      investNow: '立即投资',
      days: '天',
      target: '目标',
      raised: '已募',
      progress: '募资进度',
      description: '项目介绍',
      invest: '投资',
      investSuccess: '投资成功',
      amountPlaceholder: '请输入投资金额',
      notFound: '资产不存在',
    },
    drama: {
      title: '热门短剧',
      subtitle: '观看精彩短剧，赚取积分奖励',
      all: '全部',
      romance: '爱情',
      action: '动作',
      comedy: '喜剧',
      suspense: '悬疑',
      fantasy: '奇幻',
      episodes: '集',
      watchNow: '立即观看',
      commentPlaceholder: '发表评论...',
    },
    stake: {
      title: '质押挖矿',
      subtitle: '质押 IPT 代币获取收益',
      flexiblePool: '灵活质押池',
      stablePool: '稳健质押池',
      highYieldPool: '高收益质押池',
      annualReturn: '年化收益率',
      apy: '年化收益',
      lockPeriod: '锁定期',
      totalStaked: '总质押量',
      stakeNow: '立即质押',
      stake: '质押',
      estimated: '预计收益',
      amountPlaceholder: '请输入质押数量',
      stakeSuccess: '质押成功',
      notFound: '质押池不存在',
      vipBonus: 'VIP加成',
      vip: 'VIP',
    },
    market: {
      title: '市场交易',
      subtitle: '实时交易IPT代币',
      all: '全部',
      currentPrice: '当前价格',
      change24h: '24小时涨跌',
      high24h: '24小时最高',
      low24h: '24小时最低',
      volume: '成交量',
      buy: '买入',
      sell: '卖出',
      pending: '待处理',
      filled: '已成交',
      price: '价格',
      amount: '数量',
      timeAgo: '前',
      available: '可用',
      buyIpt: '买入IPT',
      sellIpt: '卖出IPT',
    },
    tasks: {
      title: '任务中心',
      subtitle: '完成任务获取积分和代币奖励',
      dailySign: '每日签到',
      watchDrama: '观看短剧',
      inviteFriend: '邀请好友',
      points: '积分',
      tokens: '代币',
      inProgress: '进行中',
      claimable: '可领取',
      claimed: '已领取',
      viewDetails: '查看详情',
      status: {
        incomplete: '未完成',
        inProgress: '进行中',
        claimable: '可领取',
        claimed: '已领取',
      },
      progress: '进度',
    },
    transactions: {
      title: '交易记录',
      buy: '买入',
      sell: '卖出',
      stake: '质押',
      unstake: '解质押',
      reward: '奖励',
    },
    shop: {
      title: '积分商城',
      subtitle: '使用积分兑换丰富奖励',
      exchange: '兑换',
      points: '积分',
      ticket: '观影券',
      vip: 'VIP',
      prop: '道具',
      notFound: '商品不存在',
      exchangeSuccess: '兑换成功',
      item: '商品',
    },
    profile: {
      title: '个人中心',
      myInvestments: '我的投资',
      myWallet: '我的钱包',
      pointsDetail: '积分明细',
      vipCenter: 'VIP中心',
      inviteFriends: '邀请好友',
      securitySettings: '安全设置',
      totalAssets: '总资产价值',
      totalReturn: '累计收益',
      reelBalance: 'REEL余额',
      inviteCode: '邀请码',
      logout: '退出登录',
      back: '返回个人中心',
      currentLevel: '当前等级',
      benefits: '权益',
    },
    wallet: {
      title: '我的钱包',
      total: '总资产估值',
      reel: 'REEL 代币',
      usdt: 'USDT',
      points: '积分',
      deposit: '充值',
      withdraw: '提现',
      recent: '最近交易',
      noWallet: '未绑定钱包地址',
      bindWallet: '绑定钱包地址',
      walletAddress: '绑定钱包地址',
      copied: '地址已复制',
    },
    deposit: {
      title: '充值',
      selectMethod: '选择充值方式',
      amount: '充值数量',
      confirm: '确认充值',
      connecting: '连接钱包中...',
      placeholder: '请输入充值数量',
      instruction: '充值说明',
      instruction1: '点击确认充值后会弹出钱包授权',
      instruction2: '授权后请按照显示的地址转账',
      instruction3: '转账完成后请联系客服确认',
      reelToken: 'REEL 代币',
      reelDesc: '充值 REEL 代币',
      usdt: 'USDT',
      usdtDesc: '充值 USDT',
    },
    withdraw: {
      title: '提现',
      selectMethod: '选择提现方式',
      amount: '提现数量',
      address: '提现钱包地址',
      confirm: '确认提现',
      connecting: '连接钱包中...',
      amountPlaceholder: '请输入提现数量',
      addressPlaceholder: '0x...',
      instruction: '提现说明',
      instruction1: '目前仅支持 REEL 代币提现',
      instruction2: '点击确认提现后会弹出钱包授权',
      instruction3: '授权后管理员会处理提现请求',
      instruction4: '如有疑问请联系客服',
      reelToken: 'REEL 代币',
      reelDesc: '可提现',
      usdt: 'USDT',
      usdtDesc: '暂不支持',
      notSupported: 'USDT 提现功能暂不支持，请联系客服',
      enterAddress: '请输入提现地址',
      underDev: '提现功能开发中，请联系客服',
    },
    whitepaper: {
      title: '白皮书',
      contents: '目录',
      summary: '摘要',
      overview: '项目概述与愿景',
      market: '市场分析',
      product: '产品功能架构',
      technology: '技术实现方案',
      rwa: 'RWA资产上链机制',
      tokenomics: '代币经济学',
      compliance: '合规与风险管理',
      business: '商业模式与盈利路径',
      roadmap: '路线图规划',
      team: '团队与顾问',
      risk: '风险披露与投资者保护',
      conclusion: '结语',

      summaryContent: `FunReelRWA 是一个将短剧版权通证化（IPT）与 Web3 金融基础设施深度融合的合规化平台。通过区块链技术与AI驱动的内容分析，平台将优质短剧 IP 的未来收益权拆分为可流通的数字资产凭证，使全球用户能够以极低门槛（最低5美元）参与短剧投资并分享票房及广告收益。平台构建了C2C+AMM混合交易市场、PoE（Proof of Engagement）观看即挖矿激励体系、机构级合规框架，以及AI增强的内容推荐系统，打造了一个集内容消费、资产投资、数据洞察于一体的Web3短剧生态。本白皮书全面阐述FunReelRWA在2025年市场环境下的战略升级、合规架构、技术革新与可持续商业模式。`,

      overviewContent: `1.1 项目背景：2025年市场新格局

2025年，全球短剧市场已进入精细化运营阶段。根据麦肯锡最新报告，全球短剧市场规模在2025年达到680亿美元，但行业集中度提升，头部平台占据70%市场份额。同时，RWA赛道监管框架逐渐清晰，美国SEC通过《数字资产证券框架》，欧盟MiCA法规全面实施，为合规化的文娱IP通证化提供了明确路径。

传统影视投资仍存在显著痛点：
• 高门槛壁垒：单部短剧投资门槛仍高达5-10万美元
• 流动性缺失：投资锁定期长达6-12个月，无法提前退出
• 信息不对称：投资者缺乏数据驱动的投资决策工具
• 收益不透明：传统分账体系复杂，投资者难以追踪收益

1.2 项目愿景

"让每一部短剧，成为全球创作者与粉丝共创共赢的数字艺术品。"

FunReelRWA的愿景是成为全球短剧IP资产化的合规基础设施。通过将现实世界资产（RWA）——短剧版权收益权——以符合证券法的方式通证化，我们连接创作者、机构投资者、个人观众与监管机构，打造透明、高效、可持续的短剧产业新生态。

1.3 核心价值主张（2025升级版）

• 合规化投资：IPT资产设计符合全球主要司法管辖区证券法规，通过KYC/AML+合格投资者认证双层机制
• 数据驱动决策：AI内容分析引擎提供票房预测、观众画像、风险评估，降低投资盲区
• 即时流动性：混合交易市场支持24/7交易，提供做市商深度保障机制
• 真实价值捕获：收益分配机制与实际现金流挂钩，杜绝庞氏结构
• 全球化合规架构：模块化合规框架，支持不同司法管辖区的差异化监管要求`,

      marketContent: `2.1 短剧市场：从爆发到成熟

根据Statista 2025年Q3报告：
• 全球市场规模：680亿美��（2024年：520亿美元），年增长率31%
• 区域分布：北美35%、亚太40%、欧洲15%、其他10%
• 用户行为：平均用户每日观看短剧45分钟，付费转化率18%
• 收益结构：订阅收入55%、广告收入30%、IP授权15%

关键趋势：
• 内容精品化：单集制作成本从2023年的5,000提升至2025年的15,000
• AI辅助创作：70%头部短剧采用AI进行剧本优化、分镜设计
• 跨平台分发：单一IP多平台分账成为主流

2.2 RWA赛道：合规化进程加速

根据BIS 2025年RWA报告：
• 全球RWA总规模：1.2万亿美元（2024年：7500亿）
• 细分领域：国债45%、房地产25%、私人信贷15%、IP版权10%、其他5%
• 监管进展：SEC批准15个合规RWA项目，欧盟MiCA框架下23个项目获得牌照

2.3 目标用户群体

• 机构投资者：寻求差异化收益，需要合规资产
• 高净值个人：资产配置多元化，风险控制需求
• 短剧创作者：融资困难，缺乏粉丝互动工具
• 普通观众：情感连接，小额参与
• 监管机构：投资者保护，市场稳定`,

      productContent: `3.1 AI增强的内容分析与投资决策

核心功能：
• 票房预测模型：基于历史10,000+短剧数据集，预测准确率85%
• 观众情感分析：实时分析评论、分享、完播率，生成情感指数
• 风险评级系统：从制作团队、题材热度、平台政策等15个维度评估风险
• 投资组合优化：根据用户风险偏好，推荐最优IPT组合

3.2 PoE 3.0 观看挖矿机制

UserReward = (QualityScore × DurationFactor × EngagementWeight) × (UserScore / TotalScore) × DailyPool × SustainabilityFactor

质量评分规则：
• 完播率：>80%获得满分，每降低10%扣30%分数
• 互动质量：真实评论（>20字符）权重是点赞的3倍
• 设备真实性：通过生物识别验证的设备获得1.5倍权重
• 社交传播：分享带来的新用户观看，原用户获得额外奖励

3.3 混合交易市场2.0

架构升级：
• C2C订单簿：支持限价单、市价单、止损单，深度图可视化
• AMM流动性池：引入集中流动性机制，资本效率提升4倍
• 做市商协议：专业做市商提供深度保障

风险管理：
• 波动性熔断：5分钟波动>15%暂停交易10分钟，>30%暂停1小时
• 大额交易审核：单笔>10,000需要人工审核
• 流动性保险基金：从手续费提取5%作为保险基金`,

      technologyContent: `4.1 全栈技术架构2.0

层级 | 技术栈 | 关键升级
前端 | React 18 + WebAssembly + WebGL | AI模型浏览器端推理，3D内容展示
后端 | Rust + GraphQL + Temporal | 工作流引擎，状态一致性保障
数据库 | TimescaleDB + Redis Cluster | 时序数据优化，毫秒级查询
区块链 | Ethereum L2 + Polygon zkEVM | Gas费降低95%，TPS提升至5000+
AI层 | PyTorch + ONNX + Triton | 模型即服务，实时推理
基础设施 | Kubernetes + Istio | 99.99% SLA，自动故障转移

4.2 核心技术亮点

4.2.1 合规性引擎
• KYC/AML集成：与Chainalysis、Elliptic深度集成
• 司法管辖区路由：用户请求自动路由到符合其所在地法规的节点
• 审计追溯：所有关键操作生成不可篡改的审计日志

4.2.2 AI-Blockchain融合架构
• 链下AI计算：敏感数据在可信执行环境（TEE）中处理
• 链上验证：关键预测结果通过零知识证明验证
• 模型更新治理：DAO投票决定AI模型升级

4.2.3 跨链资产桥
• 多链IPT：支持Ethereum、Polygon、Solana、BNB Chain
• 原子跨链交易：用户无需手动桥接，平台自动处理
• 统一资产视图：用户在一个界面管理所有链上的资产

4.2.4 隐私保护设计
• 零知识证明：用户身份与交易金额分离
• 差分隐私：数据分析添加噪声保护个体隐私
• 选择性披露：���户控制哪些数据对外可见`,

      rwaContent: `5.1 证券型代币设计原则

基于SEC《数字资产证券框架》和欧盟MiCA法规，IPT设计遵循：
• Howey测试规避：收益权与治理权分离，IPT不赋予平台治理权
• 限制转让：锁定期6个月，之后仅限合格投资者之间交易
• 信息披露：季度财务报告，重大事件实时披露
• 投资者保护：设立投资者赔偿基金，覆盖50%极端损失

5.2 IPT通证化流程

项目尽职调查：
1. 法律团队审核版权链
2. 财务团队验证收益预测
3. 技术团队评估制作能力

合规结构设计：
• 设立特殊目的实体（SPV）持有IP版权
• IPT代表SPV收益权份额
• 聘请持牌证券律师出具法律意见书

投资者认证：
• 合格投资者：金融资产>100,000或年收入>50,000
• 非合格投资者：限制投资额不超过净资产5%
• 地理限制：自动屏蔽受限司法管辖区

5.3 收益分配模型

收益来源 | 分配比例 | 保障机制
订阅收入 | 75% IPT持有人，15% 制片方，10% 平台 | 最低保证收益（MGR）机制
广告收入 | 70% IPT持有人，20% 平台，10% 创作者 | 动态eCPM调整
IP授权收入 | 65% IPT持有人，25% 版权方，10% 平台 | 优先购买权机制
衍生品收入 | 60% IPT持有人，30% 原创作者，10% 平台 | 收益阶梯分成

最低保证收益（MGR）机制：
• 平台设立保险基金，确保前3个月基础收益
• 未达预期收益部分，从保险基金补足
• 极端情况下启动IPT回购计划`,

      tokenomicsContent: `6.1 代币角色重新定位

代币 | 角色 | 合规设计
REEL | 实用型代币 | 非证券属性，通过Howey测试验证
IPT | 证券型资产 | 严格合规，限制转让，信息披露

REEL核心实用场景：
• 支付平台服务费（享受50%折扣）
• 质押获得高级功能权限
• 参与治理投票（非财务决策）
• 购买独家内容和体验

6.2 代币分配（2025优化版）

分配对象 | 占比 | 释放规则
社区与奖励 | 35% | 5年线性释放，季度递减
团队与创始 | 15% | 5年锁仓，2年cliff
投资者 | 15% | 2年锁仓，后3年线性释放
生态基金 | 20% | 按DAO提案释放
基金会 | 10% | 3年锁仓，后4年释放
做市商 | 5% | 6个月锁仓，动态释放

6.3 价值捕获机制

收入来源与分配：
• 交易手续费（0.3%）→ 60%回购销毁，40%流动性激励
• 资产管理费（0.5%）→ 80%质押奖励，20%运营成本
• 高级功能订阅 → 100%平台收入
• 数据API服务 → 70%生态基金，30%平台收入

6.4 质押模型

池类型 | 锁定期 | 基础年化 | VIP加成上限
保守池 | 180天 | 3-5% | +1.5%
平衡池 | 90天 | 6-8% | +2%
增长池 | 30天 | 9-12% | +2.5%
治理池 | 365天 | 4-6% + 治理权 | +3%`,

      complianceContent: `7.1 全球合规框架

模块化合规架构：
• 美国模块：符合SEC Regulation D，仅限合格投资者
• 欧盟模块：符合MiCA，提供完整招股说明书
• 亚洲模块：符合新加坡MAS、日本FSA、香港SFC规定
• 新兴市场模块：简化版，仅限小额投资

合规技术实现：
• 地理围栏自动限制服务区域
• 身份验证与投资限额动态计算
• 自动化合规报告生成
• 监管沙盒集成

7.2 风险管理委员会

组织架构：
• 独立主席：来自传统金融风险管理专家
• 成员构成：法律专家、技术安全专家、内容行业专家、投资者代表
• 决策机制：重大风险决策需要75%成员同意

核心职责：
• 每月风险评估报告
• 极端情况应急预案
• 保险策略制定
• 合规审计监督

7.3 保险与保障机制

多层次保障体系：
• 基础保障：平台保险基金（占总手续费5%）
• 二级保障：与Lloyd's合作的���制���保险
• 三级保障：DAO治理的应急资金池
• 最终保障：优质IPT资产清算权`,

      businessContent: `8.1 收入来源多元化

收入来源 | 2025占比 | 2027预测占比
交易手续费 | 40% | 30%
资产管理费 | 25% | 25%
SaaS订阅 | 15% | 20%
数据API服务 | 10% | 15%
广告与营销 | 10% | 10%

8.2 B2B2C战略

机构合作生态：
• 制片公司：提供融资+分发+数据分析全套服务
• 流媒体平台：内容采购+用户互动+收益分成
• 金融机构：资产打包+风险对冲+合规咨询
• 创作者MCN：人才培养+IP孵化+粉丝运营

企业级产品：
• FunReel Studio：创作者内容管理+融资工具
• FunReel Insights：机构投资者数据分析平台
• FunReel Compliance：合规即服务API

8.3 盈利路径

阶段 | 时间 | 关键目标
用户获取 | 2025 Q4-2026 Q2 | 50万MAU，50M TVL
产品深化 | 2026 Q3-2027 Q1 | 机构业务上线，100万MAU
生态扩展 | 2027 Q2-2027 Q4 | 全球化覆盖，500万MAU
平台经济 | 2028+ | DAO完全治理，多链生态`,

      roadmapContent: `路线图规划（2025-2028）

阶段 | 时间 | 里程碑 | KPI目标
Phase 1 | 2025 Q4 | 完成SEC Reg D备案，欧盟MiCA合规架构 | 10,000注册用户
Phase 2 | 2026 Q1-Q2 | 主网上线，5个合规IPT项目，AI预测引擎V1 | 10M TVL，50,000 MAU
Phase 3 | 2026 Q3-Q4 | 机构API开放，保险机制上线 | 50M TVL，200,000 MAU
Phase 4 | 2027 Q1-Q2 | 亚洲合规模块，创作者工作室，DAO治理启动 | 150M TVL，500,000 MAU
Phase 5 | 2027 Q3-2028 Q1 | 多链完全支持，机构级风险管理 | 500M TVL，1.5M MAU
Phase 6 | 2028 Q2+ | 跨链互操作，创作者DAO，IP衍生生态 | 1B+ TVL，5M+ MAU`,

      teamContent: `核心团队

Alex Chen — 创始人 & CEO
前TikTok短剧业务全球负责人，主导ReelShort从0到1000万DAU增长，哈佛商学院MBA，SEC注册投资顾问

Dr. Michael Li — CTO
前Coinbase首席架构师，主导多个链上RWA协议开发，CMU计算机博士，5项区块链专利持有者

Sophia Wang — COO
前Netflix亚太内容战略总监，操盘多部爆款剧集，斯坦福法学院JD，熟悉全球娱乐法规

David Zhang — CPO
前Spotify产品副总裁，从0到1搭建1亿用户产品体系，MIT人机交互博士

合规与金融顾问委员会

Sarah Johnson — 前SEC数字资产部门高级顾问，现为FunReel首席合规官
Professor Robert Chen — 斯坦福大学证券法教授，RWA领域权威学者
James Wilson — Lloyd's of London保险产品总监，定制化保险专家

团队成员持有平台代币锁仓5年，与长期价值深度绑定`,

      riskContent: `11.1 风险矩阵

风险类型 | 概率 | 影响 | 缓解措施
监管风险 | 高 | 严重 | 模块化合规，司法管辖区隔离
市场风险 | 中高 | 中等 | 保险基金，最低收益保证
技术风险 | 中 | 严重 | 多重审计，bug赏金，停机基金
运营风险 | 低 | 严重 | 团队冗余，关键人保险
流动性风险 | 中低 | 中等 | 做市商协议，流动性保险

11.2 投资者保护机制

四层保护体系：
• 信息披露：实时数据仪表盘，季度审计报告
• 资金隔离：用户资金100%托管，与运营资金分离
• 争议解决：链上仲裁机制，72小时响应承诺
• 退出保障：紧急回购计划，最低流动性保证

投资者权利：
• 随时查看底层资产数据
• 参与重大决策投票
• 申请赎回（锁定期后）
• 投诉直达合规委员会

11.3 重要免责声明

"FunReelRWA平台上的IPT资产属于证券型数字资产，投资存在本金损失风险。历史收益不代表未来表现。REEL代币不承诺任何财务回报，其价值取决于平台效用。本白皮书不构成投资建议，投资者应基于自身风险承受能力独立决策。平台已采取合理措施确保合规，但不保证完全符合所有司法管辖区法规。投资者应咨询专业法律、财务顾问。"`,

      conclusionContent: `结语：构建负责任的Web3娱乐经济

FunReelRWA代表了Web3向实用价值回归的重要一步。在2025年的市场环境下，我们摒弃了过度承诺和高通胀模型，转而构建一个合规优先、技术驱动、生态共赢的可持续平台。通过将真实世界资产与区块链技术深度融合，FunReelRWA不仅为投资者创造价值，更为创作者赋能，为观众提供深度参与的新方式。

我们坚信，Web3的真正价值不在于投机，而在于重构生产关系，让价值创造者获得公平回报。FunReelRWA将坚持这一信念，推动短剧产业向更透明、更公平、更创新的方向发展。

FunReelRWA — 共创价值，共享成功。

官网：https://funreel.io
合规文档中心：https://compliance.funreel.io
开发者文档：https://developers.funreel.io
投资者关系：ir@funreel.io
社区：Discord / Telegram / X (Twitter) / WeChat`,
    },
    points: {
      currentPoints: '当前积分',
      earned: '获得',
      used: '使用',
      history: '积分明细',
    },
    vip: {
      purchase: '购买',
    },
    invite: {
      title: '邀请好友',
      myCode: '我的邀请码',
      invited: '已邀请',
      points: '获得积分',
      tokens: '获得代币',
      rules: '邀请规则',
      rule1: '每邀请1位新用户注册，获得100积分',
      rule2: '被邀请人充值后，再获得200积分',
      rule3: '被邀请人投资后，再获得500积分',
      copied: '已复制到剪贴板',
    },
    settings: {
      title: '安全设置',
      desc: '保护您的账户安全',
      password: '修改密码',
      passwordDesc: '定期修改密码可以提高安全性',
      set: '设置',
      phone: '绑定手机',
      bound: '已绑定',
      notBound: '未绑定',
      bind: '去绑定',
      email: '绑定邮箱',
      wallet: '绑定钱包',
    },
    login: {
      title: '欢迎回来',
      subtitle: '选择登录方式开始您的投资之旅',
      email: '邮箱',
      phone: '手机',
      wallet: '钱包',
      google: 'Google',
      emailLabel: '邮箱地址',
      emailPlaceholder: '请输入邮箱地址',
      passwordLabel: '登录密码',
      passwordPlaceholder: '请输入密码',
      phoneLabel: '手机号码',
      phonePlaceholder: '请输入手机号码',
      codeLabel: '验证码',
      codePlaceholder: '请输入验证码',
      sendCode: '获取验证码',
      submit: '立即登录',
      success: '登录成功',
      walletDesc: '连接您的加密钱包进行登录',
      connectWallet: '连接钱包',
      walletConnecting: '正在连接钱包...',
      googleDesc: '使用 Google 账号快速登录',
      googleBtn: '使用 Google 登录',
      googleRedirect: '正在跳转至 Google...',
      noAccount: '还没有账号？',
      register: '立即注册',
      forgotPassword: '忘记密码？',
    },
    forgotPassword: {
      title: '找回密码',
      subtitle: '通过邮箱或手机重置您的密码',
      email: '邮箱找回',
      phone: '手机找回',
      emailLabel: '邮箱地址',
      emailPlaceholder: '请输入注册邮箱',
      phoneLabel: '手机号码',
      phonePlaceholder: '请输入注册手机号',
      codeLabel: '验证码',
      codePlaceholder: '请输入验证码',
      sendCode: '获取验证码',
      newPassword: '新密码',
      newPasswordPlaceholder: '请设置6-20位新密码',
      confirmPassword: '确认密码',
      confirmPasswordPlaceholder: '请再次输入新密码',
      submit: '重置密码',
      success: '密码重置成功',
      backToLogin: '返回登录',
      passwordMismatch: '两次输入的密码不一致',
    },
    register: {
      title: '创建账号',
      subtitle: '注册成为 FunReelRWA 会员',
      phone: '手机注册',
      email: '邮箱注册',
      phonePlaceholder: '请输入手机号码',
      emailPlaceholder: '请输入邮箱地址',
      code: '验证码',
      codePlaceholder: '请输入验证码',
      sendCode: '获取验证码',
      password: '设置密码',
      passwordPlaceholder: '请设置6-20位密码',
      agree: '我已阅读并同意',
      terms: '用户协议和隐私政策',
      submit: '立即注册',
      hasAccount: '已有账号？',
      login: '立即登录',
      success: '注册成功',
      inviteCode: '邀请码（可选）',
      invitePlaceholder: '输入邀请码',
      inviteApplied: '邀请码已应用，注册后可获得奖励',
    },
    common: {
      loading: '加载中...',
      noData: '暂无数据',
      error: '加载失败',
      retry: '重试',
      save: '保存',
      cancel: '取消',
      confirm: '确认',
      delete: '删除',
      edit: '编辑',
      create: '创建',
      search: '搜索',
      filter: '筛选',
      back: '返回',
      points: '积分',
      token: '代币',
      days: '天',
      input: '请输入',
      pleaseLogin: '请先登录',
      invalidAmount: '请输入有效金额',
    },
  },
  en: {
    nav: {
      home: 'Home',
      drama: 'Drama',
      assets: 'Assets',
      market: 'Market',
      stake: 'Stake',
      tasks: 'Tasks',
      shop: 'Shop',
      profile: 'Profile',
      search: 'Search',
    },
    home: {
      heroTitle: 'Invest in Short Drama IP',
      heroSubtitle: 'Share Copyright Revenue',
      heroDesc: 'FunReelRWA is the first fractional short drama IP investment platform',
      exploreAssets: 'Explore Assets',
      watchDrama: 'Watch Drama',
      hotAssets: 'Hot Assets',
      hotAssetsDesc: 'Invest in quality short drama IPs, share copyright revenue',
      viewAll: 'View All',
      hotDramas: 'Hot Dramas',
      hotDramasDesc: 'Watch exciting dramas, earn points rewards',
      assetProjects: 'Asset Projects',
      dramaContent: 'Drama Content',
      platformUsers: 'Platform Users',
      totalStaked: 'Total Staked',
      stats: {
        assets: 'Asset Projects',
        dramas: 'Drama Content',
        users: 'Platform Users',
        staked: 'Total Staked',
      },
    },
    assets: {
      title: 'Asset Investment',
      subtitle: 'Invest in quality short drama IPs for stable returns',
      totalAssets: 'Total Assets',
      avgReturn: 'Avg Return',
      participants: 'Participants',
      targetAmount: 'Target Amount',
      raisedAmount: 'Raised',
      apy: 'APY',
      duration: 'Duration',
      investNow: 'Invest Now',
      days: 'Days',
      target: 'Target',
      raised: 'Raised',
      progress: 'Progress',
      description: 'Description',
      invest: 'Invest',
      investSuccess: 'Investment successful',
      amountPlaceholder: 'Enter investment amount',
      notFound: 'Asset not found',
    },
drama: {
      title: 'Drama',
      subtitle: 'Watch dramas and earn points',
      all: 'All',
      romance: 'Romance',
      action: 'Action',
      comedy: 'Comedy',
      suspense: 'Suspense',
      fantasy: 'Fantasy',
      episodes: 'Episodes',
      watchNow: 'Watch Now',
      commentPlaceholder: 'Write a comment...',
    },
    stake: {
      title: 'Staking',
      subtitle: 'Stake IPT tokens to earn rewards',
      flexiblePool: 'Flexible Pool',
      stablePool: 'Stable Pool',
      highYieldPool: 'High Yield Pool',
      annualReturn: 'Annual Return',
      apy: 'APY',
      lockPeriod: 'Lock Period',
      totalStaked: 'Total Staked',
      stakeNow: 'Stake Now',
      stake: 'Stake',
      estimated: 'Estimated Reward',
      amountPlaceholder: 'Enter stake amount',
      stakeSuccess: 'Stake successful',
      notFound: 'Pool not found',
      vipBonus: 'VIP Bonus',
      vip: 'VIP',
    },
    market: {
      title: 'Market',
      subtitle: 'Trade IPT Token',
      all: 'All',
      currentPrice: 'Current Price',
      change24h: '24h Change',
      high24h: '24h High',
      low24h: '24h Low',
      volume: 'Volume',
      buy: 'Buy',
      sell: 'Sell',
      pending: 'Pending',
      filled: 'Filled',
      price: 'Price',
      amount: 'Amount',
      timeAgo: 'ago',
      available: 'Available',
      buyIpt: 'Buy IPT',
      sellIpt: 'Sell IPT',
    },
    tasks: {
      title: 'Task Center',
      subtitle: 'Complete tasks to earn points and tokens',
      dailySign: 'Daily Sign',
      watchDrama: 'Watch Drama',
      inviteFriend: 'Invite Friend',
      points: 'Points',
      tokens: 'Tokens',
      inProgress: 'In Progress',
      claimable: 'Claimable',
      claimed: 'Claimed',
      viewDetails: 'View Details',
      status: {
        incomplete: 'Incomplete',
        inProgress: 'In Progress',
        claimable: 'Claimable',
        claimed: 'Claimed',
      },
      progress: 'Progress',
    },
    transactions: {
      title: 'Transactions',
      buy: 'Buy',
      sell: 'Sell',
      stake: 'Stake',
      unstake: 'Unstake',
      reward: 'Reward',
    },
    shop: {
      title: 'Points Shop',
      subtitle: 'Redeem rewards with your points',
      exchange: 'Exchange',
      points: 'Points',
      ticket: 'Ticket',
      vip: 'VIP',
      prop: 'Prop',
      notFound: 'Item not found',
      exchangeSuccess: 'Exchange successful',
      item: 'Item',
    },
    profile: {
      title: 'Profile',
      myInvestments: 'My Investments',
      myWallet: 'My Wallet',
      pointsDetail: 'Points Detail',
      vipCenter: 'VIP Center',
      inviteFriends: 'Invite Friends',
      securitySettings: 'Security',
      totalAssets: 'Total Assets',
      totalReturn: 'Total Return',
      reelBalance: 'REEL Balance',
      inviteCode: 'Invite Code',
      logout: 'Logout',
      back: 'Back to Profile',
      currentLevel: 'Current Level',
      benefits: 'Benefits',
    },
    wallet: {
      title: 'My Wallet',
      total: 'Total Value',
      reel: 'REEL Token',
      usdt: 'USDT',
      points: 'Points',
      deposit: 'Deposit',
      withdraw: 'Withdraw',
      recent: 'Recent Transactions',
      noWallet: 'No wallet bound',
      bindWallet: 'Bind Wallet Address',
      walletAddress: 'Wallet Address',
      copied: 'Address copied',
      installMetaMask: 'Please install MetaMask wallet',
    },
    deposit: {
      title: 'Deposit',
      selectMethod: 'Select Deposit Method',
      amount: 'Deposit Amount',
      confirm: 'Confirm Deposit',
      connecting: 'Connecting Wallet...',
      placeholder: 'Enter deposit amount',
      instruction: 'Deposit Instructions',
      instruction1: 'Click confirm to authorize wallet',
      instruction2: 'Transfer to the displayed address',
      instruction3: 'Contact support after transfer',
      reelToken: 'REEL Token',
      reelDesc: 'Deposit REEL Token',
      usdt: 'USDT',
      usdtDesc: 'Deposit USDT',
      underDev: 'Deposit feature under development, contact support',
    },
    withdraw: {
      title: 'Withdraw',
      selectMethod: 'Select Withdraw Method',
      amount: 'Withdraw Amount',
      address: 'Withdraw Wallet Address',
      confirm: 'Confirm Withdraw',
      connecting: 'Connecting Wallet...',
      amountPlaceholder: 'Enter withdraw amount',
      addressPlaceholder: '0x...',
      instruction: 'Withdraw Instructions',
      instruction1: 'Currently only REEL token withdrawal supported',
      instruction2: 'Click confirm to authorize wallet',
      instruction3: 'Admin will process your request',
      instruction4: 'Contact support if needed',
      reelToken: 'REEL Token',
      reelDesc: 'Available',
      usdt: 'USDT',
      usdtDesc: 'Not Supported',
      notSupported: 'USDT withdrawal not supported, contact support',
      enterAddress: 'Please enter withdraw address',
      underDev: 'Withdraw feature under development, contact support',
    },
    points: {
      currentPoints: 'Current Points',
      earned: 'Earned',
      used: 'Used',
      history: 'Points History',
    },
    vip: {
      purchase: 'Purchase',
    },
    invite: {
      title: 'Invite Friends',
      myCode: 'My Invite Code',
      invited: 'Invited',
      points: 'Get Points',
      tokens: 'Get Tokens',
      rules: 'Invite Rules',
      rule1: 'Invite 1 new user to register, get 100 points',
      rule2: 'After invitee deposits, get 200 more points',
      rule3: 'After invitee invests, get 500 more points',
      copied: 'Copied to clipboard',
    },
    settings: {
      title: 'Security Settings',
      desc: 'Protect your account',
      password: 'Change Password',
      passwordDesc: 'Regular password changes improve security',
      set: 'Set',
      phone: 'Bind Phone',
      bound: 'Bound',
      email: 'Bind Email',
      wallet: 'Bind Wallet',
    },
    login: {
      title: 'Welcome Back',
      subtitle: 'Choose login method to start your investment journey',
      email: 'Email',
      phone: 'Phone',
      wallet: 'Wallet',
      google: 'Google',
      emailLabel: 'Email Address',
      emailPlaceholder: 'Enter your email',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      phoneLabel: 'Phone Number',
      phonePlaceholder: 'Enter your phone number',
      codeLabel: 'Verification Code',
      codePlaceholder: 'Enter verification code',
      sendCode: 'Send Code',
      submit: 'Login',
      success: 'Login Successful',
      walletDesc: 'Connect your crypto wallet to login',
      connectWallet: 'Connect Wallet',
      walletConnecting: 'Connecting wallet...',
      googleDesc: 'Quick login with Google account',
      googleBtn: 'Login with Google',
      googleRedirect: 'Redirecting to Google...',
      noAccount: "Don't have an account?",
      register: 'Register Now',
      forgotPassword: 'Forgot password?',
    },
    forgotPassword: {
      title: 'Reset Password',
      subtitle: 'Reset your password via email or phone',
      email: 'Email',
      phone: 'Phone',
      emailLabel: 'Email Address',
      emailPlaceholder: 'Enter your registered email',
      phoneLabel: 'Phone Number',
      phonePlaceholder: 'Enter your registered phone',
      codeLabel: 'Verification Code',
      codePlaceholder: 'Enter verification code',
      sendCode: 'Send Code',
      newPassword: 'New Password',
      newPasswordPlaceholder: 'Set 6-20 character password',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Confirm your new password',
      submit: 'Reset Password',
      success: 'Password reset successful',
      backToLogin: 'Back to Login',
      passwordMismatch: 'Passwords do not match',
    },
    register: {
      title: 'Create Account',
      subtitle: 'Join FunReelRWA membership',
      phone: 'Phone',
      email: 'Email',
      phonePlaceholder: 'Enter phone number',
      emailPlaceholder: 'Enter email address',
      code: 'Verification Code',
      codePlaceholder: 'Enter verification code',
      sendCode: 'Send Code',
      password: 'Set Password',
      passwordPlaceholder: 'Set 6-20 character password',
      agree: 'I agree to',
      terms: 'Terms & Privacy Policy',
      submit: 'Register',
      hasAccount: 'Already have an account?',
      login: 'Login Now',
      success: 'Registration Successful',
      inviteCode: 'Invite Code (Optional)',
      invitePlaceholder: 'Enter invite code',
      inviteApplied: 'Invite code applied, you will receive rewards after registration',
    },
    common: {
      loading: 'Loading...',
      noData: 'No Data',
      error: 'Error',
      retry: 'Retry',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      search: 'Search',
      filter: 'Filter',
      back: 'Back',
      points: 'Points',
      token: 'Token',
      days: 'Days',
      input: 'Please input',
      pleaseLogin: 'Please login first',
      invalidAmount: 'Please enter a valid amount',
    },
    whitepaper: {
      title: 'Whitepaper',
      contents: 'Contents',
      summary: 'Summary',
      overview: 'Project Overview & Vision',
      market: 'Market Analysis',
      product: 'Product Architecture',
      technology: 'Technology',
      rwa: 'RWA On-Chain Mechanism',
      tokenomics: 'Tokenomics',
      compliance: 'Compliance & Risk Management',
      business: 'Business Model',
      roadmap: 'Roadmap',
      team: 'Team & Advisors',
      risk: 'Risk Disclosure',
      conclusion: 'Conclusion',

      summaryContent: `FunReelRWA is a compliant platform that deeply integrates short drama copyright tokenization (IPT) with Web3 financial infrastructure. Through blockchain technology and AI-driven content analysis, the platform divides the future revenue rights of quality short drama IPs into tradable digital asset certificates, enabling global users to participate in short drama investment with extremely low thresholds (as low as $5) and share box office and advertising revenue. The platform has built a C2C+AMM hybrid trading market, PoE (Proof of Engagement) watch-to-earn incentive system, institutional-level compliance framework, and AI-enhanced content recommendation system, creating a Web3 short drama ecosystem that integrates content consumption, asset investment, and data insights. This whitepaper comprehensively expounds FunReelRWA's strategic upgrade, compliance framework, technological innovation, and sustainable business model in the 2025 market environment.`,

      overviewContent: `1.1 Project Background: 2025 Market New Pattern

In 2025, the global short drama market has entered the stage of refined operations. According to McKinsey's latest report, the global short drama market reached $68 billion in 2025, but industry concentration has increased, with leading platforms occupying 70% of market share. At the same time, the RWA track regulatory framework is becoming clearer, with the US SEC passing the Digital Asset Securities Framework and the EU MiCA regulations being fully implemented, providing a clear path for compliant entertainment IP tokenization.

Traditional Film Investment Pain Points:
• High barrier: Single short drama investment threshold still as high as $50,000-$100,000
• Lack of liquidity: Investment lock-up period up to 6-12 months, no early exit
• Information asymmetry: Investors lack data-driven investment decision tools
• Non-transparent returns: Traditional revenue sharing system is complex

1.2 Project Vision

"Make every short drama a digital artwork co-created and co-owned by global creators and fans."

FunReelRWA's vision is to become the compliant infrastructure for global short drama IP assetization. By tokenizing real world assets (RWA) - short drama copyright revenue rights - in compliance with securities laws, we connect creators, institutional investors, individual viewers, and regulators to create a transparent, efficient, and sustainable short drama industry new ecosystem.

1.3 Core Value Propositions (2025 Upgrade)

• Compliant Investment: IPT asset design complies with securities regulations in major jurisdictions, with dual-layer KYC/AML + accredited investor verification
• Data-Driven Decision: AI content analysis engine provides box office predictions, audience profiles, and risk assessments
• Instant Liquidity: Hybrid trading market supports 24/7 trading with market maker depth guarantee
• Real Value Capture: Revenue distribution mechanism linked to actual cash flow, avoiding Ponzi structures
• Global Compliance Architecture: Modular compliance framework supporting differentiated regulatory requirements across jurisdictions`,

      marketContent: `2.1 Short Drama Market: From Explosion to Maturity

According to Statista Q3 2025 Report:
• Global Market Size: $68B (2024: $52B), 31% YoY growth
• Regional Distribution: North America 35%, Asia Pacific 40%, Europe 15%, Other 10%
• User Behavior: Average user watches 45 minutes of short dramas daily, 18% paid conversion
• Revenue Structure: Subscription 55%, Advertising 30%, IP Licensing 15%

Key Trends:
• Content Premium: Per-episode production cost increased from $5,000 in 2023 to $15,000 in 2025
• AI-Assisted Creation: 70% of top short dramas use AI for script optimization and storyboard design
• Cross-Platform Distribution: Single IP multi-platform revenue sharing becomes mainstream

2.2 RWA Track: Compliance Acceleration

According to BIS 2025 RWA Report:
• Global RWA Total: $1.2T (2024: $750B)
• Segments: Government Bonds 45%, Real Estate 25%, Private Credit 15%, IP Copyright 10%, Other 5%
• Regulatory Progress: SEC approved 15 compliant RWA projects, EU MiCA framework approved 23 projects

2.3 Target User Groups

• Institutional Investors: Seeking differentiated returns, need compliant assets
• High Net Worth Individuals: Asset diversification, risk control needs
• Short Drama Creators: Financing difficulties, lack of fan interaction tools
• General Audience: Emotional connection, small participation
• Regulators: Investor protection, market stability`,

      productContent: `3.1 AI-Enhanced Content Analysis & Investment Decision

Core Functions:
• Box Office Prediction Model: Based on 10,000+ historical short drama datasets, 85% prediction accuracy
• Audience Sentiment Analysis: Real-time analysis of comments, shares, completion rates, generating sentiment index
• Risk Rating System: 15-dimensional risk assessment from production team, topic popularity, platform policies
• Portfolio Optimization: Recommends optimal IPT combinations based on user risk preference

3.2 PoE 3.0 Watch-to-Earn Mechanism

UserReward = (QualityScore × DurationFactor × EngagementWeight) × (UserScore / TotalScore) × DailyPool × SustainabilityFactor

Quality Scoring Rules:
• Completion Rate: Full score for >80%, minus 30% for every 10% decrease
• Engagement Quality: Real comments (>20 characters) weighted 3x likes
• Device Authenticity: Biometric-verified devices get 1.5x weight
• Social Sharing: Original user gets extra rewards for new users brought by sharing

3.3 Hybrid Trading Market 2.0

Architecture Upgrade:
• C2C Order Book: Support limit orders, market orders, stop-loss orders with depth visualization
• AMM Liquidity Pool: Concentrated liquidity mechanism (similar to Uniswap V3), 4x capital efficiency
• Market Maker Agreement: Professional market makers provide depth guarantee

Risk Management:
• Volatility Circuit Breaker: >15% in 5 minutes pauses trading for 10 minutes, >30% pauses for 1 hour
• Large Trade Review: Manual review required for trades >$10,000
• Liquidity Insurance Fund: 5% of trading fees as insurance fund`,

      technologyContent: `4.1 Full Stack Technology Architecture 2.0

Layer | Tech Stack | Key Upgrades
Frontend | React 18 + WebAssembly + WebGL | AI model browser inference, 3D content display
Backend | Rust + GraphQL + Temporal | Workflow engine, state consistency guarantee
Database | TimescaleDB + Redis Cluster | Time-series data optimization, millisecond queries
Blockchain | Ethereum L2 + Polygon zkEVM | Gas fee reduced 95%, TPS increased to 5000+
AI Layer | PyTorch + ONNX + Triton | Model as a service, real-time inference
Infrastructure | Kubernetes + Istio | 99.99% SLA, automatic failover

4.2 Core Technology Highlights

4.2.1 Compliance Engine
• KYC/AML Integration: Deep integration with Chainalysis, Elliptic
• Jurisdiction Routing: User requests automatically routed to nodes compliant with their location
• Audit Trail: All critical operations generate immutable audit logs

4.2.2 AI-Blockchain Integration
• Off-chain AI Computing: Sensitive data processed in Trusted Execution Environment (TEE)
• On-chain Verification: Key predictions verified through zero-knowledge proofs
• Model Update Governance: DAO voting decides AI model upgrades

4.2.3 Cross-Chain Bridge
• Multi-chain IPT: Support Ethereum, Polygon, Solana, BNB Chain
• Atomic Cross-Chain: Users don't need manual bridging, platform handles automatically
• Unified Asset View: Users manage assets across all chains in one interface

4.2.4 Privacy Protection
• Zero-Knowledge Proof: User identity separated from transaction amounts
• Differential Privacy: Noise added to data analysis to protect individual privacy
• Selective Disclosure: Users control which data is visible to others`,

      rwaContent: `5.1 Security Token Design Principles

Based on SEC Digital Asset Securities Framework and EU MiCA regulations:
• Howey Test Avoidance: Revenue rights and governance rights separated, IPT does not grant platform governance rights
• Transfer Restrictions: 6-month lock-up, then only tradable among accredited investors
• Disclosure: Quarterly financial reports, real-time disclosure of material events
• Investor Protection: Investor compensation fund covering 50% of extreme losses

5.2 IPT Tokenization Process

Project Due Diligence:
1. Legal team reviews copyright chain
2. Finance team verifies revenue projections
3. Technical team assesses production capability

Compliance Structure Design:
• Establish Special Purpose Vehicle (SPV) to hold IP copyright
• IPT represents SPV revenue rights share
• Engage licensed securities lawyer for legal opinion

Investor Accreditation:
• Accredited Investors: Financial assets >$100,000 or annual income >$50,000
• Non-Accredited Investors: Investment limited to ≤5% of net worth
• Geographic Restrictions: Automatically block restricted jurisdictions

5.3 Revenue Distribution Model

Revenue Source | Distribution | Guarantee Mechanism
Subscription | 75% IPT holders, 15% Producer, 10% Platform | Minimum Guarantee Revenue (MGR)
Advertising | 70% IPT holders, 20% Platform, 10% Creator | Dynamic eCPM adjustment
IP Licensing | 65% IPT holders, 25% Copyright owner, 10% Platform | Priority purchase rights
Derivatives | 60% IPT holders, 30% Original creator, 10% Platform | Tiered revenue sharing

Minimum Guarantee Revenue (MGR):
• Platform establishes insurance fund to ensure first 3 months basic revenue
• Shortfall from expected revenue covered from insurance fund
• IPT buyback plan initiated in extreme cases`,

      tokenomicsContent: `6.1 Token Role Repositioning

Token | Role | Compliance Design
REEL | Utility Token | Non-security属性, passes Howey test
IPT | Security Asset | Strict compliance, transfer restrictions, disclosure

REEL Core Use Cases:
• Pay platform fees (50% discount)
• Stake for premium features
• Participate in governance votes (non-financial decisions)
• Purchase exclusive content and experiences

6.2 Token Distribution (2025 Optimized)

Allocation | Percentage | Vesting Schedule
Community & Rewards | 35% | 5-year linear release, quarterly decline
Team & Founders | 15% | 5-year lock, 2-year cliff
Investors | 15% | 2-year lock, 3-year linear
Ecosystem Fund | 20% | Released per DAO proposals
Foundation | 10% | 3-year lock, 4-year release
Market Makers | 5% | 6-month lock, dynamic release

6.3 Value Capture Mechanism

Revenue Sources & Distribution:
• Trading Fees (0.3%) → 60% buyback & burn, 40% liquidity incentive
• Asset Management Fee (0.5%) → 80% staking rewards, 20% operations
• Premium Subscription → 100% platform revenue
• Data API Service → 70% ecosystem fund, 30% platform revenue

6.4 Staking Model

Pool Type | Lock Period | Base APY | VIP Bonus Cap
Conservative | 180 days | 3-5% | +1.5%
Balanced | 90 days | 6-8% | +2%
Growth | 30 days | 9-12% | +2.5%
Governance | 365 days | 4-6% + governance | +3%`,

      complianceContent: `7.1 Global Compliance Framework

Modular Compliance Architecture:
• US Module: SEC Regulation D compliant, accredited investors only
• EU Module: MiCA compliant, complete prospectus provided
• Asia Module: Compliant with Singapore MAS, Japan FSA, Hong Kong SFC
• Emerging Markets Module: Simplified, small investment only

Compliance Technology:
• Geofencing automatically restricts service areas
• Identity verification with dynamic investment limits
• Automated compliance report generation
• Regulatory sandbox integration

7.2 Risk Management Committee

Organization:
• Independent Chair: Risk management expert from traditional finance
• Members: Legal experts, technical security experts, content industry experts, investor representatives
• Decision Mechanism: 75% approval required for major risk decisions

Core Responsibilities:
• Monthly risk assessment reports
• Extreme situation emergency plans
• Insurance strategy formulation
• Compliance audit supervision

7.3 Insurance & Protection Mechanism

Multi-Layer Protection:
• Basic Protection: Platform insurance fund (5% of total fees)
• Secondary Protection: Customized insurance with Lloyd's of London
• Tertiary Protection: Emergency fund pool governed by DAO
• Final Protection: Quality IPT asset liquidation rights`,

      businessContent: `8.1 Diversified Revenue Sources

Revenue Source | 2025 Share | 2027 Forecast
Trading Fees | 40% | 30%
Asset Management | 25% | 25%
SaaS Subscription | 15% | 20%
Data API Services | 10% | 15%
Advertising & Marketing | 10% | 10%

8.2 B2B2C Strategy

Institutional Ecosystem:
• Production Companies: Full service financing + distribution + data analysis
• Streaming Platforms: Content procurement + user engagement + revenue sharing
• Financial Institutions: Asset packaging + risk hedging + compliance consulting
• Creator MCNs: Talent cultivation + IP incubation + fan operation

Enterprise Products:
• FunReel Studio: Creator content management + financing tools
• FunReel Insights: Institutional investor data analysis platform
• FunReel Compliance: Compliance as Service API

8.3 Profit Path

Phase | Time | Key Goals
User Acquisition | 2025 Q4-2026 Q2 | 500K MAU, $50M TVL
Product Deepening | 2026 Q3-2027 Q1 | Institutional business launch, 1M MAU
Ecosystem Expansion | 2027 Q2-2027 Q4 | Global coverage, 5M MAU
Platform Economy | 2028+ | Complete DAO governance, multi-chain ecosystem`,

      roadmapContent: `Roadmap (2025-2028)

Phase | Time | Milestone | KPI Target
Phase 1 | 2025 Q4 | SEC Reg D filing, EU MiCA compliance | 10,000 registered users
Phase 2 | 2026 Q1-Q2 | Mainnet launch, 5 compliant IPT projects | $10M TVL, 50,000 MAU
Phase 3 | 2026 Q3-Q4 | Institutional API, insurance mechanism | $50M TVL, 200,000 MAU
Phase 4 | 2027 Q1-Q2 | Asia compliance module, Creator Studio, DAO launch | $150M TVL, 500,000 MAU
Phase 5 | 2027 Q3-2028 Q1 | Multi-chain support, institutional risk management | $500M TVL, 1.5M MAU
Phase 6 | 2028 Q2+ | Cross-chain interoperability, Creator DAO, IP derivative ecosystem | $1B+ TVL, 5M+ MAU`,

      teamContent: `Core Team

Alex Chen — Founder & CEO
Former TikTok Short Drama Global Lead, led ReelShort from 0 to 10M DAU, Harvard Business School MBA, SEC Registered Investment Advisor

Dr. Michael Li — CTO
Former Coinbase Chief Architect, led multiple on-chain RWA protocol developments, CMU Computer Science PhD, 5 blockchain patents

Sophia Wang — COO
Former Netflix Asia Pacific Content Strategy Director, managed multiple hit dramas, Stanford Law JD, familiar with global entertainment regulations

David Zhang — CPO
Former Spotify Product VP, built 100M user product system from 0 to 1, MIT PhD in Human-Computer Interaction

Compliance & Financial Advisory Board

Sarah Johnson — Former SEC Digital Asset Senior Advisor, now FunReel Chief Compliance Officer
Professor Robert Chen — Stanford Law Professor, securities law expert, RWA field authority
James Wilson — Lloyd's of London Insurance Product Director, customized insurance expert

Team members have 5-year token lock-up, deeply aligned with long-term value.`,

      riskContent: `11.1 Risk Matrix

Risk Type | Probability | Impact | Mitigation | Insurance Coverage
Regulatory | High | Severe | Modular compliance, jurisdiction isolation | Partial
Market | Medium-High | Medium | Insurance fund, minimum guarantee | Full
Technical | Medium | Severe | Multiple audits, bug bounty, downtime fund | Full
Operational | Low | Severe | Team redundancy, key person insurance | Partial
Liquidity | Medium-Low | Medium | Market maker agreement, liquidity insurance | Partial

11.2 Investor Protection Mechanism

Four-Layer Protection:
• Disclosure: Real-time data dashboard, quarterly audit reports
• Fund Isolation: User funds 100% custodied, separated from operating funds
• Dispute Resolution: On-chain arbitration, 72-hour response commitment
• Exit Protection: Emergency buyback plan, minimum liquidity guarantee

Investor Rights:
• View underlying asset data anytime
• Vote on major decisions
• Apply for redemption (after lock-up)
• Direct complaints to compliance committee

11.3 Important Disclaimer

"IPT assets on the FunReelRWA platform are securities-type digital assets with risk of principal loss. Past performance does not guarantee future results. REEL tokens do not promise any financial returns; their value depends on platform utility. This whitepaper does not constitute investment advice; investors should make independent decisions based on their risk tolerance. The platform has taken reasonable measures to ensure compliance but does not guarantee full compliance with all jurisdictions. Investors should consult professional legal and financial advisors."`,

      conclusionContent: `Conclusion: Building a Responsible Web3 Entertainment Economy

FunReelRWA represents an important step for Web3 to return to practical value. In the 2025 market environment, we have abandoned over-promising and high-inflation models, and instead built a sustainable platform with compliance first, technology-driven, and ecosystem win-win. By deeply integrating real world assets with blockchain technology, FunReelRWA not only creates value for investors but also empowers creators and provides new ways for audiences to participate deeply.

We firmly believe that the true value of Web3 lies not in speculation but in restructuring production relationships, allowing value creators to receive fair rewards. FunReelRWA will adhere to this belief and promote the short drama industry towards more transparency, fairness, and innovation.

FunReelRWA — Co-create Value, Share Success.

Official Website: https://funreel.io
Compliance Center: https://compliance.funreel.io
Developer Docs: https://developers.funreel.io
Investor Relations: ir@funreel.io
Community: Discord / Telegram / X (Twitter) / WeChat`,
    },
  },
};

const LANG_STORAGE_KEY = 'funreel-lang-v2';

export function useI18n() {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY) as Lang;
      if (saved === 'zh' || saved === 'en') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'zh';
  });

  const setLang = useCallback((newLang: Lang | ((prev: Lang) => Lang)) => {
    if (typeof newLang === 'function') {
      setLangState((prev) => {
        const result = newLang(prev);
        try {
          localStorage.setItem(LANG_STORAGE_KEY, result);
        } catch {
          // ignore
        }
        return result;
      });
    } else {
      setLangState(newLang);
      try {
        localStorage.setItem(LANG_STORAGE_KEY, newLang);
      } catch {
        // ignore
      }
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const newLang = prev === 'zh' ? 'en' : 'zh';
      try {
        localStorage.setItem(LANG_STORAGE_KEY, newLang);
        window.dispatchEvent(new CustomEvent('languageChange', { detail: newLang }));
      } catch {
        // ignore
      }
      return newLang;
    });
  }, [setLang]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LANG_STORAGE_KEY && e.newValue) {
        if (e.newValue === 'zh' || e.newValue === 'en') {
          setLangState(e.newValue as Lang);
        }
      }
    };
    const handleLanguageChange = (e: CustomEvent<Lang>) => {
      if (e.detail === 'zh' || e.detail === 'en') {
        setLangState(e.detail);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let value: any = translations[lang];
    for (const k of keys) {
      value = value?.[k];
    }
    return typeof value === 'string' ? value : key;
  }, [lang]);

  return { lang, toggleLang, t, setLang };
}
