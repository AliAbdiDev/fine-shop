export type EntityId = number;

export type User = {
    id?: EntityId;
    email: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    avatar?: string | null;
    isActive?: boolean;
    isSuperuser?: boolean;
    lastLogin?: number;
    createdAt?: number;
    updatedAt?: number;
};
export type Users = Array<User>

// ------------- Product --------------
export type ProductAttribute = {
    id?: EntityId
    key: string,
    values: Array<string>
}

export type ProductAttributes = Array<ProductAttribute>

export type Product = {
    id?: EntityId
    name: string,
    category: string,
    categoryLabel?: string,
    stock: number,
    basePrice: number,
    discountedPrice?: number,
    description?: string,
    images: Array<{
        url: string, alt: string,
        id?: EntityId
    } | File>,
    isAvailable?: boolean,
    attributeList?: Array<ProductAttribute>
}

export type Products = Array<Product>

export type Category = {
    id?: EntityId,
    name: string,
    slug: string
}
export type Categorys = Array<Category>