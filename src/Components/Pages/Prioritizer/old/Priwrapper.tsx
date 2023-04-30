import Layout from "../../../LayoutArea/Layout/Layout";
import DnDOutsideResource from "./Prioritizer";

const Priwrapper = () => {
    return (
        <DnDOutsideResource />
    );
};


function MainPriwrapper() {
    return (
        <Layout PageName="Priwrapper" component={Priwrapper} />
    );
}

export default MainPriwrapper;