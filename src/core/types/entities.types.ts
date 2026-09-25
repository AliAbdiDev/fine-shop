export type User = {
    email: string;
    phoneNumber: string;
    isSuperuser: boolean;
};

// ------------- Product --------------
export type ProductAttribute = {
    key: string,
    values: Array<string>
}

export type Product = {
    id?: string;
    name: string,
    category: string,
    categoryLabel: string,
    stock: number,
    basePrice: number,
    discountedPrice?: number,
    description?: string,
    images: Array<File>,
    isAvailable?: boolean,
    attributeList?: Array<ProductAttribute>
}

export type Products = Array<Product>