import React, { useState } from 'react';
import { register } from '../apis/AuthApi';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import pic3 from './assets/images/login/pic3.jpg';

const Register: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<{
        username: string;
        email: string;
        password: string;
    }>({
        username: '',
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await register(formData);

            if (response.error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: response.error,
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful!',
                    text: 'You will be redirected to the login page.',
                    timer: 1500, 
                    showConfirmButton: false,
                });

                setFormData({ username: '', email: '', password: '' });

                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            console.error('Registration failed:', error);
            Swal.fire({
                icon: 'error',
                title: 'An Error Occurred',
                text: 'Please try again later.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content-body">
            <div className="container vh-100">
                <div className="welcome-area">
                    <div className="bg-image bg-image-overlay" style={{ backgroundImage: `url(${pic3})` }}></div>
                    <div className="join-area">
                        <div className="started">
                            <h1 className="title">Instalite - Register</h1>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3 input-group input-group-icon">
                                <span className="input-group-text">
                                    <div className="input-icon">
                                        <i className="far fa-envelope"></i>
                                    </div>
                                </span>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3 input-group input-group-icon">
                                <span className="input-group-text">
                                    <div className="input-icon">
                                        <i className="far fa-user"></i>
                                    </div>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3 input-group input-group-icon">
                                <span className="input-group-text">
                                    <div className="input-icon">
                                        <i className="fas fa-lock"></i>
                                    </div>
                                </span>
                                <input
                                    type="password"
                                    className="form-control dz-password"
                                    placeholder="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-block mb-3 btn-rounded" disabled={loading}>
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                        </form>
                        <div className="d-flex align-items-center justify-content-center">
                            <a href="/login" className="text-light text-center d-block">Already have an account?</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
