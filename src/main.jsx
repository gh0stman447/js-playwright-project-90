import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@hexlet/testing-task-manager';

createRoot(document.getElementById('root')).render(<StrictMode>{App()}</StrictMode>);
