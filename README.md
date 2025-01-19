# 💸 HETIC Wallet API Back 💸

The front repository: https://github.com/MisterAzix/hetic-wallet-api-front

---

## 📝️ Table of contents 📝

- [How to run the project](#how-to-run-the-project)
- [👤️ Authors 👤](#-authors-)

---

## How to run the project

1. Clone the repository

```bash
git clone git@github.com:MisterAzix/hetic-wallet-api-back.git
```

2. Run `pnpm install` to install the dependencies

```bash
pnpm install
```

3. Duplicate the `.env.template` file and rename it to `.env`. Fill in the environment variables with the correct values.

```dotenv
DATABASE_URL="postgresql://postgres:password@localhost:5432/hetic?schema=public"
```

4. Launch docker-compose to start the database

```bash
cd .docker/ && docker compose up -d && cd ../
```

5. Run the migrations

```bash
pnpx prisma migrate dev
```

6. Run the project

```bash
pnpm start
```

---

## 👤️ Authors 👤

- Maxence BREUILLES ([@MisterAzix](https://github.com/MisterAzix))<br />
- Benoît FAVRIE ([@benoitfvr](https://github.com/benoitfvr))<br />
- Doriane FARAU ([@DFarau](https://github.com/DFarau))<br />
- Charles LAMBRET ([@CharlesLambret](https://github.com/CharlesLambret))<br />
- Antonin CHARPENTIER ([@toutouff](https://github.com/toutouff))
