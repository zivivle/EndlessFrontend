import { useState } from "react";
import "./App.css";
import { DefaultTextField, Label } from "./components";

function App() {
    const [userInputFormValue, setUserInputFormValue] = useState({
        username: "",
        address: "",
    });
    const [isError, setIsError] = useState(false);
    return (
        <div className="w-[400px]">
            {/* 
              현재 상태에서 CLS를 초래할 수 있는 이유 
              갑자기 레이아웃이 변경되면 사용자 경험에 좋지않다.
              심지어 SEO에도 영향을 끼친다
              그러므로 사용자 경험을 위해서 CLS를 최대한 줄여야한다.
           */}
            <Label htmlFor="username">사용자 이름</Label>
            <DefaultTextField
                errorMessage="입력값을 확인해주세요."
                iconPath="/images/delete_icon.svg"
                iconAlt="delete_icon"
                onIconClick={() => {}}
                placeholder="이름을 입력해주세요."
                onChange={(e) =>
                    setUserInputFormValue((prev) => ({
                        ...prev,
                        username: e.target.value,
                    }))
                }
                value={userInputFormValue.username}
                isError={isError}
                id="username"
            />
            <div className="my-20" />
            <Label htmlFor="address">사용자 주소</Label>
            <DefaultTextField
                errorMessage="입력값을 확인해주세요."
                iconPath="/images/delete_icon.svg"
                iconAlt="delete_icon"
                onIconClick={() => {}}
                placeholder="주소을 입력해주세요."
                onChange={(e) =>
                    setUserInputFormValue((prev) => ({
                        ...prev,
                        address: e.target.value,
                    }))
                }
                value={userInputFormValue.address}
                isError={isError}
                id="address"
            />
            <button
                onClick={() => {
                    setIsError((prev) => !prev);
                }}
            >
                Error 토글
            </button>
        </div>
    );
}

export default App;
