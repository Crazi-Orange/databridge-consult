import { Product } from '../types/product';

export const products: Product[] = [
    {
        id: '1',
        name: 'MacBook Pro 14',
        description: 'Powerful laptop',
        price: 1999,
        stock: 5,
        category: 'Laptops',
        images: ['/macbook14.png']
    },
    {
        id: '2',
        name: 'Wireless Mouse',
        description: 'Smooth and responsive',
        price: 25, stock: 50,
        category: 'Accessories',
        images: ['/mouse.png']
    },
];
