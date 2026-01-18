
import { Customer, CustomerStatus, EngagementEvent } from './types';

const PROVIDED_NAMES = [
  'Arjun', 'Karthik', 'Vignesh', 'Saravanan', 'Murugan',
  'Oliver', 'Harry', 'Jack', 'George', 'Charlie', 'Thomas', 'Henry', 'Leo', 'Alfie', 'Oscar', 'Arthur', 'Freddie', 'Louis', 'Ben', 'Sam',
  'Janani', 'Priya', 'Divya', 'Saranya', 'Kavitha', 'Meena', 'Revathi', 'Nandhini', 'Keerthi', 'Ramya', 'Pavithra', 'Gayathri', 'Yazhini', 'Dharshini', 'Sneha',
  'Senthil', 'Naveen', 'Manikandan', 'Siva', 'Bala', 'James',
  'Emily', 'Jessica', 'Ashley', 'Sophia', 'Olivia', 'Emma', 'Mia', 'Ava', 'Isabella', 'Chloe', 'Lily', 'Madison', 'Hannah', 'Grace', 'Natalie',
  'Michael', 'John', 'David', 'Robert', 'Daniel', 'William', 'Matthew', 'Andrew', 'Joseph',
  'Amelia', 'Charlotte', 'Sophie', 'Lucy', 'Ella', 'Daisy', 'Poppy', 'Isla', 'Millie', 'Rosie', 'Evie', 'Holly', 'Ruby', 'Florence', 'Harriet',
  'James', 'Michael', 'William', 'David', 'John', 'Robert', 'Daniel', 'Matthew', 'Joseph', 'Andrew', 'Joshua', 'Ryan', 'Brandon', 'Christopher', 'Anthony', 'Kevin', 'Brian', 'Justin', 'Eric', 'Tyler',
  'Amal', 'Arun', 'Nikhil', 'Sreejith', 'Vishnu',
  'Anjali', 'Athira', 'Lakshmi', 'Meera'
];

const companies = [
  'TechFlow Solutions', 'GlobalReach', 'CreativePulse', 'Nexus Dynamics', 'CloudScale Inc', 
  'DataBridge', 'Apex Systems', 'Zenith Labs', 'Quantum Leap', 'Stellar AI',
  'Velocity Ventures', 'Blue Horizon', 'InfraCore', 'Swift Logistics', 'Bright Path'
];

const generateEvents = (count: number): EngagementEvent[] => {
  const events: EngagementEvent[] = [];
  const types: ('LOGIN' | 'FEATURE_USE' | 'SUPPORT_TICKET' | 'PAYMENT' | 'FEEDBACK')[] = 
    ['LOGIN', 'FEATURE_USE', 'SUPPORT_TICKET', 'PAYMENT', 'FEEDBACK'];
  
  for (let i = 0; i < count; i++) {
    events.push({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(),
      type: types[Math.floor(Math.random() * types.length)],
      metadata: {}
    });
  }
  return events;
};

const statuses = [
  CustomerStatus.ACTIVE,
  CustomerStatus.ONBOARDING,
  CustomerStatus.CHURN_RISK,
  CustomerStatus.UPSELL_READY,
  CustomerStatus.CHURNED
];

const generateCustomers = (total: number): Customer[] => {
  const customers: Customer[] = [];
  
  for (let i = 0; i < total; i++) {
    // Use the exact name provided in the list
    const name = PROVIDED_NAMES[i % PROVIDED_NAMES.length];
    const company = companies[Math.floor(Math.random() * companies.length)];
    
    // Assign statuses based on simple distribution logic
    const status = i < 5 
      ? (i % 3 === 0 ? CustomerStatus.ACTIVE : i % 3 === 1 ? CustomerStatus.CHURN_RISK : CustomerStatus.ONBOARDING)
      : statuses[Math.floor(Math.random() * statuses.length)];
    
    // Correlate health score with status
    let healthScore = 0;
    if (status === CustomerStatus.ACTIVE) healthScore = 75 + Math.random() * 20;
    else if (status === CustomerStatus.CHURN_RISK) healthScore = 20 + Math.random() * 30;
    else if (status === CustomerStatus.ONBOARDING) healthScore = 50 + Math.random() * 30;
    else if (status === CustomerStatus.UPSELL_READY) healthScore = 85 + Math.random() * 15;
    else if (status === CustomerStatus.CHURNED) healthScore = 5 + Math.random() * 15;

    customers.push({
      id: `c${i + 1}`,
      name,
      email: `${name.toLowerCase().replace(/\s/g, '')}${i}@${company.toLowerCase().replace(/\s/g, '')}.com`,
      company,
      joinedDate: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365).toISOString().split('T')[0],
      status,
      healthScore: Math.round(healthScore),
      lifetimeValue: Math.floor(Math.random() * 10000) + 500,
      events: generateEvents(Math.floor(Math.random() * 5) + 1)
    });
  }
  return customers;
};

export const INITIAL_CUSTOMERS: Customer[] = generateCustomers(97);

export const SYSTEM_INSTRUCTIONS = `
You are the CustomerMind Customer Lifecycle Manager. Your goal is to maximize customer retention and lifetime value.
You independently analyze behavioral data, predict risks/opportunities, and decide on the best engagement action.

Guidelines:
1. Be proactive: Identify churn before it happens.
2. Be personal: Use customer context to tailor messages.
3. Be ethical: Respect consent and don't be spammy.
4. Adapt: If a strategy fails (e.g., a discount didn't stop a churn), learn and try a different approach next time.

Output JSON only for analysis and decisions.
`;
