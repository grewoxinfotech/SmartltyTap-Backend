const cron = require("node-cron");
const { Op } = require("sequelize");
const { UserSubscription, Invoice, Plan } = require("../models");

function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function addYears(date, years) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

async function runAutoBillingOnce() {
  const now = new Date();
  const subs = await UserSubscription.findAll({
    where: {
      billing_mode: "AUTO",
      status: "ACTIVE",
      next_billing_at: { [Op.lte]: now },
    },
    include: [{ model: Plan, attributes: ["code", "price", "billing_cycle", "is_active"] }],
    limit: 500,
  });

  for (const s of subs) {
    const plan = s.Plan;
    if (!plan || !plan.is_active) continue;

    // eslint-disable-next-line no-await-in-loop
    await Invoice.create({
      user_id: s.user_id,
      plan_code: s.plan_code,
      amount: Number(plan.price),
      currency: "INR",
      status: "DUE",
      due_date: now,
      notes: "Auto-generated renewal invoice",
    });

    const next =
      plan.billing_cycle === "YEARLY" ? addYears(now, 1) : addMonths(now, 1);
    // eslint-disable-next-line no-await-in-loop
    await s.update({ next_billing_at: next });
  }

  return { processed: subs.length };
}

function startCronJobs() {
  // Runs daily at 02:00 server time
  cron.schedule("0 2 * * *", async () => {
    try {
      await runAutoBillingOnce();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Auto billing cron failed:", e?.message || e);
    }
  });
}

module.exports = { startCronJobs, runAutoBillingOnce };

