const Header = () => {
  return (
    <>
      <div className="container mx-auto border-4 pt-8 flex flex-col">
        <div className="flex justify-center text-3xl">주문 결제 서비스</div>
        <span className="border-2 rounded-xl self-end mr-8 px-3 py-1">
          로그인 / 회원가입
        </span>
      </div>
    </>
  );
};

export default Header;
