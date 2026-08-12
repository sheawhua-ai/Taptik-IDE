import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface KnowledgeCategoryConfig {
  id: string;
  name: string;
  includes: string[];
  affects: string[];
}

interface CategorySettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_CATEGORIES: KnowledgeCategoryConfig[] = [
  {
    id: 'c1',
    name: '品牌与产品',
    includes: ['品牌定位', '产品池', '价格体系', '核心卖点', '商家定位'],
    affects: ['内容生成', '素材匹配', '私域回复']
  },
  {
    id: 'c2',
    name: '账号与人设',
    includes: ['KOS 人设', '引流路径', '目标客户画像', '沟通风格'],
    affects: ['内容策划', '私域回复', '话术策略']
  },
  {
    id: 'c3',
    name: '客户与痛点',
    includes: ['目标客户画像', '需求痛点', '购买顾虑', '真实反馈'],
    affects: ['内容策划', '素材匹配', '话术策略']
  }
];

export function CategorySettingsDrawer({ isOpen, onClose }: CategorySettingsDrawerProps) {
  const [categories, setCategories] = useState<KnowledgeCategoryConfig[]>(DEFAULT_CATEGORIES);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(categories[0].id);

  const [newIncludeTag, setNewIncludeTag] = useState('');
  const [isAddingInclude, setIsAddingInclude] = useState(false);

  const [newAffectTag, setNewAffectTag] = useState('');
  const [isAddingAffect, setIsAddingAffect] = useState(false);

  if (!isOpen) return null;

  const activeCategory = categories.find(c => c.id === activeCategoryId);

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
      <div className="fixed inset-0 bg-neutral-900/20 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full sm:w-[800px] bg-neutral-50 shadow-2xl z-50 flex flex-col transform transition-transform">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-neutral-200 bg-white">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">知识业务分类设置</h2>
            <p className="text-sm text-neutral-500 mt-1">管理知识库分类，定义每个分类应包含的内容和应用场景。</p>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100 transition-colors shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Sidebar - Categories List */}
          <div className="w-64 bg-white border-r border-neutral-200 flex flex-col">
            <div className="p-4 border-b border-neutral-100">
              <button className="w-full py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center">
                <Plus className="w-4 h-4 mr-1.5" /> 新增分类
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors flex justify-between items-center group ${
                    activeCategoryId === cat.id 
                      ? 'bg-neutral-100 text-neutral-900 font-medium' 
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {cat.name}
                  {activeCategoryId !== cat.id && (
                    <Trash2 className="w-4 h-4 text-neutral-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right Content - Edit Category */}
          <div className="flex-1 overflow-y-auto p-8 bg-neutral-50">
            {activeCategory ? (
              <div className="space-y-8 max-w-lg">
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">分类名称</label>
                  <input 
                    type="text" 
                    value={activeCategory.name}
                    onChange={(e) => setCategories(prev => prev.map(c => c.id === activeCategoryId ? { ...c, name: e.target.value } : c))}
                    className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-neutral-200 outline-none"
                  />
                </div>

                <div>
                  <div className="mb-3">
                    <label className="block text-sm font-semibold text-neutral-900 flex items-center">
                      包含哪些知识
                    </label>
                    <p className="text-xs text-neutral-500 mt-1">描述这个板块应收录哪些知识。</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3 items-center">
                    {activeCategory.includes.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-700 flex items-center group">
                        {tag}
                        <button onClick={() => handleRemoveInclude(tag)} className="ml-2 text-neutral-400 hover:text-red-500">
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
                          className="w-32 px-2 py-1 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
                          placeholder="输入标签..."
                          autoFocus
                          onBlur={handleAddInclude}
                        />
                      </div>
                    ) : (
                      <button 
                        onClick={() => setIsAddingInclude(true)}
                        className="px-3 py-1.5 bg-neutral-100 border border-neutral-200 border-dashed rounded-lg text-sm text-neutral-600 hover:bg-neutral-200 transition-colors flex items-center"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> 添加标签
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-3">
                    <label className="block text-sm font-semibold text-neutral-900 flex items-center">
                      影响哪些业务
                    </label>
                    <p className="text-xs text-neutral-500 mt-1">描述 AI 应在什么业务场景使用本板块。</p>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    {activeCategory.affects.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-700 flex items-center group">
                        {tag}
                        <button onClick={() => handleRemoveAffect(tag)} className="ml-2 text-neutral-400 hover:text-red-500">
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
                          className="w-32 px-2 py-1 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
                          placeholder="输入标签..."
                          autoFocus
                          onBlur={handleAddAffect}
                        />
                      </div>
                    ) : (
                      <button 
                        onClick={() => setIsAddingAffect(true)}
                        className="px-3 py-1.5 bg-neutral-100 border border-neutral-200 border-dashed rounded-lg text-sm text-neutral-600 hover:bg-neutral-200 transition-colors flex items-center"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> 添加标签
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-200 flex justify-end">
                  <button onClick={onClose} className="px-6 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm">
                    保存修改
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-neutral-400">
                请选择一个分类进行编辑
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
