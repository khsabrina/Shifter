import Layout from "../../LayoutArea/Layout/Layout";


const Settings = () => {
  return (
    <h6>settings</h6>
  );
};



function MainSettings(): JSX.Element {
  return (
    <Layout PageName="Settings" component={Settings} />
  );
}

export default MainSettings;
