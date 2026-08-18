
export const ROUTES = {
    HOME: '/',
    SIGNIN: '/signin',
    SIGNIN_VERIFY: '/signin/verify',
    DASHBOARD: '/dashboard',
} as const

export type Route = (typeof ROUTES)[keyof typeof ROUTES]

// dynamic route examp
// export const ROUTES = {
//   PRODUCT: (id: string) => `/products/${id}`,
//   PRODUCTS: '/products',
// } as const
