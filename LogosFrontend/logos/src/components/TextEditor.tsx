import React, { useRef, useState } from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
    min-height: 100vh;
    background-color: #f3f4f6;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 32px;
`;

const EditorContainer = styled.div`
    width: 816px;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    flex-direction: column;
`;

const Toolbar = styled.div`
    background-color: #f9fafb;
    padding: 8px 16px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const FontSizeSelect = styled.select`
    padding: 4px 8px;
    font-size: 14px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
    &:focus {
        outline: none;
        border-color: #374151;
    }
`;

const ToolbarButton = styled.button`
    padding: 4px;
    background-color: #e5e7eb;
    color: #374151;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    &:hover {
        background-color: #d1d5db;
    }
`;

const EditableArea = styled.div`
    padding: 16px;
    min-height: 528px;
    outline: none;
    color: #374151;
`;

const PreviewArea = styled.pre`
  margin: 16px;
  padding: 16px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 14px;
  color: #374151;
  white-space: pre-wrap;
  word-break: break-all;
`;

const TextEditor: React.FC = () => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [fontSize, setFontSize] = useState<number>(16);
    const [htmlPreview, setHtmlPreview] = useState<string>('Start typing here...');

    const applyFormatting = (tag: 'b' | 'i' | 'u') => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || !editorRef.current) return;

        const range = selection.getRangeAt(0);
        if (range.collapsed) return;

        const parent = range.commonAncestorContainer;
        const isFormatted = (node: Node): boolean => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                if (element.tagName.toLowerCase() === tag) return true;
                return Array.from(element.children).some(
                    (child) => child.tagName.toLowerCase() === tag
                );
            }
            return false;
        };

        const selectedText = range.toString();
        if (isFormatted(parent)) {
            const wrapper = document.createTextNode(selectedText);
            range.deleteContents();
            range.insertNode(wrapper);
        } else {
            const wrapper = document.createElement(tag);
            wrapper.textContent = selectedText;
            range.deleteContents();
            range.insertNode(wrapper);
        }

        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(range.commonAncestorContainer);
        selection.addRange(newRange);

        editorRef.current.focus();
    };

    const applyAlignment = (align: string) => {
        if (editorRef.current) {
            editorRef.current.style.textAlign = align;
            editorRef.current.focus();
        }
    };

    const handleFontSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const size = parseInt(event.target.value, 10);
        setFontSize(size);
        if (editorRef.current) {
            editorRef.current.style.fontSize = `${size}px`;
            editorRef.current.focus();
        }
    };

    const handleInput = () => {
        if (editorRef.current) {
            setHtmlPreview(editorRef.current.innerHTML);
        }
    };

    return (
        <PageContainer>
            <EditorContainer>
                <Toolbar>
                    <FontSizeSelect value={fontSize} onChange={handleFontSizeChange}>
                        {[12, 14, 16, 18, 20, 24, 28, 32].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </FontSizeSelect>
                    <ToolbarButton
                        onClick={() => applyFormatting('b')}
                        title="Bold"
                    >
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.96-1.7 3.96-3.74 0-1.34-.7-2.54-1.8-3.47zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
                        </svg>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => applyFormatting('i')}
                        title="Italic"
                    >
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z" />
                        </svg>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => applyFormatting('u')}
                        title="Underline"
                    >
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" />
                        </svg>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => applyAlignment('left')}
                        title="Align Left"
                    >
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z" />
                        </svg>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => applyAlignment('center')}
                        title="Align Center"
                    >
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z" />
                        </svg>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => applyAlignment('right')}
                        title="Align Right"
                    >
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z" />
                        </svg>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => applyAlignment('justify')}
                        title="Justify"
                    >
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z" />
                        </svg>
                    </ToolbarButton>
                </Toolbar>
                <EditableArea
                    ref={editorRef}
                    contentEditable
                    style={{ fontSize: `${fontSize}px` }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            const br = document.createElement('br');
                            const selection = window.getSelection();
                            if (selection && selection.rangeCount > 0) {
                                const range = selection.getRangeAt(0);
                                range.insertNode(br);
                                range.setStartAfter(br);
                                range.setEndAfter(br);
                                e.preventDefault();
                            }
                        }
                    }}
                    onInput={handleInput}
                >
                </EditableArea>
                <PreviewArea>HTML string: {htmlPreview}</PreviewArea>
            </EditorContainer>

        </PageContainer>
    );
};

export default TextEditor;