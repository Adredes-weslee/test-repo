import React, { useState } from 'react';
import { Database, ChevronDown } from '../../../components/icons/index';
import { appConfig } from '../../../config';

export const RagInfoPanel: React.FC<{ agentThoughts: string[] }> = ({ agentThoughts }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm mb-6 animate-fadeIn">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center text-left p-4"
        >
          <div className="flex items-center space-x-3">
            <Database className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-slate-800">RAG Information</h3>
          </div>
          <div className="flex items-center space-x-3">
            <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>
        {isOpen && (
          <div className="px-6 pb-5 pt-4 border-t border-slate-200">
            <div className="space-y-4">
                <div>
                    <p className="text-xs text-slate-500 mb-0.5">Vector Database</p>
                    <p className="text-sm text-slate-800 font-semibold flex items-center gap-2">
                        Pinecone <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">Connected</span>
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-500 mb-0.5">Knowledge Base</p>
                    <p className="text-sm text-slate-800 font-semibold">Educational Content DB</p>
                </div>
                <div>
                    <p className="text-xs text-slate-500 mb-0.5">Search Status</p>
                    <p className="text-sm text-slate-800 font-semibold flex items-center gap-2">
                        <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">Complete</span>
                        <span>Found 0 relevant documents</span>
                    </p>
                </div>
            </div>
            {appConfig.FEATURE_FLAGS.showAgentThoughts && (
              <div className="mt-5 pt-4 border-t border-slate-200/60">
                   <p className="text-xs text-slate-500 mb-1.5">AI Agent Thoughts</p>
                   {agentThoughts && agentThoughts.length > 0 ? (
                      <ul className="list-disc list-outside ml-4 text-sm text-slate-600 space-y-1">
                          {agentThoughts.map((thought, index) => (
                              <li key={index}>{thought}</li>
                          ))}
                      </ul>
                   ) : (
                      <p className="text-sm text-slate-500">No thoughts available for this generation.</p>
                   )}
              </div>
            )}
          </div>
        )}
      </div>
    );
};
