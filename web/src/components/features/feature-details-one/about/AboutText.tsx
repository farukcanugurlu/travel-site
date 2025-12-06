
import { type Tour } from "../../../../api/tours";

interface AboutTextProps {
  tour: Tour;
}

const AboutText = ({ tour }: AboutTextProps) => {
   // Format description: split by newlines and create paragraphs
   const formatDescription = (text: string | null | undefined) => {
      if (!text) return null;
      
      // Split by newlines and filter out empty lines
      const paragraphs = text.split('\n').filter(p => p.trim().length > 0);
      
      if (paragraphs.length === 0) return null;
      
      // If only one paragraph, return it as is
      if (paragraphs.length === 1) {
         return <p className="text-capitalize lh-28">{paragraphs[0]}</p>;
      }
      
      // Multiple paragraphs - render each as separate <p> tag
      return (
         <>
            {paragraphs.map((paragraph, index) => (
               <p key={index} className="text-capitalize lh-28" style={{ marginBottom: index < paragraphs.length - 1 ? '15px' : '0' }}>
                  {paragraph.trim()}
               </p>
            ))}
         </>
      );
   };

   const descriptionContent = formatDescription(tour.description || tour.excerpt);

   return (
      <>
         <div className="tg-tour-about-inner mb-25">
            <h4 className="tg-tour-about-title mb-15">About This Tour</h4>
            {descriptionContent || <p className="text-capitalize lh-28">No description available for this tour.</p>}
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
