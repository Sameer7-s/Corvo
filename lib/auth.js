import { prisma } from "./db";

// Frictionless Hackathon Mode: Mock Authentication
// This bypasses NextAuth entirely so the app can be demoed without logging in.
// It returns a persistent "Demo Athlete" user to keep database relations happy.

export async function auth() {
  try {
    // Attempt to fetch the demo user
    let user = await prisma.user.findUnique({
      where: { email: "demo@corvo.app" }
    });

    // If they don't exist, create them instantly
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "demo@corvo.app",
          name: "Demo Athlete",
          passwordHash: "mocked"
        }
      });
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  } catch (error) {
    console.error("Mock Auth Error:", error);
    // Fallback if DB fails
    return {
      user: {
        id: "demo-user-id",
        name: "Demo Athlete"
      }
    };
  }
}

// Mock handlers to prevent crashes if something still calls them
export const handlers = { GET: () => {}, POST: () => {} };
export const signIn = async () => {};
export const signOut = async () => {};
