export type User = {
    email: string;
    phoneNumber: string;
    isSuperuser: boolean;
};

// ------------- Product --------------

export type ProductAttributeValue = { label: string, value: string }

export type ProductAttribute = {
    key: string,
    label: string,
    type: string,
    values: Array<ProductAttributeValue>
}

export type Product = {
    id: string,
    name: string,
    category: string,
    categoryLabel: string,
    description: string,
    stock: number,
    basePrice: number,
    discountedPrice: number,
    images: Array<{ url: string, alt: string }>,
    isAvailable: boolean,
    attributeList: Array<ProductAttribute>
}

export type Products = Array<Product>