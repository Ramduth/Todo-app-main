import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Loginpage.css';
import axios from 'axios';

const Loginpage = () => {
 const [formData, setFormData] = useState({
email: '',
password: ''  });
    const [errors, setErrors] = useState({});
 const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

const handleChange = (e) => {
        const { name, value } = e.target;
 setFormData(prevState => ({
    ...prevState,
 [name]: value }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    };

 const validateForm = () => {
    let formIsValid = true;
        let errorMessages = {};

 if (!formData.password) {
  formIsValid = false;
 errorMessages.password = "Password is required"; 
   } else if (formData.password.length < 6) {
 formIsValid = false;
    errorMessages.password = "Password must be at least 6 characters long";
       }
   setErrors(errorMessages);
return formIsValid; };

const handleSubmit = async (e) => {
e.preventDefault();
if (!validateForm()) return;
        setIsLoading(true);
 try {
const result = await axios.post("http://localhost:4000/login", formData);
 if (result.data.status === 200) {
   localStorage.setItem('username', formData.email);
 navigate("/todo");
       } else {
  setErrors({ form: "User Not Found" });
   }
      } catch (err) {
 console.error(err);
  if (err.response && err.response.status === 404) {
 setErrors({ form: "Email not found" });
  } else {
setErrors({ form: "Invalid email or password" }); 
   }
     } finally {
 setIsLoading(false); 
    }
    };

return (
  <div className="todo-login-container">
<form className="todo-login-form" onSubmit={handleSubmit}>
       <div className="todo-login-header">
<h1 className="todo-app-title">Welcome</h1>
 <p className="todo-login-subtitle">Please login to continue.</p> 
</div>

  {errors.form && <div className="todo-error-message">{errors.form}</div>}

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
{errors.email && <div className="todo-error-message">{errors.email}</div>} 
</div>

<div className="todo-input-group">
<label htmlFor="password" className="todo-input-label">Password</label>
<input
id="password"
type="password"
name="password"
className="todo-input-field"
placeholder="Enter your password"
value={formData.password}
 onChange={handleChange}
 disabled={isLoading} />
 {errors.password && <div className="todo-error-message">{errors.password}</div>} 
</div>

<button 
 type="submit" 
className="todo-login-button"
disabled={isLoading}>
 {isLoading ? 'Logging in...' : 'Login'} 
</button>

<div className="todo-auth-links">
 <Link to="/Reg">Not registered? Click here to register</Link>
 </div> 
</form> 
</div>
 );
};
export default Loginpage;
