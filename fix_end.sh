sed -i '657,681c\
                  </div>\
                </div>\
              </div>\
            </motion.div>\
          </>\
        )}\
        {showMaterialReq && (\
          <>\
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setShowMaterialReq(false)} className="fixed inset-0 bg-neutral-900/20 z-50" />\
            <motion.div initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{type:"spring", damping:25, stiffness:200}} className="fixed right-0 top-0 bottom-0 w-[520px] bg-white shadow-2xl z-50 flex flex-col">\
              <div className="p-6 border-b border-[#EAECF0] flex justify-between items-center">\
                <h2 className="text-[16px] font-bold">素材需求</h2>\
                <button onClick={() => setShowMaterialReq(false)} className="p-2 text-neutral-400 hover:bg-neutral-100 rounded-xl"><X size={16}/></button>\
              </div>\
              <div className="p-6 overflow-y-auto flex-1">\
                <div className="bg-neutral-50 p-4 rounded-xl text-[13px] text-[#111827]">当前建议收集6组素材，已有4组，仍缺2组。</div>\
              </div>\
            </motion.div>\
          </>\
        )}\
      </AnimatePresence>\
\
      {/* Small Modals */}\
' src/components/merchant/ProjectCenter.tsx
