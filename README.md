# CTF platform

Website for hosting my CTF challenges.

WIP, no live server yet

Uses Next.js with Mantine UI and Prisma ORM (currently with SQLite)

Generated from [Next.js + Mantine template](https://github.com/mantinedev/next-app-template)

---

## Local Development Setup

> **Note:** These steps are **only for developers cloning this repo**.
> You do **not** need to do this to use the deployed site.

### Prerequisites

- **Node.js**
- **Yarn** package manager
- **Git**

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/awrreny/ctf-platform.git
cd ctf-platform

# 2. Install dependencies
yarn

# 3. Create environment file (you will need to read through this and configure it to make it work)
cp .env.example .env

# 4. (Optional, to add your own challenges)
cp prisma/chal-seed-data-example.json prisma/chal-seed-data.json

# 5. Initialise database (make sure you are still in ctf-platform/)
yarn prisma generate
# change 'dev' to 'deploy' if in production
yarn prisma migrate dev
yarn prisma db seed

# 7. Run the development server
yarn dev
```
