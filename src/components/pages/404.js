import { Link } from "react-router-dom";

import img from "./tanos.jpeg";

const Page404 = () => {
  return (
    <div>
      <img
        src={img}
        style={{
          display: "block",
          width: "900px",
          height: "550px",
          objectFit: "contain",
          margin: "0 auto",
        }}
        alt="404 not found"
      />
      <Link style={{display: "block", textAlign: "center", fontWeight: "bold", fontSize: "24px", marginTop: "30px"}}
        to="/">Back to main page</Link>
    </div>
  );
};

export default Page404;
