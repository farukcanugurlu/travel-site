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
      </>
   )
}

export default Breadcrumb
