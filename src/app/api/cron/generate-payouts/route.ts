import { NextResponse } from "next/server";
import { db as prisma } from "@/src/lib/db";
import { calculateBiMonthlyPayout } from "@/src/lib/finance/calculations";

export async function POST(req: Request) {
  try {
    // 1. Verify Authorization Header (AWS EventBridge will send a secret token)
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Determine Pay Period string (e.g., "Aug 1 - Aug 15, 2026")
    const now = new Date();
    const year = now.getFullYear();
    const month = now.toLocaleString("default", { month: "short" });
    const isMidMonth = now.getDate() <= 15;
    
    let payPeriod = "";
    if (isMidMonth) {
      payPeriod = `${month} 1 - ${month} 15, ${year}`;
    } else {
      const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
      payPeriod = `${month} 16 - ${month} ${lastDay}, ${year}`;
    }

    let createdCount = 0;

    // ==========================================
    // 3. Generate Pending Payouts for VAs
    // ==========================================
    const activeAssignments = await prisma.assignments.findMany({
      where: { status: "active" },
      include: {
        job_applications: { include: { job_posts: true } },
        va_profiles: true
      }
    });

    for (const assignment of activeAssignments) {
      const jobPost = assignment.job_applications?.job_posts;
      if (!jobPost) continue;

      const vaRate = jobPost.va_hourly_rate;
      const workSchedule = jobPost.work_schedule;
      
      const payoutAmount = calculateBiMonthlyPayout(Number(vaRate), workSchedule);
      const vaUserId = assignment.va_profiles.user_id;

      const payoutMethod = await prisma.payout_methods.findFirst({
        where: { user_id: vaUserId, status: "active" },
        orderBy: { updated_at: 'desc' }
      });

      await prisma.payouts.create({
        data: {
          recipient_user_id: vaUserId,
          recipient_type: "va",
          amount: payoutAmount,
          currency: jobPost.currency || "USD",
          status: "pending",
          pay_period: payPeriod,
          payout_method_id: payoutMethod?.id || null,
          remarks: `Automated bi-monthly payout for Job: ${jobPost.job_title}`
        }
      });
      createdCount++;
    }

    // ==========================================
    // 4. Generate Pending Payouts for Internal Staff
    // ==========================================
    const internalStaff = await prisma.internal_staff_profiles.findMany({
      where: { hourly_rate: { gt: 0 } }
    });

    for (const staff of internalStaff) {
      const payoutAmount = calculateBiMonthlyPayout(Number(staff.hourly_rate), staff.work_schedule);
      
      const payoutMethod = await prisma.payout_methods.findFirst({
        where: { user_id: staff.user_id, status: "active" },
        orderBy: { updated_at: 'desc' }
      });

      await prisma.payouts.create({
        data: {
          recipient_user_id: staff.user_id,
          recipient_type: "internal",
          amount: payoutAmount,
          currency: "USD",
          status: "pending",
          pay_period: payPeriod,
          payout_method_id: payoutMethod?.id || null,
          remarks: `Automated bi-monthly payout for Internal Staff`
        }
      });
      createdCount++;
    }

    // ==========================================
    // 5. Generate Pending Payouts for Trainers
    // ==========================================
    const unpayoutPayments = await prisma.payments.findMany({
      where: {
        related_training_material_id: { not: null },
        status: "verified",
        trainer_payout_id: null
      },
      include: {
        training_materials: {
          include: { trainer_profiles: true }
        }
      }
    });

    // Group by Trainer User ID
    const trainerPayoutsMap = new Map<string, {
      userId: bigint;
      totalAmount: number;
      paymentIds: bigint[];
    }>();

    for (const payment of unpayoutPayments) {
      const material = payment.training_materials;
      if (!material || !material.trainer_profiles) continue;
      
      const trainerUserId = material.trainer_profiles.user_id;
      const commissionRate = Number(material.platform_commission_rate || 30);
      const amountPaid = Number(payment.amount_paid);
      
      const trainerCut = amountPaid * ((100 - commissionRate) / 100);
      
      const key = trainerUserId.toString();
      if (!trainerPayoutsMap.has(key)) {
        trainerPayoutsMap.set(key, {
          userId: trainerUserId,
          totalAmount: 0,
          paymentIds: []
        });
      }
      
      const mapItem = trainerPayoutsMap.get(key)!;
      mapItem.totalAmount += trainerCut;
      mapItem.paymentIds.push(payment.id);
    }

    // Create payouts and update payments
    for (const [key, data] of Array.from(trainerPayoutsMap.entries())) {
      const payoutMethod = await prisma.payout_methods.findFirst({
        where: { user_id: data.userId, status: "active" },
        orderBy: { updated_at: 'desc' }
      });

      // Use a transaction to ensure atomic payout creation and payment update
      await prisma.$transaction(async (tx) => {
        const payout = await tx.payouts.create({
          data: {
            recipient_user_id: data.userId,
            recipient_type: "trainer",
            amount: data.totalAmount,
            currency: "USD",
            status: "pending",
            pay_period: payPeriod,
            payout_method_id: payoutMethod?.id || null,
            remarks: `Automated course sales payout for ${data.paymentIds.length} purchases`
          }
        });

        // Mark payments as paid out
        await tx.payments.updateMany({
          where: { id: { in: data.paymentIds } },
          data: { trainer_payout_id: payout.id }
        });
      });
      
      createdCount++;
    }

    return NextResponse.json({ success: true, message: `Successfully generated ${createdCount} payouts for period ${payPeriod}` });
  } catch (error: any) {
    console.error("Cron generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
