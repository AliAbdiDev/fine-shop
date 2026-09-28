export type EntityId = number;

export type User = {
    id?: EntityId
    email: string;
    phoneNumber: string;
    isSuperuser: boolean;
};

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
    images: Array<{ url: string, alt: string } | File>,
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