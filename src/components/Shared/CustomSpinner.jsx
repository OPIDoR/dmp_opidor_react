import { ThreeDots } from "react-loader-spinner";

/* This is a React functional component that returns a custom spinner. The spinner is created using the `ThreeDots` component from the
`react-loader-spinner` library. The `CustomSpinner` component sets some props for the `ThreeDots` component, such as the height, width, radius, color,
and ariaLabel. It also sets some styles for the container `div` element to center the spinner on the page. Finally, the component is exported for use
in other parts of the application. */
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
