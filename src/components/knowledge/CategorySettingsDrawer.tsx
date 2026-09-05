import React, { useEffect, useState } from 'react';
import { X, Plus, Trash2, Lock } from 'lucide-react';
import type { KnowledgeFormat } from '../../types/knowledge';

export interface KnowledgeCategoryConfig {
  id: string;
  name: string;
  includes: string[];
  affects: string[];
  isDefault: boolean;
  primaryFormat: KnowledgeFormat;
  purpose: { stores: string; usedFor: string; excludes: string };
}

interface CategorySettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: KnowledgeCategoryConfig[];
  onSave: (categories: KnowledgeCategoryConfig[]) => void;
}

export const DEFAULT_CATEGORIES: KnowledgeCategoryConfig[] = [
  {
    id: 'c1',
    name: '品牌与产品',
    includes: ['品牌定位', '产品信息', '价格政策', '核心卖点', '功效边界'],
    affects: ['选题策划', '内容生成', '素材匹配', '商务报价'],
    isDefault: true,
    primaryFormat: '商家事实',
    purpose: { stores: '产品成分、价格、功效边界', usedFor: '写笔记时引用产品事实', excludes: '用户猜测、营销口号、没来源的数据' }
  },
  {
    id: 'c2',
    name: '账号与人设',
    includes: ['账号定位', '人设标签', '内容语气', '引流路径', '账号禁区'],
    affects: ['选题策划', '内容生成', '账号分配', '评论私信'],
    isDefault: true,
    primaryFormat: '常见问答',
    purpose: { stores: '账号身份、表达方式、常见提问', usedFor: '写内容时保持账号口吻', excludes: '临时情绪、未经确认的人设判断' }
  },
  {
    id: 'c3',
    name: '客户与痛点',
    includes: ['目标客群', '核心需求', '购买顾虑', '使用场景', '真实反馈'],
    affects: ['选题策划', '内容生成', '素材匹配', '转化承接'],
    isDefault: true,
    primaryFormat: '打法经验',
    purpose: { stores: '用户问题、购买顾虑、真实反馈', usedFor: '判断内容先解决哪个问题', excludes: '没有样本支撑的用户猜测' }
  },
  {
    id: 'c4',
    name: '内容与图文',
    includes: ['内容结构', '标题模式', '封面规范', '图文规则', '案例模板'],
    affects: ['笔记生成', '视觉生成', '内容审核', '发布执行'],
    isDefault: true,
    primaryFormat: '标杆范例',
    purpose: { stores: '已验证的内容结构、标题和图文范例', usedFor: '生成笔记和视觉时参考', excludes: '没有结论的零散截图' }
  },
  {
    id: 'c5',
    name: '禁区与流转',
    includes: ['禁用表达', '合规边界', '审核规则', '例外处理', '责任节点'],
    affects: ['发布前检查', '素材审核', '风险提醒', '任务流转'],
    isDefault: true,
    primaryFormat: '运营规则',
    purpose: { stores: '平台禁区、合规要求和任务流转规则', usedFor: '发布与审核前检查风险', excludes: '没有依据的个人提醒' }
  },
  {
    id: 'c6',
    name: '话术与承接',
    includes: ['评论回复', '私信话术', '咨询问题', '异议处理', '下一步动作'],
    affects: ['评论回复', '私信承接', '线索转化', '客服培训'],
    isDefault: true,
    primaryFormat: '常见问答',
    purpose: { stores: '用户问题、标准回答和承接动作', usedFor: '评论、私信和咨询回复', excludes: '未经确认的临时说法' }
  },
  {
    id: 'c7',
    name: '素材偏好',
    includes: ['拍摄要求', '构图偏好', '色彩风格', '禁用画面', '参考素材'],
    affects: ['素材任务', '素材筛选', '视觉生成', '素材审核'],
    isDefault: true,
    primaryFormat: '标杆范例',
    purpose: { stores: '偏好的拍摄、画面和视觉范例', usedFor: '下发素材任务与审核回传', excludes: '与品牌无关的通用审美' }
  },
  {
    id: 'c8',
    name: '打法复盘',
    includes: ['执行动作', '效果数据', '复盘结论', '适用条件', '下轮建议'],
    affects: ['方案制定', '选题策略', '执行调整', '复盘报告'],
    isDefault: true,
    primaryFormat: '打法经验',
    purpose: { stores: '做过的动作、结果数据和复盘结论', usedFor: '下一轮方案与执行调整', excludes: '只有感受、没有结果的记录' }
  }
];

export function normalizeKnowledgeFormat(format: string): KnowledgeFormat {
  if (format === '事实卡') return '商家事实';
  if (format === '规则卡') return '运营规则';
  if (format === '范例卡') return '标杆范例';
  if (format === '问答卡') return '常见问答';
  if (format === '经验卡') return '打法经验';
  return (format as KnowledgeFormat) || '商家事实';
}

const FORMAT_OPTIONS: Array<{ value: KnowledgeFormat; label: string; description: string }> = [
  { value: '商家事实', label: '商家事实', description: '一条一个明确事实，带来源依据与有效期限（如产品参数、价格、功效资质）' },
  { value: '运营规则', label: '运营规则', description: '一行一条明确红线，写清禁止项、合规依据与流转责任' },
  { value: '标杆范例', label: '标杆范例', description: '收录爆款与正反向标杆案例，用于内容生成与审核对照' },
  { value: '常见问答', label: '常见问答', description: '一问一答标准口径，写清适用场景、客群与承接动作' },
  { value: '打法经验', label: '打法经验', description: '执行动作 + 核心数据 + 复盘结论，用于下一轮方案调优' }
];

const PURPOSE_PLACEHOLDERS: Record<string, KnowledgeCategoryConfig['purpose']> = {
  商家事实: { stores: '产品成分、价格、功效边界', usedFor: '写笔记时引用产品事实', excludes: '用户猜测、营销口号、没来源的数据' },
  运营规则: { stores: '平台禁用词、审核规则、流转要求', usedFor: '发布前检查内容是否合规', excludes: '没有依据的提醒、个人偏好' },
  标杆范例: { stores: '好标题与坏标题、通过与驳回案例', usedFor: '生成内容时参考表达方式', excludes: '没有结论的单独截图' },
  常见问答: { stores: '用户问题、标准回答、适用场景', usedFor: '评论和私信回复', excludes: '没有确认的临时说法' },
  打法经验: { stores: '执行动作、结果数据、复盘结论', usedFor: '下一轮方案和内容调整', excludes: '只有感受、没有结果的记录' },
  事实卡: { stores: '产品成分、价格、功效边界', usedFor: '写笔记时引用产品事实', excludes: '用户猜测、营销口号、没来源的数据' },
  规则卡: { stores: '平台禁用词、审核规则、流转要求', usedFor: '发布前检查内容是否合规', excludes: '没有依据的提醒、个人偏好' },
  范例卡: { stores: '好标题与坏标题、通过与驳回案例', usedFor: '生成内容时参考表达方式', excludes: '没有结论的单独截图' },
  问答卡: { stores: '用户问题、标准回答、适用场景', usedFor: '评论和私信回复', excludes: '没有确认的临时说法' },
  经验卡: { stores: '执行动作、结果数据、复盘结论', usedFor: '下一轮方案和内容调整', excludes: '只有感受、没有结果的记录' }
};

const FORMAT_TAG_PRESETS: Record<string, Pick<KnowledgeCategoryConfig, 'includes' | 'affects'>> = {
  商家事实: {
    includes: ['核心信息', '数值口径', '适用范围', '有效期', '来源依据'],
    affects: ['内容生成', '事实引用', '素材匹配']
  },
  运营规则: {
    includes: ['允许事项', '禁止事项', '判断依据', '适用范围', '例外处理'],
    affects: ['发布前检查', '素材审核', '风险提醒']
  },
  标杆范例: {
    includes: ['正向案例', '反向案例', '标题范例', '图文范例', '结果说明'],
    affects: ['内容生成', '视觉生成', '内容审核']
  },
  常见问答: {
    includes: ['用户问题', '标准回答', '适用场景', '承接动作', '升级条件'],
    affects: ['评论回复', '私信承接', '客服培训']
  },
  打法经验: {
    includes: ['执行动作', '结果数据', '复盘结论', '适用条件', '下轮建议'],
    affects: ['方案制定', '执行调整', '复盘报告']
  },
  事实卡: {
    includes: ['核心信息', '数值口径', '适用范围', '有效期', '来源依据'],
    affects: ['内容生成', '事实引用', '素材匹配']
  },
  规则卡: {
    includes: ['允许事项', '禁止事项', '判断依据', '适用范围', '例外处理'],
    affects: ['发布前检查', '素材审核', '风险提醒']
  },
  范例卡: {
    includes: ['正向案例', '反向案例', '标题范例', '图文范例', '结果说明'],
    affects: ['内容生成', '视觉生成', '内容审核']
  },
  问答卡: {
    includes: ['用户问题', '标准回答', '适用场景', '承接动作', '升级条件'],
    affects: ['评论回复', '私信承接', '客服培训']
  },
  经验卡: {
    includes: ['执行动作', '结果数据', '复盘结论', '适用条件', '下轮建议'],
    affects: ['方案制定', '执行调整', '复盘报告']
  }
};

const hasSameTags = (current: string[], preset: string[]) => current.length === preset.length && current.every((tag, index) => tag === preset[index]);

export function CategorySettingsDrawer({ isOpen, onClose, categories: savedCategories, onSave }: CategorySettingsDrawerProps) {
  const [categories, setCategories] = useState<KnowledgeCategoryConfig[]>(savedCategories);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(savedCategories[0]?.id || '');

  const [newIncludeTag, setNewIncludeTag] = useState('');
  const [isAddingInclude, setIsAddingInclude] = useState(false);

  const [newAffectTag, setNewAffectTag] = useState('');
  const [isAddingAffect, setIsAddingAffect] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setCategories(savedCategories);
    setActiveCategoryId(current => savedCategories.some(category => category.id === current) ? current : savedCategories[0]?.id || '');
    setIsAddingInclude(false);
    setIsAddingAffect(false);
  }, [isOpen, savedCategories]);

  if (!isOpen) return null;

  const activeCategory = categories.find(c => c.id === activeCategoryId);
  const canSave = Boolean(activeCategory?.purpose.stores.trim() && activeCategory?.purpose.usedFor.trim() && activeCategory?.purpose.excludes.trim());

  const updateActiveCategory = (patch: Partial<KnowledgeCategoryConfig>) => {
    setCategories(prev => prev.map(category => category.id === activeCategoryId ? { ...category, ...patch } : category));
  };

  const handleAddCategory = () => {
    const id = `custom-${Date.now()}`;
    const preset = FORMAT_TAG_PRESETS['商家事实'];
    const next: KnowledgeCategoryConfig = {
      id,
      name: '新分类',
      includes: [...preset.includes],
      affects: [...preset.affects],
      isDefault: false,
      primaryFormat: '商家事实',
      purpose: { stores: '', usedFor: '', excludes: '' }
    };
    setCategories(prev => [...prev, next]);
    setActiveCategoryId(id);
  };

  const handleFormatChange = (nextFormat: KnowledgeFormat) => {
    if (!activeCategory) return;
    const normalizedCurrent = normalizeKnowledgeFormat(activeCategory.primaryFormat);
    const normalizedNext = normalizeKnowledgeFormat(nextFormat);
    const previousPreset = FORMAT_TAG_PRESETS[normalizedCurrent] || FORMAT_TAG_PRESETS['商家事实'];
    const nextPreset = FORMAT_TAG_PRESETS[normalizedNext] || FORMAT_TAG_PRESETS['商家事实'];
    updateActiveCategory({
      primaryFormat: nextFormat,
      includes: activeCategory.includes.length === 0 || hasSameTags(activeCategory.includes, previousPreset.includes)
        ? [...nextPreset.includes]
        : activeCategory.includes,
      affects: activeCategory.affects.length === 0 || hasSameTags(activeCategory.affects, previousPreset.affects)
        ? [...nextPreset.affects]
        : activeCategory.affects
    });
  };

  const handleSave = () => {
    if (!canSave) return;
    onSave(categories);
    onClose();
  };

  const handleDeleteCategory = (id: string) => {
    const target = categories.find(category => category.id === id);
    if (!target || target.isDefault) return;
    setCategories(prev => prev.filter(category => category.id !== id));
    if (activeCategoryId === id) setActiveCategoryId(categories[0].id);
  };

  const handleRemoveInclude = (tagToRemove: string) => {
    setCategories(prev => prev.map(c => 
      c.id === activeCategoryId 
        ? { ...c, includes: c.includes.filter(t => t !== tagToRemove) }
        : c
    ));
  };

  const handleAddInclude = () => {
    if (newIncludeTag.trim() && activeCategory && !activeCategory.includes.includes(newIncludeTag.trim())) {
      setCategories(prev => prev.map(c => 
        c.id === activeCategoryId 
          ? { ...c, includes: [...c.includes, newIncludeTag.trim()] }
          : c
      ));
    }
    setNewIncludeTag('');
    setIsAddingInclude(false);
  };

  const handleRemoveAffect = (tagToRemove: string) => {
    setCategories(prev => prev.map(c => 
      c.id === activeCategoryId 
        ? { ...c, affects: c.affects.filter(t => t !== tagToRemove) }
        : c
    ));
  };

  const handleAddAffect = () => {
    if (newAffectTag.trim() && activeCategory && !activeCategory.affects.includes(newAffectTag.trim())) {
      setCategories(prev => prev.map(c => 
        c.id === activeCategoryId 
          ? { ...c, affects: [...c.affects, newAffectTag.trim()] }
          : c
      ));
    }
    setNewAffectTag('');
    setIsAddingAffect(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-btn-main/20 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full sm:w-[800px] bg-page-bg shadow-2xl z-50 flex flex-col transform transition-transform">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border-default bg-surface-1">
          <div>
            <h2 className="text-lg font-bold text-text-main">知识业务分类设置</h2>
            <p className="text-sm text-text-tertiary mt-1">管理知识库分类，定义每个分类应包含的内容和应用场景。</p>
          </div>
          <button aria-label="关闭分类设置" onClick={onClose} className="p-2 text-text-tertiary hover:text-text-secondary rounded-full hover:bg-hover-bg transition-colors shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Sidebar - Categories List */}
          <div className="w-64 bg-surface-1 border-r border-border-default flex flex-col">
            <div className="p-4 border-b border-border-default">
              <button onClick={handleAddCategory} className="w-full py-2 bg-btn-main text-white rounded-lg text-sm font-medium hover:bg-btn-main-hover transition-colors flex items-center justify-center">
                <Plus className="w-4 h-4 mr-1.5" /> 新增分类
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {categories.map(cat => (
                <div
                  key={cat.id}
                  className={`group flex items-center rounded-lg text-sm transition-colors ${
                    activeCategoryId === cat.id
                      ? 'bg-hover-bg text-text-main font-medium'
                      : 'text-text-secondary hover:bg-page-bg'
                  }`}
                >
                  <button onClick={() => setActiveCategoryId(cat.id)} className="flex min-w-0 flex-1 items-center gap-2 px-4 py-2.5 text-left">
                    <span className="truncate">{cat.name}</span>
                    {cat.isDefault ? <span className="rounded bg-hover-bg px-1.5 py-0.5 text-[11px] font-normal text-text-tertiary">默认</span> : null}
                  </button>
                  {!cat.isDefault && activeCategoryId !== cat.id ? (
                    <button aria-label={`删除${cat.name}`} onClick={() => handleDeleteCategory(cat.id)} className="mr-3 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100">
                      <Trash2 className="h-4 w-4 text-text-tertiary transition-colors hover:text-danger" />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Edit Category */}
          <div className="flex-1 overflow-y-auto p-8 bg-page-bg">
            {activeCategory ? (
              <div className="space-y-8 max-w-lg">
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-2">分类名称</label>
                  <input 
                    type="text" 
                    value={activeCategory.name}
                    onChange={(e) => setCategories(prev => prev.map(c => c.id === activeCategoryId ? { ...c, name: e.target.value } : c))}
                    className="w-full px-4 py-2 bg-surface-1 border border-border-default rounded-xl text-sm focus:ring-2 focus:ring-neutral-200 outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-text-main">
                      主要沉淀格式（业务形态）
                      {activeCategory.isDefault ? <Lock className="h-3.5 w-3.5 text-text-tertiary" /> : null}
                    </label>
                    <span className="text-[12px] text-text-tertiary">用于标准化团队录入与 AI 提取</span>
                  </div>
                  <select
                    value={normalizeKnowledgeFormat(activeCategory.primaryFormat)}
                    disabled={activeCategory.isDefault}
                    onChange={(event) => handleFormatChange(event.target.value as KnowledgeFormat)}
                    className="w-full rounded-xl border border-border-default bg-surface-1 px-4 py-2.5 text-sm outline-none disabled:cursor-not-allowed disabled:bg-hover-bg disabled:text-text-tertiary focus:border-neutral-400"
                  >
                    {FORMAT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label} （{option.description.slice(0, 24)}...）
                      </option>
                    ))}
                  </select>
                  <p className="mt-1.5 text-[13px] text-text-tertiary">
                    {FORMAT_OPTIONS.find(option => option.value === normalizeKnowledgeFormat(activeCategory.primaryFormat))?.description}
                  </p>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-semibold text-text-main">用途与收录说明</label>
                  <div className="space-y-3 rounded-xl border border-border-default bg-surface-1 p-4">
                    {([
                      { key: 'stores', label: '这个区块存' },
                      { key: 'usedFor', label: '用于' },
                      { key: 'excludes', label: '不收' }
                    ] as const).map(row => (
                      <label key={row.key} className="flex items-center gap-3 text-sm text-text-secondary">
                        <span className="w-20 shrink-0">{row.label}</span>
                        <input
                          value={activeCategory.purpose[row.key]}
                          onChange={(event) => updateActiveCategory({ purpose: { ...activeCategory.purpose, [row.key]: event.target.value } })}
                          placeholder={PURPOSE_PLACEHOLDERS[normalizeKnowledgeFormat(activeCategory.primaryFormat)]?.[row.key] || ''}
                          className="min-w-0 flex-1 border-0 border-b border-border-default bg-transparent px-1 py-1.5 text-sm text-text-main outline-none focus:border-neutral-700"
                        />
                      </label>
                    ))}
                    <p className="pl-[92px] text-[12px] leading-5 text-text-tertiary">这一行帮 AI 判断内容该去别的区块，写清楚能少串块</p>
                  </div>
                </div>

                <div>
                  <div className="mb-3">
                    <label className="block text-sm font-semibold text-text-main flex items-center">
                      包含哪些知识
                    </label>
                    <p className="text-[13px] text-text-tertiary mt-1">已预置这个区块常用的知识标签，可删除或继续添加。</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3 items-center">
                    {activeCategory.includes.map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-surface-1 border border-border-default rounded-lg text-sm text-text-secondary flex items-center group">
                        {tag}
                        <button aria-label={`删除知识标签：${tag}`} onClick={() => handleRemoveInclude(tag)} className="ml-2 text-text-tertiary hover:text-danger">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                    {isAddingInclude ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={newIncludeTag}
                          onChange={(e) => setNewIncludeTag(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddInclude()}
                          className="w-32 px-2 py-1 bg-surface-1 border border-border-default rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
                          placeholder="输入标签..."
                          autoFocus
                          onBlur={handleAddInclude}
                        />
                      </div>
                    ) : (
                      <button 
                        onClick={() => setIsAddingInclude(true)}
                        className="px-3 py-1.5 bg-hover-bg border border-border-default border-dashed rounded-lg text-sm text-text-secondary hover:bg-selected-bg transition-colors flex items-center"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> 添加标签
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-3">
                    <label className="block text-sm font-semibold text-text-main flex items-center">
                      影响哪些业务
                    </label>
                    <p className="text-[13px] text-text-tertiary mt-1">已预置通常会受影响的业务标签，可删除或继续添加。</p>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    {activeCategory.affects.map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-surface-1 border border-border-default rounded-lg text-sm text-text-secondary flex items-center group">
                        {tag}
                        <button aria-label={`删除业务标签：${tag}`} onClick={() => handleRemoveAffect(tag)} className="ml-2 text-text-tertiary hover:text-danger">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                    {isAddingAffect ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={newAffectTag}
                          onChange={(e) => setNewAffectTag(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddAffect()}
                          className="w-32 px-2 py-1 bg-surface-1 border border-border-default rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
                          placeholder="输入标签..."
                          autoFocus
                          onBlur={handleAddAffect}
                        />
                      </div>
                    ) : (
                      <button 
                        onClick={() => setIsAddingAffect(true)}
                        className="px-3 py-1.5 bg-hover-bg border border-border-default border-dashed rounded-lg text-sm text-text-secondary hover:bg-selected-bg transition-colors flex items-center"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> 添加标签
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-border-default">
                  <p className="mb-3 text-right text-[13px] text-text-tertiary">保存后，AI 上传资料时会按这份说明自动拆解和归位。</p>
                  <div className="flex justify-end"><button onClick={handleSave} disabled={!canSave} className="px-6 py-2 bg-btn-main text-white rounded-lg text-sm font-medium hover:bg-btn-main-hover transition-colors shadow-sm disabled:cursor-not-allowed disabled:opacity-35">
                    保存修改
                  </button></div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-text-tertiary">
                请选择一个分类进行编辑
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
