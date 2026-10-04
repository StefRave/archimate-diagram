/// <reference types="vite/client" />
import './index.scss';
import { createRoot } from 'react-dom/client';
import { ArchiEditor } from './ArchiEditor';

createRoot(document.querySelector('#app')).render(<ArchiEditor />);
