# GigFlow - Freelance Marketplace Platform

GigFlow is a full-stack platform designed to connect freelancers with clients, featuring interactive profile management and a seamless hiring flow.

## 🚀 Key Features

1.  **Dynamic Profile Management:** - Freelancers can update their personal details, bio, and skills in real-time.
    - Interactive UI with optimistic updates for a smooth user experience.
    
2.  **Direct Hiring Flow:**
    - Clients can view profiles and initiate a hiring contract directly via the "Hire Me" modal.
    - Form validation ensures project scope and budget are captured.

## 🛠️ Technology Stack

* **Frontend:** React.js, Tailwind CSS, Lucide Icons
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose

## ⚙️ Setup Instructions

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    ```

2.  **Environment Variables**
    - Rename `.env.example` to `.env`
    - Update `MONGO_URI` with your MongoDB connection string.

3.  **Install Dependencies**
    ```bash
    # Root directory (if applicable) or split:
    cd client && npm install
    cd ../server && npm install
    ```

4.  **Run the Application**
    - **Server:** `cd server && npm start`
    - **Client:** `cd client && npm run dev`