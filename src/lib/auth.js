import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to your .env.local file");
}

const client = new MongoClient(process.env.MONGODB_URL);
const db = client.db("bazardor"); 

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_OATH_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: process.env.GIT_HUB_CLIENT_ID || "",
      clientSecret: process.env.GIT_HUB_CLIENT_SECRET || "",
    },
  },
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
});