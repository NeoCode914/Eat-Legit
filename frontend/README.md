# 📁 Eat_Legit Backend Structure

```bash
Eat_Legit/backend/
├── prisma/
│   ├── migrations/
│   ├── .env
│   └── schema.prisma
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── food.controller.ts
│   ├── declarations/
│   │   └── express.d.ts
│   ├── middlewares/
│   │   └── auth.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── food.routes.ts
│   └── ZodModels/
│       ├── foodPartnerModels.ts
│       ├── foodVidsModel.ts
│       └── userModel.ts
├── app.ts
├── db.ts
├── prisma.config.ts
├── server.ts
└── package.json
