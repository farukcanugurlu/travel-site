import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { type Tour } from "../../../api/tours";
import NiceSelect from "../../../ui/NiceSelect";
import { addToCart } from "../../../redux/features/cartSlice";

interface FeatureSidebarProps {
  tour: Tour;
}

const FeatureSidebar = ({ tour }: FeatureSidebarProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [adultCount, setAdultCount] = useState(0);
  const [youthCount, setYouthCount] = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);
  const [tourDate, setTourDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [servicePerBooking, setServicePerBooking] = useState(false);
  const [servicePerPerson, setServicePerPerson] = useState(false);

  // Get the first package for pricing (or you can add package selection)
  const tourPackage = tour.packages?.[0];
  
  const adultPrice = tourPackage?.adultPrice || 0;
  const youthPrice = tourPackage?.childPrice || 0; // Using childPrice for youth
  const childrenPrice = tourPackage?.childPrice || 0; // Using childPrice for children

  // Calculate total cost
  const calculateTotal = () => {
    let total = 0;
    total += adultCount * adultPrice;
    total += youthCount * youthPrice;
    total += childrenCount * childrenPrice;
    
    if (servicePerBooking) total += 30;
    if (servicePerPerson) total += 20 * (adultCount + youthCount + childrenCount);
    
    return total;
  };

  const totalCost = calculateTotal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasyon: En az 1 yetişkin gerekli
    if (adultCount === 0 && youthCount === 0 && childrenCount === 0) {
      toast.error("Lütfen en az 1 kişi seçin");
      return;
    }

    // Validasyon: Tarih seçilmeli
    if (!tourDate) {
      toast.error("Lütfen bir tarih seçin");
      return;
    }

    // Validasyon: Tur paketi olmalı
    if (!tourPackage) {
      toast.error("Tur paketi bulunamadı");
      return;
    }

    // Sepete eklenecek item oluştur
    const cartItem = {
      id: `${tour.id}-${tourPackage.id}-${tourDate}-${selectedTime}-${adultCount}-${youthCount}-${childrenCount}`,
      title: `${tour.title} - ${tourPackage.name} (${tourDate} ${selectedTime})`,
      price: totalCost,
      thumb: (() => {
        const imgUrl = tour.images?.[0] || tour.thumbnail || '/assets/img/listing/listing-1.jpg';
        if (!imgUrl) return '/assets/img/listing/listing-1.jpg';
        if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) return imgUrl;
        if (imgUrl.startsWith('/uploads/')) {
          return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${imgUrl}`;
        }
        return imgUrl;
      })(),
      // Ekstra bilgiler
      tourId: tour.id,
      packageId: tourPackage.id,
      tourDate: tourDate,
      tourTime: selectedTime,
      participants: {
        adults: adultCount,
        youth: youthCount,
        children: childrenCount,
      },
      extras: {
        servicePerBooking,
        servicePerPerson,
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
            onChange={(e) => setTourDate(e.target.value)}
            placeholder="When (Date)"
            required
          />
          <span className="calender">
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
          <span className="angle">
            <i className="fa-sharp fa-solid fa-angle-down"></i>
          </span>
        </div>
      </div>
      <div className="tg-tour-about-time d-flex align-items-center mb-10">
        <span className="time">Time:</span>
        <div className="form-check mr-15">
          <input
            className="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="time1"
            checked={selectedTime === "12:00"}
            onChange={() => setSelectedTime("12:00")}
          />
          <label className="form-check-label" htmlFor="time1">
            12:00
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="time2"
            checked={selectedTime === "19:00"}
            onChange={() => setSelectedTime("19:00")}
          />
          <label className="form-check-label" htmlFor="time2">
            19:00
          </label>
        </div>
      </div>
      <div className="tg-tour-about-border-doted mb-15"></div>
      <div className="tg-tour-about-tickets-wrap mb-15">
        <span className="tg-tour-about-sidebar-title">Tickets:</span>
        <div className="tg-tour-about-tickets mb-10">
          <div className="tg-tour-about-tickets-adult">
            <span>Adult</span>
            <p className="mb-0">
              (14+ years) <span>${adultPrice}</span>
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
            <span>Youth </span>
            <p className="mb-0">
              (13-17 years) <span>${youthPrice}</span>
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
              onChange={(option) => setYouthCount(parseInt(option.value))}
              name="youth"
              placeholder=""
            />
          </div>
        </div>
        <div className="tg-tour-about-tickets mb-10">
          <div className="tg-tour-about-tickets-adult">
            <span>Children </span>
            <p className="mb-0">
              (0-12 years) <span>${childrenPrice}</span>
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
              onChange={(option) => setChildrenCount(parseInt(option.value))}
              name="children"
              placeholder=""
            />
          </div>
        </div>
      </div>
      <div className="tg-tour-about-border-doted mb-15"></div>
      <div className="tg-tour-about-extra mb-10">
        <span className="tg-tour-about-sidebar-title mb-10 d-inline-block">
          Add Extra:
        </span>
        <div className="tg-filter-list">
          <ul>
            <li>
              <div className="checkbox d-flex">
                <input 
                  className="tg-checkbox" 
                  type="checkbox" 
                  id="amenities" 
                  checked={servicePerBooking}
                  onChange={(e) => setServicePerBooking(e.target.checked)}
                />
                <label htmlFor="amenities" className="tg-label">
                  Service per booking
                </label>
              </div>
              <span className="quantity">$30.00</span>
            </li>
            <li>
              <div className="checkbox d-flex">
                <input
                  className="tg-checkbox"
                  type="checkbox"
                  id="amenities-2"
                  checked={servicePerPerson}
                  onChange={(e) => setServicePerPerson(e.target.checked)}
                />
                <label htmlFor="amenities-2" className="tg-label">
                  Service per person
                </label>
              </div>
              <span className="quantity">$20.00</span>
            </li>
            <li>
              <span className="adult">Adult ({adultCount}x):</span>
              <span className="quantity">${(adultCount * adultPrice).toFixed(2)}</span>
            </li>
            <li>
              <span className="adult">Youth ({youthCount}x):</span>
              <span className="quantity">${(youthCount * youthPrice).toFixed(2)}</span>
            </li>
            <li>
              <span className="adult">Children ({childrenCount}x):</span>
              <span className="quantity">${(childrenCount * childrenPrice).toFixed(2)}</span>
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
