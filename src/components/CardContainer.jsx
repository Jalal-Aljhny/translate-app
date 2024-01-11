import Card from "./Card";

const CardContainer = () => {
  return (
    <main className="card_cont">
      <Card type={"translation"} />
      <Card type={"translated"} />
    </main>
  );
};

export default CardContainer;
