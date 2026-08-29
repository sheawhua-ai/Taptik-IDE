import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { KnowledgeItem, BusinessCategory } from '../../types/knowledge';

interface KnowledgeTabProps {
  knowledgeList: KnowledgeItem[];
  onOpenKnowledge: (item: KnowledgeItem) => void;
}

export function KnowledgeTab({ knowledgeList, onOpenKnowledge }: KnowledgeTabProps) {
  const [filterType, setFilterType] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | null>(null);

  const filters = ['全部', '待确认', '商家事实', '规则与禁区', '经验建议', '已失效'];
  const categories: BusinessCategory[] = ['品牌与产品', '账号与人设', '客户与痛点', '内容与图文', '禁区与流转', '话术与承接', '素材偏好', '打法复盘'];

  const filteredList = useMemo(() => {
    return knowledgeList.filter(item => {
      if (filterType === '待确认' && item.state !== '待确认') return false;
      if (filterType === '已失效' && item.state !== '已失效') return false;
      if (['商家事实', '规则与禁区', '经验建议'].includes(filterType) && item.type !== filterType) return false;
      if (selectedCategory && item.category !== selectedCategory) return false;
      if (searchQuery && !item.summary.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [knowledgeList, filterType, selectedCategory, searchQuery]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-1 p-2 rounded-xl shadow-sm border border-border-default">
        <div className="flex flex-wrap gap-1">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterType === f 
                  ? 'bg-hover-bg text-text-main' 
                  : 'text-text-secondary hover:bg-page-bg'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto px-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input 
              type="text" 
              placeholder="搜索知识或来源..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-page-bg border-none rounded-lg text-sm focus:ring-2 focus:ring-neutral-200 outline-none"
            />
          </div>
          <div className="relative group">
            <button className="p-2 text-text-tertiary hover:bg-page-bg rounded-lg border border-transparent hover:border-border-default transition-colors">
              <Filter className="w-4 h-4" />
            </button>
            {/* Simple Dropdown for Category filtering for demo */}
            <div className="absolute right-0 mt-2 w-48 bg-surface-1 border border-border-default rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 p-2">
              <div className="text-[13px] font-semibold text-text-tertiary px-2 mb-2 uppercase tracking-wider">业务分类</div>
              <button 
                className={`w-full text-left px-2 py-1.5 text-sm rounded-md ${!selectedCategory ? 'bg-hover-bg text-text-main' : 'hover:bg-page-bg'}`}
                onClick={() => setSelectedCategory(null)}
              >
                全部业务分类
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  className={`w-full text-left px-2 py-1.5 text-sm rounded-md ${selectedCategory === cat ? 'bg-hover-bg text-text-main' : 'hover:bg-page-bg'}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedCategory && (
        <div className="flex items-center text-sm text-text-main bg-hover-bg px-4 py-2 rounded-lg">
          <span className="font-medium mr-2">正在查看：</span> {selectedCategory}
          <button onClick={() => setSelectedCategory(null)} className="ml-auto text-text-tertiary hover:text-text-main text-[13px]">清除筛选</button>
        </div>
      )}

      {/* List */}
      <div className="bg-surface-1 border border-border-default rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-page-bg/80 text-[13px] text-text-tertiary border-b border-border-default uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3 font-medium w-2/5">知识摘要</th>
              <th className="px-5 py-3 font-medium">类型</th>
              <th className="px-5 py-3 font-medium">适用范围</th>
              <th className="px-5 py-3 font-medium">来源</th>
              <th className="px-5 py-3 font-medium">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {filteredList.map(item => (
              <tr 
                key={item.id} 
                className="hover:bg-page-bg cursor-pointer transition-colors group"
                onClick={() => onOpenKnowledge(item)}
              >
                <td className="px-5 py-3.5">
                  <div className="font-medium text-text-main group-hover:text-text-main transition-colors line-clamp-1">{item.summary}</div>
                  {item.reliability && <div className="text-[13px] text-text-tertiary mt-0.5">{item.reliability}</div>}
                </td>
                <td className="px-5 py-3.5">
                  <span className={`px-2.5 py-1 rounded-md text-[13px] font-medium ${
                    item.type === '商家事实' ? 'bg-hover-bg text-text-main' :
                    item.type === '规则与禁区' ? 'bg-red-50 text-red-700' :
                    item.type === '经验建议' ? 'bg-indigo-50 text-indigo-700' :
                    'bg-hover-bg text-text-secondary'
                  }`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-text-secondary">{item.scope}</td>
                <td className="px-5 py-3.5 text-text-tertiary truncate max-w-[150px]">{item.source}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center ${
                    item.state === '正常' ? 'text-emerald-600' : 
                    item.state === '待确认' ? 'text-amber-600' : 'text-text-tertiary'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                      item.state === '正常' ? 'bg-emerald-500' : 
                      item.state === '待确认' ? 'bg-amber-500' : 'bg-neutral-400'
                    }`}></span>
                    {item.state}
                  </span>
                </td>
              </tr>
            ))}
            {filteredList.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-text-tertiary">
                  没有找到符合条件的知识
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
