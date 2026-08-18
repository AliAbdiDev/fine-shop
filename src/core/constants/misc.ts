export const APP_MODE = {
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
};


//---- ROLES
export const ROLES = {
    GUEST: 'guest',
    BUYER: 'buyer',
    ADMIN: 'admin',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]
