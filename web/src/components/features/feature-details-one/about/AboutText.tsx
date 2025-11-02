
import { type Tour } from "../../../../api/tours";

interface AboutTextProps {
  tour: Tour;
}

const AboutText = ({ tour }: AboutTextProps) => {
   return (
      <>
         <div className="tg-tour-about-inner mb-25">
            <h4 className="tg-tour-about-title mb-15">About This Tour</h4>
            <p className="text-capitalize lh-28">{tour.description || tour.excerpt || 'No description available for this tour.'}</p>
         </div>
         {tour.highlights && tour.highlights.length > 0 && (
            <div className="tg-tour-about-inner mb-40">
               <h4 className="tg-tour-about-title mb-20">Trip Highlights</h4>
               <div className="tg-tour-about-list">
                  <ul>
                     {tour.highlights.map((highlight, index) => (
                        <li key={index}>
                           <span className="icon mr-10"><i className="fa-sharp fa-solid fa-check fa-fw"></i></span>
                           <span className="text">{highlight}</span>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         )}
      </>
   )
}

export default AboutText
