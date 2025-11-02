/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "./CheckoutForm"
import { useSelector, useDispatch } from "react-redux";
import UseCartInfo from "../../../../hooks/UseCartInfo";
import { clear_cart } from "../../../../redux/features/cartSlice";
import authApiService from "../../../../api/auth";
import bookingsApiService from "../../../../api/bookings";
import { toast } from "react-toastify";

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  companyName: string;
  country: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  orderNote: string;
}

const CheckoutArea = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    orderNote: "",
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const productItem = useSelector((state: any) => state.cart?.cart || []);
  const { total } = UseCartInfo();
  const [shipCost] = useState<number>(5);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentUser = authApiService.getCurrentUser();
    const token = localStorage.getItem('authToken');
    
    if (!currentUser) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }
    
    if (!token) {
      toast.error("Authentication token is missing. Please login again.");
      authApiService.logout();
      navigate("/login");
      return;
    }
    
    console.log('Current user:', currentUser);
    console.log('Auth token exists:', !!token);

    if (productItem.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error("Please fill in required fields (First Name, Last Name, Email, Phone)");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create bookings for each cart item
      const bookingPromises = productItem.map(async (item: any) => {
        // Extract booking data from cart item
        const tourId = item.tourId;
        const packageId = item.packageId;
        
        // Ensure tourDate is in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
        let tourDate = item.tourDate;
        if (tourDate) {
          // If it's just a date string (YYYY-MM-DD), convert to full ISO string
          if (tourDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            tourDate = new Date(tourDate + 'T00:00:00').toISOString();
          } else if (!tourDate.includes('T')) {
            // If it doesn't have time component, add it
            tourDate = new Date(tourDate).toISOString();
          }
        } else {
          // Default to today at noon
          tourDate = new Date().toISOString();
        }
        
        const participants = item.participants || {};
        const adultCount = participants.adults || participants.adult || item.quantity || 1;
        const childCount = participants.children || participants.child || 0;
        const infantCount = participants.infants || participants.infant || 0;

        if (!tourId || !packageId) {
          throw new Error("Missing tour or package information in cart item");
        }

        const bookingData = {
          userId: currentUser.id,
          tourId,
          packageId,
          adultCount: Number(adultCount),
          childCount: Number(childCount),
          infantCount: Number(infantCount),
          tourDate: tourDate, // ISO 8601 format
          specialRequests: formData.orderNote || undefined,
          contactPhone: formData.phone || undefined,
          contactEmail: formData.email || undefined,
        };

        console.log('Creating booking with data:', bookingData);
        return bookingsApiService.createBooking(bookingData);
      });

      const bookings = await Promise.all(bookingPromises);
      
      // Clear cart after successful booking
      dispatch(clear_cart());
      
      toast.success(`Successfully created ${bookings.length} booking(s)!`);
      
      // Redirect to user profile bookings tab
      setTimeout(() => {
        navigate("/user-profile?tab=bookings");
      }, 1500);
    } catch (error: any) {
      console.error("Error placing order:", error);
      
      // If 401, user will be redirected automatically by API service
      if (error?.status === 401) {
        toast.error("Your session has expired. Please login again.");
      } else {
        const errorMessage = error?.message || "Failed to place order. Please try again.";
        toast.error(errorMessage);
      }
      console.error("Full error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isHydrated) return null;

  return (
    <section className="checkout-area pb-100 pt-125">
      <div className="container">
        <form onSubmit={handlePlaceOrder}>
          <div className="row">
            <CheckoutForm formData={formData} setFormData={setFormData} />
            <div className="col-xl-3 col-lg-4">
              <div className="tg-blog-sidebar top-sticky mb-30">
                <div className="tg-blog-sidebar-box mb-30">
                  <h2 className="tg-checkout-form-title tg-checkout-form-title-3 mb-15">Your Order</h2>
                  <div className="tg-checkout-order-table table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="product-name">Product</th>
                          <th className="product-total">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* <!-- item list --> */}
                        {productItem.length > 0 ? productItem.map((add_item: any, add_index: any) =>
                          <tr key={add_index} className="cart_item first">
                            <td className="product-name">
                              {add_item.title}<span> ${(add_item.price || 0).toFixed(2)} x {add_item.quantity || 0}</span>
                            </td>
                            <td className="product-total">
                              <span className="amount">${((add_item.quantity || 0) * (add_item.price || 0)).toFixed(2)}</span>
                            </td>
                          </tr>
                        ) : (
                          <tr>
                            <td colSpan={2} className="text-center">Your cart is empty</td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr className="cart-subtotal">
                          <th>Subtotal</th>
                          <td><span className="amount">${total.toFixed(2)}</span></td>
                        </tr>
                        <tr className="cart-subtotal">
                          <th>Shipping</th>
                          <td><span className="amount">${shipCost.toFixed(2)}</span></td>
                        </tr>
                        <tr className="cart-subtotal">
                          <th>Total</th>
                          <td><span className="amount">${(total + shipCost).toFixed(2)}</span></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                <div className="tg-blog-sidebar-box mb-25">
                  <h2 className="tg-checkout-form-title tg-checkout-form-title-3 mb-15">Payment</h2>
                  <div className="tg-checkout-payment mb-5">
                    <input type="radio" name="payment" id="payment" defaultChecked />
                    <label htmlFor="payment">Direct bank transfer</label>
                  </div>
                  <p className="tg-checkout-para mb-5">Make your payment directly into
                    our bank account. Please use your
                    Order ID as the payment reference.
                    Your order will not be shipped until
                    the funds have cleared in our
                    account.
                  </p>
                  <div className="tg-checkout-payment">
                    <input type="radio" name="payment" id="payment2" />
                    <label htmlFor="payment2">Cas on Delivery</label>
                  </div>
                </div>
                <div className="tg-checkout-form-btn">
                  <button
                    type="submit"
                    className="tg-btn w-100"
                    disabled={isSubmitting || productItem.length === 0}
                  >
                    {isSubmitting ? "Processing..." : "Place Your Order"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

export default CheckoutArea
