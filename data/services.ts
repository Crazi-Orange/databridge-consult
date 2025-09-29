import { Service } from '../types/service';

export const services: Service[] = [
    {
        id: '1',
        title: 'Research Writing',
        description: 'High-quality research writing services.',
        price: 150, category: 'Writing',
        duration_days: 5,
        digital_delivery: true
    },
    {
        id: '2',
        title: 'Graphic Design',
        description: 'Professional graphic design.',
        price: 80, category: 'Design',
        duration_days: 3,
        digital_delivery: true
    },
];
