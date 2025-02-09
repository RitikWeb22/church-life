// src/pages/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUser, 
  FiHome, 
  FiCreditCard, 
  FiCheckCircle, 
  FiArrowLeft, 
  FiChevronRight 
} from 'react-icons/fi';

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  // Update form state for each input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate and proceed to the next step
  const nextStep = () => {
    // Basic validation for shipping info on Step 1
    if (step === 1) {
      if (!formData.name || !formData.address) {
        setError('Please fill in the required shipping fields.');
        return;
      }
    }
    // Basic validation for payment info on Step 2
    if (step === 2) {
      if (!formData.cardNumber || !formData.expiry || !formData.cvv) {
        setError('Please fill in the required payment fields.');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  // Go back a step
  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };

  // Complete order and go to confirmation step
  const completeOrder = (e) => {
    e.preventDefault();
    // Here you can add any order submission logic (e.g., API call)
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-100 flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-4xl bg-base-100 p-8 rounded-2xl shadow-xl">
        {/* Enhanced Steps Component */}
        <div className="mb-8 text-center">
          <ul className="steps steps-vertical lg:steps-horizontal">
            <li className={`step ${step >= 1 ? 'step-primary' : ''}`}>
              <div className="step-circle">
                <FiUser className="text-xl" />
              </div>
              <div className="step-title mt-2">Shipping</div>
            </li>
            <li className={`step ${step >= 2 ? 'step-primary' : ''}`}>
              <div className="step-circle">
                <FiCreditCard className="text-xl" />
              </div>
              <div className="step-title mt-2">Payment</div>
            </li>
            <li className={`step ${step >= 3 ? 'step-primary' : ''}`}>
              <div className="step-circle">
                <FiCheckCircle className="text-xl" />
              </div>
              <div className="step-title mt-2">Review</div>
            </li>
          </ul>
        </div>

        {error && (
          <div className="alert alert-error shadow-lg mb-6 animate-fade-in">
            <div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="stroke-current flex-shrink-0 h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Step 1: Shipping Details */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <FiUser className="text-primary" /> Shipping Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg">Full Name</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      className="input input-lg input-bordered w-full pl-12"
                      placeholder="John Doe"
                      onChange={handleChange}
                      value={formData.name}
                    />
                    <FiUser className="absolute left-4 top-4 text-xl text-gray-400" />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg">Address</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address"
                      className="input input-lg input-bordered w-full pl-12"
                      placeholder="123 Main St"
                      onChange={handleChange}
                      value={formData.address}
                    />
                    <FiHome className="absolute left-4 top-4 text-xl text-gray-400" />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg">City</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    className="input input-lg input-bordered w-full"
                    placeholder="New York"
                    onChange={handleChange}
                    value={formData.city}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg">Postal Code</span>
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    className="input input-lg input-bordered w-full"
                    placeholder="10001"
                    onChange={handleChange}
                    value={formData.postalCode}
                  />
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text text-lg">Country</span>
                  </label>
                  <select
                    name="country"
                    className="select select-lg select-bordered w-full"
                    onChange={handleChange}
                    value={formData.country}
                  >
                    <option value="">Select Country</option>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Payment Information */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <FiCreditCard className="text-primary" /> Payment Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text text-lg">Card Number</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cardNumber"
                      className="input input-lg input-bordered w-full pl-12"
                      placeholder="4242 4242 4242 4242"
                      onChange={handleChange}
                      value={formData.cardNumber}
                    />
                    <FiCreditCard className="absolute left-4 top-4 text-xl text-gray-400" />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg">Expiry Date</span>
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    className="input input-lg input-bordered w-full"
                    placeholder="MM/YY"
                    onChange={handleChange}
                    value={formData.expiry}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg">CVV</span>
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    className="input input-lg input-bordered w-full"
                    placeholder="123"
                    onChange={handleChange}
                    value={formData.cvv}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Order Summary */}
          {step === 3 && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <FiCheckCircle className="text-primary" /> Order Summary
              </h2>
              
              <div className="bg-base-200 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Shipping Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Address</p>
                    <p className="font-medium">{formData.address}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">City</p>
                    <p className="font-medium">{formData.city}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Postal Code</p>
                    <p className="font-medium">{formData.postalCode}</p>
                  </div>
                </div>
              </div>

              <div className="bg-base-200 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Payment Information</h3>
                <div className="flex gap-8">
                  <div>
                    <p className="text-gray-600">Card Number</p>
                    <p className="font-medium">
                      •••• •••• •••• {formData.cardNumber.slice(-4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Expiry Date</p>
                    <p className="font-medium">{formData.expiry}</p>
                  </div>
                </div>
              </div>

              <div className="bg-base-200 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Order Total</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">$99.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">$99.00</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Order Confirmation */}
          {step === 4 && (
            <div className="text-center py-12">
              <div className="mb-6 flex justify-center">
                <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="text-success text-5xl animate-checkmark" />
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-4">Order Confirmed!</h2>
              <p className="text-xl text-gray-600 mb-8">
                Thank you for your purchase. Your order is being processed.
              </p>
              <button 
                className="btn btn-primary btn-lg px-8 gap-2"
                onClick={() => navigate('/')}
              >
                <FiArrowLeft /> Continue Shopping
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex justify-between border-t pt-6">
              {step > 1 && (
                <button 
                  className="btn btn-outline btn-lg gap-2"
                  onClick={prevStep}
                >
                  <FiArrowLeft /> Back
                </button>
              )}
              <div className="flex-1"></div>
              {step < 3 ? (
                <button 
                  className="btn btn-primary btn-lg gap-2"
                  onClick={nextStep}
                >
                  Continue <FiChevronRight />
                </button>
              ) : (
                <button 
                  className="btn btn-success btn-lg gap-2"
                  onClick={completeOrder}
                >
                  Confirm Order <FiCheckCircle />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
