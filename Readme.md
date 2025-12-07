# Shoe App Frontend

A modern **React + Vite** e-commerce interface for managing and purchasing shoes.  
Built with **Tailwind CSS** and connected to a **FastAPI backend**, it provides a complete shopping experience with admin controls, cart management, and real-time order creation.

---

## Features

### User Features

- **Product Catalog** with category filtering.
- **Mock Authentication** (auto-login as admin for testing).
- **Shopping Cart** with add/remove actions.
- **Transactional Checkout** using a single backend request.
- **Order History** page for reviewing past purchases.

### Admin Features (MockAdmin only)

- **Product Management (CRUD)** – create, edit, delete shoes.
- **Category Management (CRUD)** – organize catalog.
- **View All Orders** – full system order history.

> Admin access is controlled through the `is_admin` flag (frontend + backend enforcement).

---

## Tech Stack

| Tool                                      | Purpose                                  |
| ----------------------------------------- | ---------------------------------------- |
| **React (Hooks + Functional Components)** | UI Framework                             |
| **Vite**                                  | Lightning-fast dev server & build tool   |
| **Tailwind CSS**                          | Responsive utility-based styling         |
| **Lucide React**                          | Icon system                              |
| **Custom API Utilities**                  | Backend request helpers                  |
| **Backend Required:** FastAPI             | Product, Category, Cart & Order REST API |

---

## Prerequisites

Before running the frontend, ensure:

- **FastAPI Backend is running** at:  
  `http://127.0.0.1:8000`
- **Node.js v20+**
- **npm**

---

## 🛠️ Installation & Setup

From the `frontend/` directory:

```sh
npm install
```
