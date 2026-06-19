# MongoDB Atlas Setup Guide (for FreshBasket)

This guide gets your database working on MongoDB Atlas (cloud) in under 10 minutes — needed if you want to deploy your app online.

> 💡 If you just want to run the app on your own laptop for now, skip this guide — the default `.env` already works with local MongoDB (just install MongoDB Community Server and run `mongod`).

---

## Step 1: Create a Database User (with password you'll remember)

1. Log in to https://cloud.mongodb.com
2. Click your project → **Clusters** (left sidebar)
3. On your cluster card, click the **"..."** (three dots) → if no user option appears there, use the address bar trick below.

**Fastest way to reach the Database Users page:**
1. Look at your browser's address bar. It looks like:
   ```
   https://cloud.mongodb.com/v2/64xxxxxxxxxxxxxxxxxxxxxx#/clusters
   ```
2. Replace everything after the `#` with `/security/database/users`, so it becomes:
   ```
   https://cloud.mongodb.com/v2/64xxxxxxxxxxxxxxxxxxxxxx#/security/database/users
   ```
3. Press Enter. This takes you directly to **Database Access**.

4. Click **"+ Add New Database User"**
5. Authentication Method: **Password**
6. Username: `freshbasket_admin` (or anything, no spaces)
7. Password: Click **"Autogenerate Secure Password"**
8. **🚨 IMMEDIATELY click the copy icon and paste it into Notepad — save it!** You cannot view it again later.
9. Database User Privileges: select **"Read and write to any database"**
10. Click **"Add User"**

---

## Step 2: Allow Network Access

1. Same trick — change the URL ending to `/security/network/accessList`
   ```
   https://cloud.mongodb.com/v2/64xxxxxxxxxxxxxxxxxxxxxx#/security/network/accessList
   ```
2. Click **"+ Add IP Address"**
3. Click **"Allow Access from Anywhere"** (fills in `0.0.0.0/0`)
4. Click **"Confirm"**

> This is required because deployment platforms like Render use changing IP addresses.

---

## Step 3: Get Your Connection String

1. Go back to **Clusters**
2. Click **"Connect"** on your cluster
3. Click **"Drivers"**
4. Select **Node.js** as the driver
5. Copy the connection string shown. It looks like:
   ```
   mongodb+srv://<username>:<password>@freshbasket-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=freshbasket-cluster
   ```

---

## Step 4: Build Your Final MONGO_URI

Take the string from Step 3 and make **3 edits**:

| Find | Replace with |
|------|--------------|
| `<username>` | The username you created in Step 1 (e.g. `freshbasket_admin`) |
| `<password>` | The password you copied and saved in Step 1 |
| `/?retryWrites` | `/freshbasket?retryWrites` (adds your database name) |

### Example

**Before:**
```
mongodb+srv://<username>:<password>@freshbasket-cluster.40fofab.mongodb.net/?retryWrites=true&w=majority&appName=freshbasket-cluster
```

**After (with made-up example values):**
```
mongodb+srv://freshbasket_admin:Xk9mPqR2vL@freshbasket-cluster.40fofab.mongodb.net/freshbasket?retryWrites=true&w=majority&appName=freshbasket-cluster
```

> ⚠️ Common mistake: leaving the literal text `<password>` in the string instead of your real password. This will always fail with an authentication error.
>
> ⚠️ If your password contains special characters like `@`, `#`, `%`, you must URL-encode them, or simply regenerate a password using only letters and numbers (click "Autogenerate Secure Password" — it avoids problem characters automatically).

---

## Step 5: Update Your `.env` File

Open `server/.env` and replace the `MONGO_URI` line with your final string from Step 4:

```dotenv
MONGO_URI=mongodb+srv://freshbasket_admin:Xk9mPqR2vL@freshbasket-cluster.40fofab.mongodb.net/freshbasket?retryWrites=true&w=majority&appName=freshbasket-cluster
```

Save the file.

---

## Step 6: Restart and Verify

```bash
npm run dev
```

✅ **Success looks like:**
```
✅ MongoDB Connected: freshbasket-cluster-shard-00-00.40fofab.mongodb.net
📦 Database Name: freshbasket
```

❌ **If you see an error**, it will now tell you exactly what to check (this project's `config/db.js` has been updated to give clear error messages).

---

## Step 7: Re-seed the Cloud Database

Your local database and Atlas database are **completely separate** — seeding one doesn't seed the other. Run seed again now that you're connected to Atlas:

```bash
npm run seed
```

---

## Step 8: Verify Orders Are Saving

1. Place a test order in your app (Cash on Delivery is easiest)
2. Go to Atlas → **Clusters** → **Browse Collections**
3. Click **freshbasket** database → **orders** collection
4. You should see your order document there

If you don't see it, your server is still connected to local MongoDB, not Atlas — check Step 6's terminal output again.
