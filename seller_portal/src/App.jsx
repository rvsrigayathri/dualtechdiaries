import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  Plus, 
  Search, 
  TrendingUp, 
  DollarSign, 
  Users, 
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample Data State
  const [products, setProducts] = useState([
    { id: '1', sku: 'SKU-NEO-01', title: 'Wireless Noise-Canceling Headphones', price: 189.99, stock: 42, category: 'Electronics', status: 'ACTIVE' },
    { id: '2', sku: 'SKU-NEO-02', title: 'Ergonomic Mechanical Keyboard (RGB)', price: 129.50, stock: 15, category: 'Accessories', status: 'ACTIVE' },
    { id: '3', sku: 'SKU-NEO-03', title: 'Ultra-wide 34" Curved Gaming Monitor', price: 499.00, stock: 4, category: 'Electronics', status: 'LOW_STOCK' },
    { id: '4', sku: 'SKU-NEO-04', title: 'Minimalist Desk LED Lamp', price: 45.00, stock: 88, category: 'Office', status: 'ACTIVE' },
  ]);

  const [orders, setOrders] = useState([
    { id: 'ORD-9821', customer: 'Alex Rivera', items: 2, total: 319.49, status: 'PROCESSING', date: '2026-08-16' },
    { id: 'ORD-9820', customer: 'Sophia Chen', items: 1, total: 499.00, status: 'PENDING', date: '2026-08-16' },
    { id: 'ORD-9819', customer: 'Marcus Vance', items: 3, total: 174.50, status: 'SHIPPED', date: '2026-08-15' },
    { id: 'ORD-9818', customer: 'Emily Watson', items: 1, total: 189.99, status: 'DELIVERED', date: '2026-08-15' },
  ]);

  const handleAddProduct = () => {
    const title = prompt('Enter Product Title:');
    if (!title) return;
    const sku = `SKU-NEO-${Math.floor(1000 + Math.random() * 9000)}`;
    const price = parseFloat(prompt('Enter Price ($):', '49.99')) || 49.99;
    const stock = parseInt(prompt('Enter Initial Stock Quantity:', '50')) || 50;

    const newProd = {
      id: Date.now().toString(),
      sku,
      title,
      price,
      stock,
      category: 'General',
      status: stock > 5 ? 'ACTIVE' : 'LOW_STOCK'
    };
    setProducts([newProd, ...products]);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0b0f19', color: '#e2e8f0' }}>
      
      {/* Sidebar Navigation */}
      <aside style={{ width: '260px', background: '#111827', borderRight: '1px solid rgba(255,255,255,0.08)', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', color: '#fff' }}>S</div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', margin: 0 }}>Seller Portal</h2>
              <span style={{ fontSize: '11px', color: '#818cf8', fontWeight: '600' }}>v1.0 • Kavinath Repo</span>
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products', label: 'Products Catalog', icon: Package },
            { id: 'orders', label: 'Orders & Sales', icon: ShoppingBag },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Store Settings', icon: Settings },
          ].map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: active ? '#818cf8' : '#94a3b8',
                  fontWeight: active ? '600' : '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Connected Repository:</p>
          <a href="https://github.com/Kavinath17/Seller-Portal" target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#818cf8', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', marginTop: '4px', fontWeight: '500' }}>
            Kavinath17/Seller-Portal <ExternalLink size={12} />
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        
        {/* Header Bar */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#f8fafc', margin: 0, textTransform: 'capitalize' }}>
              {activeTab === 'dashboard' ? 'Merchant Dashboard' : activeTab.replace('_', ' ')}
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>
              Real-time store management and fulfillment console
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search products, orders..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="glass-input"
                style={{ paddingLeft: '36px', width: '240px' }}
              />
            </div>
            <button onClick={handleAddProduct} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} />
              <span>Add Product</span>
            </button>
          </div>
        </header>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Metric Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              {[
                { title: 'Total Revenue', value: '$12,480.00', change: '+14.2%', icon: DollarSign, color: '#38bdf8' },
                { title: 'Total Orders', value: '142', change: '+8.1%', icon: ShoppingBag, color: '#818cf8' },
                { title: 'Active Products', value: products.length.toString(), change: 'Live', icon: Package, color: '#4ade80' },
                { title: 'Low Stock Alert', value: products.filter(p => p.stock < 10).length.toString(), change: 'Action Required', icon: AlertCircle, color: '#f87171' },
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div key={idx} className="glass-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>{card.title}</span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                        <Icon size={18} />
                      </div>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#f8fafc' }}>{card.value}</div>
                    <span style={{ fontSize: '12px', color: card.change.includes('+') || card.change === 'Live' ? '#4ade80' : '#f87171', fontWeight: '600', marginTop: '4px', display: 'inline-block' }}>
                      {card.change}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Recent Orders Preview */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f8fafc', margin: 0 }}>Recent Orders</h3>
                <button onClick={() => setActiveTab('orders')} className="btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }}>
                  View All Orders
                </button>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}>
                    <th style={{ padding: '12px 8px' }}>Order ID</th>
                    <th style={{ padding: '12px 8px' }}>Customer</th>
                    <th style={{ padding: '12px 8px' }}>Date</th>
                    <th style={{ padding: '12px 8px' }}>Total</th>
                    <th style={{ padding: '12px 8px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '14px 8px', fontWeight: '600', color: '#818cf8' }}>{order.id}</td>
                      <td style={{ padding: '14px 8px' }}>{order.customer}</td>
                      <td style={{ padding: '14px 8px', color: '#94a3b8' }}>{order.date}</td>
                      <td style={{ padding: '14px 8px', fontWeight: '600' }}>${order.total.toFixed(2)}</td>
                      <td style={{ padding: '14px 8px' }}>
                        <span className={`badge ${order.status === 'DELIVERED' ? 'badge-success' : order.status === 'PROCESSING' ? 'badge-warning' : 'badge-info'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#f8fafc', margin: 0 }}>Product Inventory ({products.length})</h3>
              <button onClick={handleAddProduct} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} />
                <span>Add Product</span>
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}>
                  <th style={{ padding: '12px 8px' }}>SKU</th>
                  <th style={{ padding: '12px 8px' }}>Title</th>
                  <th style={{ padding: '12px 8px' }}>Category</th>
                  <th style={{ padding: '12px 8px' }}>Price</th>
                  <th style={{ padding: '12px 8px' }}>Stock</th>
                  <th style={{ padding: '12px 8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '14px 8px', fontFamily: 'monospace', color: '#818cf8' }}>{product.sku}</td>
                    <td style={{ padding: '14px 8px', fontWeight: '500' }}>{product.title}</td>
                    <td style={{ padding: '14px 8px', color: '#94a3b8' }}>{product.category}</td>
                    <td style={{ padding: '14px 8px', fontWeight: '600' }}>${product.price.toFixed(2)}</td>
                    <td style={{ padding: '14px 8px' }}>{product.stock} units</td>
                    <td style={{ padding: '14px 8px' }}>
                      <span className={`badge ${product.stock > 10 ? 'badge-success' : 'badge-warning'}`}>
                        {product.stock > 10 ? 'In Stock' : 'Low Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#f8fafc', marginBottom: '20px' }}>Order Processing Queue</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}>
                  <th style={{ padding: '12px 8px' }}>Order ID</th>
                  <th style={{ padding: '12px 8px' }}>Customer</th>
                  <th style={{ padding: '12px 8px' }}>Items</th>
                  <th style={{ padding: '12px 8px' }}>Total Amount</th>
                  <th style={{ padding: '12px 8px' }}>Status</th>
                  <th style={{ padding: '12px 8px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '14px 8px', fontWeight: '600', color: '#818cf8' }}>{order.id}</td>
                    <td style={{ padding: '14px 8px' }}>{order.customer}</td>
                    <td style={{ padding: '14px 8px' }}>{order.items} items</td>
                    <td style={{ padding: '14px 8px', fontWeight: '600' }}>${order.total.toFixed(2)}</td>
                    <td style={{ padding: '14px 8px' }}>
                      <span className={`badge ${order.status === 'DELIVERED' ? 'badge-success' : order.status === 'PROCESSING' ? 'badge-warning' : 'badge-info'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 8px' }}>
                      {order.status === 'PENDING' && (
                        <button onClick={() => handleUpdateOrderStatus(order.id, 'PROCESSING')} className="btn-secondary" style={{ fontSize: '12px', padding: '4px 10px' }}>
                          Process Order
                        </button>
                      )}
                      {order.status === 'PROCESSING' && (
                        <button onClick={() => handleUpdateOrderStatus(order.id, 'SHIPPED')} className="btn-primary" style={{ fontSize: '12px', padding: '4px 10px' }}>
                          Mark Shipped
                        </button>
                      )}
                      {order.status === 'SHIPPED' && (
                        <button onClick={() => handleUpdateOrderStatus(order.id, 'DELIVERED')} className="btn-secondary" style={{ fontSize: '12px', padding: '4px 10px' }}>
                          Mark Delivered
                        </button>
                      )}
                      {order.status === 'DELIVERED' && (
                        <span style={{ fontSize: '12px', color: '#4ade80' }}>✓ Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </main>
    </div>
  );
}
