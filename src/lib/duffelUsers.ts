/**
 * Duffel Customer Users Helper
 * 
 * Utility functions to manage Duffel Customer Users.
 * These functions ensure users are created in Duffel before:
 * - Opening the Duffel Assistant
 * - Creating orders
 */

interface DuffelCustomerUser {
    id: string;
    email: string;
    given_name: string;
    family_name: string;
}

interface CreateUserParams {
    email: string;
    given_name: string;
    family_name: string;
    phone_number?: string;
}

/**
 * Get or create a Duffel Customer User
 * 
 * This function first checks if a user exists with the given email.
 * If not, it creates a new customer user.
 * 
 * @param params User details
 * @returns The Duffel Customer User ID
 */
export async function getOrCreateDuffelUser(params: CreateUserParams): Promise<DuffelCustomerUser | null> {
    const { email, given_name, family_name, phone_number } = params;

    try {
        // 1. First, check if user exists
        const getRes = await fetch(`/api/duffel/customer-users?email=${encodeURIComponent(email)}`);
        const getData = await getRes.json();

        if (getData.found) {
            return {
                id: getData.id,
                email: getData.email,
                given_name: getData.given_name,
                family_name: getData.family_name
            };
        }

        // 2. User doesn't exist, create new one
        const createRes = await fetch('/api/duffel/customer-users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                given_name,
                family_name,
                phone_number
            })
        });

        const createData = await createRes.json();

        if (createData.error) {
            console.error('Failed to create Duffel user:', createData.error);
            return null;
        }

        if (createData.exists) {
            // Edge case: user was created between check and create
            // Try to get again
            const retryRes = await fetch(`/api/duffel/customer-users?email=${encodeURIComponent(email)}`);
            const retryData = await retryRes.json();

            if (retryData.found) {
                return {
                    id: retryData.id,
                    email: retryData.email,
                    given_name: retryData.given_name,
                    family_name: retryData.family_name
                };
            }
        }

        return {
            id: createData.id,
            email: createData.email,
            given_name: createData.given_name,
            family_name: createData.family_name
        };

    } catch (error) {
        console.error('Error managing Duffel user:', error);
        return null;
    }
}

/**
 * Get Duffel Customer User ID for a given email
 * Returns null if user doesn't exist
 */
export async function getDuffelUserId(email: string): Promise<string | null> {
    try {
        const res = await fetch(`/api/duffel/customer-users?email=${encodeURIComponent(email)}`);
        const data = await res.json();

        if (data.found) {
            return data.id;
        }

        return null;
    } catch (error) {
        console.error('Error getting Duffel user:', error);
        return null;
    }
}
