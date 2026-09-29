export interface product {
    id: number;
    name: string;
    price: number;
}

const products: product[] = [
    {id: 1, name: 'Wireless mouse', price: 15.99},
    {id: 2, name: 'Mechanical keyboard', price: 49.99},
    {id: 3, name: 'USB-C hub', price: 24.5},
];

export const getAllProducts = (): product[]=>{
    return products;
};

export const getProductById = (id: number): product | undefined =>{
    return products.find((p)=> p.id ===id);
};

