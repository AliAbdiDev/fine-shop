export type EntityId = number;

export type User = {
    id?: EntityId;
    firstName?: string;
    lastName?: string;
    email: string;
    phoneNumber?: string;
    avatarUrl?: string | null;
    isActive?: boolean;
    isSuperuser?: boolean;
    createdAt?: string;
    updatedAt?: string;
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