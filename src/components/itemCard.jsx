import { useNavigate } from "react-router-dom";

const ItemCard = (props) => {
  const navigate = useNavigate();

  const handleItemDetail = (id) => {
    navigate(`/items/${id}`);
  };
  return (
    <>
      <div className="border-2 rounded-xl flex flex-col p-3 my-3 gap-1">
        <div className="text-lg">{props.item.name}</div>
        <div className="text-md self-end">가격 : {props.item.price}</div>
        <div className="text-md self-end">수량 : {props.item.stock}</div>
        <button
          className=" rounded-xl self-end bg-blue-200 px-3 py-1"
          onClick={() => handleItemDetail(props.item.itemId)}
        >
          상세보기
        </button>
      </div>
    </>
  );
};

export default ItemCard;
