import React, { useEffect, useState } from "react";
import axios from "axios";
import './addProduct.css';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const AddProduct = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "",
    quantity: 0,
    price: 0,
    description: "",
  });
  const [search, setSearch] = useState(""); // search state

  const API_URL = "http://localhost:5000/api/products";

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = {
      name: formData.name,
      type: formData.type,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      description: formData.description,
    };
    try {
      if (formData.id) {
        await axios.put(`${API_URL}/${formData.id}`, submitData);
      } else {
        await axios.post(API_URL, submitData);
      }
      setFormData({ id: "", name: "", type: "", quantity: 0, price: 0, description: "" });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to submit product.");
    }
  };

  const handleEdit = (product) => {
    setFormData({
      id: product._id,
      name: product.name,
      type: product.type,
      quantity: product.quantity,
      price: product.price,
      description: product.description,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // Prepare data for PieChart
  const typeData = Array.from(
    products.reduce((map, product) => {
      map.set(product.type, (map.get(product.type) || 0) + product.quantity);
      return map;
    }, new Map()),
    ([name, value]) => ({ name, value })
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4444', '#AA33FF'];

  // Filtered products based on search
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="add-product-container">
      <h1>Tea Packet Management</h1>

      {/* Centered search input */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <form className="product-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="type" placeholder="Type" value={formData.type} onChange={handleChange} required />
        <input name="quantity" type="number" placeholder="Quantity" value={formData.quantity} onChange={handleChange} />
        <input name="price" type="number" step="0.01" placeholder="Price" value={formData.price} onChange={handleChange} />
        <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <button type="submit">{formData.id ? "Update" : "Add"}</button>
      </form>

      <h3 style={{ marginTop: "30px" }}>Stock by Tea Type</h3>
      <PieChart width={400} height={300}>
        <Pie
          data={typeData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {typeData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [`${value} packets`, `${name}`]} />
      </PieChart>

      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th><th>Type</th><th>Qty</th><th>Price</th><th>Description</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td><td>{p.type}</td><td>{p.quantity}</td><td>{p.price}</td><td>{p.description}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddProduct;
