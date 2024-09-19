const Card = ({ children, backgroundColor }) => {
  return (
    <div
      className={`flex flex-col flex-1 items-center p-2  rounded h-max ${backgroundColor} text-white shadow-md`}
    >
      {children}
    </div>
  );
};

export default Card;
