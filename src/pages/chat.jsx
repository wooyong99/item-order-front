// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as StompJs from "@stomp/stompjs";
import { useCookies } from "react-cookie";

const Chat = () => {
  // URL에서 채팅방 ID를 가져옴
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  // 메시지 입력 상태
  const [message, setMessage] = useState("");
  // STOMP 클라이언트를 위한 ref. 웹소켓 연결을 유지하기 위해 사용
  const client = useRef(null);
  const [cookies, setCookie] = useCookies(["AccessToken", "RefreshToken"]);

  const token =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzIwMjM2NzM1LCJpYXQiOjE3MjAxNTAzMzV9.Z7RBQPR9jYecd9cz6rajNRGbH3u6vMva2WFcSNpZUHl6iEIkmT_RcuIHkvaJYbQR-EQPSIIrBWer9tNyyMw8lQ";

  const connect = () => {
    setCookie("RefreshToken", token, { path: "/" });
    setCookie("AccessToken", token, { path: "/" });
    console.log(cookies.AccessToken);

    client.current = new StompJs.Client({
      brokerURL: "wss://api.nodak.link/chat",
      // brokerURL: "ws://localhost:8080/chat",
      connectHeaders: {
        Cookie: `AccessToken=${cookies.AccessToken}`,
      },
      onConnect: () => {
        console.log("success");
        subscribe(roomId);
        // publishOnWait();
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });
    client.current.activate();
    console.log("방 번호", roomId);
    console.log(client.current);
  };
  // 웹소켓 연결 해제
  const disconnect = () => {
    client.current.deactivate();
    console.log("채팅이 종료되었습니다.");
  };

  const subscribe = (roomId) => {
    client.current.subscribe(`/sub/${roomId}`, (message) => {
      const receivedMessage = JSON.parse(message.body);
      setMessages((prevMessages) => [...prevMessages, receivedMessage.content]);
      console.log("Received message: ", receivedMessage);
    });
  };

  // 새 메시지를 보내는 함수
  const sendMessage = () => {
    if (client.current && message) {
      const messageObj = {
        content: message,
      };
      console.log(message);
      client.current.publish({
        destination: `/pub/${roomId}`,
        body: JSON.stringify(messageObj),
      });

      setMessages((prevMessages) => [...prevMessages, message]);
      setMessage(""); // 입력 필드 초기화
    }
  };

  return (
    <div>
      <div className="container mx-auto flex flex-col items-center">
        <div className="socketCon flex gap-2">
          <button onClick={connect} className="border-2 rounded-xl p-2">
            웹소켓 연결하기
          </button>
          <button onClick={disconnect} className="border-2 rounded-xl p-2">
            웹소켓 연결끊기
          </button>
        </div>
        <div>
          <div className="text-xl">메세지 내용</div>
          {messages.map((msg, index) => (
            <div key={index} className="border-b-2">
              {msg}
            </div>
          ))}
        </div>
        <div>
          <input
            placeholder="메세지를 입력하세요."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          ></input>
        </div>
        <button onClick={sendMessage} className="border-2 rounded-xl p-2">
          메세지 전송
        </button>
      </div>
    </div>
  );
};

export default Chat;
