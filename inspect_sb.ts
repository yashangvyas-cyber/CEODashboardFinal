import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
    const { data: deals, error: dErr } = await supabase.from('deals').select('*').limit(1);
    console.log('Deals schema:', dErr || (deals && deals[0] ? Object.keys(deals[0]) : 'empty'));

    const { data: invoices, error: iErr } = await supabase.from('invoices').select('*').limit(1);
    console.log('Invoices schema:', iErr || (invoices && invoices[0] ? Object.keys(invoices[0]) : 'empty'));
}

inspect();
