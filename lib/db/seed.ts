import { tableHashes } from '@/data/tableHash';
import { stripe } from '../payments/stripe';
import { db } from './drizzle';
import { users, teams, teamMembers, restaurantTables } from './schema';
import { hashPassword } from '@/lib/auth/session';

async function createStripeProducts() {
  console.log('Creating Stripe products and prices...');

  const baseProduct = await stripe.products.create({
    name: 'Base',
    description: 'Base subscription plan',
  });

  await stripe.prices.create({
    product: baseProduct.id,
    unit_amount: 800, // $8 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
    },
  });

  const plusProduct = await stripe.products.create({
    name: 'Plus',
    description: 'Plus subscription plan',
  });

  await stripe.prices.create({
    product: plusProduct.id,
    unit_amount: 1200, // $12 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
    },
  });

  console.log('Stripe products and prices created successfully.');
}

async function seed() {
  type Account = {email: string, password: string};
  const accounts: Account[] = [
    {
      email: 'renjian',
      password: 'renjian111',
    },
    {
      email: 'donglian',
      password: 'donglian222',
    },
    {
      email: 'others',
      password: 'others222',
    },
    {
      email: 'test@test.com',
      password: 'admin123',
    }
  ];

  const seededUsers = await db.transaction(async (tx) => {
    const createdUsers = [];

    for await (const account of accounts) {
      const passwordHash = await hashPassword(account.password);
      const [createdUser] = await tx
        .insert(users)
        .values({
          email: account.email,
          passwordHash,
          role: 'owner',
        })
        .returning();

      createdUsers.push(createdUser);
    }

    return createdUsers;
  });

  const user = seededUsers[0];

  console.log(`${seededUsers.length} users created.`);

  const [team] = await db
    .insert(teams)
    .values({
      name: 'Test Team',
    })
    .returning();

  await db.insert(teamMembers).values({
    teamId: team.id,
    userId: user.id,
    role: 'owner',
  });

  await createStripeProducts();

  // Seed restaurant tables.
  await db.transaction(async (tx) => {
    for await (const [i, hash] of tableHashes.entries()) {
      await tx.insert(restaurantTables).values({
        tableHash: hash,
        number: i + 1,
      });
    }
  });
}

seed()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seed process finished. Exiting...');
    process.exit(0);
  });
