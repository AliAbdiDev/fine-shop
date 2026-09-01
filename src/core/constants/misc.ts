export const APP_MODE = {
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
    isClient: () => typeof window !== 'undefined',
};

//---- ROLES
export const ROLES = {
    GUEST: 'guest',
    BUYER: 'buyer',
    ADMIN: 'admin',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]


export const ROUTES = {
    HOME: '/',
    SIGNIN: '/signin',
    SIGNIN_VERIFY: '/signin/verify',
    ADMIN: '/admin',
    Products: "/products"
} as const

export type Routekeys = keyof typeof ROUTES
export type Route = (typeof ROUTES)[keyof typeof ROUTES]

export const ROLE_HOME: Record<Role, Route> = {
    [ROLES.GUEST]: ROUTES.HOME,
    [ROLES.BUYER]: ROUTES.HOME,
    [ROLES.ADMIN]: ROUTES.ADMIN,
}

// dynamic route examp
// export const ROUTES = {
//   PRODUCT: (id: string) => `/products/${id}`,
//   PRODUCTS: '/products',
// } as const
