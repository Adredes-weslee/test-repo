import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism-plus';

export const MarkdownContent: React.FC<{ content: string; }> = React.memo(({ content }) => {
    if (!content) return null;
    
    return (
        <ReactMarkdown
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex, [rehypePrism, { ignoreMissing: true }]]}
            children={content}
            components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-semibold text-slate-800 mb-4 mt-6" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-slate-800 mb-3 mt-5" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-bold text-slate-700 mb-2 mt-4" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-outside ml-5 space-y-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-5 space-y-2" {...props} />,
                li: ({node, ...props}) => <li className="pl-2" {...props} />,
                code: ({node, className, children, ...props}) => {
                    const match = /language-(\w+)/.exec(className || '')
                    // This is for inline code
                    if (!className && !props.inline) {
                        return <code className="bg-slate-100 text-slate-800 font-mono text-sm px-1.5 py-0.5 rounded" {...props}>{children}</code>
                    }
                    // For block code, rehype-prism-plus handles the rendering
                    return <code className={className} {...props}>{children}</code>
                },
                table: ({node, ...props}) => <div className="overflow-x-auto my-4"><table className="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-lg" {...props} /></div>,
                thead: ({node, ...props}) => <thead className="bg-slate-50" {...props} />,
                th: ({node, ...props}) => <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200" {...props} />,
                tbody: ({node, ...props}) => <tbody className="bg-white divide-y divide-slate-100" {...props} />,
                tr: ({node, ...props}) => <tr className="hover:bg-slate-50/50 transition-colors" {...props} />,
                td: ({node, ...props}) => <td className="px-6 py-4 whitespace-normal text-sm text-slate-700" {...props} />,
            }}
        />
    );
});