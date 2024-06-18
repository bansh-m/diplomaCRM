const mongoose = require('mongoose');
const Review = require('../models/Review');

const reviews = [
        {
            "roomId": "66502c6b01688ea1c8969cf7",
            "clientName": "Катерина",
            "clientEmail": "rebecca45@dickerson-sanchez.com",
            "difficulty": 7,
            "actorPerformance": 5,
            "overallRating": 9,
            "comment": "Чудова атмосфера.",
            "createdAt": "2024-06-13"
        },
        {
            "roomId": "66502c6b01688ea1c8969cf7",
            "clientName": "Людмила",
            "clientEmail": "cpadilla@perez-taylor.com",
            "difficulty": 3,
            "actorPerformance": 10,
            "overallRating": 9,
            "comment": "Дуже сподобалося.",
            "createdAt": "2024-06-16"
        },
        {
            "roomId": "66502c6b01688ea1c8969cf7",
            "clientName": "Володимир",
            "clientEmail": "mary61@booth.com",
            "difficulty": 3,
            "actorPerformance": 7,
            "overallRating": 10,
            "comment": "Сподобалися випробування!",
            "createdAt": "2024-05-25"
        },
        {
            "roomId": "66502c6b01688ea1c8969cf7",
            "clientName": "Ольга",
            "clientEmail": "stephen57@young.com",
            "difficulty": 9,
            "actorPerformance": 2,
            "overallRating": 5,
            "comment": "Дуже сподобалося.",
            "createdAt": "2024-05-20"
        },
        {
            "roomId": "66502c6b01688ea1c8969cf7",
            "clientName": "Олена",
            "clientEmail": "michellewood@wells.com",
            "difficulty": 9,
            "actorPerformance": 4,
            "overallRating": 6,
            "comment": "Добре продумані загадки.",
            "createdAt": "2024-05-22"
        },
        {
            "roomId": "66502c6b01688ea1c8969cf7",
            "clientName": "Сергій",
            "clientEmail": "jodyjones@scott.org",
            "difficulty": 3,
            "actorPerformance": 9,
            "overallRating": 9,
            "comment": "Дуже рекомендую!",
            "createdAt": "2024-06-09"
        },
        {
            "roomId": "66502c6b01688ea1c8969cf7",
            "clientName": "Олена",
            "clientEmail": "amymartin@hoffman.com",
            "difficulty": 6,
            "actorPerformance": 6,
            "overallRating": 7,
            "comment": "Ідеальна складність.",
            "createdAt": "2024-06-16"
        },
        {
            "roomId": "66502c6b01688ea1c8969cf7",
            "clientName": "Юрій",
            "clientEmail": "bethburns@aguilar-rose.com",
            "difficulty": 2,
            "actorPerformance": 10,
            "overallRating": 9,
            "comment": "Дуже креативно!",
            "createdAt": "2024-05-20"
        },
        {
            "roomId": "66502e5400cb6bc0030a94a0",
            "clientName": "Леся",
            "clientEmail": "faithrussell@yahoo.com",
            "difficulty": 3,
            "actorPerformance": 7,
            "overallRating": 9,
            "comment": "Неймовірний досвід!",
            "createdAt": "2024-06-06"
        },
        {
            "roomId": "66502e5400cb6bc0030a94a0",
            "clientName": "Тарас",
            "clientEmail": "josephrobbins@wells.net",
            "difficulty": 7,
            "actorPerformance": 6,
            "overallRating": 6,
            "comment": "Сподобалися випробування!",
            "createdAt": "2024-05-30"
        },
        {
            "roomId": "66502e5400cb6bc0030a94a0",
            "clientName": "Олександр",
            "clientEmail": "turnercourtney@hotmail.com",
            "difficulty": 2,
            "actorPerformance": 9,
            "overallRating": 9,
            "comment": "Неймовірний досвід!",
            "createdAt": "2024-05-30"
        },
        {
            "roomId": "66502e5400cb6bc0030a94a0",
            "clientName": "Леся",
            "clientEmail": "clarksarah@elliott.com",
            "difficulty": 7,
            "actorPerformance": 4,
            "overallRating": 7,
            "comment": "Чудовий сюжет!",
            "createdAt": "2024-06-16"
        },
        {
            "roomId": "66502e5400cb6bc0030a94a0",
            "clientName": "Оксана",
            "clientEmail": "john48@moore-jacobson.biz",
            "difficulty": 5,
            "actorPerformance": 7,
            "overallRating": 7,
            "comment": "Дуже сподобалося.",
            "createdAt": "2024-06-11"
        },
        {
            "roomId": "66502e5400cb6bc0030a94a0",
            "clientName": "Катерина",
            "clientEmail": "qjuarez@smith-camacho.net",
            "difficulty": 6,
            "actorPerformance": 8,
            "overallRating": 7,
            "comment": "Дуже рекомендую!",
            "createdAt": "2024-05-29"
        },
        {
            "roomId": "66502e5400cb6bc0030a94a0",
            "clientName": "Михайло",
            "clientEmail": "mikemoore@phillips.com",
            "difficulty": 6,
            "actorPerformance": 4,
            "overallRating": 4,
            "comment": "Ідеальна складність.",
            "createdAt": "2024-06-15"
        },
        {
            "roomId": "66502e5400cb6bc0030a94a0",
            "clientName": "Олександр",
            "clientEmail": "wjoseph@anderson.org",
            "difficulty": 8,
            "actorPerformance": 3,
            "overallRating": 2,
            "comment": "Неймовірний досвід!",
            "createdAt": "2024-05-27"
        },
        {
            "roomId": "66502e5400cb6bc0030a94a0",
            "clientName": "Володимир",
            "clientEmail": "luis12@gmail.com",
            "difficulty": 3,
            "actorPerformance": 8,
            "overallRating": 8,
            "comment": "Чудова атмосфера.",
            "createdAt": "2024-06-01"
        },
        {
            "roomId": "665da0bc84555c1c5001f736",
            "clientName": "Тарас",
            "clientEmail": "rsanders@smith.org",
            "difficulty": 2,
            "actorPerformance": 10,
            "overallRating": 9,
            "comment": "Дуже креативно!",
            "createdAt": "2024-05-20"
        },
        {
            "roomId": "665da0bc84555c1c5001f736",
            "clientName": "Леся",
            "clientEmail": "cherylgutierrez@collins.com",
            "difficulty": 1,
            "actorPerformance": 9,
            "overallRating": 8,
            "comment": "Чудова атмосфера.",
            "createdAt": "2024-06-12"
        },
        {
            "roomId": "665da0bc84555c1c5001f736",
            "clientName": "Ірина",
            "clientEmail": "gregory70@hotmail.com",
            "difficulty": 1,
            "actorPerformance": 8,
            "overallRating": 9,
            "comment": "Захоплююча пригода!",
            "createdAt": "2024-06-14"
        },
        {
            "roomId": "665da0bc84555c1c5001f736",
            "clientName": "Юрій",
            "clientEmail": "crystal84@hotmail.com",
            "difficulty": 7,
            "actorPerformance": 6,
            "overallRating": 5,
            "comment": "Чудова атмосфера."
        }
];

mongoose.connect("mongodb://127.0.0.1:27017/crmDB")
    .then(() => {
        console.log('Connected to MongoDB');
        return Review.insertMany(reviews);
    })
    .then(() => {
        console.log('Reviews added successfully');
    })
    .catch(error => {
        console.error('Error connecting to MongoDB or inserting reviews:', error);
    })
    .finally(() => {
        mongoose.disconnect();
    });
