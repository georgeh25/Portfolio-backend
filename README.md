# Portfolio Backend

This is the backend for a developer portfolio, built with **Node.js**, **Express**, **MongoDB**, and **Multer** for file uploads. It handles **projects**, **technologies**, **experiences**, **social networks**, and **about me** sections.

## Features

- **Authentication**: JWT-based authentication for secure user sessions.
- **File Uploads**: Supports image uploads for profile pictures.
- **About Me**: Update and manage personal information like profile picture and "about me" text.
- **CRUD Operations**: Full CRUD functionality for projects, technologies, and experiences.
- **Role-based Access**: Admin users can manage content while general users have limited access.

## Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
MONGODB_URI=your-mongodb-uri
JWT_SECRET_KEY=your-jwt-secret-key
PORT=5000
```

## Running Locally (Development)

To start the application in development mode:

1. Install **Nodemon** (optional, for live reloading):

   ```bash
   npm install -g nodemon
   ```

2. Run the server:

   ```bash
   npm run dev
   ```

The application will be accessible at `http://localhost:5000`

## Deploying to Production

### Deployment on Azure (or any cloud provider)

1. **Clone the repository** to your cloud server or VPS:

   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables** for production in your `.env` file:

   ```env
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET_KEY=your-production-jwt-secret-key
   PORT=80
   ```

4. **Install PM2** for process management in production:

   ```bash
   npm install pm2 -g
   ```

5. **Start the application** using PM2:

   ```bash
   pm2 start server.js --name portfolio-backend
   ```

6. **Configure Nginx** (if applicable) for reverse proxy and serving static assets (like profile pictures).

7. Optionally, **enable auto-restart** on server reboot:

   ```bash
   pm2 save
   pm2 startup
   ```

### Deployment on Azure App Service

1. **Log in to Azure** via the CLI:

   ```bash
   az login
   ```

2. **Create a resource group**:

   ```bash
   az group create --name myResourceGroup --location eastus
   ```

3. **Create an App Service plan**:

   ```bash
   az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku F1
   ```

4. **Create an App Service**:

   ```bash
   az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name your-unique-app-name --runtime "NODE|16-lts"
   ```

5. **Push your code** to Azure:

   ```bash
   git push azure master
   ```

6. **Set environment variables**:

   ```bash
   az webapp config appsettings set --resource-group myResourceGroup --name your-unique-app-name --settings MONGODB_URI=your-mongodb-uri JWT_SECRET_KEY=your-jwt-secret-key
   ```

7. **Monitor logs** to ensure the deployment is successful:

   ```bash
   az webapp log tail --name your-unique-app-name --resource-group myResourceGroup
   ```

### MongoDB Setup (Optional)

For database, I recommend using **MongoDB Atlas**:

1. Create a **MongoDB Atlas** account and cluster.
2. Get the **MongoDB URI** and add it to your `.env` file.
3. Ensure that your production server IP is whitelisted on MongoDB Atlas.
