import img from "./thor-error.gif";

const ErrorMessage = () => {
  return (
    <div>
      <img
        style={{
          display: "block",
          width: "250px",
          height: "220px",
          objectFit: "contain",
          margin: "0 auto",
        }}
        src={img}
        alt="Error"
      />
      <h1 
        style={{    
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "24px",
          color: "#9f0013",
        }}
      >Error!</h1>
    </div>
  );
};

export default ErrorMessage;
