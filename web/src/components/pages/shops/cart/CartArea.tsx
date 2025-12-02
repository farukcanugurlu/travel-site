/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import UseCartInfo from "../../../../hooks/UseCartInfo";
import { addToCart, decrease_quantity, remove_cart_product } from "../../../../redux/features/cartSlice";

const CartArea = () => {
   
   const [mounted, setMounted] = useState(false);
   const productItem = useSelector((state: any) => state.cart?.cart || []);
   const dispatch = useDispatch();
   const { total } = UseCartInfo();

   useEffect(() => {
      setMounted(true);
   }, []);

   if (!mounted) return null;

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
   };

   return (
      <div className="cart-area pb-100 pt-105">
         <div className="container">
            <div className="row">
               <div className="col-12">
                  {productItem.length === 0 ? (
                     <div className="mb-30">
                        <div className="empty_bag text-center">
                           <p className="py-3">Your Bag is Empty</p>
                           <Link to={"/tours"} className="tg-btn">
                              Go To Shop
                           </Link>
                        </div>
                     </div>
                  ) : (
                     <form onClick={(e) => e.preventDefault()}>
                        <style>{`
                          /* Mobil için cart kart görünümü */
                          @media (max-width: 991px) {
                            /* Mobil taşma düzeltmeleri */
                            .cart-area {
                              overflow-x: hidden !important;
                            }
                            
                            .cart-area .container {
                              max-width: 100% !important;
                              padding-left: 15px !important;
                              padding-right: 15px !important;
                            }
                            
                            .cart-area .row {
                              margin-left: -15px !important;
                              margin-right: -15px !important;
                            }
                            
                            .cart-area .row > * {
                              padding-left: 15px !important;
                              padding-right: 15px !important;
                            }
                            
                            /* Desktop table'ı mobilde gizle */
                            .tg-cart-table-content {
                              display: none !important;
                            }
                            
                            /* Mobil cart kartları */
                            .mobile-cart-items {
                              display: block !important;
                              width: 100% !important;
                              max-width: 100% !important;
                              margin: 0 !important;
                              padding: 0 !important;
                            }
                            
                            .mobile-cart-item {
                              background: #fff;
                              border: 1px solid #e0e0e0;
                              border-radius: 12px;
                              padding: 16px;
                              margin-bottom: 16px;
                              box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                              width: 100% !important;
                              max-width: 100% !important;
                              box-sizing: border-box !important;
                            }
                            
                            .mobile-cart-item-header {
                              display: flex;
                              align-items: flex-start;
                              gap: 12px;
                              margin-bottom: 16px;
                              padding-bottom: 16px;
                              border-bottom: 1px solid #f0f0f0;
                              width: 100% !important;
                              box-sizing: border-box !important;
                            }
                            
                            .mobile-cart-item-thumb {
                              width: 80px;
                              height: 80px;
                              border-radius: 8px;
                              overflow: hidden;
                              flex-shrink: 0;
                            }
                            
                            .mobile-cart-item-thumb img {
                              width: 100%;
                              height: 100%;
                              object-fit: cover;
                            }
                            
                            .mobile-cart-item-info {
                              flex: 1;
                              min-width: 0;
                              overflow: hidden;
                            }
                            
                            .mobile-cart-item-title {
                              font-size: 15px;
                              font-weight: 600;
                              color: #2c3e50;
                              margin: 0 0 8px 0;
                              line-height: 1.4;
                              display: -webkit-box;
                              -webkit-line-clamp: 2;
                              -webkit-box-orient: vertical;
                              overflow: hidden;
                              word-wrap: break-word;
                            }
                            
                            .mobile-cart-item-title a {
                              color: #2c3e50;
                              text-decoration: none;
                            }
                            
                            .mobile-cart-item-title a:hover {
                              color: #560CE3;
                            }
                            
                            .mobile-cart-item-price {
                              font-size: 16px;
                              font-weight: 700;
                              color: #560CE3;
                              margin: 0;
                            }
                            
                            .mobile-cart-item-remove {
                              width: 32px;
                              height: 32px;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              border-radius: 50%;
                              background: #f5f5f5;
                              color: #666;
                              cursor: pointer;
                              transition: all 0.2s ease;
                              flex-shrink: 0;
                            }
                            
                            .mobile-cart-item-remove:hover {
                              background: #fee;
                              color: #e74c3c;
                            }
                            
                            .mobile-cart-item-body {
                              display: flex;
                              align-items: center;
                              justify-content: space-between;
                              gap: 16px;
                              flex-wrap: wrap;
                              width: 100% !important;
                              box-sizing: border-box !important;
                            }
                            
                            .mobile-cart-item-quantity {
                              display: flex;
                              align-items: center;
                              gap: 12px;
                              flex: 1;
                              min-width: 120px;
                            }
                            
                            .mobile-cart-item-quantity-label {
                              font-size: 14px;
                              font-weight: 500;
                              color: #666;
                            }
                            
                            .mobile-cart-item-subtotal {
                              text-align: right;
                              flex: 1;
                              min-width: 100px;
                            }
                            
                            .mobile-cart-item-subtotal-label {
                              font-size: 12px;
                              color: #999;
                              margin-bottom: 4px;
                            }
                            
                            .mobile-cart-item-subtotal-amount {
                              font-size: 18px;
                              font-weight: 700;
                              color: #2c3e50;
                            }
                            
                             /* Total ve butonlar mobilde - Sağa yapıştır */
                             .tg-cart-page-total {
                               width: 100% !important;
                               max-width: 100% !important;
                               box-sizing: border-box !important;
                               padding-left: 0 !important;
                               padding-right: 0 !important;
                               margin-left: 0 !important;
                               margin-right: 0 !important;
                             }
                             
                             .tg-cart-page-total .d-flex {
                               gap: 10px !important;
                               justify-content: flex-end !important;
                               align-items: center !important;
                               width: 100% !important;
                               max-width: 100% !important;
                               margin: 0 !important;
                               padding: 0 !important;
                               display: flex !important;
                               flex-direction: row !important;
                             }
                             
                             .tg-cart-page-total .tg-btn {
                               flex: 0 0 auto !important;
                               min-width: 0 !important;
                               text-align: center !important;
                               padding: 10px 20px !important;
                               font-size: 14px !important;
                               margin: 0 !important;
                             }
                           }
                          
                          /* Desktop'ta mobil kartları gizle */
                          @media (min-width: 992px) {
                            .mobile-cart-items {
                              display: none !important;
                            }
                            
                            /* Desktop buton düzenlemesi */
                            .tg-cart-page-total {
                              width: 100% !important;
                              max-width: 100% !important;
                              box-sizing: border-box !important;
                              padding-left: 0 !important;
                              padding-right: 0 !important;
                              margin-left: 0 !important;
                              margin-right: 0 !important;
                            }
                            
                            .tg-cart-page-total > .d-flex {
                              gap: 10px !important;
                              justify-content: center !important;
                              width: 100% !important;
                              max-width: 100% !important;
                              margin: 0 auto !important;
                              padding-left: 0 !important;
                              padding-right: 0 !important;
                              display: flex !important;
                            }
                            
                            .tg-cart-page-total .tg-btn {
                              flex: 0 0 auto !important;
                              min-width: 0 !important;
                              text-align: center !important;
                              padding: 10px 24px !important;
                              font-size: 14px !important;
                            }
                          }
                          
                          /* Genel buton div düzenlemesi - Tüm ekranlar için */
                          .tg-cart-page-total .d-flex.justify-content-center {
                            width: 100% !important;
                            max-width: 100% !important;
                            margin: 0 auto !important;
                            padding-left: 0 !important;
                            padding-right: 0 !important;
                            justify-content: center !important;
                            display: flex !important;
                            box-sizing: border-box !important;
                          }
                          
                          /* Parent column düzenlemesi */
                          .col-xl-3.col-lg-4.col-md-5 .tg-cart-page-total {
                            padding-left: 0 !important;
                            padding-right: 0 !important;
                            margin-left: 0 !important;
                            margin-right: 0 !important;
                          }
                          
                          .col-xl-3.col-lg-4.col-md-5 .tg-cart-page-total .d-flex {
                            margin-left: 0 !important;
                            margin-right: 0 !important;
                            padding-left: 0 !important;
                            padding-right: 0 !important;
                          }
                        `}</style>
                        <div className="row gutter-y-30">
                           {/* Desktop Table */}
                           <div className="tg-cart-table-content table-responsive mb-30">
                              <table className="table">
                                 <thead>
                                    <tr>
                                       <th>Item</th>
                                       <th className="price">Price</th>
                                       <th>Quantity</th>
                                       <th className="subtotal">Subtotal</th>
                                       <th>Remove</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {productItem.map((item: any, i: any) =>
                                       <tr key={i}>
                                          <td className="product-thumbnail">
                                             <Link className="thumb" to="/shop-details">
                                                <img src={item.thumb} alt="" />
                                             </Link>
                                             <Link className="texts" to="/shop-details">{item.title}</Link>
                                          </td>
                                          <td className="product-price2">
                                             <span className="amount">€{item.price}.00</span>
                                          </td>
                                          <td className="product-quantity">
                                             <div className="tg-product-details-quantity">
                                                <div className="tg-booking-quantity-item">
                                                   <span onClick={() => dispatch(decrease_quantity(item))} className="decrement">
                                                      <svg width="14" height="2" viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                         <path d="M1 1H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                      </svg>
                                                   </span>
                                                   <input className="tg-quantity-input" type="text" onChange={handleSubmit} value={item.quantity} readOnly />
                                                   <span onClick={() => dispatch(addToCart(item))} className="increment">
                                                      <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                         <path d="M1.21924 7H13.3836" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                         <path d="M7.30176 13V1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                      </svg>
                                                   </span>
                                                </div>
                                             </div>
                                          </td>

                                          <td className="product-subtotal"><span className="amount">€{item.price * item.quantity}.00</span></td>
                                          <td className="product-remove">
                                             <a onClick={() => dispatch(remove_cart_product(item))} style={{ cursor: "pointer" }}><i className="fa fa-times"></i></a>
                                          </td>
                                       </tr>
                                    )}
                                 </tbody>
                              </table>
                           </div>
                           
                           {/* Mobil Cart Kartları */}
                           <div className="mobile-cart-items" style={{ display: 'none', width: '100%' }}>
                              {productItem.map((item: any, i: any) => (
                                 <div key={i} className="mobile-cart-item">
                                    <div className="mobile-cart-item-header">
                                       <Link to="/shop-details" className="mobile-cart-item-thumb">
                                          <img src={item.thumb} alt={item.title} />
                                       </Link>
                                       <div className="mobile-cart-item-info">
                                          <h5 className="mobile-cart-item-title">
                                             <Link to="/shop-details">{item.title}</Link>
                                          </h5>
                                          <p className="mobile-cart-item-price">€{item.price}.00</p>
                                       </div>
                                       <div 
                                          className="mobile-cart-item-remove"
                                          onClick={() => dispatch(remove_cart_product(item))}
                                       >
                                          <i className="fa fa-times"></i>
                                       </div>
                                    </div>
                                    <div className="mobile-cart-item-body">
                                       <div className="mobile-cart-item-quantity">
                                          <span className="mobile-cart-item-quantity-label">Quantity:</span>
                                          <div className="tg-product-details-quantity">
                                             <div className="tg-booking-quantity-item">
                                                <span onClick={() => dispatch(decrease_quantity(item))} className="decrement">
                                                   <svg width="14" height="2" viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                      <path d="M1 1H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                   </svg>
                                                </span>
                                                <input className="tg-quantity-input" type="text" onChange={handleSubmit} value={item.quantity} readOnly />
                                                <span onClick={() => dispatch(addToCart(item))} className="increment">
                                                   <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                      <path d="M1.21924 7H13.3836" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                      <path d="M7.30176 13V1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                   </svg>
                                                </span>
                                             </div>
                                          </div>
                                       </div>
                                       <div className="mobile-cart-item-subtotal">
                                          <div className="mobile-cart-item-subtotal-label">Subtotal</div>
                                          <div className="mobile-cart-item-subtotal-amount">€{item.price * item.quantity}.00</div>
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                           <div className="row">
                              <div className="col-xl-9 col-lg-8 col-md-7">
                                 {/* Coupon section removed */}
                              </div>
                              <div className="col-xl-3 col-lg-4 col-md-5">
                                 <div className="tg-cart-page-total mb-20" style={{ width: '100%' }}>
                                    <ul className="mb-20">
                                       <li>Subtotal <span>€{total.toFixed(2)}</span></li>
                                       <li className="borders">Shopping <span>€0.00</span></li>
                                       <li>Total <span>€{total.toFixed(2)}</span></li>
                                    </ul>
                                     <div className="d-flex" style={{ gap: '10px', width: '100%', maxWidth: '100%', margin: 0, padding: 0, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <Link to="#" className="tg-btn tg-btn-black mb-10" style={{ flex: '0 0 auto', padding: '10px 24px', fontSize: '14px', margin: 0 }}>Update</Link>
                                        <Link to="/checkout" className="tg-btn mb-10" style={{ flex: '0 0 auto', padding: '10px 24px', fontSize: '14px', margin: 0 }}>Checkout</Link>
                                     </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </form>
                  )}
               </div>
            </div>
         </div>
      </div>
   )
}

export default CartArea