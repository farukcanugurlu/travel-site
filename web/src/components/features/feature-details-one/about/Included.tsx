import { type Tour } from "../../../../api/tours";

interface IncludedProps {
  tour: Tour;
}

const Included = ({ tour }: IncludedProps) => {
  // Only use actual tour data, no defaults
  const included = tour.included && Array.isArray(tour.included) && tour.included.length > 0 
    ? tour.included 
    : null;

  const excluded = tour.excluded && Array.isArray(tour.excluded) && tour.excluded.length > 0 
    ? tour.excluded 
    : null;

  // Don't render if both are empty
  if (!included && !excluded) {
    return null;
  }

   return (
      <div className="tg-tour-about-inner mb-40">
         <h4 className="tg-tour-about-title mb-20">Included/Exclude</h4>
         <div className="row">
            {included && (
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
            )}
            {excluded && (
               <div className={included ? "col-lg-7" : "col-lg-12"}>
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
            )}
         </div>
      </div>
   )
}

export default Included
