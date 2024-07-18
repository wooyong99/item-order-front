import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { slider } from "@material-tailwind/react";
import MessageModal from "./messageModel";
import AlertModal from "./alertModal";

const ItemDetail = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState("");
  const [paymentFail, setPaymentFail] = useState(false);
  const [paymentFailMsg, setPaymentFailMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/items/${itemId}`
        );
        setItem(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  const requestPay = (merchant_uid, price, name) => {
    const { IMP } = window;
    IMP.init("imp95037675");

    IMP.request_pay(
      {
        pg: "kakaopay", //KG이니시스 pg파라미터 값
        pay_method: "card", //결제 방법
        merchant_uid: merchant_uid, //주문번호
        name: name, //상품 명
        amount: price, //금액
        buyer_email: "gildong@gmail.com",
        buyer_name: "홍길동",
        buyer_tel: "010-4242-4242",
        buyer_addr: "서울특별시 강남구 신사동",
        buyer_postcode: "01181",
      },
      async (rsp) => {
        if (rsp.success) {
          console.log(rsp);
          for (let i = 0; i < 5; i++) {
            let myToken =
              "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiZXhwIjo4NjU3MjEyMTY1NTEsImlhdCI6MTcyMTIxNjU1MX0.1woBAonYkR134Hw-pnSHDvxIaXj8k1FdXcpeJx7B060noqOOG5ORTdrOtucinYABd7ufCe4RUx7ZRISWrbj47w";
            const paymentRes = await axios.post(
              // "http://localhost:8080/orders/test/check-payment",
              "http://localhost:8080/orders/" + merchant_uid + "/check-payment",
              {
                impUid: rsp.imp_uid,
                price: rsp.paid_amount,
              },
              {
                headers: {
                  Authorization: `${myToken}`, // Bearer 토큰을 헤더에 포함
                },
              }
            );
            console.log(paymentRes.data);
            if (paymentRes.data.status === "PAYMENT_SUCCESS") {
              setPaymentSuccess(true);
              setPaymentSuccessMsg(paymentRes.data.msg);
              return;
            }
            if (
              paymentRes.data.status === "PAYMENT_OUT_OF_STOCK" ||
              paymentRes.data.status === "PAYMENT_NO_PAYMENT_INFO"
            ) {
              setPaymentFail(true);
              setPaymentFailMsg(paymentRes.data.msg);
              return;
            }
            console.log(paymentRes.data);
            await sleep(500);
          }
        } else {
          setPaymentFail(true);
        }
      }
    );
  };

  const requestItemOrder = async () => {
    let myToken =
      "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiZXhwIjo4NjU3MjEyMTY1NTEsImlhdCI6MTcyMTIxNjU1MX0.1woBAonYkR134Hw-pnSHDvxIaXj8k1FdXcpeJx7B060noqOOG5ORTdrOtucinYABd7ufCe4RUx7ZRISWrbj47w";
    try {
      await axios
        .post(
          `http://localhost:8080/items/${itemId}/orders`,
          {
            userId: 1,
            price: item.price,
          },
          {
            headers: {
              Authorization: `${myToken}`, // Bearer 토큰을 헤더에 포함
            },
          }
        )
        .then((res) => {
          requestPay(res.data, item.price, item.name);
        });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const onMessageModalClose = () => {
    setPaymentSuccess(false);
    navigate("/");
  };

  const onAlertModalClose = () => {
    setPaymentFail(false);
    navigate("/");
  };

  return (
    <div>
      <div className="bg-blue-200">
        <MessageModal
          open={paymentSuccess}
          onClose={onMessageModalClose}
          title={paymentSuccessMsg}
        />
        <AlertModal
          open={paymentFail}
          onClose={onAlertModalClose}
          title={paymentFailMsg}
        />
        <div className="container mx-auto flex justify-center py-10">
          <span className="text-3xl">상품 상세보기</span>
        </div>
      </div>
      <div className="container mx-auto mt-10">
        {item && (
          <div className="border-blue-200 border-2 rounded-xl p-10 flex flex-col gap-2">
            <p className="text-xl">상품 ID: {item.itemId}</p>
            <p className="text-xl">상품 이름: {item.name}</p>
            <p className="text-xl">상품 가격: {item.price}</p>
            <p className="text-xl">상품 재고: {item.stock}</p>
            <button
              className=" rounded-xl self-end bg-blue-200 px-4 py-2 text-xl"
              onClick={requestItemOrder}
            >
              결제하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetail;
