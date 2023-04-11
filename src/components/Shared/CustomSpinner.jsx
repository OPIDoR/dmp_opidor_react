import { ThreeDots } from "react-loader-spinner";

function CustomSpinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", alignContent: "center" }}>
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="#2c7dad"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      />
    </div>
  );
}

export default CustomSpinner;
