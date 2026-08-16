# Seller Portal — Full Guide

> One quick note before we start: This guide outlines a production-ready **Seller Portal** architecture built with a **Java (Spring Boot 3 / Java 21)** backend and a **React (Vite + Tailwind CSS)** frontend, backed by **PostgreSQL** and **Redis**. If you prefer a Node.js / Express or Next.js full-stack setup instead, let me know and I can tailor the implementation details accordingly.

---

## 1. Project Plan (MVP Scope)

**Flow:** `Seller Register / Login → Store Setup → Product & Inventory Management → Order Processing & Fulfillment → Revenue & Payout Analytics`

**In scope for v1:**
- Seller authentication & profile/store configuration (store name, branding, payout details)
- Product management (CRUD for items, categories, pricing, SKU, variant attributes, stock quantities)
- Multi-image drag-and-drop upload for product listings
- Order lifecycle management (New / Pending, Processing, Shipped, Delivered, Canceled)
- Real-time stock decrement and low-inventory alerting
- Basic revenue, total order count, and top-selling product dashboard analytics
- PDF invoice generation for customer orders

**Explicitly out of scope for v1** (add in v2):
- Multi-warehouse inventory routing & geo-fulfillment
- Automated multi-currency tax computation
- Live automated carrier tracking APIs (FedEx/UPS/DHL webhooks)
- Complex multi-tiered seller commission calculation & dispute resolution engine

---

## 2. Architecture

```
┌─────────────┐     REST / JSON APIs     ┌──────────────────────┐
│   React     │ ───────────────────────▶ │   Spring Boot API    │
│  Seller UI  │                          │    (Java 21)         │
│ (Vite/Tailwind) ◀───────────────────── │                      │
└─────────────┘                          └──────────┬───────────┘
                                                    │
                ┌───────────────────────────────────┼───────────────────────────────────┐
                ▼                                   ▼                                   ▼
        ┌───────────────┐                   ┌────────────────┐                  ┌────────────────┐
        │  Redis Cache  │                   │ PostgreSQL DB  │                  │ Cloudflare R2  │
        │(Session/Stock)│                   │(Sellers/Orders)│                  │(Product Media) │
        └───────────────┘                   └────────────────┘                  └────────────────┘
                                                    │
                                                    ▼
                                            ┌────────────────┐
                                            │ Invoice Engine │
                                            │(OpenHTMLtoPDF) │
                                            └────────────────┘
```

**Why these pieces:**
- **Spring Boot 3 (Java 21)** — Robust, type-safe backend framework with built-in transaction management, security, and scalability.
- **PostgreSQL** — Essential for transactional consistency across orders, payments, line items, and stock balances.
- **Redis** — Fast in-memory cache for seller session validation, rate limiting, and real-time inventory locking to prevent race conditions during high-volume checkout.
- **Cloudflare R2** — S3-compatible zero-egress fee object storage for high-resolution product images and invoice PDFs.
- **OpenHTMLtoPDF** — Enables consistent HTML/CSS layout templates for generating downloadable order invoice PDFs.

---

## 3. Free-Cost Hosting Plan

| Layer | Service | Free Tier Notes |
|---|---|---|
| Frontend | Vercel or Netlify | Free hosting for single-page applications, custom domains, auto-deploy on git push |
| Backend API | Render or Railway | Free tier supports background web services; handles low-traffic seller demos |
| Database | Neon or Supabase (PostgreSQL) | Free 500MB - 1GB PostgreSQL database with connection pooling |
| In-Memory Cache | Upstash Redis | Free tier with 10k requests/day, ideal for serverless or containerized setups |
| Product Media Storage | Cloudflare R2 | 10 GB free storage per month with $0 egress bandwidth costs |
| Domain | Custom or Subdomain | Free `.vercel.app` / `.onrender.com` URLs during development & staging |

**Expectation Setting:** Free-tier application containers spin down after inactivity (cold start delay ~30 seconds). This is perfect for build, staging, and demo phases; upgrade to a paid compute tier ($5–$7/mo) when launching live seller onboarding.

---

## 4. Backend Structure (Spring Boot)

```
backend/
├── pom.xml
├── src/main/java/com/sellerportal/
│   ├── SellerPortalApplication.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── ProductController.java
│   │   ├── OrderController.java
│   │   └── AnalyticsController.java
│   ├── service/
│   │   ├── ProductService.java
│   │   ├── OrderService.java
│   │   ├── InventoryService.java
│   │   ├── StorageService.java
│   │   └── InvoiceGeneratorService.java
│   ├── model/
│   │   ├── Seller.java
│   │   ├── Store.java
│   │   ├── Product.java
│   │   ├── Order.java
│   │   ├── OrderItem.java
│   │   └── OrderStatus.java
│   ├── repository/
│   │   ├── SellerRepository.java
│   │   ├── ProductRepository.java
│   │   ├── OrderRepository.java
│   │   └── OrderItemRepository.java
│   └── dto/
│       ├── ProductDTO.java
│       ├── OrderResponseDTO.java
│       └── DashboardMetricsDTO.java
└── src/main/resources/
    ├── application.yml
    └── templates/
        └── order-invoice-template.html
```

### Key Model — `Product.java`
```java
package com.sellerportal.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID sellerId;

    @Column(nullable = false)
    private String title;

    @Column(unique = true, nullable = false)
    private String sku;

    @Column(length = 3000)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stockQuantity;

    private String category;

    @ElementCollection
    private List<String> imageUrls = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private ProductStatus status = ProductStatus.ACTIVE;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Getters and Setters
}
```

### Inventory & Stock Management — `ProductService.java`
```java
package com.sellerportal.service;

import com.sellerportal.model.Product;
import com.sellerportal.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional
    public Product updateStock(UUID productId, UUID sellerId, int quantityDelta) {
        Product product = productRepository.findByIdAndSellerId(productId, sellerId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found or access denied"));

        int newStock = product.getStockQuantity() + quantityDelta;
        if (newStock < 0) {
            throw new IllegalStateException("Insufficient stock available");
        }

        product.setStockQuantity(newStock);
        return productRepository.save(product);
    }
}
```

### Order Fulfillment Endpoint — `OrderController.java`
```java
package com.sellerportal.controller;

import com.sellerportal.model.Order;
import com.sellerportal.model.OrderStatus;
import com.sellerportal.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/seller/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<Order>> getSellerOrders(@RequestAttribute("sellerId") UUID sellerId) {
        return ResponseEntity.ok(orderService.getOrdersForSeller(sellerId));
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @RequestAttribute("sellerId") UUID sellerId,
            @PathVariable UUID orderId,
            @RequestParam OrderStatus status) {
        Order updatedOrder = orderService.updateStatus(orderId, sellerId, status);
        return ResponseEntity.ok(updatedOrder);
    }
}
```

**Technical Edge-Case Note:** When multiple orders attempt to purchase the last unit of stock simultaneously, use database-level pessimistic locking (`SELECT ... FOR UPDATE`) or Redis distributed locking on product SKUs to guarantee zero negative stock balance oversells.

---

## 5. Frontend Structure (React + Vite)

```
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── MetricCard.jsx
│   │   ├── ProductForm.jsx
│   │   ├── OrderTable.jsx
│   │   └── ImageUploader.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── ProductCatalog.jsx
│   │   ├── AddEditProduct.jsx
│   │   ├── OrderList.jsx
│   │   └── Settings.jsx
│   ├── services/
│   │   └── api.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── App.jsx
│   └── main.jsx
```

### Add/Edit Product Component — `ProductForm.jsx`
```jsx
import { useState } from "react";

export default function ProductForm({ initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    sku: initialData.sku || "",
    price: initialData.price || "",
    stockQuantity: initialData.stockQuantity || 0,
    category: initialData.category || "General",
    description: initialData.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-gray-800">
        {initialData.id ? "Edit Product" : "Add New Product"}
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">SKU Code</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Price ($)</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
          <input
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
      >
        Save Product Listing
      </button>
    </form>
  );
}
```

---

## 6. Database Schema (PostgreSQL DDL)

```sql
-- Sellers Table
CREATE TABLE sellers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stores Table
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    store_name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Product Images Junction Table
CREATE TABLE product_images (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL
);

-- Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES sellers(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_orders_seller_status ON orders(seller_id, status);
```

---

## 7. Build Order (Step-by-Step Execution Plan)

1. **Spring Boot Skeleton & DB Setup:** Initialize Spring Boot application with JPA, Security, PostgreSQL driver, and execute DDL migrations.
2. **Seller Auth & Profile API:** Implement JWT auth (`/api/v1/auth/register`, `/api/v1/auth/login`) and store profile CRUD.
3. **Product Catalog APIs:** Build product CRUD controllers, category tagging, and stock updates. Test with Postman/Swagger.
4. **Cloudflare R2 Media Integration:** Implement image upload service supporting multi-file direct S3 presigned URL uploads.
5. **React Dashboard Shell:** Set up Vite + React + Tailwind CSS with routing for Dashboard, Catalog, Orders, and Settings.
6. **Product Catalog UI:** Build inventory management grid with inline stock controls and search/filter by category/SKU.
7. **Order Management & State Machine:** Build order list with real-time status updates (Pending → Processing → Shipped → Delivered).
8. **PDF Invoice Generator:** Add OpenHTMLtoPDF template rendering for generating customer order receipt PDFs.
9. **Analytics Dashboard:** Build revenue, order volume, and low-stock indicator widgets using Chart.js or Recharts.
10. **Deployment:** Deploy PostgreSQL database to Neon/Supabase, API to Render/Railway, and Frontend to Vercel.

---

## 8. Sample AI Prompt (For Accelerated Development)

```text
I am building a Seller Portal application using Spring Boot 3 (Java 21) and PostgreSQL.
I need to write an OrderFulfillmentService method `processOrderFulfillment(UUID orderId, UUID sellerId, String trackingNumber)` that:

1. Validates that the order belongs to the seller.
2. Checks that the current order status is 'PROCESSING'.
3. Updates the order status to 'SHIPPED' and saves the shipping tracking number.
4. Triggers an asynchronous email notification to the customer with their tracking link.
5. Handles concurrency safely and throws clear custom exceptions if any validation fails.

Please provide the annotated Java service method, custom exception classes, and unit tests using JUnit 5 & Mockito.
```
