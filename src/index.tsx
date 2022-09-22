/// <reference types="vite/client" />
import './index.scss';
import { render, h } from 'preact';
import { ArchiEditor } from './ArchiEditor';

render(<ArchiEditor />, document.querySelector('#app'));
