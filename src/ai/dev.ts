import { config } from 'dotenv';
config();

import '@/ai/flows/redact-sensitive-info.ts';
import '@/ai/flows/extract-text-from-screenshot.ts';