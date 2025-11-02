import { useEffect, useState } from "react";
import { type Tour } from "../../../../api/tours";

interface FaqData {
   id: number;
   day: string;
   title: string;
   desc: string;
   showAnswer: boolean;
};

interface FaqProps {
  tour: Tour;
}

const defaultFaqData: FaqData[] = [
   {
      id: 1,
      day: "Day-01",
      title: "London to Amsterdam",
      desc: "Trade Center is the seventh tallest building in the world and the tallest building in the w hemisph ere. This skyscraper standst view of New York City. From here, you have awesome Manhattan the Statue of Liberty, Brooklyn, Staten Island, ",
      showAnswer: false,
   },
   {
      id: 2,
      day: "Day-02",
      title: "Art Museums, Central Park, Rockefeller Center, Times Square",
      desc: "Trade Center is the seventh tallest building in the world and the tallest building in the w hemisph ere. This skyscraper standst view of New York City. From here, you have awesome Manhattan the Statue of Liberty, Brooklyn, Staten Island, ",
      showAnswer: false,
   },
   {
      id: 3,
      day: "Day-03",
      title: "The Statue of Liberty, Ellis Island, the Tenement Museum & a Food Tour",
      desc: "Trade Center is the seventh tallest building in the world and the tallest building in the w hemisph ere. This skyscraper standst view of New York City. From here, you have awesome Manhattan the Statue of Liberty, Brooklyn, Staten Island, ",
      showAnswer: false,
   },
   {
      id: 4,
      day: "Day-04",
      title: "Empire State Building, Chelsea Market, the High Line & Hudson Yards",
      desc: "Trade Center is the seventh tallest building in the world and the tallest building in the w hemisph ere. This skyscraper standst view of New York City. From here, you have awesome Manhattan the Statue of Liberty, Brooklyn, Staten Island, ",
      showAnswer: false,
   },
];

const Faq = ({ tour }: FaqProps) => {
   const [faqData, setFaqData] = useState<FaqData[]>([]);

   useEffect(() => {
      // Use tour itinerary if available, otherwise use defaults
      const itineraryData = tour.itinerary || defaultFaqData.map((item, index) => ({
         day: item.day,
         title: item.title,
         description: item.desc
      }));

      const mappedData: FaqData[] = itineraryData.map((item, index) => ({
         id: index + 1,
         day: item.day,
         title: item.title,
         desc: item.description,
         showAnswer: index === 0
      }));

      setFaqData(mappedData);
   }, [tour.itinerary]);

   const toggleAnswer = (faqId: number) => {
      setFaqData((prevFaqData) =>
         prevFaqData.map((faq) => ({
            ...faq,
            showAnswer: faq.id === faqId
         }))
      );
   };

   return (
      <div className="tg-tour-faq-wrap mb-70">
         <h4 className="tg-tour-about-title mb-15">Tour Plan</h4>
         {tour.description || tour.excerpt ? (
            <p className="text-capitalize lh-28 mb-20">
               {tour.excerpt || tour.description?.split('\n')[0] || 'Discover amazing destinations with our carefully planned tour itinerary.'}
            </p>
         ) : (
            <p className="text-capitalize lh-28 mb-20">
               Discover amazing destinations with our carefully planned tour itinerary.
            </p>
         )}
         <div className="tg-tour-about-faq-inner">
            <div className="tg-tour-about-faq" id="accordionExample">
               {faqData.map((item) => (
                  <div key={item.id} className="accordion-item">
                     <h2 className="accordion-header">
                        <button className={`accordion-button ${item.showAnswer ? "" : "collapsed"}`} onClick={() => toggleAnswer(item.id)} type="button">
                           <span>{item.day}</span>{item.title}
                        </button>
                     </h2>
                     <div id="collapseOne" className={`accordion-collapse collapse ${item.showAnswer ? "show" : ""}`}>
                        <div className="accordion-body">
                           <p>{item.desc}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}

export default Faq
