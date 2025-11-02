import { type Tour } from "../../../../api/tours";

interface IncludedProps {
  tour: Tour;
}

const Included = ({ tour }: IncludedProps) => {
  // Default values if not provided
  const included = tour.included || [
    "Pick and Drop Service",
    "1 Meal Per Day",
    "Cruise Dinner & Music Event",
    "Visit 7 Best Places"
  ];

  const excluded = tour.excluded || [
    "Gratuities",
    "Return airport and round trip transfers.",
    "Luxury air-conditioned coach",
    "Tickets"
  ];

   return (
      <div className="tg-tour-about-inner mb-40">
         <h4 className="tg-tour-about-title mb-20">Included/Exclude</h4>
         <div className="row">
            <div className="col-lg-5">
               <div className="tg-tour-about-list  tg-tour-about-list-2">
                  <ul>
                     {included.map((item, index) => (
                        <li key={index}>
                           <span className="icon mr-10"><i className="fa-sharp fa-solid fa-check fa-fw"></i></span>
                           <span className="text">{item}</span>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
            <div className="col-lg-7">
               <div className="tg-tour-about-list tg-tour-about-list-2 disable">
                  <ul>
                     {excluded.map((item, index) => (
                        <li key={index}>
                           <span className="icon mr-10"><i className="fa-sharp fa-solid fa-xmark"></i></span>
                           <span className="text">{item}</span>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Included
