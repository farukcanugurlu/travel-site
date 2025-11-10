import FooterThree from "../../../layouts/footers/FooterThree"
import HeaderThree from "../../../layouts/headers/HeaderThree"
import BreadCrumb from "../../common/BreadCrumb"
import AboutArea from "./AboutArea"
import Choose from "./Choose"

const About = () => {
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb title="About Us" sub_title="About Us" pageType="about" />
            <AboutArea />
            <Choose />
         </main>
         <FooterThree />
      </>
   )
}

export default About
