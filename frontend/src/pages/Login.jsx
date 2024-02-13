import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSignInAlt } from 'react-icons/fa';
import CustomSpinner from '../components/CustomSpinner';
import { useAuth } from '../auth/AuthContext'; // Import the useAuth hook

function Login() {
  const { login } = useAuth(); // Access the login function from the useAuth hook
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    // console.log(e);
    setFormData((prevState) => ({
      
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("id", data._id);
        localStorage.setItem("token", data.token);
        toast.success('Login successful');
        login();
        navigate('/');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CustomSpinner />;
  }

  return (
    <div className="register-container">
      <section className="heading">
        <h1>
          <FaSignInAlt /> Login
        </h1>
        <p>Login to Continue</p>
      </section>

      <section className="form-container">
        <div className="image-container">
          <img
            src="https://images.unsplash.com/photo-1576153645383-e03c25dafed5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="key"
            className="rounded-2xl"
          />
        </div>

        <form className="form" onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              placeholder="Your Email"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              placeholder="Your Password"
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <button type="submit" className="btn">
              Register
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Login;
