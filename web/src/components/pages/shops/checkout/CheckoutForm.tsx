import { useState, useEffect } from "react";
import NiceSelect from "../../../../ui/NiceSelect";
import authApiService from "../../../../api/auth";

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

interface CheckoutFormProps {
  formData: CheckoutFormData;
  setFormData: (data: CheckoutFormData) => void;
}

const CheckoutForm = ({ formData, setFormData }: CheckoutFormProps) => {
  const currentUser = authApiService.getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      // Auto-fill user info if available, but don't override if user already typed
      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || currentUser.firstName || "",
        lastName: prev.lastName || currentUser.lastName || "",
        email: prev.email || currentUser.email || "",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

   const selectHandler = () => { };

   return (
      <div className="col-xl-9 col-lg-8">
         <div className="tg-checkout-form-wrapper mr-50">
            <h2 className="tg-checkout-form-title mb-30">Billing Details</h2>
            <div className="row gx-24">
               <div className="col-lg-6 col-md-6">
                  <div className="tg-checkout-form-input mb-25">
              <input
                className="input"
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
                  </div>
               </div>
               <div className="col-lg-6 col-md-6">
                  <div className="tg-checkout-form-input mb-25">
              <input
                className="input"
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
                  </div>
               </div>
               <div className="col-lg-12">
                  <div className="tg-checkout-form-input mb-25">
              <input
                className="input"
                type="text"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
              />
                  </div>
               </div>
               <div className="col-lg-12">
                  <div className="tg-checkout-form-input">
                     <NiceSelect
                        className="select input mb-25"
                        options={[
                           { value: "01", text: "Country / Region*" },
                           { value: "02", text: "Canada" },
                           { value: "03", text: "Span" },
                           { value: "04", text: "India" },
                           { value: "05", text: "Uganda" },
                           { value: "06", text: "Bangladesh" },
                        ]}
                        defaultCurrent={0}
                        onChange={selectHandler}
                        name=""
                        placeholder="" />
                  </div>
               </div>
               <div className="col-lg-12">
                  <div className="tg-checkout-form-input mb-25">
              <input
                className="input"
                type="text"
                placeholder="House number and street name"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
                  </div>
               </div>
               <div className="col-lg-12">
                  <div className="tg-checkout-form-input mb-25">
              <input
                className="input"
                type="text"
                placeholder="Apartment, Suite, unit, etc (Optional)"
                value={formData.apartment}
                onChange={(e) => handleChange("apartment", e.target.value)}
              />
                  </div>
               </div>
               <div className="col-lg-12">
                  <div className="tg-checkout-form-input">
                     <NiceSelect
                        className="select input  mb-25"
                        options={[
                           { value: "01", text: "Town / City" },
                           { value: "02", text: "Luhanshchyna" },
                           { value: "03", text: "London" },
                           { value: "04", text: "Volyn" },
                           { value: "05", text: "Dnipropetrovshchyna" },
                        ]}
                        defaultCurrent={0}
                        onChange={selectHandler}
                        name=""
                        placeholder="" />
                  </div>
               </div>
               <div className="col-lg-12">
                  <div className="tg-checkout-form-input mb-25">
              <input
                className="input"
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
              />
                  </div>
               </div>
               <div className="col-lg-12">
                  <div className="tg-checkout-form-input mb-25">
              <input
                className="input"
                type="text"
                placeholder="Zip Code"
                value={formData.zipCode}
                onChange={(e) => handleChange("zipCode", e.target.value)}
              />
                  </div>
               </div>
               <div className="col-lg-12">
                  <div className="tg-checkout-form-input mb-25">
              <input
                className="input"
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
                  </div>
               </div>
               <div className="col-lg-12">
                  <div className="tg-checkout-form-input mb-40">
              <input
                className="input"
                type="email"
                placeholder="E-mail Address"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
                  </div>
               </div>
               <div className="col-lg-12">
                  <div className="tg-checkout-form-input mb-25">
                     <h2 className="tg-checkout-form-title tg-checkout-form-title-2 mb-15">Additional Information</h2>
              <textarea
                className="input textarea"
                placeholder="Order Note (Optional) "
                value={formData.orderNote}
                onChange={(e) => handleChange("orderNote", e.target.value)}
              ></textarea>
                  </div>
               </div>
            </div>
         </div>
      </div>
  );
};

export default CheckoutForm;
