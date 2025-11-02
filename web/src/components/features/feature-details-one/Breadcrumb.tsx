import { Link } from "react-router-dom";
import { type Tour } from "../../../api/tours";

interface BreadcrumbProps {
  tour: Tour;
}

const Breadcrumb = ({ tour }: BreadcrumbProps) => {
   return (
      <>
         <div className="tg-breadcrumb-spacing-3 include-bg p-relative fix" style={{ backgroundImage: `url(/assets/img/breadcrumb/breadcrumb-2.jpg)` }}>
            <div className="tg-hero-top-shadow"></div>
         </div>
         <div className="tg-breadcrumb-list-2-wrap">
            <div className="container">
               <div className="row">
                  <div className="col-12">
                     <div className="tg-breadcrumb-list-2">
                        <ul>
                           <li><Link to="/">Home</Link></li>
                           <li><i className="fa-sharp fa-solid fa-angle-right"></i></li>
                           <li><Link to="/tours">Tours</Link></li>
                           <li><i className="fa-sharp fa-solid fa-angle-right"></i></li>
                           <li><span>{tour.title}</span></li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}

export default Breadcrumb
