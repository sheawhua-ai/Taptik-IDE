import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ContentDetailDrawer } from "../components/rings/ContentDetailDrawer";
import {
  ArrowRight,
  Camera,
  Plus,
  Image as ImageIcon,
  Sparkles,
  X,
  LayoutGrid,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  GitCommit,
  User,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
const MOCK_PROJECTS = [
  {
    id: "p1",
    name: "\u7F8E\u5986\u641C\u7D22\u79CD\u8349\u6218\u5F79",
    goal: "\u641C\u7D22\u5361\u4F4D + \u79C1\u57DF\u627F\u63A5",
    currentDirection: "\u6297\u8001 / \u7D27\u81F4 / \u654F\u611F\u808C / \u6210\u5206\u79D1\u666E",
    nodes: [
      { id: "strategy", name: "\u7B56\u7565", status: "\u5DF2\u786E\u8BA4", type: "success", tab: "strategy", actionDesc: "\u8FDB\u5165\u64CD\u76D8\u5EFA\u8BAE\u6A21\u5757" },
      { id: "content", name: "\u5185\u5BB9", status: "\u5DF2\u89C4\u521212", type: "success", tab: "content", actionDesc: "\u8FDB\u5165\u5185\u5BB9\u751F\u6210\u6A21\u5757" },
      { id: "material", name: "\u7D20\u6750", status: "\u7F3A4", type: "warning", tab: "matrix", actionDesc: "\u5FEB\u901F\u5904\u7406\u7D20\u6750\u7F3A\u53E3" },
      { id: "publish", name: "\u53D1\u5E03", status: "\u5F85\u6392\u671F", type: "pending", tab: "content", actionDesc: "\u8FDB\u5165\u8D26\u53F7\u4E0E\u53D1\u5E03\u6A21\u5757" },
      { id: "interaction", name: "\u4E92\u52A8", status: "\u5F85\u6FC0\u6D3B", type: "pending", tab: "interaction", actionDesc: "\u6A21\u5757\u5F85\u6FC0\u6D3B" },
      { id: "sales", name: "\u79C1\u57DF", status: "\u5F85\u6FC0\u6D3B", type: "pending", tab: "interaction", actionDesc: "\u6A21\u5757\u5F85\u6FC0\u6D3B" },
      { id: "metrics", name: "\u590D\u76D8", status: "\u5F85\u6FC0\u6D3B", type: "pending", tab: "metrics", actionDesc: "\u6A21\u5757\u5F85\u6FC0\u6D3B" }
    ],
    issue: "\u6218\u5F79\u7D20\u6750\u7F3A\u53E3\u5BFC\u81F44\u7BC7\u56FE\u6587\u65E0\u6CD5\u751F\u6210",
    recommendation: "\u8865\u9F50\u7D20\u6750 -> \u68C0\u67E5\u751F\u6210\u5185\u5BB9 -> \u6392\u671F\u53D1\u5E03",
    owner: "\u8FD0\u8425\u5C0F\u738B",
    deadline: "\u4ECA\u65E5 18:00"
  },
  {
    id: "p2",
    name: "\u5E7C\u72AC\u6362\u7CAE\u907F\u5751\u641C\u7D22\u5361\u4F4D",
    goal: "\u81EA\u7136\u6D41\u8D77\u91CF + \u8F6C\u5316",
    currentDirection: "\u907F\u5751 / \u6311\u98DF / \u8F6F\u4FBF / \u4E13\u4E1A\u79D1\u666E",
    nodes: [
      { id: "strategy", name: "\u7B56\u7565", status: "\u5DF2\u786E\u8BA4", type: "success", tab: "strategy", actionDesc: "\u8FDB\u5165\u64CD\u76D8\u5EFA\u8BAE\u6A21\u5757" },
      { id: "content", name: "\u5185\u5BB9", status: "156\u7BC7", type: "success", tab: "content", actionDesc: "\u8FDB\u5165\u5185\u5BB9\u751F\u6210\u6A21\u5757" },
      { id: "material", name: "\u7D20\u6750", status: "\u5168\u9F50", type: "success", tab: "matrix", actionDesc: "\u7D20\u6750\u9F50\u5907" },
      { id: "publish", name: "\u53D1\u5E03", status: "\u5DF2\u53D142", type: "success", tab: "content", actionDesc: "\u8FDB\u5165\u8D26\u53F7\u4E0E\u53D1\u5E03\u6A21\u5757" },
      { id: "interaction", name: "\u4E92\u52A8", status: "\u9AD8\u610F\u541141", type: "warning", tab: "interaction", actionDesc: "\u5FEB\u901F\u5904\u7406\u9AD8\u610F\u5411\u7EBF\u7D22" },
      { id: "sales", name: "\u79C1\u57DF", status: "\u5F85\u8DDF\u8FDB12", type: "warning", tab: "interaction", actionDesc: "\u5904\u7406\u79C1\u57DF\u627F\u63A5\u52A8\u4F5C" },
      { id: "metrics", name: "\u590D\u76D8", status: "\u6570\u636E\u4F73", type: "success", tab: "metrics", actionDesc: "\u67E5\u770B\u590D\u76D8\u6570\u636E" }
    ],
    issue: "\u53D1\u73B0 41 \u6761\u9AD8\u610F\u5411\u5F85\u8DDF\u8FDB\u7EBF\u7D22",
    recommendation: "\u53BB\u79C1\u4FE1\u627F\u63A5 -> AI \u5FEB\u6377\u56DE\u590D",
    owner: "\u5BA2\u670D\u5C0F\u674E",
    deadline: "\u660E\u65E5 12:00"
  }
];
export default function MerchantMatrix() {
  const [activeProject, setActiveProject] = useState(null);
  const [activeDrawer, setActiveDrawer] = useState(null);
  const handleNodeClick = (node) => {
    if (node.type === "warning") {
      setActiveDrawer(node.id === "interaction" ? "interaction" : "materials");
    } else if (node.type === "success") {
      if (node.id === "content") {
        setActiveDrawer("content_detail");
        return;
      }
      window.dispatchEvent(new CustomEvent("nav-to-tab", { detail: { tab: node.tab } }));
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full bg-neutral-50/50 w-full relative", children: [
    /* @__PURE__ */ jsxs("div", { className: "h-20 border-b border-neutral-100 px-8 flex items-center justify-between bg-white shrink-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsx(LayoutGrid, { size: 24 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-[17px] font-semibold text-neutral-900", children: "\u5546\u5BB6\u8FD0\u8425\u6D41" }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-neutral-400 mt-0.5", children: "\u638C\u63E1\u5404\u9879\u76EE\u63A8\u8FDB\u72B6\u6001\uFF0C\u4F18\u5148\u5904\u7406\u5F71\u54CD\u53D1\u5E03\u548C\u8F6C\u5316\u7684\u4E8B\u9879\u3002" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("button", { className: "flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-xl text-[13px] font-bold shadow-md hover:bg-neutral-800 transition-colors", children: [
        /* @__PURE__ */ jsx(Plus, { size: 16 }),
        " \u65B0\u5EFA\u9879\u76EE\u6D41"
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-8 custom-scrollbar", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-center justify-between shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0", children: /* @__PURE__ */ jsx(AlertTriangle, { size: 16 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[14px] font-bold text-rose-900 mb-0.5", children: "\u5546\u5BB6\u753B\u50CF\u7F3A 7 \u9879\u5173\u952E\u4FE1\u606F\uFF0C\u53EF\u80FD\u5F71\u54CD\u672C\u8F6E\u5185\u5BB9\u5224\u65AD\u4E0E\u7D20\u6750\u7B5B\u9009" }),
            /* @__PURE__ */ jsx("div", { className: "text-[12px] text-rose-700", children: "\u7F3A\u5931\u9879\u4F1A\u5F71\u54CD\u64CD\u76D8\u5EFA\u8BAE\u5B8C\u6574\u5EA6\u548C\u79C1\u57DF\u8BDD\u672F\u98CE\u9669\uFF0C\u5EFA\u8BAE\u5C3D\u5FEB\u8865\u5145\uFF0C\u786E\u4FDD\u4E0B\u6E38\u6D41\u8F6C\u8D28\u91CF\u3002" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => window.dispatchEvent(new CustomEvent("open-merchant-profile-drawer")),
            className: "text-[13px] font-bold text-white bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm",
            children: [
              "\u53BB\u8865\u9F50\u753B\u50CF ",
              /* @__PURE__ */ jsx(ChevronRight, { size: 16 })
            ]
          }
        )
      ] }),
      MOCK_PROJECTS.map((proj) => /* @__PURE__ */ jsx("div", { className: "bg-white border border-neutral-200 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between mb-4", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-[18px] font-bold text-neutral-900", children: proj.name }),
            /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold rounded text-[11px]", children: "\u6267\u884C\u4E2D" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-[13px] text-neutral-500 flex items-center gap-3", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "\u4E3B\u653B\u65B9\u5411\uFF1A",
              /* @__PURE__ */ jsx("strong", { className: "text-neutral-800", children: proj.currentDirection })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "w-1 h-1 rounded-full bg-neutral-300" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "\u672C\u8F6E\u76EE\u6807\uFF1A",
              proj.goal
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "bg-amber-50/50 border border-amber-100 rounded-xl p-4 mb-4 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(AlertTriangle, { size: 14, className: "text-amber-600" }),
            /* @__PURE__ */ jsx("span", { className: "text-[13px] font-bold text-amber-900", children: proj.issue })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Sparkles, { size: 14, className: "text-indigo-500" }),
            /* @__PURE__ */ jsxs("span", { className: "text-[12px] font-medium text-indigo-700", children: [
              "\u5EFA\u8BAE\u5904\u7406\uFF1A",
              proj.recommendation
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative mt-2", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-[18px] left-10 right-10 h-1 bg-neutral-100 rounded-full -z-10" }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-between relative z-10 px-2", children: proj.nodes.map((node, idx) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 group relative", onClick: () => handleNodeClick(node), children: [
            /* @__PURE__ */ jsx("div", { className: `text-[13px] font-bold transition-colors ${node.type === "pending" ? "text-neutral-400" : "text-neutral-700 group-hover:text-indigo-600"}`, children: node.name }),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: `w-14 h-14 rounded-2xl flex items-center justify-center border-2 shadow-sm transition-all bg-white relative overflow-hidden
                          ${node.type === "success" ? "border-emerald-500 text-emerald-600 cursor-pointer group-hover:border-emerald-600" : node.type === "warning" ? "border-amber-500 text-amber-600 ring-4 ring-amber-500/10 cursor-pointer" : "border-neutral-200 text-neutral-300 cursor-not-allowed"}
                          ${node.type !== "pending" ? "group-hover:scale-105 group-active:scale-95" : ""}`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: `transition-opacity flex items-center justify-center w-full h-full ${node.type !== "pending" ? "group-hover:opacity-0" : ""}`, children: [
                    node.type === "success" && /* @__PURE__ */ jsx(CheckCircle2, { size: 20 }),
                    node.type === "warning" && /* @__PURE__ */ jsx(AlertTriangle, { size: 20 }),
                    node.type === "pending" && /* @__PURE__ */ jsx(GitCommit, { size: 20 })
                  ] }),
                  node.type !== "pending" && /* @__PURE__ */ jsx("div", { className: `absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${node.type === "warning" ? "bg-amber-50" : "bg-emerald-50"}`, children: /* @__PURE__ */ jsx(ArrowRight, { size: 16, className: node.type === "warning" ? "text-amber-600" : "text-emerald-600" }) })
                ]
              }
            ),
            /* @__PURE__ */ jsx("div", { className: `text-[12px] font-medium px-3 py-1 rounded-full border
                          ${node.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-700 font-bold" : node.type === "warning" ? "bg-amber-50 border-amber-100 text-amber-700 font-bold shadow-sm" : "bg-neutral-50 border-neutral-100 text-neutral-400"}
                        `, children: node.status }),
            /* @__PURE__ */ jsxs("div", { className: "absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max max-w-[160px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20", children: [
              /* @__PURE__ */ jsx("div", { className: "bg-neutral-900 text-white text-[11px] font-medium px-3 py-2 rounded-lg text-center shadow-lg leading-relaxed", children: node.actionDesc }),
              /* @__PURE__ */ jsx("div", { className: "absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-900 rotate-45" })
            ] })
          ] }, node.id)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-[13px] text-neutral-500 font-medium", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(User, { size: 14, className: "text-neutral-400" }),
              " \u8D1F\u8D23\u4EBA\uFF1A",
              proj.owner
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Clock, { size: 14, className: "text-neutral-400" }),
              " \u622A\u6B62\uFF1A",
              proj.deadline
            ] })
          ] }),
          /* @__PURE__ */ jsxs("button", { className: "flex items-center gap-1 text-[13px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors", children: [
            "\u8FDB\u5165\u8BE6\u60C5 ",
            /* @__PURE__ */ jsx(ChevronRight, { size: 16 })
          ] })
        ] })
      ] }) }, proj.id))
    ] }) }),
    /* @__PURE__ */ jsxs(AnimatePresence, { children: [
      activeDrawer === "content_detail" && /* @__PURE__ */ jsx(ContentDetailDrawer, { onClose: () => setActiveDrawer(null) }),
      activeDrawer === "materials" && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex justify-end", onClick: () => setActiveDrawer(null), children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" }),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { x: "100%" },
            animate: { x: 0 },
            exit: { x: "100%" },
            transition: { type: "spring", damping: 25, stiffness: 200 },
            className: "w-[500px] bg-white h-full shadow-2xl flex flex-col relative z-10",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Camera, { size: 18, className: "text-indigo-600" }),
                  /* @__PURE__ */ jsx("h3", { className: "font-bold text-neutral-900 text-[16px]", children: "\u6218\u5F79\u7D20\u6750\u7F3A\u53E3 - \u5E7C\u72AC\u6362\u7CAE" })
                ] }),
                /* @__PURE__ */ jsx("button", { onClick: () => setActiveDrawer(null), className: "p-2 hover:bg-neutral-200 rounded-full transition-colors", children: /* @__PURE__ */ jsx(X, { size: 18, className: "text-neutral-500" }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3", children: [
                  /* @__PURE__ */ jsx(AlertTriangle, { size: 18, className: "text-amber-600 mt-0.5" }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h4", { className: "text-[14px] font-bold text-amber-900 mb-1", children: "\u5F53\u524D\u7F3A 8 \u4E2A\u5173\u952E\u7D20\u6750" }),
                    /* @__PURE__ */ jsx("p", { className: "text-[12px] text-amber-700 leading-relaxed", children: "\u8FD9\u6279\u7D20\u6750\u7F3A\u5931\u76F4\u63A5\u5BFC\u81F4 12 \u7BC7\u7206\u6B3E\u6F5C\u529B\u7684\u201C\u6311\u98DF\u8BEF\u533A\u201D\u7B14\u8BB0\u65E0\u6CD5\u6392\u671F\u53D1\u5E03\uFF0C\u5EFA\u8BAE\u7ACB\u5373\u8865\u9F50\u3002" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [1, 2, 3].map((_, i) => /* @__PURE__ */ jsxs("div", { className: "border border-neutral-200 rounded-xl p-4 flex gap-4 bg-white hover:border-indigo-300 transition-colors cursor-pointer group shadow-sm", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400 shrink-0", children: /* @__PURE__ */ jsx(ImageIcon, { size: 24 }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col justify-center", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                      /* @__PURE__ */ jsx("h4", { className: "font-bold text-[14px] text-neutral-900", children: "\u72D7\u72D7\u6311\u98DF\u5B9E\u62CD\u5C01\u9762\u56FE" }),
                      /* @__PURE__ */ jsx("span", { className: "text-[11px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded font-bold", children: "\u7F3A 2 \u5F20" })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-[12px] text-neutral-500 mb-3", children: "\u7528\u4E8E\u201C\u5E7C\u72AC\u6311\u98DF\u5176\u5B9E\u662F\u4F60\u7684\u9505\u201D\u7CFB\u5217\u56FE\u6587" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                      /* @__PURE__ */ jsx("button", { className: "text-[12px] font-medium text-white bg-neutral-900 px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors", children: "\u53BB\u7D20\u6750\u5E93\u6311\u9009" }),
                      /* @__PURE__ */ jsx("button", { className: "text-[12px] font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors", children: "AI \u4E00\u952E\u751F\u6210" })
                    ] })
                  ] })
                ] }, i)) })
              ] })
            ]
          }
        )
      ] }),
      activeDrawer === "interaction" && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex justify-end", onClick: () => setActiveDrawer(null), children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" }),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { x: "100%" },
            animate: { x: 0 },
            exit: { x: "100%" },
            transition: { type: "spring", damping: 25, stiffness: 200 },
            className: "w-[500px] bg-white h-full shadow-2xl flex flex-col relative z-10",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(MessageSquare, { size: 18, className: "text-indigo-600" }),
                  /* @__PURE__ */ jsx("h3", { className: "font-bold text-neutral-900 text-[16px]", children: "\u9AD8\u610F\u5411\u7EBF\u7D22\u5904\u7406 - \u5E7C\u72AC\u6362\u7CAE" })
                ] }),
                /* @__PURE__ */ jsx("button", { onClick: () => setActiveDrawer(null), className: "p-2 hover:bg-neutral-200 rounded-full transition-colors", children: /* @__PURE__ */ jsx(X, { size: 18, className: "text-neutral-500" }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3", children: [
                  /* @__PURE__ */ jsx(AlertTriangle, { size: 18, className: "text-amber-600 mt-0.5" }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h4", { className: "text-[14px] font-bold text-amber-900 mb-1", children: "\u53D1\u73B0 41 \u6761\u9AD8\u610F\u5411\u5F85\u8DDF\u8FDB\u7EBF\u7D22" }),
                    /* @__PURE__ */ jsx("p", { className: "text-[12px] text-amber-700 leading-relaxed", children: "\u7CFB\u7EDF\u5DF2\u901A\u8FC7\u8BED\u4E49\u5206\u6790\u63D0\u53D6\u4E86\u8FD1\u671F\u201C\u6C42\u63A8\u8350\u201D\u3001\u201C\u600E\u4E48\u4E70\u201D\u7B49\u9AD8\u9891\u8BC4\u8BBA\u4E0E\u79C1\u4FE1\uFF0C\u5EFA\u8BAE\u6279\u91CF\u63A5\u5165\u8F6C\u5316\u6D41\u7A0B\u3002" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [1, 2, 3].map((_, i) => /* @__PURE__ */ jsxs("div", { className: "border border-neutral-200 rounded-xl p-4 flex gap-4 bg-white hover:border-neutral-300 transition-colors cursor-pointer group shadow-sm", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center text-white shrink-0", children: /* @__PURE__ */ jsx(User, { size: 20 }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col justify-center", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                      /* @__PURE__ */ jsxs("h4", { className: "font-bold text-[14px] text-neutral-900", children: [
                        "\u5C0F\u7EA2\u85AF_\u7528\u6237",
                        i + 1
                      ] }),
                      /* @__PURE__ */ jsx("span", { className: "text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold", children: "\u9AD8\u610F\u5411" })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-[13px] text-neutral-700 mb-3 bg-neutral-50 p-2 rounded-lg", children: "\u201C\u6211\u5BB6\u6CD5\u6597\u6700\u8FD1\u4E00\u76F4\u62C9\u8F6F\u4FBF\uFF0C\u6362\u8FD9\u4E2A\u7CAE\u53EF\u4EE5\u5417\uFF1F\u201D" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                      /* @__PURE__ */ jsx("button", { className: "text-[12px] font-medium text-white bg-neutral-900 px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors", children: "\u53BB\u79C1\u4FE1\u627F\u63A5" }),
                      /* @__PURE__ */ jsx("button", { className: "text-[12px] font-medium text-neutral-700 bg-neutral-100 px-3 py-1.5 rounded-lg hover:bg-neutral-200 transition-colors", children: "AI \u5FEB\u6377\u56DE\u590D" })
                    ] })
                  ] })
                ] }, i)) })
              ] })
            ]
          }
        )
      ] })
    ] })
  ] });
}
