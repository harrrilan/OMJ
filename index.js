import React from 'react';
import { createRoot } from 'react-dom/client';
import Today from './Today.js';

const root = createRoot(document.getElementById('root'));
root.render(<Today />);