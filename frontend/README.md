# bun-react-tailwind-shadcn-template

To install dependencies:

```bash
bun install
```

To start a development server:

```bash
bun dev
```

To run for production:

```bash
bun start
```

This project was created using `bun init` in bun v1.3.6. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

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
