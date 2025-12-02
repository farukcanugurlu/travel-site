import { useState, useEffect } from "react";
import SearchableSelect from "../../../../ui/SearchableSelect";
import authApiService from "../../../../api/auth";
import { countries } from "../../../../data/countries";
import { getCitiesByCountry, getAllCities } from "../../../../data/cities";

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
  const [availableCities, setAvailableCities] = useState<Array<{ value: string; text: string }>>([]);

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

  // Update cities when country changes
  useEffect(() => {
    if (formData.country) {
      const cities = getCitiesByCountry(formData.country);
      if (cities.length > 0) {
        setAvailableCities(cities);
      } else {
        // If no cities found for the country, show all cities
        setAvailableCities(getAllCities());
      }
      // Reset city when country changes
      setFormData((prev) => ({
        ...prev,
        city: "",
      }));
    } else {
      // If no country selected, show all cities
      setAvailableCities(getAllCities());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.country]);

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleCountryChange = (item: { value: string; text: string }, name: string) => {
    handleChange("country", item.value);
  };

  const handleCityChange = (item: { value: string; text: string }, name: string) => {
    handleChange("city", item.value);
  };

  // Prepare country options with placeholder
  const countryOptions = [
    { value: "", text: "Select Country / Region" },
    ...countries,
  ];

  // Prepare city options with placeholder
  const cityOptions = formData.country
    ? [
        { value: "", text: "Select Town / City" },
        ...availableCities,
      ]
    : [
        { value: "", text: "Select Country First" },
        ...availableCities,
      ];

  return (
    <>
      <style>{`
        .nice-select .list {
          max-height: 300px;
          overflow-y: auto;
        }
        
        .nice-select .list .search-box {
          padding: 10px 15px;
          border-bottom: 1px solid #e0e0e0;
          position: sticky;
          top: 0;
          background: #fff;
          z-index: 10;
        }
        
        .nice-select .list .search-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.3s ease;
        }
        
        .nice-select .list .search-input:focus {
          border-color: var(--tg-theme-primary, #ff6b6b);
        }
        
        .nice-select .list .option.disabled {
          color: #999;
          cursor: not-allowed;
          font-style: italic;
        }
        
        .nice-select .list .option {
          cursor: pointer;
          padding: 10px 15px;
        }
        
        .nice-select .list .option:hover {
          background-color: #f5f5f5;
        }
        
        .nice-select .list .option.selected {
          background-color: #e8f4f8;
          color: var(--tg-theme-primary, #ff6b6b);
        }
      `}</style>
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
                <SearchableSelect
                  className="select input mb-25"
                  options={countryOptions}
                  defaultCurrent={-1}
                  onChange={handleCountryChange}
                  name="country"
                  placeholder="Country / Region"
                  value={formData.country}
                />
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
                <SearchableSelect
                  className="select input mb-25"
                  options={cityOptions}
                  defaultCurrent={-1}
                  onChange={handleCityChange}
                  name="city"
                  placeholder="Town / City"
                  value={formData.city}
                />
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
                <h2 className="tg-checkout-form-title tg-checkout-form-title-2 mb-15">
                  Additional Information
                </h2>
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
    </>
  );
};

export default CheckoutForm;
