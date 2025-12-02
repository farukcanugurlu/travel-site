import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { type Tour } from "../../../api/tours";
import NiceSelect from "../../../ui/NiceSelect";
import { addToCart } from "../../../redux/features/cartSlice";
import { normalizeImageUrl } from "../../../utils/imageUtils";

interface FeatureSidebarProps {
  tour: Tour;
}

const FeatureSidebar = ({ tour }: FeatureSidebarProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [tourDate, setTourDate] = useState("");
  
  // Parse availableTimes from tour data
  const getAvailableTimes = () => {
    console.log('Tour availableTimes:', tour.availableTimes, 'Type:', typeof tour.availableTimes);
    
    if (!tour.availableTimes) {
      console.log('No availableTimes, using default');
      return ["12:00", "19:00"];
    }
    
    // If it's already an array, use it
    if (Array.isArray(tour.availableTimes) && tour.availableTimes.length > 0) {
      console.log('Using array availableTimes:', tour.availableTimes);
      return tour.availableTimes;
    }
    
    // If it's a string, try to parse it
    if (typeof tour.availableTimes === 'string') {
      try {
        const parsed = JSON.parse(tour.availableTimes);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('Parsed string availableTimes:', parsed);
          return parsed;
        }
      } catch (e) {
        console.warn('Failed to parse availableTimes:', e);
      }
    }
    
    console.log('Using default times');
    return ["12:00", "19:00"]; // Fallback to default times
  };
  
  const availableTimes = getAvailableTimes();
  console.log('Final availableTimes:', availableTimes);
  const [selectedTime, setSelectedTime] = useState(availableTimes[0] || "12:00");

  // Update selectedTime when availableTimes changes
  useEffect(() => {
    const times = getAvailableTimes();
    if (times.length > 0) {
      // If current selectedTime is not in the new times, select the first one
      if (!times.includes(selectedTime)) {
        setSelectedTime(times[0]);
      }
    }
  }, [tour.availableTimes, selectedTime]);

  // Get the first package for pricing (or you can add package selection)
  const tourPackage = tour.packages?.[0];
  
  // Get prices based on selected date (monthly pricing if available)
  const getPricesForDate = (dateString: string) => {
    if (!dateString || !tourPackage) {
      return {
        adultPrice: tourPackage?.adultPrice || 0,
        childPrice: tourPackage?.childPrice || 0,
        infantPrice: tourPackage?.infantPrice || 0,
      };
    }

    try {
      const date = new Date(dateString);
      const month = (date.getMonth() + 1).toString(); // 1-12
      const monthlyPrices = tourPackage.monthlyPrices?.[month];

      if (monthlyPrices) {
        return {
          adultPrice: monthlyPrices.adultPrice ?? (tourPackage?.adultPrice ?? 0),
          childPrice: monthlyPrices.childPrice ?? (tourPackage?.childPrice ?? 0),
          infantPrice: monthlyPrices.infantPrice ?? (tourPackage?.infantPrice ?? 0),
        };
      }
    } catch (e) {
      console.warn('Error parsing date for monthly pricing:', e);
    }

    // Fallback to base prices
    return {
      adultPrice: tourPackage?.adultPrice || 0,
      childPrice: tourPackage?.childPrice || 0,
      infantPrice: tourPackage?.infantPrice || 0,
    };
  };

  const prices = getPricesForDate(tourDate);
  const adultPrice = prices.adultPrice;
  const childPrice = prices.childPrice;
  const infantPrice = prices.infantPrice;

  // Calculate total cost
  const calculateTotal = () => {
    let total = 0;
    total += adultCount * adultPrice;
    total += childCount * childPrice;
    total += infantCount * infantPrice;
    
    return total;
  };

  const totalCost = calculateTotal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasyon: En az 1 yetişkin gerekli
    if (adultCount === 0 && childCount === 0 && infantCount === 0) {
      toast.error("Please select at least 1 person");
      return;
    }

    // Validasyon: Tarih seçilmeli
    if (!tourDate) {
      toast.error("Please select a date");
      return;
    }

    // Validasyon: Tur paketi olmalı
    if (!tourPackage) {
      toast.error("Tour package not found");
      return;
    }

    // Sepete eklenecek item oluştur
    const cartItem = {
      id: `${tour.id}-${tourPackage.id}-${tourDate}-${selectedTime}-${adultCount}-${childCount}-${infantCount}`,
      title: `${tour.title} - ${tourPackage.name} (${tourDate} ${selectedTime})`,
      price: totalCost,
      thumb: normalizeImageUrl(tour.images?.[0] || tour.thumbnail || '/assets/img/listing/listing-1.jpg'),
      // Ekstra bilgiler
      tourId: tour.id,
      packageId: tourPackage.id,
      tourDate: tourDate,
      tourTime: selectedTime,
      participants: {
        adults: adultCount,
        children: childCount,
        infants: infantCount,
      },
    } as any;

    dispatch(addToCart(cartItem));
    toast.success("Sepete eklendi. Sepete yönlendiriliyorsunuz...");
    
    // Sepete yönlendir
    setTimeout(() => {
      navigate('/cart');
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4 className="tg-tour-about-title title-2 mb-15">Book This Tour</h4>
      <div className="tg-booking-form-parent-inner mb-10">
        <div className="tg-tour-about-date p-relative">
          <input
            className="input"
            name="datetime-local"
            type="date"
            value={tourDate}
            onChange={(e) => {
              const selectedDate = e.target.value;
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const selected = new Date(selectedDate);
              selected.setHours(0, 0, 0, 0);
              
              // Bugünden önceki tarihleri engelle
              if (selected < today) {
                return; // Tarihi değiştirme
              }
              
              setTourDate(selectedDate);
            }}
            min={(() => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return today.toISOString().split('T')[0];
            })()}
            placeholder="When (Date)"
            required
            style={{ 
              position: 'relative',
              zIndex: 1,
              cursor: 'pointer'
            }}
          />
          <span 
            className="calender"
            style={{ 
              pointerEvents: 'none',
              zIndex: 0
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.1111 1V3.80003M4.88888 1V3.80003M1 6.59992H15M2.55556 2.39988H13.4444C14.3036 2.39988 15 3.02668 15 3.79989V13.6C15 14.3732 14.3036 15 13.4444 15H2.55556C1.69645 15 1 14.3732 1 13.6V3.79989C1 3.02668 1.69645 2.39988 2.55556 2.39988Z"
                stroke="#560CE3"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span 
            className="angle"
            style={{ 
              pointerEvents: 'none',
              zIndex: 0
            }}
          >
            <i className="fa-sharp fa-solid fa-angle-down"></i>
          </span>
        </div>
      </div>
      {availableTimes.length > 0 && (
        <div className="tg-tour-about-time d-flex align-items-center mb-10" style={{ flexWrap: 'wrap', gap: '10px' }}>
          <span className="time" style={{ marginRight: '10px' }}>Time:</span>
          {availableTimes.map((time, index) => (
            <div key={index} className="form-check" style={{ marginRight: '15px' }}>
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id={`time${index}`}
                checked={selectedTime === time}
                onChange={() => setSelectedTime(time)}
              />
              <label className="form-check-label" htmlFor={`time${index}`}>
                {time}
              </label>
            </div>
          ))}
        </div>
      )}
      <div className="tg-tour-about-border-doted mb-15"></div>
      <div className="tg-tour-about-tickets-wrap mb-15">
        <span className="tg-tour-about-sidebar-title">Tickets:</span>
        <div className="tg-tour-about-tickets mb-10">
          <div className="tg-tour-about-tickets-adult">
            <span>Adult</span>
            <p className="mb-0">
              <span>${adultPrice}</span>
            </p>
          </div>
          <div className="tg-tour-about-tickets-quantity">
            <NiceSelect
              className="select  item-first"
              options={[
                { value: "0", text: "0" },
                { value: "1", text: "1" },
                { value: "2", text: "2" },
                { value: "3", text: "3" },
                { value: "4", text: "4" },
                { value: "5", text: "5" },
                { value: "6", text: "6" },
                { value: "7", text: "7" },
              ]}
              defaultCurrent={0}
              onChange={(option) => setAdultCount(parseInt(option.value))}
              name="adult"
              placeholder=""
            />
          </div>
        </div>
        <div className="tg-tour-about-tickets mb-10">
          <div className="tg-tour-about-tickets-adult">
            <span>Child </span>
            <p className="mb-0">
              <span>${childPrice}</span>
            </p>
          </div>
          <div className="tg-tour-about-tickets-quantity">
            <NiceSelect
              className="select  item-first"
              options={[
                { value: "0", text: "0" },
                { value: "1", text: "1" },
                { value: "2", text: "2" },
                { value: "3", text: "3" },
                { value: "4", text: "4" },
                { value: "5", text: "5" },
                { value: "6", text: "6" },
                { value: "7", text: "7" },
              ]}
              defaultCurrent={0}
              onChange={(option) => setChildCount(parseInt(option.value))}
              name="child"
              placeholder=""
            />
          </div>
        </div>
        <div className="tg-tour-about-tickets mb-10">
          <div className="tg-tour-about-tickets-adult">
            <span>Infant </span>
            <p className="mb-0">
              <span>${infantPrice}</span>
            </p>
          </div>
          <div className="tg-tour-about-tickets-quantity">
            <NiceSelect
              className="select  item-first"
              options={[
                { value: "0", text: "0" },
                { value: "1", text: "1" },
                { value: "2", text: "2" },
                { value: "3", text: "3" },
                { value: "4", text: "4" },
                { value: "5", text: "5" },
                { value: "6", text: "6" },
                { value: "7", text: "7" },
              ]}
              defaultCurrent={0}
              onChange={(option) => setInfantCount(parseInt(option.value))}
              name="infant"
              placeholder=""
            />
          </div>
        </div>
      </div>
      <div className="tg-tour-about-border-doted mb-15"></div>
      <div className="tg-tour-about-extra mb-10">
        <span className="tg-tour-about-sidebar-title mb-10 d-inline-block">
          Price Summary:
        </span>
        <div className="tg-filter-list">
          <ul>
            <li>
              <span className="adult">Adult ({adultCount}x):</span>
              <span className="quantity">${(adultCount * adultPrice).toFixed(2)}</span>
            </li>
            <li>
              <span className="adult">Child ({childCount}x):</span>
              <span className="quantity">${(childCount * childPrice).toFixed(2)}</span>
            </li>
            <li>
              <span className="adult">Infant ({infantCount}x):</span>
              <span className="quantity">${(infantCount * infantPrice).toFixed(2)}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="tg-tour-about-border-doted mb-15"></div>
      <div className="tg-tour-about-coast d-flex align-items-center flex-wrap justify-content-between mb-20">
        <span className="tg-tour-about-sidebar-title d-inline-block">
          Total Cost:
        </span>
        <h5 className="total-price">${totalCost.toFixed(2)}</h5>
      </div>
      <button type="submit" className="tg-btn tg-btn-switch-animation w-100">
        Book now
      </button>
    </form>
  );
};

export default FeatureSidebar;
