const WORKER_URL = 'https://batch-proxy.u-zhomart.workers.dev';

export async function getUserBatch(userId, token) {
    try {
        const res = await fetch(`${WORKER_URL}?userId=${userId}`, {
            headers: { 'X-Jwt-Token': token }
        });
        const data = await res.json();
        return data.labels?.[0]?.labelName ?? null;
    } catch {
        return null;
    }
}