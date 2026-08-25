const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  let user = await prisma.user.findUnique({
    where: { email: "demo@rehabcoach.app" }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: "demo-athlete",
        email: "demo@rehabcoach.app",
        name: "Demo Athlete",
        onboardingCompleted: true,
        goal: "improve mobility"
      }
    });
  }
  
  const userId = user.id;

  // Clear existing mock sessions to avoid duplicates
  await prisma.movementSession.deleteMany({
    where: { userId }
  });

  console.log("Seeding past sessions...");

  // Add 3 sessions over the past few days
  const now = new Date();
  const daysAgo = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const session1 = await prisma.movementSession.create({
    data: {
      userId,
      exercise: "bodyweight_squat",
      targetReps: 10,
      attemptedReps: 10,
      acceptedReps: 6,
      rejectedReps: 4,
      movementQuality: 71,
      depthScore: 78,
      alignmentScore: 75,
      consistencyScore: 76,
      startedAt: daysAgo(3),
      completedAt: daysAgo(3),
      createdAt: daysAgo(3),
      updatedAt: daysAgo(3),
    }
  });

  const session2 = await prisma.movementSession.create({
    data: {
      userId,
      exercise: "pushup",
      targetReps: 10,
      attemptedReps: 10,
      acceptedReps: 7,
      rejectedReps: 3,
      movementQuality: 79,
      depthScore: 82,
      alignmentScore: 80,
      consistencyScore: 81,
      startedAt: daysAgo(1),
      completedAt: daysAgo(1),
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
    }
  });

  const session3 = await prisma.movementSession.create({
    data: {
      userId,
      exercise: "bodyweight_squat",
      targetReps: 10,
      attemptedReps: 10,
      acceptedReps: 8,
      rejectedReps: 2,
      movementQuality: 84,
      depthScore: 89,
      alignmentScore: 84,
      consistencyScore: 86,
      startedAt: now,
      completedAt: now,
      createdAt: now,
      updatedAt: now,
    }
  });

  console.log("Seed complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
