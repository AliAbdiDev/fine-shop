export async function register() {
    if (
        process.env.NEXT_RUNTIME === 'nodejs' &&
        process.env.NEXT_PUBLIC_API_MOCKING === 'true'
    ) {
        const { initServer } = await import('./core/mocks/configs/server')
        await initServer()
    }
}
