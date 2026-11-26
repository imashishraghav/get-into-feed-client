import React, { useState } from 'react';
import { automationEngine } from '../utils/automationEngine.js';

export function AutomationRecipesView({ onShowToast }) {
  const [recipes, setRecipes] = useState(automationEngine.getRecipes());
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'SLA & Routing', 'Lead Capture', 'Deals & Proposals', 'Client Delivery', 'Billing & GST'];

  const handleToggle = (id) => {
    const newState = automationEngine.toggleRecipe(id);
    setRecipes([...automationEngine.getRecipes()]);
    onShowToast?.(`Recipe ${id} is now ${newState ? 'ACTIVE 🟢' : 'PAUSED ⏸️'}`);
  };

  const filteredRecipes = selectedCategory === 'All'
    ? recipes
    : recipes.filter((r) => r.category === selectedCategory);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f8fafc] dark:bg-[#09090b] border-t border-slate-200 dark:border-slate-800 p-4 sm:p-6 text-xs">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              RevOps Automation Engine Live
            </span>
          </div>
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100 mt-1">
            Agency Automation Recipe Library (17 Pre-Built Workflows)
          </h2>
          <p className="text-slate-500">
            Zero-code automation rules managing Speed-to-Lead SLA, WhatsApp welcomes, invoice chasers, and reels delivery.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="flex-1 overflow-y-auto pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
              recipe.enabled
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-xs'
                : 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200/60 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {recipe.category}
                </span>

                {/* 1-Click Toggle Switch */}
                <button
                  onClick={() => handleToggle(recipe.id)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                    recipe.enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      recipe.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">
                {recipe.name}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed mb-3">
                {recipe.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
              <span className="text-blue-600 dark:text-blue-400 font-semibold truncate max-w-[170px]">
                ⚡ {recipe.actionSummary}
              </span>
              <span className="text-slate-400 font-mono">
                {recipe.executionCount} runs
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
