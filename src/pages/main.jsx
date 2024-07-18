import { useEffect, useState } from "react";
import Header from "../components/header";
import axios from "axios";
import ItemCard from "../components/itemCard";

const Main = () => {
  // const [searchParams] = useSearchParams();
  const [page, setPage] = useState(0);
  const size = 10;
  const [itemData, setItemData] = useState([]);

  const fetchData = async (page) => {
    const apiUrl = `http://localhost:8080/items?page=${page}&size=${size}`;

    await axios.get(apiUrl).then((res) => {
      setItemData((prevData) => [...prevData, ...res.data]);
    });
  };
  useEffect(() => {
    fetchData(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Header></Header>
      <div className="container mx-auto mt-10">
        <div>
          <div className="text-2xl border-black">상품 목록</div>
        </div>
        <div className="">
          {itemData.map((item, index) => {
            return <ItemCard key={index} item={item}></ItemCard>;
          })}
        </div>
      </div>
    </>
  );
};

export default Main;
