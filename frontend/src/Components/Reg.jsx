import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Reg.css';
import axios from 'axios';

const Reg = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (error) setError(''); 
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.phone || !formData.password) {
            setError('Please fill in all fields');
            return false;
        }
        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone.replace(/[-()\s]/g, ''))) {
            setError('Please enter a valid 10-digit phone number');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await axios.post("http://localhost:4000/userreg", formData);
            
            navigate('/');
        } catch (err) {
            if (err.response && err.response.status === 400) {
                
                setError(err.response.data.message || 'Email is already registered');
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="todo-register-container">
            <form className="todo-register-form" onSubmit={handleSubmit}>
                <div className="todo-register-header">
                    <h1 className="todo-register-title">Create Account</h1>
                    <p className="todo-register-subtitle">Get started with your new account</p>
                </div>

                {error && <div className="todo-error-message">{error}</div>}

                <div className="todo-input-group">
                    <label htmlFor="name" className="todo-input-label">Full Name</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        className="todo-input-field"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                </div>

                <div className="todo-input-group">
                    <label htmlFor="email" className="todo-input-label">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        className="todo-input-field"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                </div>

                <div className="todo-input-group">
                    <label htmlFor="phone" className="todo-input-label">Phone Number</label>
                    <input
                        id="phone"
                        type="tel"
                        name="phone"
                        className="todo-input-field"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                </div>

                <div className="todo-input-group">
                    <label htmlFor="password" className="todo-input-label">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        className="todo-input-field"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                </div>

                <button 
                    type="submit" 
                    className="todo-register-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>

                <div className="todo-auth-links">
                    <a href="/" className="todo-auth-link">
                        Already have an account? Login here
                    </a>
                </div>
            </form>
        </div>
    );
};

export default Reg;
