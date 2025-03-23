export interface SelectionRange {
   start: number;
   end: number;
   text: string;
}

export interface SelectionPosition {
   top: number;
   left: number;
}

export type StyleTag = 'h1' | 'h2' | 'h3' | 'ul' | 'ol' | 'link' | 'color' | 'size';

export interface ITextEditorProps {
   content: string;
   setContent: Function;
}