import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BUSINESS_UNITS = ['Engineering', 'Sales & Marketing', 'Finance & Admin', 'Legal & HR'];
const DEPARTMENTS = ['Frontend', 'Backend', 'Design', 'QA', 'DevOps', 'Sales', 'Marketing', 'HR'];
const SKILLS = ['React', 'Node.js', 'Python', 'AWS', 'Figma', 'SEO', 'Salesforce', 'SQL'];

// Helper to generate a random date within the last X years
function recentDate(years = 3) {
    return faker.date.past({ years }).toISOString();
}

async function seedEmployees(count = 200) {
    console.log(`Seeding ${count} employees...`);
    const employees = Array.from({ length: count }).map(() => {
        const isExited = faker.datatype.boolean({ probability: 0.15 });
        return {
            name: faker.person.fullName(),
            department: faker.helpers.arrayElement(DEPARTMENTS),
            business_unit: faker.helpers.arrayElement(BUSINESS_UNITS),
            hire_date: recentDate(5),
            status: isExited ? 'Exited' : (faker.datatype.boolean({ probability: 0.05 }) ? 'On Leave' : 'Active'),
            exit_date: isExited ? recentDate(1) : null,
            exit_reason: isExited ? faker.helpers.arrayElement(['Better Opportunity', 'Poor Performance', 'Relocation', 'Personal']) : null,
            exit_type: isExited ? faker.helpers.arrayElement(['Voluntary', 'Involuntary']) : null,
            salary: faker.number.int({ min: 50000, max: 200000 }),
            skills: faker.helpers.arrayElements(SKILLS, { min: 1, max: 4 }),
            performance_score: faker.number.float({ min: 2.5, max: 5.0, fractionDigits: 1 }),
        };
    });

    const { error } = await supabase.from('employees').insert(employees);
    if (error) console.error('Error seeding employees:', error.message);
}

async function seedDeals(count = 100) {
    console.log(`Seeding ${count} deals...`);
    const deals = Array.from({ length: count }).map(() => {
        const isClosed = faker.datatype.boolean({ probability: 0.6 });
        const isWon = isClosed ? faker.datatype.boolean({ probability: 0.7 }) : false;
        const stage = isWon ? 'Closed Won' : (isClosed ? 'Closed Lost' : faker.helpers.arrayElement(['Lead', 'Proposal', 'Negotiation']));

        return {
            client_name: faker.company.name(),
            deal_value: faker.number.int({ min: 10000, max: 500000 }),
            stage: stage,
            probability_percent: isWon ? 100 : (isClosed ? 0 : faker.number.int({ min: 10, max: 90 })),
            loss_reason: stage === 'Closed Lost' ? faker.helpers.arrayElement(['Competitor', 'Budget', 'Timing', 'Product Gap']) : null,
            owner: faker.person.fullName(),
            business_unit: faker.helpers.arrayElement(BUSINESS_UNITS),
            created_date: recentDate(2),
            close_date: isClosed ? recentDate(1) : null,
        };
    });

    const { error, data } = await supabase.from('deals').insert(deals).select();
    if (error) console.error('Error seeding deals:', error.message);
    return data;
}

async function seedInvoices(dealRecords: any[], count = 150) {
    console.log(`Seeding ${count} invoices...`);
    if (!dealRecords || dealRecords.length === 0) return;

    const invoices = Array.from({ length: count }).map(() => {
        // Pick a random Won deal to associate with, or leave null for random invoicing
        const deal = faker.helpers.arrayElement(dealRecords.filter(d => d.stage === 'Closed Won') || dealRecords);
        const isPaid = faker.datatype.boolean({ probability: 0.8 });
        const issueDate = faker.date.past({ years: 1 });
        const dueDate = new Date(issueDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days later

        return {
            deal_id: deal ? deal.id : null,
            client_name: deal ? deal.client_name : faker.company.name(),
            amount: deal ? Math.min(deal.deal_value, faker.number.int({ min: 5000, max: 100000 })) : faker.number.int({ min: 5000, max: 100000 }),
            status: isPaid ? 'Paid' : (dueDate < new Date() ? 'Overdue' : 'Unpaid'),
            issue_date: issueDate.toISOString(),
            due_date: dueDate.toISOString(),
            payment_date: isPaid ? faker.date.between({ from: issueDate, to: new Date() }).toISOString() : null,
            business_unit: deal ? deal.business_unit : faker.helpers.arrayElement(BUSINESS_UNITS),
        };
    });

    const { error } = await supabase.from('invoices').insert(invoices);
    if (error) console.error('Error seeding invoices:', error.message);
}

async function seedProjects(count = 50) {
    console.log(`Seeding ${count} projects...`);
    const projects = Array.from({ length: count }).map(() => {
        const budget = faker.number.int({ min: 100, max: 2000 });
        const spent = faker.number.int({ min: 0, max: budget * 1.2 }); // allow some over-budget
        const type = faker.helpers.arrayElement(['Fixed Cost', 'Hourly', 'Hirebase']);
        const createdAt = faker.date.past({ years: 2 }).toISOString();

        return {
            name: `${faker.company.catchPhraseAdjective()} ${faker.hacker.noun()}`,
            type: type,
            status: faker.helpers.arrayElement(['Active', 'Paused', 'Completed', 'At Risk']),
            budget_hours: budget,
            spent_hours: spent,
            billed_hours: type === 'Hourly' ? Math.floor(spent * faker.number.float({ min: 0.6, max: 1.0 })) : 0,
            business_unit: faker.helpers.arrayElement(BUSINESS_UNITS),
            created_at: createdAt
        };
    });

    const { error } = await supabase.from('projects').insert(projects);
    if (error) console.error('Error seeding projects:', error.message);
}

async function clearTables() {
    console.log('🧹 Clearing old data...');
    // Delete all rows in the tables we are about to seed
    await Promise.all([
        supabase.from('candidates').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('job_requisitions').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('invoices').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('deals').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('employees').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
    ]);
}

async function seedJobRequisitions(count = 50) {
    console.log(`Seeding ${count} job requisitions...`);
    const reqs = Array.from({ length: count }).map(() => {
        const isClosed = faker.datatype.boolean({ probability: 0.3 });
        const postedDate = faker.date.past({ years: 1 });
        return {
            role_title: faker.person.jobTitle(),
            status: isClosed ? 'Closed' : 'Open',
            department: faker.helpers.arrayElement(DEPARTMENTS),
            priority: faker.helpers.arrayElement(['Low', 'Medium', 'High', 'Critical']),
            posted_date: postedDate.toISOString(),
            closed_date: isClosed ? faker.date.between({ from: postedDate, to: new Date() }).toISOString() : null,
            created_at: postedDate.toISOString()
        };
    });

    const { error, data } = await supabase.from('job_requisitions').insert(reqs).select();
    if (error) console.error('Error seeding job requisitions:', error.message);
    return data;
}

async function seedCandidates(reqRecords: any[], count = 300) {
    console.log(`Seeding ${count} candidates...`);
    if (!reqRecords || reqRecords.length === 0) return;

    const candidates = Array.from({ length: count }).map(() => {
        const req = faker.helpers.arrayElement(reqRecords);
        const stage = faker.helpers.arrayElement(['Applied', 'Screening', 'Interview', 'Offered', 'Hired', 'Rejected']);
        const offerStatus = stage === 'Offered' || stage === 'Hired' ? (stage === 'Hired' ? 'Accepted' : faker.helpers.arrayElement(['Pending', 'Declined'])) : null;

        // Use purely random past dates to prevent faker from>to intersection crashes
        const offerDate = offerStatus ? faker.date.past({ years: 1 }) : null;
        const createdAt = faker.date.past({ years: 1 });

        return {
            req_id: req.id,
            name: faker.person.fullName(),
            current_stage: stage,
            offer_status: offerStatus,
            offer_date: offerDate ? offerDate.toISOString() : null,
            join_date: stage === 'Hired' && offerDate ? faker.date.between({ from: offerDate, to: new Date() }).toISOString() : null,
            source: faker.helpers.arrayElement(['LinkedIn', 'Referral', 'Website', 'Agency']),
            created_at: createdAt.toISOString()
        };
    });

    const { error } = await supabase.from('candidates').insert(candidates);
    if (error) console.error('Error seeding candidates:', error.message);
}

async function runSeed() {
    console.log('🌱 Starting Database Seeding...');

    await clearTables();

    await seedEmployees(360); // Match current dashboard number roughly
    const deals = await seedDeals(120);
    await seedInvoices(deals || [], 200);
    await seedProjects(60);
    const reqs = await seedJobRequisitions(70);
    await seedCandidates(reqs || [], 400);

    console.log('✅ Seeding Complete!');
}

runSeed().catch(console.error);
