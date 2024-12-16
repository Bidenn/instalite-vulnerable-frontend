import React, { useState } from 'react';
import { register } from '../../../apis/AuthApi';
import { useNavigate } from 'react-router-dom';
import pic3 from '../../assets/images/login/pic3.jpg';
import Swal from 'sweetalert2';

const Register: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<{
        email: string;
        password: string;
    }>({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<{ email: string; password: string }>({
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState<boolean>(false);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string): boolean => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === 'email') {
            setErrors((prev) => ({
                ...prev,
                email: validateEmail(value) ? '' : 'Invalid email format.',
            }));
        }

        if (name === 'password') {
            setErrors((prev) => ({
                ...prev,
                password: validatePassword(value)
                    ? ''
                    : 'Password must include uppercase, lowercase, number, special character, and be at least 8 characters.',
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(formData.email)) {
            setErrors((prev) => ({ ...prev, email: 'Invalid email format.' }));
            return;
        }
        if (!validatePassword(formData.password)) {
            setErrors((prev) => ({
                ...prev,
                password: 'Password must meet the requirements.',
            }));
            return;
        }

        Swal.fire({
            title: 'Registering...',
            text: 'Please wait while we create your account.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            const response = await register(formData);

            if (response.error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: response.error ?? 'Please try again later.',
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful!',
                    text: response.message ?? 'A verification email has been sent to your email address.',
                    timer: 3000,
                });

                setFormData({ email: '', password: '' });

                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            }
        } catch (error) {
            console.error('Registration failed:', error);

            Swal.fire({
                icon: 'error',
                title: 'An Error Occurred',
                text: 'Please try again later.',
            });
        }
    };

    return (
        <div className="content-body">
            <div className="container vh-100">
                <div className="welcome-area">
                    <div
                        className="bg-image bg-image-overlay"
                        style={{ backgroundImage: `url(${pic3})` }}
                    ></div>
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
                                    required
                                />
                            </div>
                            {errors.email && (
                                <small className="text-danger">{errors.email}</small>
                            )}
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
                                    required
                                />
                            </div>
                            {errors.password && (
                                <small className="text-danger">{errors.password}</small>
                            )}
                            <button
                                type="submit"
                                className="btn btn-primary btn-block mb-3 btn-rounded"
                                disabled={loading}
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                        </form>
                        <div className="d-flex align-items-center justify-content-center">
                            <a href="/login" className="text-light text-center d-block">
                                Already have an account?
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
