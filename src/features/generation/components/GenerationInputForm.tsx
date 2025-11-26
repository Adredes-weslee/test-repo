import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Button, Textarea, IconButton } from '../../../components/ui';
import { Sparkles, Rocket, Upload, File as FileIcon, X } from '../../../components/icons';
import { isMac } from '../../../utils';
import { usePromptSuggestions } from '../hooks';

interface GenerationInputFormProps {
  onGenerate: (prompt: string, type: 'course' | 'project', file: File | null) => void;
  isLoading: boolean;
}

export const GenerationInputForm: React.FC<GenerationInputFormProps> = ({ onGenerate, isLoading }) => {
  const [generationType, setGenerationType] = useState<'course' | 'project'>('project');
  const [prompt, setPrompt] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { suggestion, isLoading: isSuggestionLoading, onSuggestionApplied } = usePromptSuggestions(prompt, generationType);
  const [canShowSuggestion, setCanShowSuggestion] = useState(true);

  useLayoutEffect(() => {
    if (inputRef.current) {
        const { scrollHeight, clientHeight } = inputRef.current;
        setCanShowSuggestion(scrollHeight <= clientHeight);
    }
  }, [prompt]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerateClick = () => {
    if (prompt.trim() || uploadedFile) {
      onGenerate(prompt, generationType, uploadedFile);
    }
  };

  const useSuggestion = () => {
    if (suggestion) {
        setPrompt(suggestion.suggestion);
        onSuggestionApplied();
        setTimeout(() => inputRef.current?.focus(), 0);
    }
  };
  
  const isSuggestionVisible = canShowSuggestion && suggestion && prompt && suggestion.suggestion.toLowerCase().startsWith(prompt.toLowerCase()) && suggestion.suggestion.length > prompt.length;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab' && !e.shiftKey && isSuggestionVisible) {
      e.preventDefault();
      useSuggestion();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerateClick();
    }
  };

  const placeholderText = generationType === 'course'
    ? "Describe the course you want to create, or attach a specification document...\ne.g., A beginner's guide to data science with Python, focusing on pandas and matplotlib."
    : "Describe the project you want to build, or attach a curriculum document...\ne.g., A real-time chat application using React and Firebase, with Google authentication.";

  const buttonText = generationType === 'course' ? 'Generate Course' : 'Generate Project';
  const HeaderIcon = generationType === 'course' ? Sparkles : Rocket;
  const headerText = generationType === 'course' ? 'Generate a New Course' : 'Generate a New Project';
  const subHeaderText = generationType === 'course'
    ? 'Describe the course you want to create. Our AI assistant will generate a complete curriculum and lesson plans for you.'
    : 'Describe the project you want to build. Our AI assistant will generate a detailed specification and scaffold the project files.';

  const shortcutKey = isMac() ? '⌘+Enter' : 'Ctrl+Enter';

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl mx-auto border border-slate-100 animate-fadeIn">
      <div className="text-center mb-8">
        <div className="flex justify-center items-center gap-3 mb-2">
            <HeaderIcon className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold text-slate-800">{headerText}</h2>
        </div>
        <p className="text-slate-600 max-w-2xl mx-auto">
          {subHeaderText}
        </p>
      </div>

      <div className="relative">
        {/* Suggestion Text Overlay */}
        {isSuggestionVisible && (
            <div 
                className="absolute inset-0 px-3 py-2 text-base text-slate-800 border border-transparent pointer-events-none rounded-lg overflow-hidden"
            >
                <div className="whitespace-pre-wrap text-sm">
                    <span className="text-transparent">{prompt}</span>
                    <span className="text-slate-400">{suggestion.suggestion.substring(prompt.length)}</span>
                    <span className="ml-2 inline-block bg-slate-200/80 backdrop-blur-sm text-slate-600 text-xs font-sans font-semibold px-2 py-1 rounded-md shadow-sm align-middle">
                        Tab
                    </span>
                </div>
            </div>
        )}

        {/* Real Textarea */}
        <Textarea
            ref={inputRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isSuggestionVisible ? '' : placeholderText}
            rows={5}
            className={`text-base caret-primary relative z-10 ${isSuggestionVisible ? 'bg-transparent' : ''}`}
        />

        {/* Loading indicator */}
        {isSuggestionLoading && !suggestion && (
          <div className="absolute top-3 right-3 flex items-center gap-2 text-sm text-slate-500 z-20">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </div>
        )}
      </div>

      <div className="mt-4">
        {!uploadedFile ? (
          <label htmlFor="file-upload" className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary-text cursor-pointer transition-colors w-fit">
            <Upload className="w-4 h-4" />
            Attach a file (optional)
          </label>
        ) : (
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded-md text-sm border border-slate-200 animate-fadeIn">
            <div className="flex items-center gap-2 truncate min-w-0">
              <FileIcon className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="text-slate-800 truncate" title={uploadedFile.name}>{uploadedFile.name}</span>
            </div>
            <IconButton icon={X} tooltipText="Remove file" onClick={removeFile} className="!w-6 !h-6 flex-shrink-0" />
          </div>
        )}
        <input id="file-upload" type="file" className="sr-only" ref={fileInputRef} onChange={handleFileChange} />
      </div>

      <div className="mt-6">
        <Button
          onClick={handleGenerateClick}
          disabled={isLoading || (!prompt.trim() && !uploadedFile)}
          icon={generationType === 'course' ? Sparkles : Rocket}
          className="w-full relative"
        >
          {isLoading ? 'Generating...' : buttonText}
          {!isLoading && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 border border-white/30 text-white font-semibold text-xs font-sans px-2 py-1 rounded-md shadow-sm pointer-events-none">
              {shortcutKey}
            </span>
          )}
        </Button>
      </div>
      
      <div className="text-center mt-6 text-sm text-slate-500">
        {generationType === 'project' ? (
          <>
            Or,{' '}
            <button onClick={() => setGenerationType('course')} className="text-primary-text font-semibold hover:underline focus:outline-none">
              generate a course
            </button>
            {' '}instead.
          </>
        ) : (
          <>
            Or,{' '}
            <button onClick={() => setGenerationType('project')} className="text-primary-text font-semibold hover:underline focus:outline-none">
              generate a project
            </button>
            {' '}instead.
          </>
        )}
      </div>
    </div>
  );
};