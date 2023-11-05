import { auth } from "@clerk/nextjs";
import { db } from "./db";
import { usersSubscriptions } from "./db/schema";
import { eq } from "drizzle-orm";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

/**
 * checks if the user has a valid subscription
 * @returns boolean
 */
export const checkSubscription = async () => {
    const {userId} = await auth();

    if (!userId) {
        return false;
    }

    const _userSubscriptions = await db.select()
    .from(usersSubscriptions)
    .where(eq(usersSubscriptions.userId, userId));

    if (!_userSubscriptions[0]) {
        return false;
    }

    const userSubscription = _userSubscriptions[0];

    const isValid = userSubscription.stripePriceId && userSubscription.stripeCurrentPeriodEnd && userSubscription.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS > Date.now();

    return !!isValid;
};