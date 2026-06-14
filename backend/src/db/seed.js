const { fakerEN_IN: faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');
const { supabase } = require('./supabase');
const { calculateChurnScore } = require('../services/churnScoring');

const generateCustomers = () => {
  const customers = [];
  const now = new Date();

  // 30 Critical customers
  for (let i = 0; i < 30; i++) {
    const total_spend = faker.number.int({ min: 8000, max: 25000 });
    const total_orders = faker.number.int({ min: 5, max: 15 });
    const daysSinceLastOrder = faker.number.int({ min: 75, max: 120 });
    const daysSinceFirstOrder = faker.number.int({ min: 150, max: 365 });

    const last_order_date = new Date(now.getTime() - daysSinceLastOrder * 24 * 60 * 60 * 1000);
    const first_order_date = new Date(now.getTime() - daysSinceFirstOrder * 24 * 60 * 60 * 1000);

    customers.push({
      id: uuidv4(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number('+91##########'),
      total_spend,
      total_orders,
      last_order_date: last_order_date.toISOString(),
      first_order_date: first_order_date.toISOString()
    });
  }

  // 40 At Risk customers
  for (let i = 0; i < 40; i++) {
    const total_spend = faker.number.int({ min: 2000, max: 8000 });
    const total_orders = faker.number.int({ min: 2, max: 6 });
    const daysSinceLastOrder = faker.number.int({ min: 35, max: 75 });
    const daysSinceFirstOrder = faker.number.int({ min: 80, max: 200 });

    const last_order_date = new Date(now.getTime() - daysSinceLastOrder * 24 * 60 * 60 * 1000);
    const first_order_date = new Date(now.getTime() - daysSinceFirstOrder * 24 * 60 * 60 * 1000);

    customers.push({
      id: uuidv4(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number('+91##########'),
      total_spend,
      total_orders,
      last_order_date: last_order_date.toISOString(),
      first_order_date: first_order_date.toISOString()
    });
  }

  // 30 Safe customers
  for (let i = 0; i < 30; i++) {
    const total_spend = faker.number.int({ min: 500, max: 5000 });
    const total_orders = faker.number.int({ min: 1, max: 5 });
    const daysSinceLastOrder = faker.number.int({ min: 5, max: 30 });
    const daysSinceFirstOrder = faker.number.int({ min: 40, max: 100 });

    const last_order_date = new Date(now.getTime() - daysSinceLastOrder * 24 * 60 * 60 * 1000);
    const first_order_date = new Date(now.getTime() - daysSinceFirstOrder * 24 * 60 * 60 * 1000);

    customers.push({
      id: uuidv4(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number('+91##########'),
      total_spend,
      total_orders,
      last_order_date: last_order_date.toISOString(),
      first_order_date: first_order_date.toISOString()
    });
  }

  return customers;
};

const seedDatabase = async () => {
  console.log('Generating 100 realistic customers...');
  const customers = generateCustomers();

  console.log('Inserting customers into Supabase...');
  
  const { data, error } = await supabase
    .from('customers')
    .insert(customers)
    .select();

  if (error) {
    console.error('Error inserting customers:', error);
    return;
  }

  console.log(`Successfully inserted ${data.length} customers.`);
  console.log('Calculating churn scores and risk tiers...');
  
  const updates = data.map(customer => {
    const { score, tier } = calculateChurnScore(customer);
    return {
      id: customer.id,
      churn_score: score,
      risk_tier: tier
    };
  });

  console.log('Updating customers with scores and tiers...');
  let updateCount = 0;
  for (const update of updates) {
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        churn_score: update.churn_score,
        risk_tier: update.risk_tier
      })
      .eq('id', update.id);
      
    if (updateError) {
      console.error(`Error updating customer ${update.id}:`, updateError);
    } else {
      updateCount++;
    }
  }

  console.log(`Successfully updated ${updateCount} customers with churn scores and risk tiers.`);
};

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
